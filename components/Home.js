import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { loginUser, getTeam, getMembers } from '../actions/index';
import { apiCall, allApiCall } from '../api';
export class Home extends Component {

  async componentDidMount() {
    const user = await apiCall('http://localhost:8001/api/v1/users/', 1);
    const team = await apiCall(`http://localhost:8001/api/v1/team/`, user.team_id)
    const teamMembers = await allApiCall(`http://localhost:8001/api/v1/teamid?teamid=${user.team_id}`)
    
    await this.props.loginUser(user)
    await this.props.getTeam(team)
    await this.props.getMembers(teamMembers)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> Home </Text>
        <Text>{this.props.user.name}</Text>
        <Text>{this.props.team.name}</Text>
        <Button
          style={{ fontSize: 20 }}
          title="test"
          onPress={() => console.log('clicked')}>
        </Button>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  team: state.team,
  members: state.members
} )

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
});
