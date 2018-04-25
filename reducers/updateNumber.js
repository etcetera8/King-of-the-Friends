export const updateNumber = (state = 1, action) => {
  switch (action.type) {
    case 'ADD_USER_DATA':
      return action.payload
    default:
    return state;
  }
}