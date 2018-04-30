
export const loginUser = (user) => ({
  type: 'LOGIN_USER',
  payload: user
});

// export const fetchUser = (user) => {
//   console.log('fire dof')
//   return function (dispatch) {
//     //dispatch(requestPosts(user))
//     return fetch('http://localhost:8001/api/v1/users/1')
//       .then(
//       response => response.json(),
//       error => console.log('An error occurred.', error)
//       )
//       .then(json =>
        
//         loginUser({ type: 'LOGIN_USER', user: json })
//       )
//   }
// }