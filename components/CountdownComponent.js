import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import RNMomentCountDown from 'react-native-moment-countdown';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

class CountdownComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      today: new Date(Date.now()).toISOString(),
      end: "",
      seconds: 0,
    }
  }

componentDidMount = () => {
  const { finish_date } = this.props.team;
  if (this.state.today > finish_date) {
    this.setState({ seconds: .01 }) //IF JUST 0 PASSED IN WILL NOT RENDER
  } else {
    this.setState({ seconds: this.formatDate(finish_date) })
  }
}

componentDidUpdate = (prevProps) => {
  if (prevProps.team.finish_date != this.props.team.finish_date) {
    console.log('diferent date');
    //this.forceUpdate()
  } else {
    console.log('date not changed');
  }
}

formatDate = (date) => {
  if (this.props.date) {
    const now = moment(this.state.today);
    const end = moment(this.props.team.finish_date);
    const duration = moment.duration(now.diff(end));
    const seconds = Math.abs(duration._milliseconds)/1000;
    return seconds
  }
}

render () {
  const { seconds } = this.state;
    return (
      <View>
        { seconds &&
          <CountDown
            digitBgColor={"rgba(242, 100, 48, 1)"}
            digitTxtColor={"#fff"}
            timeTxtColor={"#000"}
            style={styles.countdown}
            until={seconds}
            onFinish={this.props.showWinner}
            size={20}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  team: state.team
})

export default connect(mapStateToProps, null)(CountdownComponent)

const styles = StyleSheet.create({
  countdown: {
    margin: 10
  }
})