import React, { Component } from 'react';
import {connect} from 'react-redux';
import { StyleSheet, View, Text, Button } from 'react-native';
import { loginUser } from '../actions/index';
import { apiCall, apiLoginUser, getUser } from '../api';
class Login extends Component {

  loginHelper = async () => {
    const user = await apiCall('http://localhost:8001/api/v1/users/', 1);
    console.log(user)
    apiLoginUser();
    getUser()
    await this.props.loginUser(user)
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>Login page</Text>
        <Button
          title="LOGIN"
          onPress={() => this.loginHelper()}
        ></Button>
      </View>
    )
  }
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