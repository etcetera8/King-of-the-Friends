import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Image, TextInput } from 'react-native';
import Expo, { WebBrowser, AuthSession, AppLoading, Font } from 'expo';
import { Icon } from 'react-native-elements';
import { loginUser, getTeam, getMembers } from '../actions/index';
import { apiCall, allApiCall, stravaLogin, getUser, patchPostCall, serverRoot, getUserAttempts } from '../api';
import { cleanUser } from '../cleaner';
import { CustomInput } from './CustomInput';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
    const userValidation = await apiCall(`${serverRoot}users/`, user.athlete.email);
    if (user.errors) {
      this.setState({ loading: false });
    } else if (inviteCode) {
      const invitedTeam = await apiCall(`${serverRoot}team/invitecode/`, inviteCode)
      const options = {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          team_id: invitedTeam.id
        })
      }
      const patchedUser = await patchPostCall(`${serverRoot}users/`, user.athlete.email, options);
      await this.getAllUserAndTeam(userValidation, user);
      await this.updateUserPropsAndBe(user.access_token, user.athlete.email, invitedTeam.start_date, invitedTeam.segment_id, invitedTeam.id)
    } else if (userValidation && !inviteCode) {
      this.getAllUserAndTeam(userValidation, user);
    } else {
      console.log("no user exists!");
      //create a new user
      //bring them to fresh screen
    }
  }
  
  updateUserPropsAndBe = async (token, email, start_date, segment_id, team_id) => {
    const attempts = await getUserAttempts(segment_id, token);
    const attemptsToDate = attempts.filter(attempt => attempt.start_date > start_date);
    const fastestTime = attemptsToDate.length ? attemptsToDate[0].elapsed_time : 0;
    const updatedTime = { segment_time: fastestTime };
    const teamMembers = await allApiCall(`${serverRoot}teamid?teamid=${team_id}`);
    const updatedMembers = await teamMembers.map(member => member.email === email ? { ...member, ...updatedTime } : member);
    
    this.props.getMembers(updatedMembers)
    const options = {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        segment_time: fastestTime,
        token
      })
    }
    //const result = await patchPostCall('http://localhost:8001/api/v1/users/', email, options)
  }
  
  getAllUserAndTeam = async(userVal, user) => {
    const beUser = await apiCall(`${serverRoot}users/`, userVal.email);
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
  
  render () {
    const { isReady, loading, showInput, inviteCode } = this.state; 
    return(
      <View style={styles.container}>
      { isReady &&
        <View style={styles.titleWrap}>
          <Icon type="material-community" name="crown" size={148} color={"rgba(242, 100, 48, 1)"}/>
          <Text style={styles.king}>KING</Text>
          <Text style={styles.friends}>OF THE FRIENDS</Text>
        </View>
      }
        { 
          !loading ?
          <View style={{marginBottom: 80}}>
            <TouchableOpacity onPress={this._openAuthSessionAsync}>
              <Image
                style={styles.loginButton}
                source={require('../assets/images/stravaBtn.png')}
              />
            </TouchableOpacity>
            <View style={styles.inviteWrapper}>
              <Text onPress={() => this.setState({showInput: !showInput})} style={styles.invite}>Have an invite code from a friend?</Text>
                
              { showInput &&
                <CustomInput
                  inputHandler={userInput => this.setState({ inviteCode: userInput })}
                  value={inviteCode}
                  style={styles.inviteInput}
                  label={"Invite Code"}
                />
              }
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
    marginTop: 20,
    width: 200,
    alignSelf: 'center',
    paddingLeft: 70
  }
})