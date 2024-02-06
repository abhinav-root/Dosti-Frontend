import { createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  createdAt: Date;
  friends: number;
}

export interface Message {
  _id: string;
  chat: string;
  sender: string;
  content: string;
  createdAt: string;
}

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  SEEN = "SEEN",
}

export interface Chat {
  _id: string;
  users: User[];
  latestMessage: Message | null;
  unread: number;
  messageStatus: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface InitialState {
  chats: Chat[];
  selectedChat: Chat | null;
}
const initialState: InitialState = {
  chats: [],
  selectedChat: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addNewChat: (state, action) => {
      state.chats.push(action.payload);
    },
    deleteChat: (state, action) => {
      const chatId  = action.payload;
      state.chats = state.chats.filter((chat) => chat._id !== chatId);
    },
    updateSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    setLatestMessage: (state, action) => {
      console.log("doing stuff");
      const { chatId, latestMessage } = action.payload;
      const index = state.chats.findIndex((chat) => chat._id === chatId);
      console.log({ selectedChatId: state.selectedChat?._id, chatId });
      if (state.selectedChat?._id !== chatId) {
        state.chats[index].unread++;
      }
      state.chats[index].latestMessage = latestMessage;
    },
    markAllChatsDelivered: (state, action) => {
      const userId = action.payload;
      console.log("markAllChatsDelivered");
      console.log({ userId });
      const updated = state.chats.map((chat) => {
        if (chat.users[0]._id === userId || chat.users[1]._id === userId) {
          chat.messageStatus = MessageStatus.DELIVERED;
          console.log("chat found with userId", chat._id);
        }
        return chat;
      });
      state.chats = updated;
      console.log("chats after update", state.chats);
    },
  },
});

export const {
  setChats,
  addNewChat,
  deleteChat,
  updateSelectedChat,
  clearSelectedChat,
  setLatestMessage,
  markAllChatsDelivered,
} = chatsSlice.actions;

export default chatsSlice.reducer;
