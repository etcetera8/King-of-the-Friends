export const addCoordinates = (state = [], action) => {
  switch(action.type) {
    case 'ADD_COORDINATES':
      return action.payload;
    default:
      return state;
  }
}