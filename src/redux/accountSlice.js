import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reserv: true,
    liked: false
};

const accountSlice = createSlice({
  name: 'сhoice',
  initialState,
  reducers: {
    reserve: (state) => {
        state.reserv = true
        state.liked = false
    },
    liked: (state) => {
        state.liked = true
        state.reserv = false
    },
  },
});

export const { reserve, liked } = accountSlice.actions;
export default accountSlice.reducer;