import axios from 'axios';
import { AnyAction, Dispatch } from 'redux';

// Action Types
export const FETCH_CHALLENGE_DETAIL_REQUEST = 'FETCH_CHALLENGE_DETAIL_REQUEST';
export const FETCH_CHALLENGE_DETAIL_SUCCESS = 'FETCH_CHALLENGE_DETAIL_SUCCESS';
export const FETCH_CHALLENGE_DETAIL_FAILURE = 'FETCH_CHALLENGE_DETAIL_FAILURE';

// Challenge Detail Type
export type ChallengeDetail = {
  challenge_id: string;
  challenge_title: string;
  repo_link: string;
  points: number;
  total_test_case: number;
  tags: string[];
};

// Action Creators
export const fetchChallengeDetailRequest = () => ({
  type: FETCH_CHALLENGE_DETAIL_REQUEST,
});

export const fetchChallengeDetailSuccess = (challengeDetail: ChallengeDetail) => ({
  type: FETCH_CHALLENGE_DETAIL_SUCCESS,
  payload: challengeDetail,
});

export const fetchChallengeDetailFailure = (error: string) => ({
  type: FETCH_CHALLENGE_DETAIL_FAILURE,
  payload: error,
});


export const fetchChallengeDetail = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchChallengeDetailRequest())

    try {
      const url = process.env.REACT_APP_API_BASE_URL
      const response = await axios.get<{ data: ChallengeDetail }>(`${url}/getChallengeDetails/${id}`);

      if (!response.data) {
        throw new Error('Failed to fetch challenge details');
      }

      const challengeDetail = response.data.data;
      dispatch(fetchChallengeDetailSuccess(challengeDetail));
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.message : error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(fetchChallengeDetailFailure(message));
    }
  }
};