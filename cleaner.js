export const cleanUser = (user, token) => {
  console.log(user);
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
