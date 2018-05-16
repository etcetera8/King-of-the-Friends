import { combineReducers } from 'redux';
import { loginUser } from './loginUser';
import { getTeam } from './getTeam';
import { getMembers } from './getMembers';

const rootReducer = combineReducers(
  {
    user: loginUser,
    team: getTeam,
    members: getMembers
  }
)  

export default rootReducer;