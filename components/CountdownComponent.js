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
      today: "",
      end: "",
      seconds: 0,
    }
  }

componentDidMount = () => {
  this.setState({seconds: this.formatDate(this.props.team.finish_date)})
}

formatDate = (date) => {
  if (this.props.date) {
    const today = new Date(Date.now()).toISOString();
    const now = moment(today);
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
            onFinish={() => console.log('finished')}
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