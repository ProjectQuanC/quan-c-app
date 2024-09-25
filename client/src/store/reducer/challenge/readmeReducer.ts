import {
  FETCH_README_REQUEST,
  FETCH_README_SUCCESS,
  FETCH_README_FAILURE
} from '../../features/challenge/readmeAction';


interface ReadmeState {
  loading: boolean;
  data: string;
  error: string | null;
}

const initialState: ReadmeState = {
  loading: false,
  data: '',
  error: null,
};

const readmeReducer = (state = initialState, action: any): ReadmeState => {
  switch (action.type) {
    case FETCH_README_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_README_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_README_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default readmeReducer;