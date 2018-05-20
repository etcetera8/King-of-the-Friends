import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNMomentCountDown from 'react-native-moment-countdown';

export function Countdown({ date }) {
  let rawDate = '0000-00-00'
  if (date) {
    rawDate = date.substr(0, 10)
  }
  
  return (
    <View>
      <View style={styles.countdown}>
      <RNMomentCountDown 
        style={styles.countdown}
        toDate={rawDate} 
        targetFormatMask='DD:HH:mm:ss' />
      </View>
      <Text style={styles.countdown}>Finish Date: {rawDate}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  countdown: {
    fontSize: 20,
    margin: 10
  }
})