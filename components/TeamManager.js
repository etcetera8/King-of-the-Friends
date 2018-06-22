import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { getTeam } from '../actions/index';
//import DatePicker from 'react-native-datepicker';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { patchPostCall, editTeamCall } from '../api';
import { Icon } from 'react-native-elements';
import CountdownComponent from './CountdownComponent';
import { TeamCreator }from './TeamCreator';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment'
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';

class TeamManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todaysDate: new Date(Date.now()).toISOString(),
      editDate: '',
      editSegmentId: '',
      date: "2018-05-15",
      emails: '',
      displayEditor: true,
      error: false,
      currentChallengeActive: true,
      showAlert: false,
      showDateTimePicker: false
    }
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  toggleDateTimePicker = () => {
    this.setState({showDateTimePicker: !this.state.showDateTimePicker})
  }

  handleDatePicked = (date) => {
    console.log('a date has been picked', date);
    this.setState({ editDate: date })
    this.toggleDateTimePicker();
  }

  confirmEdit = () => {
    this.showAlert()
  }

  editTeam = async () => {
    const { editDate, editSegmentId } = this.state;
    const newSegment = editSegmentId.length === 0 ?  this.props.team.segment_id : editSegmentId;
    const updateTeam = { segment_id: newSegment, finish_date: editDate + 'T05:30:00.000Z'}
    const newNewTeam = { ...this.props.team, ...updateTeam}
    const { finish_date , segment_id, id } = this.props.team;
    const confirmEdit = await editTeamCall('PATCH', id, editSegmentId, segment_id, editDate+'T23:30:00-06', finish_date);
    console.log(confirmEdit, 'edit confirmed')
    this.props.updateTeam(newNewTeam)
  }

  sendEmail = () => {
    const emails = this.state.emails.split(', ')
    const { user, team } = this.props;
    Communications.email(emails, null, null, 'King of the Friends Invite', `${user.name} has invited you to join ${team.name}! Go to the app and on the sign in page enter the invite code and sign in with Strava! Invite Code: ${team.invite_code}`);
    this.setState({emails: ''});
    //send alert that email has been sent
  }

  render() {
    return (
      <View flex top style={{flex: 1}}>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Edit active team"
          message="Are you sure?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, edit team."
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
            this.editTeam();
          }} />
        />
        { this.props.team.name &&
          this.displayTeamEditor()
        }
      </View>
    )
  }

  displayTeamEditor() {
    const { team } = this.props;
    const { currentChallengeActive, todaysDate, showDateTimePicker, editDate, emails } = this.state;
    return (
      <View style={styles.teamEditor}>
        <View style={{marginTop: 50}}>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Icon color={currentChallengeActive ? "green" : "red"} name="check-circle" type="Feather" />
          </View>
          <Text style={styles.segment}>Segment ID: {team.segment_id}</Text>
          <View style={{ flexDirection: "row", alignItems:'center', justifyContent:'center'}}>
            <View style={{alignSelf: 'center'}}>
              <Text style={styles.finDate}>{new Date(team.finish_date).toDateString()}</Text>
            </View>
            <View>
              <Icon name="flag-checkered" type="material-community" />
            </View>
          </View>
            <CountdownComponent date={team.finish_date} />
        { currentChallengeActive &&
          <View style={{justifyContent: 'space-around'}}>
            <CustomInput 
              inputHandler={segmentId => this.setState({ editSegmentId: segmentId })}
              value={this.state.editSegmentId}
              style={styles.inviteInput}
              label={"New Segment ID"} />
            <TouchableOpacity
              style={styles.datepick}
              onPress={this.toggleDateTimePicker}>
              <Text style={editDate ? styles.dateText : styles.placeholder}>{editDate ? new Date(editDate).toDateString() : 'Pick a new date'} </Text>
              <Icon style={{margin: 5}}color='rgba(242, 100, 48, 1)' type="font-awesome" name="calendar" />
            </TouchableOpacity>
            <DateTimePicker
              isVisible={showDateTimePicker}
              onConfirm={this.handleDatePicked}
              onCancel={this.toggleDateTimePicker}
              mode='datetime'
              minimumDate={new Date(Date.now())}
              date={new Date()} />
            <CustomButton 
              pressHandler={this.editTeam}
              text={'Edit Team'} />
          </View>
        }
        </View>
        <View style={styles.inviteWrapper}>
          <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
            <Icon type='font-awesome' name='users' size={55} color={'#fff'} />
          </View>
          <View>
            <Text style={styles.inviteText}>Invite freinds to team by email seperated by commas</Text>
            <View style={styles.inputWrapper}>
              <CustomInput
                inputHandler={input => this.setState({ emails: input})}
                value={this.state.emails}
                style={styles.inviteInput}
                label={"enter emails"}
                labelColor={{color: '#fff'}}
                inputColor={{color: '#fff'}}
                iconColor={'#fff'} />
                { emails.includes('@', 1) &&
                  <Icon
                  style={{borderWidth: 1, postion: 'absolute', right: 0, marginRight: 10}}
                  type="font-awesome" 
                  name="send" 
                  size={24} 
                  color={'#fff'} 
                  onPress={this.sendEmail} />
                }
                </View>
          </View>
        </View>
      </View>
    )
  }
} 

const mapStateToProps = state => ({
  team: state.team,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  updateTeam: team => dispatch(getTeam(team))
})

export default connect(mapStateToProps, mapDispatchToProps)(TeamManager)

const styles = StyleSheet.create({
  teamEditor: {
    justifyContent: 'flex-start',
    flex: 1
  },
  input: {
    height: 40,
    borderColor: 'gray',
    width: 200,
    borderWidth: 1,
    margin: 10
  },
  teamName: {
    fontSize: 24,
    marginRight: 20
  },
  finDate: {
    fontSize: 17,
  },
  segment: {
    fontSize: 17,
    alignSelf: 'center',
    margin: 20
  },
  datepick: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(242, 100, 48, 1)',
    width: 250,
    margin: 30
  },
  placeholder: {
    color: 'rgba(242, 100, 8, 1)',
    fontSize: 18,
    fontWeight: 'bold'
  },
  dateText: {
    color: 'rgba(160, 55, 252, 1)',
    fontSize: 20
  },
  inviteWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(242, 100, 48, 1)',
    position: 'absolute',
    bottom: 0
  },
  inviteText: { 
    color: '#fff',
    alignSelf: 'center',
    fontSize: 18,
    width: 250,
    alignSelf: 'center',
    marginTop: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  inviteInput: {
    alignSelf: 'center',
    margin: 10,
    width: 250,
    alignSelf: 'center',
    paddingLeft: 70,
    color: '#fff'
  }
})
