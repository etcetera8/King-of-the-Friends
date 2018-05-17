import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import connect from 'react-redux';
import { MapView } from 'expo';

export class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coordinates: [
        {
          "latitude": 40.71858,
          "longitude": -73.98908
        },
        {
          "latitude": 40.71868,
          "longitude": -73.98903
        },
        {
          "latitude": 40.7187,
          "longitude": -73.98912
        },
        {
          "latitude": 40.71893,
          "longitude": -73.98988
        },
        {
          "latitude": 40.71911,
          "longitude": -73.99044
        },
        {
          "latitude": 40.71964,
          "longitude": -73.99215
        },
        {
          "latitude": 40.72017,
          "longitude": -73.99389
        },
        {
          "latitude": 40.72022,
          "longitude": -73.99402
        },
        {
          "latitude": 40.72026,
          "longitude": -73.99413
        },
        {
          "latitude": 40.72033,
          "longitude": -73.9941
        },
        {
          "latitude": 40.72052,
          "longitude": -73.99402
        },
        {
          "latitude": 40.72061,
          "longitude": -73.99399
        },
        {
          "latitude": 40.72071,
          "longitude": -73.994
        },
        {
          "latitude": 40.7208,
          "longitude": -73.99398
        },
        {
          "latitude": 40.72093,
          "longitude": -73.99393
        },
        {
          "latitude": 40.72166,
          "longitude": -73.99365
        },
        {
          "latitude": 40.72237,
          "longitude": -73.9934
        },
        {
          "latitude": 40.72241,
          "longitude": -73.99349
        },
        {
          "latitude": 40.72268,
          "longitude": -73.99413
        },
        {
          "latitude": 40.72303,
          "longitude": -73.99504
        },
        {
          "latitude": 40.72335,
          "longitude": -73.99578
        },
        {
          "latitude": 40.72338,
          "longitude": -73.99582
        },
        {
          "latitude": 40.72364,
          "longitude": -73.99645
        },
        {
          "latitude": 40.72381,
          "longitude": -73.99688
        },
        {
          "latitude": 40.72388,
          "longitude": -73.99701
        },
        {
          "latitude": 40.72418,
          "longitude": -73.99777
        },
        {
          "latitude": 40.72458,
          "longitude": -73.99858
        },
        {
          "latitude": 40.72533,
          "longitude": -74.0001
        },
        {
          "latitude": 40.72687,
          "longitude": -74.00317
        },
        {
          "latitude": 40.72693,
          "longitude": -74.00352
        },
        {
          "latitude": 40.72777,
          "longitude": -74.00318
        },
        {
          "latitude": 40.72805,
          "longitude": -74.00318
        },
        {
          "latitude": 40.72833,
          "longitude": -74.00315
        },
        {
          "latitude": 40.72832,
          "longitude": -74.00305
        },
        {
          "latitude": 40.7283,
          "longitude": -74.003
        },
        {
          "latitude": 40.72835,
          "longitude": -74.00299
        },
        {
          "latitude": 40.72842,
          "longitude": -74.00298
        },
        {
          "latitude": 40.72843,
          "longitude": -74.00309
        },
        {
          "latitude": 40.72845,
          "longitude": -74.00331
        },
        {
          "latitude": 40.72858,
          "longitude": -74.00468
        }
      ]
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.71858,
            longitude: -73.98908,
            latitudeDelta: 0.0722,
            longitudeDelta: 0.0221,
          }}>
          {
            this.state.coordinates &&
            <MapView.Polyline
              coordinates={this.state.coordinates}
              strokeWidth={4}
              strokeColor="red"
            />
          }
          </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    width: 250,
    height: 250,
    borderRadius: 250/2
  }
})

