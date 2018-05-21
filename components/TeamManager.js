import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import { patchPostCall, editTeamCall } from '../api';
import { Icon } from 'react-native-elements';
import { CountdownComponent } from './CountdownComponent';
import AwesomeAlert from 'react-native-awesome-alerts';


class TeamManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todaysDate: '',
      editDate: '',
      editSegmentId: '',
      teamName: '',
      segmentId: '',
      date: "2018-05-15",
      displayEditor: true,
      displayCreator: false,
      error: false,
      currentChallengeActive: true,
      showAlert: false
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

  confirmEdit = () => {
    this.showAlert()
  }

  editTeam = async () => {
    const { editDate, editSegmentId } = this.state;
    const { finish_date, segment_id, id } = this.props.team;
    editTeamCall('PATCH', id, editSegmentId, segment_id, editDate, finish_date);
  }

  createTeam = async () => {
    const { teamName, segmentId, date } = this.state;
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
      <View flex top>
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
        {this.displayTeamEditor()}
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
    )
  }

  displayTeamEditor() {
    const { team } = this.props;
    const { currentChallengeActive } = this.state;
    if (Date.now() > team.finish_date) {
      this.setState({currentChallengeActive: false})
    }
    return (
      <View style={styles.teamEditor}>
        <View style={{width: 200}}>
          <Text style={currentChallengeActive ? styles.active : styles.inactive}>STATUS</Text>
          <Text>Current Team: {team.name}</Text>
          <Text>Segment: {team.segment_id}</Text>
          <Text>Finish Date: {team.finish_date}</Text>
        </View>
        { 
          currentChallengeActive &&
          <View>
          <TextInput
            style={styles.input}
            onChangeText={segmentId => this.setState({ editSegmentId: segmentId })}
            value={this.state.editSegmentId}
            placeholder={"New Segment ID"}
          />
          <DatePicker
            style={{ width: 210 }}
            date={this.state.editDate}
            mode="date"
            placeholder="Select New Date"
            format="YYYY-MM-DD"
            minDate={this.state.todaysDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
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
            }}
            onDateChange={(date) => { this.setState({ editDate: date }) }}
          />
          <Button
            title='Edit Team'
            onPress={this.confirmEdit}
          /></View>
        }
        {/* <CountdownComponent date={this.props.team.finish_date}/> */}
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
        style={{ width: 210 }}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate={this.state.todaysDate}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
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

const mapStateToProps = state => ({
  team: state.team
})

export default connect(mapStateToProps, null)(TeamManager)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    position: 'relative'
  },
  error: {
    color: 'red'
  },
  buttonLabel: {
    flexDirection: 'row',
    width: 200,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  faIcons: {
    alignSelf: 'flex-end',
  },
  teamEditor: {
    flex: 1,
    marginTop: 100,
    marginBottom: 100,
    maxHeight: 200,
    alignItems: 'center'
  },
  teamCreator: {
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
  active: {
    color: 'green'
  },
  inactive: {
    color: 'red'
  }
})
