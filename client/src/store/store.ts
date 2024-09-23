import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/auth/authReducer';
import challengeReducer from './reducer/challenge/challengeReducer';
import { userReducer } from './reducer/user/userReducer';
import leaderboardReducer from './reducer/leaderboard/leaderboardReducer';
import challengeDetailReducer from './reducer/challenge/challengeDetailReducer';


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    challenges: challengeReducer,
    challengeDetail: challengeDetailReducer,
    leaderboard: leaderboardReducer,
  },
});

// Type for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
