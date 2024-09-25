// actions/userActions.ts
import { Dispatch } from 'redux';

export const FETCH_USER_DATA_REQUEST = 'FETCH_USER_DATA_REQUEST';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const FETCH_USER_DATA_FAILURE = 'FETCH_USER_DATA_FAILURE';

export const fetchUserData = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_USER_DATA_REQUEST });

  try {
    const url = process.env.REACT_APP_API_BASE_URL
    const response = await fetch(`${url}/getUserData`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('TOKEN'),
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    dispatch({ type: FETCH_USER_DATA_SUCCESS, payload: data.data });
  } catch (error: any) {
    dispatch({ type: FETCH_USER_DATA_FAILURE, payload: error.message });
  }
};
