// reducer.ts

import { FETCH_LEADERBOARD_REQUEST, FETCH_LEADERBOARD_SUCCESS, FETCH_LEADERBOARD_FAILURE } from '../../features/leaderboard/leaderboardAction';
import { LeaderboardEntry } from '../../types/types';

interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
  userRank: number;
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  leaderboard: [],
  userRank: 0,
  loading: false,
  error: null,
};

const leaderboardReducer = (state = initialState, action: any): LeaderboardState => {
  switch (action.type) {
    case FETCH_LEADERBOARD_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_LEADERBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        leaderboard: action.payload.leaderboard,
        userRank: action.payload.userRank,
      };
    case FETCH_LEADERBOARD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default leaderboardReducer;