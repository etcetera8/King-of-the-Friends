import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { loginUser, getTeam, getMembers } from '../actions/index';
import { apiCall, allApiCall } from '../api';
import moment from 'moment';
import{ Map} from './Map';

export class Home extends Component {

  async componentDidMount() {
    const user = await apiCall('http://localhost:8001/api/v1/users/', 1);
    const team = await apiCall(`http://localhost:8001/api/v1/team/`, user.team_id)
    const teamMembers = await allApiCall(`http://localhost:8001/api/v1/teamid?teamid=${user.team_id}`)
    
    await this.props.loginUser(user)
    await this.props.getTeam(team)
    await this.props.getMembers(teamMembers)
  }

  getTeamMembers = () => {
    let sorted = this.props.members.sort( (a, b) => parseInt(a.segment_time) - parseInt(b.segment_time))
    
    return sorted.map( (member, i) => {
      let number = moment.utc(member.segment_time).format('HH:mm');
      return <View style={styles.placeWrapper}>
               <View style={styles.placeNum}><Text>{i+1}</Text></View>
               <Text>{member.name}</Text>
               <Text>{number}</Text>
             </View>
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> Home </Text>
        <Text>{this.props.user.name}</Text>
        <View style={styles.leaderBoard}>
          <Map />
          <Text>{this.props.team.name}</Text>
          {this.getTeamMembers()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  team: state.team,
  members: state.members
})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user) => dispatch(loginUser(user)),
  getTeam: (team) => dispatch(getTeam(team)),
  getMembers: (members)=> dispatch(getMembers(members))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderBoard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
  },
  placeWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxHeight: 50,
    maxWidth: 300,
  },
  placeNum: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderRadius: 30/2,
    overflow: 'hidden',
    backgroundColor: 'orange',
  },
});
