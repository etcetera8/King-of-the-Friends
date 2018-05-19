import React, { Component } from 'react';
import {connect} from 'react-redux';
import { StyleSheet, View, Text, Button, Linking } from 'react-native';
import { loginUser } from '../actions/index';
import { apiCall, stravaLogin, getUser } from '../api';
import Expo, { WebBrowser, AuthSession } from 'expo';

class Login extends Component {
  state = {
    redirectData: null,
  }

  // loginHelper = async () => {
  //   const user = await apiCall('http://localhost:8001/api/v1/users/', 1);
  //   console.log(user)
  //   await this.props.loginUser(user) 
  // }

  render () {
    return(
      <View style={styles.container}>
        {/* <Button
          title="UI QUICK LOGIN"
          onPress={() => this.loginHelper()}
        ></Button> */}
        <Button
          onPress={this._openAuthSessionAsync}
          title="Login with Strava"
        />
      </View>
    )
  }

  _openAuthSessionAsync = async () => {
    let redirect = await Linking.getInitialURL('/')
    let result = await WebBrowser.openAuthSessionAsync(
      `https://www.strava.com/oauth/authorize?client_id=25688&response_type=code&redirect_uri=${redirect}&approval_prompt=force`
    );

    this.setState({ result });
    const user = await getUser(result.url);
    this.props.loginUser(user.athlete)
    let check = await apiCall('http://localhost:8001/api/v1/users/', user.athlete.email )
    
    if (check) {
      //update the users information
      //get all the team members information
      // take to login page
    } else {
      //create a new user
      //bring them to fresh screen
    }
  };

}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user) => dispatch(loginUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: "white",
  }
})