import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "./features/chats/chatsSlice";
import messagesReducer from "./features/messages/messgesSlice";
import onlineUsers from "./features/online-users/onlineUsersSlice";

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    messages: messagesReducer,
    onlineUsers: onlineUsers,
  },
  devTools: import.meta.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
