import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { apiCall, allApiCall, patchPostCall, segmentCall, serverRoot, getUserAttempts } from '../api';
import TeamCreator from './TeamCreator';
import { loginUser, getTeam, getMembers, addCoordinates } from '../actions/index';
import polyline from '@mapbox/polyline';
import AwesomeAlert from 'react-native-awesome-alerts';

class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      teamId: '',
      teams: [],
      showAlert: false
    }
  }

  async componentDidMount() {
    let teams = await allApiCall(`${serverRoot}team/`, '');
    this.setState({ teams: teams })
  }

  toggleAlert = () => {
    this.setState({showAlert: !this.state.showAlert})
  }

  makeOptions = () => {
    const teams = this.state.teams.map((team, i) => {
      return <Picker.Item key={i + team.name}label={team.name} value={team.id} />
    })
    return teams;
  }

  joinTeam = async () => {
    const { email, token } = this.props.user
    const { teamId, showAlert } = this.state;
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
      await this.updateStoreAndProps(email, token, teamId, options);
      this.updateUserPropsAndBe()
    }
  }

  updateStoreAndProps = async (email, token, teamId, options) => {
    const confirmation = await patchPostCall(`${serverRoot}users/`, email, options);
    const team = await apiCall(`${serverRoot}team/`, teamId);
    const teamMembers = await allApiCall(`${serverRoot}teamid?teamid=${teamId}`);
    const stravaSegment = await segmentCall(team.segment_id, token);
    const coordinates = polyline.decode(stravaSegment.map.polyline).map(latLng => {
      return { latitude: latLng[0], longitude: latLng[1] }
    })
    this.props.updateMembers(teamMembers);
    this.props.updateTeam(team);
    this.props.updateCoordinates(coordinates);
    this.toggleAlert();
  }

  updateUserPropsAndBe = async () => {
    //need to get the newly chosen segment
    const { token, email } = this.props.user;
    const { start_date, segment_id } = this.props.team;
    const attempts = await getUserAttempts(segment_id, token);
    const attemptsToDate = attempts.filter(attempt => attempt.start_date > start_date);
    const fastestTime = attemptsToDate.length ? attemptsToDate[0].elapsed_time : 0;
    const updatedTime = { segment_time: fastestTime };
    const updatedMembers = this.props.members.map( member =>  member.email === email ? {...member, ...updatedTime} : member );
    this.props.updateMembers(updatedMembers)

    const options = {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        segment_time: fastestTime,
        token
      })
    }
    const result = await patchPostCall('http://localhost:8001/api/v1/users/', email, options)
  }

  render() {
    const { teamId, teams, showAlert } = this.state;
    return(
      <View style={styles.container}>
        <AwesomeAlert
          show={showAlert}
          title="You've joined a team!"
          showConfirmButton={true}
          confirmText="Sick, got it"
          onConfirmPressed={()=>{this.toggleAlert()}}
        />
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
  user: state.user,
  team: state.team,
  members: state.members
})

const mapDispatchToProps = dispatch=> ({
  updateUser: user => dispatch(loginUser(user)),
  updateTeam: team => dispatch(getTeam(team)),
  updateMembers: members => dispatch(getMembers(members)),
  updateCoordinates: coordinates => dispatch(addCoordinates(coordinates))
})

export default connect(mapStateToProps, mapDispatchToProps)(Account)