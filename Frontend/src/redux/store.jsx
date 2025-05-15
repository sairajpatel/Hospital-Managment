// redux/store.js or redux/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // ✅ Correct path

export const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ Must be reducer, not undefined
  },
});
