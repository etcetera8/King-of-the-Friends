export const updateNumber = (state = 1, action) => {
  switch (action.type) {
    case 'UPDATE_NUMBER':
      return action.payload
    default:
    return state;
  }
}