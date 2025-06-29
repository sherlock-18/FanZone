import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Clock, Users } from 'lucide-react';
import { usePost } from '../contexts/PostContext';
import { useTeam } from '../contexts/TeamContext';
import { formatDistanceToNow } from 'date-fns';
import CreatePost from '../components/Posts/CreatePost';
import Post from '../components/Posts/Post';

const Home: React.FC = () => {
  const { state: postState } = usePost();
  const { state: teamState } = useTeam();
  const [activeTab, setActiveTab] = useState<'trending' | 'following' | 'recent'>('trending');

  const mockMatches = [
    {
      id: '1',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      homeLogo: '🔴',
      awayLogo: '🔴',
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE',
      time: '78\'',
    },
    {
      id: '2',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      homeLogo: '🔵',
      awayLogo: '⚪',
      homeScore: 0,
      awayScore: 0,
      status: 'UPCOMING',
      time: '20:00',
    },
  ];

  const trendingTopics = [
    { name: '#ChampionsLeague', posts: '2.5K posts' },
    { name: '#MUFC', posts: '1.8K posts' },
    { name: '#ElClasico', posts: '3.2K posts' },
    { name: '#PremierLeague', posts: '4.1K posts' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <CreatePost />

          {/* Feed Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200">
              {[
                { key: 'trending', label: 'Trending', icon: TrendingUp },
                { key: 'following', label: 'Following', icon: Users },
                { key: 'recent', label: 'Recent', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="divide-y divide-gray-200">
              {postState.isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading posts...</p>
                </div>
              ) : (
                postState.posts.map((post) => (
                  <Post key={post.id} post={post} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Live Matches */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Live Matches
            </h3>
            <div className="space-y-4">
              {mockMatches.map((match) => (
                <div key={match.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{match.homeLogo}</span>
                      <span className="font-medium text-sm">{match.homeTeam}</span>
                    </div>
                    <div className="text-center">
                      {match.status === 'LIVE' ? (
                        <div className="text-lg font-bold">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">{match.time}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{match.awayLogo}</span>
                      <span className="font-medium text-sm">{match.awayTeam}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          match.status === 'LIVE'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {match.status === 'LIVE' ? match.time : match.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium text-blue-600">{topic.name}</p>
                    <p className="text-sm text-gray-500">{topic.posts}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Teams */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Teams</h3>
            <div className="space-y-3">
              {teamState.teams
                .filter(team => !team.isFollowed)
                .slice(0, 3)
                .map((team) => (
                  <div key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{team.logo}</span>
                      <div>
                        <p className="font-medium text-sm">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;