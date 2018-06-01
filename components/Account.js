import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { apiCall, allApiCall, patchPostCall } from '../api';
import { TeamCreator } from './TeamCreator';
import { loginUser, getTeam, getMembers } from '../actions/index';

class Account extends Component {
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
    return teams;
  }

  joinTeam = async () => {
    const { email } = this.props.user
    const { teamId } = this.state;
    if (teamId != '') {
      const options = {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          team_id: teamId
        })
      }
      const confirmation = await patchPostCall('http://localhost:8001/api/v1/users/', email, options )
      console.log(confirmation);

      const team = await apiCall(`http://localhost:8001/api/v1/team/`, teamId);
      const teamMembers = await allApiCall(`http://localhost:8001/api/v1/teamid?teamid=${teamId}`);
      this.props.updateMembers(teamMembers)
      this.props.updateTeam(team);
    }
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

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch=> ({
  updateUser: user => dispatch(loginUser(user)),
  updateTeam: team => dispatch(getTeam(team)),
  updateMembers: members => dispatch(getMembers(members))
})

export default connect(mapStateToProps, mapDispatchToProps)(Account)