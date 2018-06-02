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
      latitudeDelta: 0.0102,
      longitudeDelta: 0.0102,
      coordinates : [],
      name: ''
    }
  }
  
  componentDidUpdate(prevProps) {
    console.log('infinite check');
    if (this.props.coordinates.length !== prevProps.coordinates.length || !this.state.coordinates.length) {
      this.renderMap()
    }
  }

  getRegionForCoordinates(points) {
  let minX, maxX, minY, maxY;
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const deltaX = (maxX - minX);
  const deltaY = (maxY - minY);

  return {
    latitudeDelta: deltaX,
    longitudeDelta: deltaY
  };
}

  renderMap = async() => {
    const { team, user } = this.props;
    const stravaSegment = await segmentCall(team.segment_id, user.token);
    if (stravaSegment.errors) {
      this.setState({ begin: 39.742043, end: -104.991531, coordinates: [{latitude: 0, longitude: 0}, { latitude: 1, longitude: 1 }]})
    } else {
      const coordinates = polyline.decode(stravaSegment.map.polyline).map(latLng => {
        return { latitude: latLng[0], longitude: latLng[1] }
      })
      this.props.updateCoordinates(coordinates)
      let region = this.getRegionForCoordinates(coordinates)
      this.setState({
        begin: stravaSegment.start_latitude,
        end: stravaSegment.end_longitude,
        coordinates,
        name: stravaSegment.name,
        latitudeDelta: region.latitudeDelta += 0.02,
        longitudeDelta: region.longitudeDelta += 0.02,
      })
    }
  }

  render() {
    const { name, begin, end, latitudeDelta, longitudeDelta } = this.state;
    const { coordinates } = this.props;
    return (
      <View> 
      { coordinates && begin &&
          <MapView
          style={styles.map}
          region={{
            latitude: begin,
            longitude: end,
            latitudeDelta,
            longitudeDelta
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

