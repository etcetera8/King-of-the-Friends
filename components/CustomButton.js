import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

export const CustomButton = ({text, pressHandler }) => {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={pressHandler}
      > 
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 175,
    height: 40,
    margin: 2,
    backgroundColor: 'rgba(160, 55, 252, 1)',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowOffset: { width: 3, height: 3, },
    shadowColor: 'black',
    shadowOpacity: .3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  }
})