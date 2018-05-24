import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Button, Linking, Image } from 'react-native';
import Expo, { WebBrowser, AuthSession, AppLoading, Font } from 'expo';
import { Icon } from 'react-native-elements';
import { loginUser, getTeam, getMembers } from '../actions/index';
import { apiCall, allApiCall, stravaLogin, getUser, patchPostCall } from '../api';
import { cleanUser } from '../cleaner';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      isReady: false
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
          <Icon type="foundation" name="crown" size={148} color={"rgba(242, 100, 48, 1)"}/>
          <Text style={styles.king}>KING</Text>
          <Text style={styles.friends}>OF THE FRIENDS</Text>
        </View>
      }
        { 
          !this.state.loading ?
          <Button
            onPress={this._openAuthSessionAsync}
            title="Login with Strava"
            style={styles.loginButton}
          />
          : 
          <Image 
            style={styles.loader}
            source={require('../assets/loader.gif')}/>
        }
      </View>
    )
  }

  _openAuthSessionAsync = async () => {
    this.setState({loading: true})
    const redirect = await Linking.getInitialURL('/')
    const result = await WebBrowser.openAuthSessionAsync(
      `https://www.strava.com/oauth/authorize?client_id=25688&response_type=code&redirect_uri=${redirect}&approval_prompt=force`
    );
    this._validateUser(result)
  };

  _validateUser = async (result) => {
    const user = await getUser(result.url);
    this.props.loginUser(cleanUser(user.athlete, user.access_token));
    let userValidation = await apiCall('http://localhost:8001/api/v1/users/', user.athlete.email)
    if (userValidation) {
      this.getAllUserAndTeam(userValidation);
    } else {
      console.log("no user exists!");
      //create a new user
      //bring them to fresh screen
    }
  }

  getAllUserAndTeam = async(user) => {
    const beUser = await apiCall('http://localhost:8001/api/v1/users/', user.email);
    const team = await apiCall(`http://localhost:8001/api/v1/team/`, beUser.team_id);
    const teamMembers = await allApiCall(`http://localhost:8001/api/v1/teamid?teamid=${beUser.team_id}`);
    const options = { 
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        picture: user.picture,
        name: user.name,
        team_id: beUser.team_id
      })
    }
    patchPostCall('http://localhost:8001/api/v1/users/', user.email, options)

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
    marginBottom: 350

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
  }
})