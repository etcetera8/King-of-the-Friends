import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class TeamManager extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Team Management</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
})