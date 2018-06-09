import React, {Component} from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import {patchPostCall, serverRoot} from '../api';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-datepicker';
import voucher_codes from 'voucher-code-generator';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton'

import { Icon } from 'react-native-elements';

class TeamCreator extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: null,
      teamName: '',
      segmentId: '',
      todaysDate: new Date(Date.now()).toISOString(),
      showAlert: false
    }
  }

  createTeam = async () => {
    const { teamName, segmentId, date } = this.state;
    if (!teamName || !segmentId || !date) {
      this.setState({ error: true });
    } else {
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.teamName,
          segment_id: this.state.segmentId,
          start_date: this.state.todaysDate,
          finish_date: this.state.date,
          invite_code: voucher_codes.generate({length: 8, count:1})[0]
        })
      }
      const team = await patchPostCall('http://localhost:8001/api/v1/team', '', options);
      const user = await this.updateUserTeam(team.id);
      this.setState({ error: false, teamName: '', segmentId: '', showAlert: true });
      this.props.alert()
      //next instantly update store and get times for segments and all that stuff
    }
  }

  updateUserTeam = async (teamId) => {
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
    const confirmation = await patchPostCall(`${serverRoot}users/`, this.props.user.email, options);
    return confirmation;
  }

  render() {
    const { teamName, segmentId, date, todaysDate} = this.state;
    return (
      <View style={styles.teamCreator}>
        <Icon 
          type="material-community" 
          name="crown" 
          size={168} 
          color={"rgba(242, 100, 48, 1)"} />
        <Text style={styles.text}>Create Your New Team</Text>

    {
      this.state.error &&
      <Text style={styles.error}>Teams must have a name and segment id</Text>
    }
      <CustomInput 
        value={teamName}
        style={styles.input}
        label={"New Team Name"}
        inputHandler={teamName => this.setState({ teamName })}
      />
      <CustomInput 
        value={segmentId}
        style={styles.input}
        label={"New Segment ID"}
        inputHandler={segmentId => this.setState({ segmentId })}
      />
      <DatePicker
        style={styles.datePicker}
        date={date}
        mode="date"
        placeholder="Select Finish Date"
        format="MM-DD-YYYY"
        minDate={todaysDate}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={date => { this.setState({ date: date }) }}
        customStyles={{
          dateIcon: {
            marginTop: 10,
            position: 'absolute',
            left: 0,
            top: 0,
            marginLeft: 0
          },
          dateInput: {
            marginTop: 10,
            marginLeft: 36,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderColor: 'rgba(242, 100, 48, 1)'
          }
        }
      }/>
        <CustomButton
          pressHandler={this.createTeam}
          text='Create Team' 
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, null)(TeamCreator)

const styles = StyleSheet.create({
  error: {
    color: 'red'
  },
  faIcons: {
    alignSelf: 'flex-end',
  },
  teamCreator: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  input: {
    alignSelf: 'center',  
    width: 210,
    margin: 5
  },
  datePicker: {
    marginBottom: 85,
    marginTop: 25,
    alignSelf: 'center',
    width: 200,
  },
  text: {
    fontFamily: 'Lobster',
    alignSelf: 'center',
    fontSize: 30
  }
})

