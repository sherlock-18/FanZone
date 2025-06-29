import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Trophy, TrendingUp } from 'lucide-react';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number;
  awayScore?: number;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  time: string;
  venue: string;
  league: string;
  date: string;
}

const MatchCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'finished'>('live');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');

  const mockMatches: Match[] = [
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
      venue: 'Old Trafford',
      league: 'Premier League',
      date: '2024-01-15',
    },
    {
      id: '2',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      homeLogo: '🔵',
      awayLogo: '⚪',
      homeScore: 0,
      awayScore: 0,
      status: 'LIVE',
      time: '45\'',
      venue: 'Camp Nou',
      league: 'La Liga',
      date: '2024-01-15',
    },
    {
      id: '3',
      homeTeam: 'Chelsea',
      awayTeam: 'Arsenal',
      homeLogo: '🔵',
      awayLogo: '🔴',
      status: 'UPCOMING',
      time: '17:30',
      venue: 'Stamford Bridge',
      league: 'Premier League',
      date: '2024-01-16',
    },
    {
      id: '4',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeLogo: '🔴',
      awayLogo: '🟡',
      homeScore: 3,
      awayScore: 1,
      status: 'FINISHED',
      time: 'FT',
      venue: 'Allianz Arena',
      league: 'Bundesliga',
      date: '2024-01-14',
    },
  ];

  const leagues = ['all', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Champions League'];

  const filteredMatches = mockMatches.filter(match => {
    const statusMatch = activeTab === 'live' ? match.status === 'LIVE' :
                       activeTab === 'upcoming' ? match.status === 'UPCOMING' :
                       match.status === 'FINISHED';
    
    const leagueMatch = selectedLeague === 'all' || match.league === selectedLeague;
    
    return statusMatch && leagueMatch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Center</h1>
        <p className="text-gray-600">Live scores, upcoming fixtures, and match results</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Status Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'live', label: 'Live', icon: '🔴' },
              { key: 'upcoming', label: 'Upcoming', icon: '📅' },
              { key: 'finished', label: 'Finished', icon: '✅' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* League Filter */}
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-gray-400" />
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
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Match Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">{match.league}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    match.status === 'LIVE'
                      ? 'bg-red-100 text-red-600'
                      : match.status === 'UPCOMING'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {match.status === 'LIVE' ? `LIVE ${match.time}` : 
                   match.status === 'UPCOMING' ? match.time : 
                   'FINISHED'}
                </span>
              </div>
            </div>

            {/* Teams */}
            <div className="space-y-4">
              {/* Home Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{match.homeLogo}</span>
                  <span className="font-semibold text-gray-900">{match.homeTeam}</span>
                </div>
                {match.homeScore !== undefined && (
                  <span className="text-2xl font-bold text-gray-900">{match.homeScore}</span>
                )}
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{match.awayLogo}</span>
                  <span className="font-semibold text-gray-900">{match.awayTeam}</span>
                </div>
                {match.awayScore !== undefined && (
                  <span className="text-2xl font-bold text-gray-900">{match.awayScore}</span>
                )}
              </div>
            </div>

            {/* Match Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{match.venue}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{match.date}</span>
                </div>
              </div>
            </div>

            {/* Live Indicators */}
            {match.status === 'LIVE' && (
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 text-sm font-medium">Live Updates</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500">
            {activeTab === 'live' 
              ? 'No live matches at the moment'
              : activeTab === 'upcoming'
              ? 'No upcoming matches scheduled'
              : 'No finished matches to display'
            }
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {mockMatches.filter(m => m.status === 'LIVE').length}
          </div>
          <div className="text-gray-600">Live Matches</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {mockMatches.filter(m => m.status === 'UPCOMING').length}
          </div>
          <div className="text-gray-600">Upcoming Today</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {mockMatches.filter(m => m.status === 'FINISHED').length}
          </div>
          <div className="text-gray-600">Matches Finished</div>
        </div>
      </div>
    </div>
  );
};

export default MatchCenter;