// reducers/authReducer.ts
import { LOGIN_SUCCESS, LOGOUT, FETCH_USER_DATA } from '../../features/auth/authActions';

interface AuthState {
  isAuthenticated: boolean;
  userData: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userData: null,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userData: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userData: null,
      };
    case FETCH_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
