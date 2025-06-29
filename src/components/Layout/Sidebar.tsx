import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  Users, 
  BarChart3, 
  MessageCircle, 
  Bell, 
  Settings,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTeam } from '../../contexts/TeamContext';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { state: teamState } = useTeam();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Matches', href: '/matches', icon: Trophy },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Polls', href: '/polls', icon: BarChart3 },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (user?.isAdmin) {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: Shield });
  }

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Main Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Followed Teams Section */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Your Teams
          </h3>
          <div className="space-y-2">
            {teamState.followedTeams.slice(0, 5).map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{team.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{team.name}</p>
                  <p className="text-xs text-gray-500">{team.league}</p>
                </div>
              </Link>
            ))}
            {teamState.followedTeams.length > 5 && (
              <Link
                to="/teams"
                className="flex items-center justify-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View all teams
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Teams Following</span>
              <span className="font-medium text-blue-600">{teamState.followedTeams.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Followers</span>
              <span className="font-medium text-purple-600">{user?.followers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Following</span>
              <span className="font-medium text-green-600">{user?.following}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;