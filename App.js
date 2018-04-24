import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/';
import { StyleSheet, Text, View } from 'react-native';

const initialState = () => {
  const enhancer = compose(
    applyMiddleware(thunk),
    global.reduxNativeDevTools ?
      global.reduxNativeDevTools(/*options*/) :
      noop => noop
  )
  const store = createStore(rootReducer, enhancer);
  if (global.reduxNativeDevTools) {
    global.reduxNativeDevTools.updateStore(store)
  }
return store
}

export default class App extends React.Component {

  render() {
    console.log(initialState)
    return (
      <Provider store={ initialState() }>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
