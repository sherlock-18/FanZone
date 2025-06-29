import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'help'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    email: user?.email || '',
  });
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    teamUpdates: true,
    matchAlerts: false,
    polls: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showFollowers: true,
    allowMessages: true,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    // Show success message
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Change Avatar
                      </button>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'likes' && 'Get notified when someone likes your posts'}
                          {key === 'comments' && 'Get notified when someone comments on your posts'}
                          {key === 'follows' && 'Get notified when someone follows you'}
                          {key === 'teamUpdates' && 'Get notified about your favorite teams'}
                          {key === 'matchAlerts' && 'Get notified about live matches'}
                          {key === 'polls' && 'Get notified about poll results and new polls'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Followers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'showEmail' && 'Display your email address on your profile'}
                          {key === 'showFollowers' && 'Show your followers and following count'}
                          {key === 'allowMessages' && 'Allow other users to send you messages'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Light', 'Dark', 'Auto'].map((theme) => (
                        <button
                          key={theme}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="text-center">
                            <div className={`w-12 h-8 mx-auto mb-2 rounded ${
                              theme === 'Light' ? 'bg-white border border-gray-300' :
                              theme === 'Dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'
                            }`}></div>
                            <span className="text-sm font-medium">{theme}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Help & Support</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'FAQ', description: 'Find answers to common questions' },
                      { title: 'Contact Support', description: 'Get help from our support team' },
                      { title: 'Community Guidelines', description: 'Learn about our community rules' },
                      { title: 'Privacy Policy', description: 'Read our privacy policy' },
                      { title: 'Terms of Service', description: 'Review our terms of service' },
                      { title: 'Report a Problem', description: 'Report bugs or issues' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Need immediate help?</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Contact our support team and we'll get back to you within 24 hours.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;