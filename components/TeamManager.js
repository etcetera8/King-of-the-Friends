import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { patchPostCall } from '../api';
import { Icon } from 'react-native-elements';

export default class TeamManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayCreator: false,
      teamName: '',
      segmentId: "0",
      date: "2018-05-15",
      todaysDate: "",
      error: false,
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
    const {teamName, segmentId, date} = this.state;
    if(!teamName || !segmentId || !date) {
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
          finish_date: this.state.date
        })
      }
      await patchPostCall('http://localhost:8001/api/v1/team', '', options)
      this.setState({ error: false });
    }
  }

  showForm = () => {
    let displayCreator = !this.state.displayCreator;
    this.setState({displayCreator})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.teamWrapper}>
          <View style={styles.buttonLabel}>
            <Text>Create new team</Text>
          {
            this.state.displayCreator ? 
            <View style={styles.faIcons}><Icon onPress={this.showForm} name="minus" type="font-awesome"/></View>
            :
            <View style={styles.faIcons}><Icon onPress={this.showForm} name="plus" type="font-awesome" /></View>
          }</View>
        {
          this.state.displayCreator &&
          this.displayTeamCreator()
        } 
        </View>
      </View>
    )
  }

  displayTeamCreator() {
    return (<View style={styles.teamCreator}>
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
        }}
        onDateChange={(date) => { this.setState({ date: date }) }}
      />
      <Button
        title='Create Team'
        onPress={this.createTeam}
      />
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  teamWrapper: {
    bottom: 0,
    height: 250,
  },
  error: {
    color: 'red'
  },
  buttonLabel: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  faIcons: {
    alignSelf: 'flex-end',
  },
  teamCreator: {
    display: 'flex',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    marginLeft: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    width: 200,
    borderWidth: 1,
    margin: 10
  }
})