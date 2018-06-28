import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';
import { apiCall, allApiCall, patchPostCall, segmentCall, serverRoot, getUserAttempts } from '../api';
import TeamCreator from './TeamCreator';
import { loginUser, getTeam, getMembers, addCoordinates } from '../actions/index';
import { CustomInput } from './CustomInput';
import polyline from '@mapbox/polyline';
import AwesomeAlert from 'react-native-awesome-alerts';

class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      teamId: '',
      inviteCode: '',
      teams: [],
      showAlert: false,
      showInput: false
    }
  }

  toggleAlert = () => {
    this.setState({showAlert: !this.state.showAlert})
  }

  render() {
    const { teamId, teams, showAlert, showInput, inviteCode } = this.state;
    return(
      <View style={styles.container}>
        <AwesomeAlert
          show={showAlert}
          title="You've joined a team!"
          showConfirmButton={true}
          confirmText="Sick, got it"
          onConfirmPressed={()=>{this.toggleAlert()}} />
        <View style={styles.createTeam}>
          <TeamCreator 
            alert={this.toggleAlert}
            showInput={showInput}
            inviteCode={inviteCode} />
        </View>
        <View style={styles.inviteWrapper}>
          <Text onPress={() => this.setState({ showInput: !showInput })} style={styles.invite}>Have an invite code from a friend?</Text>
          { showInput &&
            <CustomInput
              inputHandler={userInput => this.setState({ inviteCode: userInput })}
              value={inviteCode}
              style={styles.inviteInput}
              label={"Invite Code"} />
          }
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
  },
  inviteWrapper: {
    height: 80,
    marginBottom: 30
  },
  invite: {
    color: 'rgba(242, 100, 48, 1)',
    alignSelf: 'center'
  },
  inviteInput: {
    position: 'absolute',
    bottom: 0,
    borderWidth: 0,
    marginTop: 15,
    width: 200,
    alignSelf: 'center',
    paddingLeft: 70
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