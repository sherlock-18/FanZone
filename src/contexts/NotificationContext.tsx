import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'team_post' | 'match_alert' | 'poll';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

type NotificationAction =
  | { type: 'FETCH_NOTIFICATIONS_SUCCESS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string };

const NotificationContext = createContext<{
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
}>({
  state: { notifications: [], unreadCount: 0, isLoading: false },
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
});

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length,
        isLoading: false,
      };
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.isRead).length,
      };
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length,
      };
    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(n => ({ ...n, isRead: true }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };
    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.isRead).length,
      };
    default:
      return state;
  }
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah Wilson liked your post about Manchester United',
    timestamp: '2024-01-15T11:00:00Z',
    isRead: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'comment',
    title: 'New Comment',
    message: 'Mike Rodriguez commented on your post',
    timestamp: '2024-01-15T10:45:00Z',
    isRead: false,
  },
  {
    id: '3',
    userId: '1',
    type: 'team_post',
    title: 'Team Update',
    message: 'Manchester United posted a new update',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: true,
  },
  {
    id: '4',
    userId: '1',
    type: 'match_alert',
    title: 'Match Starting Soon',
    message: 'Liverpool vs Real Madrid starts in 30 minutes',
    timestamp: '2024-01-15T10:00:00Z',
    isRead: true,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_NOTIFICATIONS_SUCCESS', payload: mockNotifications });
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  };

  return (
    <NotificationContext.Provider
      value={{
        state,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};