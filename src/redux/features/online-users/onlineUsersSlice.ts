import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  onlineUsers: {
    [userId: string]: string;
  };
}

const initialState: InitialState = {
  onlineUsers: {},
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
