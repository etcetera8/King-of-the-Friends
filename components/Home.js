import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { apiCall, allApiCall, getUserAttempts, patchPostCall } from '../api';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import CountdownComponent from './CountdownComponent';
import {CustomButton }from './CustomButton';
import Map from './Map';

export class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      props: false,
      team: true,
    }
  }

  async componentDidUpdate() {
    console.log('infinite check');
    const { team, user } = this.props;
    
    if (team.segment_id && !this.state.props) {
      this.updateMembersTimeToBackEnd()
      const { token } = user;
      const attempts = await getUserAttempts(team.segment_id, token);
      const attemptsToDate = attempts.filter(attempt => attempt.start_date > team.start_date);
      const fastestTime = attemptsToDate.length ? attemptsToDate[0].elapsed_time : 0;
      const options = {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          segment_time: fastestTime,
          token
        })
      }
      const result = await patchPostCall('http://localhost:8001/api/v1/users/', user.email, options)
      this.setState({props: true})
    } 
  }

  getTeamMembers = () => {
    const { members } = this.props;
    const sorted = members.sort( (a, b) => parseInt(a.segment_time) - parseInt(b.segment_time));

    return sorted.map( (member, i) => {
      const mins = Math.floor(member.segment_time / 60);
      const secs = member.segment_time - mins * 60;

      return (
        <View style={styles.placeWrapper} key={i}>
          <View style={styles.placeNum}>
            <Text style={styles.placeText}>{i + 1}</Text>
          </View>
          <Text>{member.name}</Text>
          <View style={styles.imageWrapper}>
            <Image
            source={{ uri: member.picture }}
            style={styles.profilePic} />
            { i === 0 &&
              <View style={styles.icon}><Icon  type="material-community" name="crown" size={27} color={"rgba(242, 100, 48, 1)"} /></View>
            }
          </View>
          <Text>{mins}:{secs}</Text>
        </View>
      )
    })
  }

  renderNoTeamMessage = () => {
    if (!this.props.user.team_id) {
      return (
        <View style={styles.noTeamWrapper}>
          <Icon type="material-community" name="crown" size={148} color={"rgba(242, 100, 48, 1)"} />
          <Text style={styles.welcomeText}>Welcome to <Text style={styles.title}>King of the Friends</Text>! You're not on a team yet so go to the teams page to create or join an existing team!</Text>
          <CustomButton
            pressHandler={this.accountNavigate}
            text={"Take Me to Teams"}
          />
        </View>
      )
    }
  }

  updateMembersTimeToBackEnd = async () => {
    const members = await allApiCall('http://localhost:8001/api/v1/users');
    const authedMembers = members.map(member => {
      return { email: member.email, token: member.token }
    })
    const stravaSegs = await authedMembers.map(member => {
      return getUserAttempts(this.props.team.segment_id, member.token);
    })
    const resolvedAllTeamAttempts = await Promise.all(stravaSegs)
    // resolvedAllTeamAttempts.forEach(async (array, i) => {
    //   let fastestTime = array[0].elapsed_time;
    //   console.log(array)
    //   console.log(fastestTime);
    //   const options = {
    //     method: 'PATCH',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       segment_time: fastestTime,
    //     })
    //   }
    //   let result = await patchPostCall('http://localhost:8001/api/v1/users/', authedMembers[i], options)
    //   console.log(result);
    // })
  }

  accountNavigate = () => {
    this.props.navigation.navigate('Account', { name: 'Team Sign Up' })
  }

  render() {
    const { name, finish_date } = this.props.team;
    return (
      <View style={styles.container}>
        <Text style={styles.teamName}>{name}</Text>
        { finish_date &&
          <CountdownComponent date={finish_date}/>
        }
        <Map />
        { !name && this.props.user.picture &&
          this.renderNoTeamMessage()
        }
        { name &&
          this.getTeamMembers()
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  team: state.team,
  members: state.members
})

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 24,
  },
  placeWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxHeight: 50,
    maxWidth: 300,
    marginTop: 25,
  },
  noTeamWrapper: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeNum: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderRadius: 30/2,
    overflow: 'hidden',
    backgroundColor: 'rgba(242, 100, 48, 1)',
  },
  placeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Lobster',
    fontSize: 20  
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 55,
    maxWidth: 55,
    height: 59,
    overflow: 'visible'
  },
  profilePic: {
    position: 'absolute',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 40/2,
  },
  icon: {
    marginLeft: 27,
  },
  welcomeText: {
    width: 300,
    marginBottom: 85,
    fontSize: 18,
    alignSelf: 'center'
  },
  title: {
    color: "rgba(242, 100, 48, 1)",
    fontWeight: 'bold'
  }
});
