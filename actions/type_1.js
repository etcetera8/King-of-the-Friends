import TYPE_1 from './types';

export const type1_action = (dispatch) => {
  data=2
  dispatch({
    type: TYPE_1,
    payload: data
  })
}