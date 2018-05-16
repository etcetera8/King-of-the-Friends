import { combineReducers } from 'redux';
import { loginUser } from './loginUser';
import { getTeam } from './getTeam';
const rootReducer = combineReducers(
  {
    user: loginUser,
    team: getTeam
  }
)  

export default rootReducer;