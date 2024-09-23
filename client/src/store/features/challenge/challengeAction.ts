import axios from 'axios';
import { Dispatch } from 'redux';

export const FETCH_CHALLENGES_REQUEST = 'FETCH_CHALLENGES_REQUEST';
export const FETCH_CHALLENGES_SUCCESS = 'FETCH_CHALLENGES_SUCCESS';
export const FETCH_CHALLENGES_FAILURE = 'FETCH_CHALLENGES_FAILURE';

export const fetchChallengesRequest = () => ({
  type: FETCH_CHALLENGES_REQUEST
});

export const fetchChallengesSuccess = (challenges: any[], totalPages: number) => ({
  type: FETCH_CHALLENGES_SUCCESS,
  payload: { challenges, totalPages }
});

export const fetchChallengesFailure = (error: string) => ({
  type: FETCH_CHALLENGES_FAILURE,
  payload: error
});

// Fetch challenges function
export const fetchChallenges = (page: number, value: string, searchQuery: string, difficulty: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchChallengesRequest());
    const accessToken = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);

    const data = JSON.stringify({
      filter: value,
      search: searchQuery,
      difficulty: difficulty,
      page: page
    });

    try {
      const response = await axios.post('http://localhost:8000/getChallenges', data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const { data: challengesData, paginationData } = response.data;
      console.log(challengesData)
      dispatch(fetchChallengesSuccess(challengesData, paginationData.totalPages));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(fetchChallengesFailure(error.message));
      } else if (error instanceof Error) {
        dispatch(fetchChallengesFailure(error.message));
      } else {
        dispatch(fetchChallengesFailure('An unknown error occurred'));
      }
    }
  };
};
