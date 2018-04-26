import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Text, Button, StyleSheet} from 'react-native';
import { updateNumber } from '../actions/index';

export class Home extends Component {
  render() {
    console.log(this)
    return (
      <View style={styles.container}>
      <Text> Home </Text>
      <Button
        style={{ fontSize: 20, color: 'green' }}
        title="test"
        onPress={() => this.props.updateNumber(3)}>1
      </Button>
    </View>
    )
  }
}



const mapStateToProps = (state) => ({
  number: state.number
} )

const mapDispatchToProps = (dispatch) => ({
  updateNumber: (number) => dispatch(updateNumber(number))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
