import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/AuthReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Type for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
