import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Users, UserPlus, MessageCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { useTeam } from '../contexts/TeamContext';
import { formatDistanceToNow } from 'date-fns';
import Post from '../components/Posts/Post';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { state: postState } = usePost();
  const { state: teamState } = useTeam();
  const [activeTab, setActiveTab] = useState<'posts' | 'teams' | 'about'>('posts');
  
  const isOwnProfile = !userId || userId === user?.id;
  const profileUser = user; // In a real app, fetch user by userId

  const userPosts = postState.posts.filter(post => post.userId === profileUser?.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="relative">
            <img
              src={profileUser?.avatar}
              alt={profileUser?.name}
              className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-0 object-cover"
            />
            <div className="pt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profileUser?.name}</h1>
                  <p className="text-gray-600 mt-1">{profileUser?.bio}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profileUser?.joinedAt}</span>
                    </div>
                  </div>
                </div>
                
                {isOwnProfile ? (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{userPosts.length}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profileUser?.followers}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profileUser?.following}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{teamState.followedTeams.length}</div>
                  <div className="text-sm text-gray-500">Teams</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'posts', label: 'Posts' },
            { key: 'teams', label: 'Teams' },
            { key: 'about', label: 'About' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'posts' && (
            <div>
              {userPosts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {userPosts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? 'Share your first post!' : `${profileUser?.name} hasn't posted anything yet.`}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamState.followedTeams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{team.logo}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{team.name}</h4>
                      <p className="text-sm text-gray-500">{team.league}</p>
                      <p className="text-xs text-gray-400">{team.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{profileUser?.bio}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Joined {profileUser?.joinedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{profileUser?.followers} followers</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Favorite Teams</h3>
                <div className="flex flex-wrap gap-2">
                  {teamState.followedTeams.slice(0, 6).map((team) => (
                    <span
                      key={team.id}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span>{team.logo}</span>
                      <span>{team.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;