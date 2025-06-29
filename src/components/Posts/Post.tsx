import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

interface PostProps {
  post: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    image?: string;
    likes: number;
    comments: any[];
    shares: number;
    timestamp: string;
    isLiked: boolean;
    teamId?: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { likePost, addComment, sharePost } = usePost();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    likePost(post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleShare = () => {
    sharePost(post.id);
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(`Check out this post: ${post.content}`);
  };

  return (
    <div className="p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{post.userName}</h4>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 leading-relaxed">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="mt-3 rounded-lg w-full max-h-96 object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between py-2 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              post.isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="flex space-x-3 mb-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;