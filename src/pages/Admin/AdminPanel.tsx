import React, { useState } from 'react';
import { Users, FileText, Flag, BarChart3, Settings, Shield, Trash2, Eye, Ban } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'reports' | 'analytics'>('overview');

  // Mock data for admin panel
  const mockStats = {
    totalUsers: 15420,
    totalPosts: 8934,
    totalReports: 23,
    activeUsers: 2341,
  };

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15', posts: 45 },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com', status: 'active', joinDate: '2024-01-10', posts: 32 },
    { id: '3', name: 'Mike Rodriguez', email: 'mike@example.com', status: 'suspended', joinDate: '2024-01-05', posts: 12 },
  ];

  const mockPosts = [
    { id: '1', author: 'John Doe', content: 'Great match today!', likes: 45, reports: 0, status: 'published' },
    { id: '2', author: 'Sarah Wilson', content: 'Controversial referee decision...', likes: 23, reports: 2, status: 'flagged' },
    { id: '3', author: 'Mike Rodriguez', content: 'Spam content here', likes: 1, reports: 5, status: 'removed' },
  ];

  const mockReports = [
    { id: '1', type: 'Spam', content: 'Promotional content', reporter: 'User123', status: 'pending' },
    { id: '2', type: 'Harassment', content: 'Inappropriate comment', reporter: 'User456', status: 'resolved' },
    { id: '3', type: 'Misinformation', content: 'False match result', reporter: 'User789', status: 'pending' },
  ];

  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'posts', label: 'Posts', icon: FileText },
    { key: 'reports', label: 'Reports', icon: Flag },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users, content, and platform settings</p>
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
                      ? 'bg-red-50 text-red-700 border border-red-200'
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
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{mockStats.totalUsers.toLocaleString()}</div>
                    <div className="text-blue-700">Total Users</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{mockStats.totalPosts.toLocaleString()}</div>
                    <div className="text-green-700">Total Posts</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{mockStats.totalReports}</div>
                    <div className="text-yellow-700">Pending Reports</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{mockStats.activeUsers.toLocaleString()}</div>
                    <div className="text-purple-700">Active Today</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
                      { action: 'Post reported', user: 'sarah@example.com', time: '15 minutes ago' },
                      { action: 'User suspended', user: 'mike@example.com', time: '1 hour ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{activity.action}</span>
                          <span className="text-gray-600 ml-2">{activity.user}</span>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Posts</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.joinDate}</td>
                          <td className="py-3 px-4 text-gray-600">{user.posts}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                                <Ban className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Moderation</h2>
                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{post.author}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : post.status === 'flagged'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{post.likes} likes</span>
                            <span>{post.reports} reports</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">User Reports</h2>
                <div className="space-y-4">
                  {mockReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{report.type}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{report.content}</p>
                          <p className="text-sm text-gray-500">Reported by: {report.reporter}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Resolve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">+12.5%</div>
                    <p className="text-gray-600">This month</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Post Engagement</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">+8.3%</div>
                    <p className="text-gray-600">This week</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Active Users</h3>
                    <div className="text-3xl font-bold text-purple-600 mb-2">2,341</div>
                    <p className="text-gray-600">Today</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Report Rate</h3>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">0.3%</div>
                    <p className="text-gray-600">This month</p>
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

export default AdminPanel;