import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import connect from 'react-redux';
import { MapView } from 'expo';
//import { Polyline } from 'react-native-maps';

export class Map extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("polyline", MapView.Polyline);
  }

  render() {
    return (
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
            <MapView.Polyline 
              strokeWidth={4}
              strokeColor="red"
            />
        <Text>
          Map
        </Text>
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

