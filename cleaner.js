export const cleanUser = (user, token) => {
  const { id, email } = user;
  const name = user.firstname + " " + user.lastname;
  return {
    stravaId: id,
    name,
    picture: user.profile_medium,
    email,
    token
  }
}
