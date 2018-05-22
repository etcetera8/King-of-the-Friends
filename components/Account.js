import React, { Component } from 'react';
import {StyleSheet, Text, View, Picker } from 'react-native';
import { allApiCall } from '../api';

export default class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      newTeam: '',
      teams: []
    }
  }

  async componentDidMount() {
    let teams = await allApiCall(`http://localhost:8001/api/v1/team/`, '');
    this.setState({ teams: teams })
  }

  makeOptions = () => {
    const teams = this.state.teams.map((team, i) => {
      return <Picker.Item key={i + team.name}label={team.name} value={team.id} />
    })
    return teams
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>Account Page</Text>
        <Picker
          selectedValue={this.state.newTeam}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) => this.setState({ newTeam: itemValue })}>
          {this.makeOptions()}
        </Picker>
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
