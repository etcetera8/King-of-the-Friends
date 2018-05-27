import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import { patchPostCall, editTeamCall } from '../api';
import { Icon } from 'react-native-elements';
import { CountdownComponent } from './CountdownComponent';
import { TeamCreator }from './TeamCreator';
import AwesomeAlert from 'react-native-awesome-alerts';

class TeamManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todaysDate: '',
      editDate: '',
      editSegmentId: '',
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
    this.setState({ todaysDate: new Date(Date.now()).toISOString()});
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
    const confirmEdit = editTeamCall('PATCH', id, editSegmentId, segment_id, editDate+'T23:30:00-06', finish_date);
    console.log(confirmEdit, 'edit confirmed')
    //this is where we should update the store
  }

  showForm = () => {
    const displayCreator = !this.state.displayCreator;
    this.setState({ displayCreator })
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
        {
          this.displayTeamEditor()
        }
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
          <TeamCreator />
        } 
      </View>
    )
  }

  displayTeamEditor() {
    const { team } = this.props;
    const { currentChallengeActive } = this.state;
    // if (new Date(Date.now()).toISOString() > team.finish_date) {
    //   this.setState({currentChallengeActive: false})
    // }
    return (
      <View style={styles.teamEditor}>
        <View style={{width: 300}}>
        <View style={{ flexDirection: "row", alignSelf: "center", marginBottom: 10 }}>
          <Text style={styles.teamName}>Current Team: {team.name}</Text>
          <Icon color={currentChallengeActive ? "green" : "red"} name="check-circle" type="Feather" />
        </View>
          <Text style={styles.segment}>Live Segment: {team.segment_id}</Text>
          <Text style={styles.finDate}>Finish Date: {team.finish_date}</Text>
            <CountdownComponent date={this.props.team.finish_date}/>
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
              onDateChange={(date) => { this.setState({ editDate: date }) }}
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
            />
            <Button
              title='Edit Team'
              onPress={this.confirmEdit}
            />
          </View>
        }
      </View>
    )
  }
} 

const mapStateToProps = state => ({
  team: state.team,
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
    marginTop: 100,
    marginBottom: 100,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    width: 200,
    borderWidth: 1,
    margin: 10
  },
  teamName: {
    fontSize: 20,
  },
  finDate: {
    alignSelf: 'center'
  },
  segment: {
    alignSelf: 'center',
    marginBottom: 10
  }
})
