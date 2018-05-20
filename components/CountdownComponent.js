import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNMomentCountDown from 'react-native-moment-countdown';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

export class CountdownComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      today: "",
      end: "",
      seconds: 25
    }
  }

componentDidMount() {
  this.formatDate()
}

formatDate = () => {
  if (this.props.date) {
    const today = new Date(Date.now()).toISOString().substr(0,10)
    const now = moment(today);
    const end = moment(this.props.date.substr(0, 10))
    const duration = moment.duration(now.diff(end))
    const seconds = Math.abs(duration._milliseconds)/1000
    return (<CountDown
      style={styles.countdown}
      until={seconds}
      onFinish={() => console.log('finished')}
      onPress={() => alert('hello')}
      size={20}
    />)
  }
}

render() {
  let { date } = this.props;
    return (
      <View>
        { date &&
          this.formatDate()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  countdown: {
    margin: 10
  }
})