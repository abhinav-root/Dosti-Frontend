import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../chats/chatsSlice";

interface InitialState {
  selectedChatMessages: Message[];
}

const initialState: InitialState = {
  selectedChatMessages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    pushMessages: (state, action) => {
      const msgs = state.selectedChatMessages
      state.selectedChatMessages = [...action.payload, ...msgs]
    },
    pushMessage: (state, action) => {
      state.selectedChatMessages.push(action.payload);
    },
    clearAllMessages: (state) => {
      state.selectedChatMessages = [];
    },
  },
});

export const { pushMessage, pushMessages, clearAllMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
