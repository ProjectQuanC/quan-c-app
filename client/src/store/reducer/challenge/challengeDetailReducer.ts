import {
  FETCH_CHALLENGE_DETAIL_REQUEST,
  FETCH_CHALLENGE_DETAIL_SUCCESS,
  FETCH_CHALLENGE_DETAIL_FAILURE
} from '../../features/challenge/challengeDetailAction';

interface ChallengeDetail {
  challenge_id: string;
  challenge_title: string;
  repo_link: string;
  points: number;
  total_test_case: number;
  tags: string[];
}

interface ChallengeDetailState {
  loading: boolean;
  data: ChallengeDetail | null;
  error: string | null;
}

const initialState: ChallengeDetailState = {
  loading: false,
  data: null,
  error: null,
};

const challengeDetailReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_CHALLENGE_DETAIL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_CHALLENGE_DETAIL_SUCCESS:
      return {
        ...state,
        challenges: action.payload.challenges,
        totalPages: action.payload.totalPages,
        loading: false
      };
    case FETCH_CHALLENGE_DETAIL_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default challengeDetailReducer;