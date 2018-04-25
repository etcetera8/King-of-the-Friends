import { combineReducers } from 'redux';
import { updateNumber } from './updateNumber'

const rootReducer = combineReducers(
  {
    temp: () => { return {hi: 5}},
    stuff: () =>  null,
    number: updateNumber
  }
)  

export default rootReducer;