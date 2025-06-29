import React, { useState } from 'react';
import { Image, MapPin, Smile } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePost } from '../../contexts/PostContext';
import { useTeam } from '../../contexts/TeamContext';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { createPost } = usePost();
  const { state: teamState } = useTeam();
  const [content, setContent] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createPost(content, undefined, selectedTeam || undefined);
      setContent('');
      setSelectedTeam('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind about sports?"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={isExpanded ? 4 : 2}
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag a team (optional)
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a team...</option>
                    {teamState.teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.logo} {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      <span className="text-sm">Photo</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Location</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Smile className="w-4 h-4" />
                      <span className="text-sm">Emoji</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent('');
                        setSelectedTeam('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;