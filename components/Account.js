import React, { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';

export default class Account extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>Account Page</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
