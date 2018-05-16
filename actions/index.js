export const loginUser = (user) => ({
  type: 'LOGIN_USER',
  payload: user
});

export const getTeam = (team) => ({
  type: 'GET_TEAM',
  payload: team
})
