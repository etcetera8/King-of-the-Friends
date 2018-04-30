import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider } from 'react-redux';
import { initialState } from './store';
import Login from './components/Login';
import { Tabs } from './components/TabNavigator';

export class App extends React.Component {
  constructor(props) {
    super(props)
  }

  login = () => {
    return this.props.user ? <Tabs></Tabs> : <Login></Login>
  }

  render() {
    return (
      <Provider store={ initialState() }>
        {this.login()}
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
