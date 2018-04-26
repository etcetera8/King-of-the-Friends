import React from 'react';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import Home from './components/Home'
import {initialState} from './store'


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
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
          <Home handlePress={this.handlePress}/>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
