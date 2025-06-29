import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatRoom {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatState {
  messages: ChatMessage[];
  chatRooms: ChatRoom[];
  activeRoomId: string | null;
  isLoading: boolean;
}

type ChatAction =
  | { type: 'FETCH_CHAT_ROOMS_SUCCESS'; payload: ChatRoom[] }
  | { type: 'FETCH_MESSAGES_SUCCESS'; payload: ChatMessage[] }
  | { type: 'SEND_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_ACTIVE_ROOM'; payload: string }
  | { type: 'MARK_MESSAGES_AS_READ'; payload: string };

const ChatContext = createContext<{
  state: ChatState;
  sendMessage: (content: string, receiverId: string) => void;
  setActiveRoom: (roomId: string) => void;
  markMessagesAsRead: (roomId: string) => void;
}>({
  state: { messages: [], chatRooms: [], activeRoomId: null, isLoading: false },
  sendMessage: () => {},
  setActiveRoom: () => {},
  markMessagesAsRead: () => {},
});

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'FETCH_CHAT_ROOMS_SUCCESS':
      return { ...state, chatRooms: action.payload, isLoading: false };
    case 'FETCH_MESSAGES_SUCCESS':
      return { ...state, messages: action.payload, isLoading: false };
    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_ACTIVE_ROOM':
      return { ...state, activeRoomId: action.payload };
    case 'MARK_MESSAGES_AS_READ':
      return {
        ...state,
        chatRooms: state.chatRooms.map(room =>
          room.id === action.payload ? { ...room, unreadCount: 0 } : room
        ),
      };
    default:
      return state;
  }
};

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    participantIds: ['1', '2'],
    participantNames: ['John Doe', 'Sarah Wilson'],
    participantAvatars: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
    ],
    unreadCount: 2,
  },
  {
    id: '2',
    participantIds: ['1', '3'],
    participantNames: ['John Doe', 'Mike Rodriguez'],
    participantAvatars: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    ],
    unreadCount: 0,
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Sarah Wilson',
    senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    receiverId: '1',
    content: 'Hey! Did you watch the match last night?',
    timestamp: '2024-01-15T10:00:00Z',
    isRead: false,
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'John Doe',
    senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    receiverId: '2',
    content: 'Yes! What a game! That last-minute goal was incredible!',
    timestamp: '2024-01-15T10:05:00Z',
    isRead: true,
  },
  {
    id: '3',
    senderId: '2',
    senderName: 'Sarah Wilson',
    senderAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    receiverId: '1',
    content: 'I know right! I was on the edge of my seat the entire second half.',
    timestamp: '2024-01-15T10:10:00Z',
    isRead: false,
  },
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    chatRooms: [],
    activeRoomId: null,
    isLoading: false,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_CHAT_ROOMS_SUCCESS', payload: mockChatRooms });
    dispatch({ type: 'FETCH_MESSAGES_SUCCESS', payload: mockMessages });
  }, []);

  const sendMessage = (content: string, receiverId: string) => {
    const user = JSON.parse(localStorage.getItem('fanzone_user') || '{}');
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    dispatch({ type: 'SEND_MESSAGE', payload: newMessage });
  };

  const setActiveRoom = (roomId: string) => {
    dispatch({ type: 'SET_ACTIVE_ROOM', payload: roomId });
  };

  const markMessagesAsRead = (roomId: string) => {
    dispatch({ type: 'MARK_MESSAGES_AS_READ', payload: roomId });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        sendMessage,
        setActiveRoom,
        markMessagesAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};