import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { MapView, Font, AppLoading } from 'expo';
import { segmentCall } from '../api';
import { addCoordinates } from '../actions/index';
import polyline from '@mapbox/polyline';
class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      begin: 0,
      end: 0,
      coordinates : [],
      name: ''
    }
  }
  
  componentDidUpdate() {
    if (!this.props.coordinates.length) {
      this.renderMap()
    }
  }

  renderMap = async() => {
    const {team, user} = this.props;
    const stravaSegment = await segmentCall(team.segment_id, user.token);
    const coordinates = polyline.decode(stravaSegment.map.polyline).map(latLng => {
      return { latitude: latLng[0], longitude: latLng[1] }
    })
    
    this.props.updateCoordinates(coordinates)
    this.setState({
      begin: stravaSegment.start_latitude,
      end: stravaSegment.end_longitude,
      name: stravaSegment.name
    })
  }

  render() {
    const { name, begin, end } = this.state;
    const { coordinates } = this.props;
    return (
      <View> 
      { begin &&
          <MapView
          style={styles.map}
          initialRegion={{
            latitude: begin,
            longitude: end,
            latitudeDelta: 0.0102,
            longitudeDelta: 0.0301,
          }}>
            <MapView.Polyline
              coordinates={coordinates}
              strokeWidth={3}
              strokeColor="rgba(242, 100, 48, 1)"
            />
          </MapView>
      }
        <Text style={styles.segmentName}>{name}</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  team: state.team,
  user: state.user,
  coordinates: state.coordinates
})

const mapDispatchToProps = dispatch => ({
  updateCoordinates: coordinates => dispatch(addCoordinates(coordinates))
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)

const styles = StyleSheet.create({
  map: {
    marginTop: 10,
    width: 230,
    height: 230,
    borderRadius: 230/2,
    borderWidth: 5,
    borderColor: "rgba(160, 55, 252, 1)"
  },
  segmentName: {
    marginTop: 15,
    fontFamily: 'Lobster',
    fontSize: 18,
    alignSelf: 'center',
    color: 'rgba(242, 100, 48, 1)'
  }
})

