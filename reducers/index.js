import { combineReducers } from 'redux';

const rootReducer = combineReducers(
  {
    temp: () => { return {hi: 5}},
    stuff: () =>  null
  }
)  

export default rootReducer;