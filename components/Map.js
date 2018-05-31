import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { MapView, Font, AppLoading } from 'expo';
import { segmentCall } from '../api';
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
    if (!this.state.coordinates.length) {
      this.renderMap()
    }
  }

  renderMap = async() => {
    const stravaSegment = await segmentCall(this.props.team.segment_id, this.props.user.token);
    if (stravaSegment.errors) {
      this.setState({ begin: 39.742043, end: -104.991531, coordinates: [{latitude: 0, longitude: 0}]})
    } else {
      const coordinates = polyline.decode(stravaSegment.map.polyline).map( latLng => {
        return { latitude: latLng[0], longitude: latLng[1] }
      })
      this.setState({
        begin: stravaSegment.start_latitude,
        end: stravaSegment.end_longitude,
        coordinates,
        name: stravaSegment.name
      })
    }
  }

  render() {
    const { name, begin, end, coordinates } = this.state;
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

const mapStateToProps = (state) => ({
  team: state.team,
  user: state.user
})

export default connect(mapStateToProps, null)(Map)

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

