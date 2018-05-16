export const getMembers = (state = [], action) => {
  switch(action.type) {
    case 'GET_MEMBERS':
      return action.payload
    default:
      return state
  }
}