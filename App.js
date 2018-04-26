import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider } from 'react-redux';
import { initialState } from './store'

// import Home from './components/Home';
// import Account from './components/Account';
import {Tabs} from './components/TabNavigator';


export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 1
    }
  }

  handlePress = (number) => {
    console.log('press', number);
  }

  render() {
    return (
      <Provider store={ initialState() }>
          <Tabs></Tabs>
      </Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  number: state.number
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
