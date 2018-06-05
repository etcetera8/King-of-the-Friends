import React, {Component} from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import {patchPostCall, serverRoot} from '../api';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-datepicker';
import voucher_codes from 'voucher-code-generator';


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
    return confirmation
  }

  render() {
    return (
      <View style={styles.teamCreator}>
        <AwesomeAlert
          show={this.state.showAlert}
          message="Team Created!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="Ok!"
          confirmButtonColor="green"
          onConfirmPressed={() => {this.setState({showAlert: false})}} />
    {
      this.state.error &&
      <Text style={styles.error}>Teams must have a name and segment id</Text>
    }
      <TextInput
        style={styles.input}
        onChangeText={teamName => this.setState({ teamName })}
        value={this.state.teamName}
        placeholder={"New Team Name"}
      />
      <TextInput
        style={styles.input}
        onChangeText={segmentId => this.setState({ segmentId })}
        value={this.state.segmentId}
        placeholder={"Segment ID"}
      />
      <DatePicker
        style={{ width: 210 }}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate={this.state.todaysDate}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => { this.setState({ date: date }) }}
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 0,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            borderColor: 'gray'
          }
        }
      }/>
      <Button
        title='Create Team'
        onPress={this.createTeam}/>
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
    marginLeft: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    width: 200,
    borderWidth: 1,
    margin: 10
  },
})

