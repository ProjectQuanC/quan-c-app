// reducers/challengeReducer.ts
import {
  FETCH_CHALLENGES_REQUEST,
  FETCH_CHALLENGES_SUCCESS,
  FETCH_CHALLENGES_FAILURE
} from '../../features/challenge/challengeAction';

const initialState = {
  challenges: [],
  totalPages: 0,
  loading: false,
  error: ''
};

const challengeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_CHALLENGES_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_CHALLENGES_SUCCESS:
      return {
        ...state,
        challenges: action.payload.challenges,
        totalPages: action.payload.totalPages,
        loading: false
      };
    case FETCH_CHALLENGES_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default challengeReducer;