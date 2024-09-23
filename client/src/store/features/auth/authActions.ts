// actions/authActions.ts
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const FETCH_USER_DATA = 'FETCH_USER_DATA';

export const loginSuccess = (userData: any) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});

export const fetchUserData = (userData: any) => ({
  type: FETCH_USER_DATA,
  payload: userData,
});
