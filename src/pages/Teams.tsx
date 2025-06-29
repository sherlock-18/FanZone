import React, { useState } from 'react';
import { Search, Users, Trophy, Heart } from 'lucide-react';
import { useTeam } from '../contexts/TeamContext';

const Teams: React.FC = () => {
  const { state: teamState, followTeam, unfollowTeam } = useTeam();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');

  const sports = ['all', 'Football', 'Basketball', 'Baseball', 'Hockey'];
  const leagues = ['all', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Champions League'];

  const filteredTeams = teamState.teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || team.sport === selectedSport;
    const matchesLeague = selectedLeague === 'all' || team.league === selectedLeague;
    return matchesSearch && matchesSport && matchesLeague;
  });

  const handleFollow = (teamId: string, isFollowed: boolean) => {
    if (isFollowed) {
      unfollowTeam(teamId);
    } else {
      followTeam(teamId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams</h1>
        <p className="text-gray-600">Discover and follow your favorite sports teams</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sport Filter */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport}
              </option>
            ))}
          </select>

          {/* League Filter */}
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league === 'all' ? 'All Leagues' : league}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{teamState.teams.length}</div>
          <div className="text-gray-600">Total Teams</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{teamState.followedTeams.length}</div>
          <div className="text-gray-600">Following</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {teamState.teams.reduce((sum, team) => sum + team.followers, 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Total Fans</div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Team Header */}
            <div className="p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-6xl mb-4">{team.logo}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{team.name}</h3>
              <p className="text-gray-600 text-sm">{team.league}</p>
            </div>

            {/* Team Info */}
            <div className="p-6">
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{team.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span>Founded</span>
                  <span className="font-medium">{team.founded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sport</span>
                  <span className="font-medium">{team.sport}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Followers</span>
                  <span className="font-medium">{team.followers.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFollow(team.id, team.isFollowed)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                    team.isFollowed
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${team.isFollowed ? 'fill-current' : ''}`} />
                  <span>{team.isFollowed ? 'Unfollow' : 'Follow'}</span>
                </button>
                <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Popular Teams Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular Teams</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamState.teams
              .sort((a, b) => b.followers - a.followers)
              .slice(0, 6)
              .map((team, index) => (
                <div key={team.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-xl">{team.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{team.name}</p>
                    <p className="text-sm text-gray-500">{team.followers.toLocaleString()} followers</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;