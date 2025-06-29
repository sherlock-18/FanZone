import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  favoriteTeams: string[];
  isAdmin: boolean;
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  user: User | null;
}>({
  state: { user: null, isLoading: false, error: null },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
  user: null,
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Die-hard Manchester United fan since 1995. Love discussing tactics and player performances.',
    followers: 1250,
    following: 340,
    favoriteTeams: ['manchester-united', 'england'],
    isAdmin: false,
    joinedAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@fanzone.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'FanZone Administrator',
    followers: 5000,
    following: 100,
    favoriteTeams: ['barcelona', 'brazil'],
    isAdmin: true,
    joinedAt: '2022-01-01',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('fanzone_user');
    if (savedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(savedUser) });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const user = mockUsers.find(u => u.email === email);
      if (!user || password !== 'password') {
        throw new Error('Invalid email or password');
      }

      localStorage.setItem('fanzone_user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (mockUsers.find(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'New FanZone member!',
        followers: 0,
        following: 0,
        favoriteTeams: [],
        isAdmin: false,
        joinedAt: new Date().toISOString().split('T')[0],
      };

      mockUsers.push(newUser);
      localStorage.setItem('fanzone_user', JSON.stringify(newUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
    }
  };

  const logout = () => {
    localStorage.removeItem('fanzone_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('fanzone_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateProfile,
        user: state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};