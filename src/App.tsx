import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { TeamProvider } from './contexts/TeamContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChatProvider } from './contexts/ChatContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import MatchCenter from './pages/MatchCenter';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Polls from './pages/Polls';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AdminPanel from './pages/Admin/AdminPanel';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><MatchCenter /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
            <Route path="/teams/:teamId" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
            <Route path="/polls" element={<ProtectedRoute><Polls /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <TeamProvider>
            <NotificationProvider>
              <ChatProvider>
                <AppContent />
              </ChatProvider>
            </NotificationProvider>
          </TeamProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;