import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Text, Button, StyleSheet} from 'react-native';
import { loginUser } from '../actions/index';
import { apiCall } from '../api';
export class Home extends Component {

  async componentDidMount() {
    const user = await apiCall('http://localhost:8001/api/v1/users/', 1);
    console.log(user)
    await this.props.loginUser(user)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> Home </Text>
        <Button
          style={{ fontSize: 20, color: 'green' }}
          title="test"
          onPress={() => console.log('clicked')}>1
        </Button>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
} )

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user) => dispatch(loginUser(user))
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
