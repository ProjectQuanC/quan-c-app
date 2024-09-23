// actions.ts

import axios from 'axios';
import { Dispatch } from 'redux';
import { LeaderboardEntry, LeaderboardResponse } from '../../types/types';

// Define action types
export const FETCH_LEADERBOARD_REQUEST = 'FETCH_LEADERBOARD_REQUEST';
export const FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS';
export const FETCH_LEADERBOARD_FAILURE = 'FETCH_LEADERBOARD_FAILURE';

// Action creators
export const fetchLeaderboardRequest = () => ({
  type: FETCH_LEADERBOARD_REQUEST,
});

export const fetchLeaderboardSuccess = (leaderboard: LeaderboardEntry[], userRank: number) => ({
  type: FETCH_LEADERBOARD_SUCCESS,
  payload: { leaderboard, userRank },
});

export const fetchLeaderboardFailure = (error: string) => ({
  type: FETCH_LEADERBOARD_FAILURE,
  payload: error,
});

// Thunk action for fetching leaderboard
export const fetchLeaderboard = (userId: string, challengeId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchLeaderboardRequest());

    let data = JSON.stringify({
      "userId": userId,
      "challengeId": challengeId
    });

    let config = {
      headers: { 
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity,
    };

    try {
      const response = await axios.post<LeaderboardResponse>(
        'http://localhost:8000/getChallengeLeaderboard',
        data,
        config
      );

      const { leaderboard, userRank } = response.data.data;
      dispatch(fetchLeaderboardSuccess(leaderboard, userRank));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(fetchLeaderboardFailure(error.message));
      } else if (error instanceof Error) {
        dispatch(fetchLeaderboardFailure(error.message));
      } else {
        dispatch(fetchLeaderboardFailure('An unknown error occurred'));
      }
    }
  };
};
