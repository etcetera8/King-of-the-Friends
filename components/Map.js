import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { segmentCall } from '../api';
import polyline from '@mapbox/polyline';

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      begin: 0,
      end: 0,
      coordinates : []
    }
  }
  
  componentDidUpdate() {
    if (!this.state.coordinates.length) {
      this.renderMap()
    }
  }

  renderMap = async() => {
    const stravaSegment = await segmentCall(this.props.team.segment_id, this.props.user.token);
    const coordinates = polyline.decode(stravaSegment.map.polyline).map(latLng => {
      return { latitude: latLng[0], longitude: latLng[1] }
    })
    this.setState({
      begin: stravaSegment.start_latitude,
      end: stravaSegment.end_longitude,
      coordinates
    })
  }

  render() {
    return (
      <View> 
      { this.state.begin &&
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: this.state.begin,
              longitude: this.state.end,
              latitudeDelta: 0.0722,
              longitudeDelta: 0.0221,
            }}>
            <MapView.Polyline
              coordinates={this.state.coordinates}
              strokeWidth={2}
              strokeColor="red"
            />
          </MapView>
      }
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
    width: 250,
    height: 250,
    borderRadius: 250/2
  }
})

