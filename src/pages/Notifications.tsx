import React from 'react';
import { Bell, Heart, MessageCircle, Users, Trophy, BarChart3, Check, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const Notifications: React.FC = () => {
  const { state, markAsRead, markAllAsRead, deleteNotification } = useNotification();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'team_post':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'match_alert':
        return <Bell className="w-5 h-5 text-purple-500" />;
      case 'poll':
        return <BarChart3 className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        {state.unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{state.notifications.length}</div>
          <div className="text-gray-600">Total Notifications</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{state.unreadCount}</div>
          <div className="text-gray-600">Unread</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{state.notifications.length - state.unreadCount}</div>
          <div className="text-gray-600">Read</div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {state.notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {state.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && (
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">
              When you get notifications, they'll show up here
            </p>
          </div>
        )}
      </div>

      {/* Notification Types Legend */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'like', label: 'Likes', description: 'When someone likes your post' },
            { type: 'comment', label: 'Comments', description: 'When someone comments on your post' },
            { type: 'follow', label: 'Follows', description: 'When someone follows you' },
            { type: 'team_post', label: 'Team Updates', description: 'When your teams post updates' },
            { type: 'match_alert', label: 'Match Alerts', description: 'Live match notifications' },
            { type: 'poll', label: 'Polls', description: 'Poll results and reminders' },
          ].map((item) => (
            <div key={item.type} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              {getNotificationIcon(item.type)}
              <div>
                <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;