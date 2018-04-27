import { combineReducers } from 'redux';
import { loginUser } from './loginUser'

const rootReducer = combineReducers(
  {
    user: loginUser
  }
)  

export default rootReducer;