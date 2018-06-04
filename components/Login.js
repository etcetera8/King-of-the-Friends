import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Image, TextInput } from 'react-native';
import Expo, { WebBrowser, AuthSession, AppLoading, Font } from 'expo';
import { Icon } from 'react-native-elements';
import { loginUser, getTeam, getMembers } from '../actions/index';
import { apiCall, allApiCall, stravaLogin, getUser, patchPostCall, serverRoot } from '../api';
import { cleanUser } from '../cleaner';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      isReady: false,
      showInput: false,
      inviteCode: ''
    }
  } 

  componentWillMount() {
    ( async ()=> { 
      await Font.loadAsync({
      'Lobster': require('../assets/fonts/Lobster/Lobster-Regular.ttf'),
      'Unica': require('../assets/fonts/Unica_One/UnicaOne-Regular.ttf')

    })
      this.setState({ isReady: true })
    })();
  }

  render () {
    return(
      <View style={styles.container}>
      { this.state.isReady &&
        <View style={styles.titleWrap}>
          <Icon type="material-community" name="crown" size={148} color={"rgba(242, 100, 48, 1)"}/>
          <Text style={styles.king}>KING</Text>
          <Text style={styles.friends}>OF THE FRIENDS</Text>
        </View>
      }
        { 
          !this.state.loading ?
          <View style={{marginBottom: 80}}>
            <TouchableOpacity onPress={this._openAuthSessionAsync}>
              <Image
                style={styles.loginButton}
                source={require('../assets/images/stravaBtn.png')}
              />
            </TouchableOpacity>
            <View style={styles.inviteWrapper}>
              <Text onPress={() => this.setState({showInput: !this.state.showInput})} style={styles.invite}>Have an invite code from a friend?</Text>
                
              { this.state.showInput &&
              <TextInput
                  style={styles.inviteInput}
                  onChangeText={userInput => this.setState({ inviteCode: userInput })}
                  value={this.state.inviteCode}
                  placeholder={"Invite Code"}
              />}
            </View>
          </View>
          : 
          <Image 
            style={styles.loader}
            source={require('../assets/loader.gif')}/>
        }
      </View>
    )
  }

  _openAuthSessionAsync = async () => {
    this.setState({loading: true })
    const redirect = await Linking.getInitialURL('/')
    const result = await WebBrowser.openAuthSessionAsync(
      `https://www.strava.com/oauth/authorize?client_id=25688&response_type=code&redirect_uri=${redirect}&approval_prompt=force`
    );
    this._validateUser(result, this.state.inviteCode)
  };

  _validateUser = async (result, inviteCode) => {
    const user = await getUser(result.url);
    console.log(inviteCode)
    if (user.errors) {
      this.setState({ loading: false });
    } else {
      const userValidation = await apiCall(`${serverRoot}users/`, user.athlete.email)
      if (userValidation) {
        this.getAllUserAndTeam(userValidation, user);
      } else {
        console.log("no user exists!");
        //create a new user
        //bring them to fresh screen
      }
    }
  }

  getAllUserAndTeam = async(userVal, user) => {
    const beUser = await apiCall(`${serverRoot}users/`, userVal.email);
    console.log(beUser);
    this.props.loginUser(cleanUser(user.athlete, user.access_token, beUser.team_id));
    const team = await apiCall(`${serverRoot}team/`, beUser.team_id);
    const teamMembers = await allApiCall(`${serverRoot}teamid?teamid=${beUser.team_id}`);
    const options = { 
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        picture: userVal.picture,
        name: userVal.name,
        team_id: beUser.team_id
      })
    }
    patchPostCall(`${serverRoot}users/`, user.email, options)

    this.setState({ loading: false })
    this.props.getMembers(teamMembers)
    this.props.getTeam(team);
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  team: state.team,
  members: state.members
})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user) => dispatch(loginUser(user)),
  getTeam: (team) => dispatch(getTeam(team)),
  getMembers: (members) => dispatch(getMembers(members))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  loader: {
    display: 'flex',
    alignSelf: 'center',
  },
  loginButton: {
    alignSelf:'center',
    marginBottom: 20
  },
  titleWrap: {
    alignContent:'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  king: {
    color: 'rgba(160, 55, 252, 1);',
    fontSize: 125,
    fontFamily: 'Lobster'
  },
  friends: {
    color: 'rgba(242, 100, 48, 1)',
    fontSize: 55,
    fontFamily: 'Unica',
  },
  inviteWrapper: {
    height: 100,
  },
  invite: {
    color: 'rgba(242, 100, 48, 1)',
    alignSelf: 'center'
  },
  inviteInput: {
    position: 'absolute',
    bottom: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    marginTop: 20,
    width: 200,
    borderColor: 'rgba(242, 100, 48, 1)',
    alignSelf: 'center',
    paddingLeft: 70
  }
})