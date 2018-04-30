import React, {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import Login from './Login';
import { Tabs } from './TabNavigator';

class LoginNavigator extends Component {
  
  
  login = () => {
    return this.props.user.email ? <Tabs></Tabs> : <Login></Login>
  }

  render = () => {
    console.log(this)
    return this.login()
    
  }

}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, null)(LoginNavigator)