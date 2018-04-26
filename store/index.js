import rootReducer from '../reducers/';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

export const initialState = () => {
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