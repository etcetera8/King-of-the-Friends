import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getTeam } from '../actions/index';
import DatePicker from 'react-native-datepicker';
import { patchPostCall, editTeamCall } from '../api';
import { Icon } from 'react-native-elements';
import CountdownComponent from './CountdownComponent';
import { TeamCreator }from './TeamCreator';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment'

class TeamManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todaysDate: new Date(Date.now()).toISOString(),
      editDate: '',
      editSegmentId: '',
      date: "2018-05-15",
      displayEditor: true,
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

  confirmEdit = () => {
    this.showAlert()
  }

  editTeam = async () => {
    const { editDate, editSegmentId } = this.state;
    let newSegment = editSegmentId.length === 0 ?  this.props.team.segment_id : editSegmentId;
    const updateTeam = { segment_id: newSegment, finish_date: editDate + 'T05:30:00.000Z'}
    let newNewTeam = { ...this.props.team, ...updateTeam}

    const { finish_date , segment_id, id } = this.props.team;
    const confirmEdit = await editTeamCall('PATCH', id, editSegmentId, segment_id, editDate+'T23:30:00-06', finish_date);
    console.log(confirmEdit, 'edit confirmed')
    this.props.updateTeam(newNewTeam)
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
    const { currentChallengeActive } = this.state;
    // if (new Date(Date.now()).toISOString() > team.finish_date) {
    //   this.setState({currentChallengeActive: false})
    // }
    return (
      <View style={styles.teamEditor}>
        <View style={{width: 300}}>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Icon color={currentChallengeActive ? "green" : "red"} name="check-circle" type="Feather" />
        </View>
          <Text style={styles.segment}>Segment ID: {team.segment_id}</Text>
          <View style={{ flexDirection: "row", alignItems:'center', justifyContent:'center'}}>
          <View style={{alignSelf: 'center'}}><Text style={styles.finDate}>{moment.utc(team.finish_date ).local().format('MMMM Do YYYY, h:mm:ss a')}</Text></View>
          <View><Icon name="flag-checkered" type="material-community" /></View>
        </View>
            <CountdownComponent date={team.finish_date}/>
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
              onPress={this.editTeam}
            />
          </View>
        }
        <Text>Invite freinds to team</Text>
      </View>
    )
  }
} 

const mapStateToProps = state => ({
  team: state.team,
})

const mapDispatchToProps = dispatch => ({
  updateTeam: team => dispatch(getTeam(team))
})

export default connect(mapStateToProps, mapDispatchToProps)(TeamManager)

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
    marginTop: 150,
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
  }
})
