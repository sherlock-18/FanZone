import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: string;
  isLiked: boolean;
  teamId?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

type PostAction =
  | { type: 'FETCH_POSTS_START' }
  | { type: 'FETCH_POSTS_SUCCESS'; payload: Post[] }
  | { type: 'FETCH_POSTS_ERROR'; payload: string }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'LIKE_POST'; payload: string }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: Comment } }
  | { type: 'SHARE_POST'; payload: string };

const PostContext = createContext<{
  state: PostState;
  fetchPosts: () => void;
  createPost: (content: string, image?: string, teamId?: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  sharePost: (postId: string) => void;
}>({
  state: { posts: [], isLoading: false, error: null },
  fetchPosts: () => {},
  createPost: () => {},
  likePost: () => {},
  addComment: () => {},
  sharePost: () => {},
});

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'FETCH_POSTS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_POSTS_SUCCESS':
      return { ...state, posts: action.payload, isLoading: false, error: null };
    case 'FETCH_POSTS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? { 
                ...post, 
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked 
              }
            : post
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? { ...post, comments: [...post.comments, action.payload.comment] }
            : post
        ),
      };
    case 'SHARE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? { ...post, shares: post.shares + 1 }
            : post
        ),
      };
    default:
      return state;
  }
};

const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'What a performance from United today! That late winner had me jumping off my couch! 🔴⚽',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=500',
    likes: 234,
    comments: [
      {
        id: '1',
        userId: '2',
        userName: 'Sarah Wilson',
        userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'I know right! Best match of the season so far!',
        timestamp: '2024-01-15T10:30:00Z',
      }
    ],
    shares: 45,
    timestamp: '2024-01-15T10:00:00Z',
    isLiked: false,
    teamId: 'manchester-united',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Mike Rodriguez',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Barcelona\'s new formation is looking incredible this season. Xavi really knows what he\'s doing! 💙❤️',
    likes: 189,
    comments: [],
    shares: 23,
    timestamp: '2024-01-15T09:45:00Z',
    isLiked: true,
    teamId: 'barcelona',
  },
  {
    id: '3',
    userId: '4',
    userName: 'Emma Thompson',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Who else is excited for tonight\'s Champions League matches? Liverpool vs Real Madrid is going to be epic! 🏆',
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=500',
    likes: 456,
    comments: [
      {
        id: '2',
        userId: '1',
        userName: 'John Doe',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Can\'t wait! Both teams are in great form.',
        timestamp: '2024-01-15T09:50:00Z',
      }
    ],
    shares: 78,
    timestamp: '2024-01-15T09:30:00Z',
    isLiked: false,
  },
];

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, {
    posts: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    dispatch({ type: 'FETCH_POSTS_START' });
    setTimeout(() => {
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: mockPosts });
    }, 1000);
  };

  const createPost = (content: string, image?: string, teamId?: string) => {
    const user = JSON.parse(localStorage.getItem('fanzone_user') || '{}');
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      image,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: new Date().toISOString(),
      isLiked: false,
      teamId,
    };
    dispatch({ type: 'ADD_POST', payload: newPost });
  };

  const likePost = (postId: string) => {
    dispatch({ type: 'LIKE_POST', payload: postId });
  };

  const addComment = (postId: string, content: string) => {
    const user = JSON.parse(localStorage.getItem('fanzone_user') || '{}');
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: { postId, comment: newComment } });
  };

  const sharePost = (postId: string) => {
    dispatch({ type: 'SHARE_POST', payload: postId });
  };

  return (
    <PostContext.Provider
      value={{
        state,
        fetchPosts,
        createPost,
        likePost,
        addComment,
        sharePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};