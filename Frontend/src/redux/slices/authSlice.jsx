// redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

let user = null;
const token = Cookies.get('token');
if (token) {
  try {
    user = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token");
  }
}

const initialState = {
  isLoggedIn: !!token,
  user: user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      // Store token in cookie if it's provided
      if (action.payload.token) {
        Cookies.set('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      Cookies.remove('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer; // ✅ VERY IMPORTANT
