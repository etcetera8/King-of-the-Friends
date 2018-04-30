import React, { Component } from 'react';
import {StyleSheet, View, Text, Button } from 'react-native';

export default class Login extends Component {

  render() {
    return(
      <View style={styles.container}>
        <Text>Login page</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: "white",
    color: "black"
  }
})