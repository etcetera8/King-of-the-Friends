import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { patchPostCall } from '../api';

export default class TeamManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      teamName: '',
      segmentId: "0",
      date: "2018-05-15",
      todaysDate: ""
    }
  }

  componentDidMount() {
    const todaysDate = this.getDate();
    this.setState({todaysDate});
  }

  getDate() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return year + "-" + month + "-" + day;
  }

  createTeam = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.teamName,
        segment_id: this.state.segmentId,
        finish_date: this.state.date
      })
    }
    const didwork = await patchPostCall('http://localhost:8001/api/v1/team', '', options)
    console.log(didwork);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Team Management</Text>
        <TextInput
          style={styles.input}
          onChangeText={teamName => this.setState({teamName})}
          value={this.state.teamName}
          placeholder={"New Team Name"}
        />
        <TextInput
          style={styles.input}
          onChangeText={segmentId => this.setState({segmentId})}
          value={this.state.segmentId}
          placeholder={"Segment ID"}
        />
        <DatePicker
          style={{ width: 200 }}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate={this.state.todaysDate}
          maxDate="2016-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => { this.setState({ date: date }) }}
        />
        <Button 
          title='Create Team'
          onPress={this.createTeam}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    width: 200,
    borderWidth: 1
  }
})