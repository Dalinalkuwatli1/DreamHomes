import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Conversation, Message } from '../../types';
import { mockMessages } from '../../data/mockData';

interface MessagesState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

const initialState: MessagesState = {
  conversations: mockMessages as Conversation[],
  activeConversationId: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
      if (action.payload) {
        const conv = state.conversations.find(c => c.id === action.payload);
        if (conv) {
          conv.messages.forEach(m => { m.read = true; });
          conv.unreadCount = 0;
        }
      }
    },
    sendMessage(state, action: PayloadAction<{ conversationId: string; message: Message }>) {
      const conv = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conv) {
        conv.messages.push(action.payload.message);
        conv.lastUpdated = action.payload.message.timestamp;
      }
    },
    startConversation(state, action: PayloadAction<Conversation>) {
      const existing = state.conversations.find(
        c => c.propertyId === action.payload.propertyId && c.senderId === action.payload.senderId
      );
      if (!existing) state.conversations.unshift(action.payload);
    },
    deleteConversation(state, action: PayloadAction<string>) {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      if (state.activeConversationId === action.payload) state.activeConversationId = null;
    },
  },
});

export const { setActiveConversation, sendMessage, startConversation, deleteConversation } = messagesSlice.actions;
export default messagesSlice.reducer;
