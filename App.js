import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider, connect } from 'react-redux';
import { initialState } from './store';
// import Login from './components/Login';
// import { Tabs } from './components/TabNavigator';
import LoginNavigator from './components/LoginNavigator';

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={ initialState() }>
        <LoginNavigator></LoginNavigator>
      </Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
