import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { apiCall, allApiCall } from '../api';
import moment from 'moment';
import { Countdown } from './Countdown'
import{ Map } from './Map';

export class Home extends Component {

  getTeamMembers = () => {
    const sorted = this.props.members.sort( (a, b) => parseInt(a.segment_time) - parseInt(b.segment_time))
    
    return sorted.map( (member, i) => {
      const number = moment.utc(member.segment_time).format('HH:mm');
      return <View style={styles.placeWrapper} key={i}>
               <View style={styles.placeNum}><Text>{i+1}</Text></View>
               <Text>{member.name}</Text>
               <Image
                source={{ uri: member.picture }}
                style={styles.profilePic} />
               <Text>{number}</Text>
             </View>
    })
  }

  render() {
    return (
      <View style={styles.container}>
          <Text>{this.props.team.name}</Text>
          <Countdown date={this.props.team.finish_date}/>
          <Map />
          {this.getTeamMembers()}
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
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 40/2
  },
  placeWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxHeight: 50,
    maxWidth: 300,
    marginTop: 50,
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
