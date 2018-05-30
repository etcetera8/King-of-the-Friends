export const loginUser = (user = {}) => ({
  type: 'LOGIN_USER',
  payload: user
});

export const getTeam = (team = {}) => ({
  type: 'GET_TEAM',
  payload: team
})

export const getMembers = (members = []) => ({
  type: 'GET_MEMBERS',
  payload: members
})
