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

  toggleAlert = () => {
    this.setState({showAlert: !this.state.showAlert})
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
        <View style={styles.createTeam}>
          <TeamCreator alert={this.toggleAlert} />
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
  createTeam: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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