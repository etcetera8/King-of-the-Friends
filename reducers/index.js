import { combineReducers } from 'redux';
import { loginUser } from './loginUser';
import { getTeam } from './getTeam';
import { getMembers } from './getMembers';
import { addCoordinates } from './addCoordinates';

const rootReducer = combineReducers(
  {
    user: loginUser,
    team: getTeam,
    members: getMembers,
    coordinates: addCoordinates
  }
)  

export default rootReducer;