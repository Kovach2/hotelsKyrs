import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    admin: (state) =>{
      state.isAuthenticated = true;
      state.isAdmin = true;
      state.user = {username: 'admin'}
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = true;
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { login, logout, admin } = authSlice.actions;
export default authSlice.reducer;