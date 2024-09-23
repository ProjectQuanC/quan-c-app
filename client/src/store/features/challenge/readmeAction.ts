import axios from 'axios';
import { Dispatch } from 'redux';

export const FETCH_README_REQUEST = 'FETCH_README_REQUEST';
export const FETCH_README_SUCCESS = 'FETCH_README_SUCCESS';
export const FETCH_README_FAILURE = 'FETCH_README_FAILURE';

const fetchReadmeRequest = () => ({ 
  type: FETCH_README_REQUEST 
});

const fetchReadmeSuccess = (readme: string) => ({
   type: FETCH_README_SUCCESS, payload: readme 
});
const fetchReadmeFailure = (error: string) => ({ 
  type: FETCH_README_FAILURE, payload: error 
});

export const fetchReadme = (repoLink: string) => async (dispatch: Dispatch) => {
  dispatch(fetchReadmeRequest());
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${repoLink}/main/README.md`);
    if (!response.ok) throw new Error('Failed to fetch README');
    const readmeText = await response.text();
    dispatch(fetchReadmeSuccess(readmeText));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch(fetchReadmeFailure(error.message));
    } else if (error instanceof Error) {
      dispatch(fetchReadmeFailure(error.message));
    } else {
      dispatch(fetchReadmeFailure('An unknown error occurred'));
    }
  }
};
