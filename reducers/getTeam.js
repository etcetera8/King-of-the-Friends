export const getTeam = (state = {}, action) => {
  switch(action.type) {
    case 'GET_TEAM':
      return action.payload
    default:
      return state
  }

}