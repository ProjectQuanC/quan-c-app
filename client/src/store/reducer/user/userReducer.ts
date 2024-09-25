// reducers/userReducer.ts
import { User } from './userTypes';
import {
  FETCH_USER_DATA_REQUEST,
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
} from '../../features/user/userAction';

interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  user: null,
  error: null,
};

export const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case FETCH_USER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
