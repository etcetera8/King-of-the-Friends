import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { allApiCall } from '../api';
import { TeamCreator } from './TeamCreator';

export default class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      teamId: '',
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

  joinTeam = () => {
    console.log('join a team');
    const teamId = this.state.teamId;
    console.log(teamId);
  }

  render() {
    const { teamId, teams } = this.state;
    return(
      <View style={styles.container}>
        <View style={styles.joinTeam}>
          <Text>Join an existing team!</Text>
          <Picker
            selectedValue={teamId ? teamId : teams[0]}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => this.setState({ teamId: itemValue })}>
            {this.makeOptions()}
          </Picker>
          <Button title="Join This Team" onPress={this.joinTeam}/>
        </View>
        <View style={styles.createTeam}>
          <Text>Or create a new team</Text>
          <TeamCreator />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  joinTeam: {
    height: 300,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picker: {
    height: 150,
    width: '100%',
  },
  createTeam: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 60,
    paddingTop: 30
  }
});
