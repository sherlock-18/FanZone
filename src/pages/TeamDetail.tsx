import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Users, Trophy, Calendar, MapPin, Star } from 'lucide-react';
import { useTeam } from '../contexts/TeamContext';
import { usePost } from '../contexts/PostContext';
import Post from '../components/Posts/Post';
import CreatePost from '../components/Posts/CreatePost';

const TeamDetail: React.FC = () => {
  const { teamId } = useParams();
  const { state: teamState, followTeam, unfollowTeam } = useTeam();
  const { state: postState } = usePost();
  const [activeTab, setActiveTab] = useState<'posts' | 'stats' | 'matches' | 'players'>('posts');

  const team = teamState.teams.find(t => t.id === teamId);
  const teamPosts = postState.posts.filter(post => post.teamId === teamId);

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Team not found</h2>
        <p className="text-gray-600">The team you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleFollow = () => {
    if (team.isFollowed) {
      unfollowTeam(team.id);
    } else {
      followTeam(team.id);
    }
  };

  const mockStats = {
    wins: 18,
    losses: 5,
    draws: 3,
    goalsFor: 45,
    goalsAgainst: 22,
    position: 2,
  };

  const mockUpcomingMatches = [
    { opponent: 'Chelsea', date: '2024-01-20', time: '15:00', venue: 'Home' },
    { opponent: 'Arsenal', date: '2024-01-27', time: '17:30', venue: 'Away' },
    { opponent: 'Liverpool', date: '2024-02-03', time: '12:30', venue: 'Home' },
  ];

  const mockPlayers = [
    { name: 'Marcus Rashford', position: 'Forward', number: 10, goals: 12 },
    { name: 'Bruno Fernandes', position: 'Midfielder', number: 8, assists: 8 },
    { name: 'Harry Maguire', position: 'Defender', number: 5, cleanSheets: 7 },
    { name: 'David de Gea', position: 'Goalkeeper', number: 1, saves: 85 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Team Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative">
          <div className="absolute bottom-6 left-6 flex items-end space-x-6">
            <div className="text-8xl">{team.logo}</div>
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
              <p className="text-blue-100 text-lg">{team.league}</p>
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <p className="text-gray-700 mb-4">{team.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Founded {team.founded}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{team.sport}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{team.followers.toLocaleString()} followers</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleFollow}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                team.isFollowed
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${team.isFollowed ? 'fill-current' : ''}`} />
              <span>{team.isFollowed ? 'Unfollow' : 'Follow Team'}</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockStats.wins}</div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{mockStats.draws}</div>
              <div className="text-sm text-gray-600">Draws</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{mockStats.losses}</div>
              <div className="text-sm text-gray-600">Losses</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">#{mockStats.position}</div>
              <div className="text-sm text-gray-600">League Position</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'posts', label: 'Posts' },
            { key: 'stats', label: 'Statistics' },
            { key: 'matches', label: 'Fixtures' },
            { key: 'players', label: 'Squad' },
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
              <div className="p-6 border-b border-gray-200">
                <CreatePost />
              </div>
              {teamPosts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {teamPosts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Be the first to post about {team.name}!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Season Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Matches Played</span>
                      <span className="font-semibold">{mockStats.wins + mockStats.losses + mockStats.draws}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Goals Scored</span>
                      <span className="font-semibold text-green-600">{mockStats.goalsFor}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Goals Conceded</span>
                      <span className="font-semibold text-red-600">{mockStats.goalsAgainst}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Goal Difference</span>
                      <span className="font-semibold text-blue-600">+{mockStats.goalsFor - mockStats.goalsAgainst}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Form Guide</h3>
                  <div className="flex space-x-2">
                    {['W', 'W', 'D', 'W', 'L'].map((result, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Last 5 matches</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Fixtures</h3>
              <div className="space-y-4">
                {mockUpcomingMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{match.date}</div>
                        <div className="text-xs text-gray-500">{match.time}</div>
                      </div>
                      <div className="text-lg">vs</div>
                      <div className="font-medium text-gray-900">{match.opponent}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        match.venue === 'Home' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {match.venue}
                      </span>
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Players</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {player.number}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{player.name}</div>
                      <div className="text-sm text-gray-500">{player.position}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-600">
                        {player.goals !== undefined ? `${player.goals} goals` :
                         player.assists !== undefined ? `${player.assists} assists` :
                         player.cleanSheets !== undefined ? `${player.cleanSheets} clean sheets` :
                         `${player.saves} saves`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;