import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { loginUser, getTeam } from '../actions/index';
import { apiCall } from '../api';
export class Home extends Component {

  async componentDidMount() {
    const user = await apiCall('http://localhost:8001/api/v1/users/', 1);
    
    console.log(user)
    const team = await apiCall(`http://localhost:8001/api/v1/team/`, user.team_id)
    console.log(team)
  
    await this.props.loginUser(user)
    await this.props.getTeam(team)
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
  team: state.team
} )

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user) => dispatch(loginUser(user)),
  getTeam: (team) => dispatch(getTeam(team))
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
