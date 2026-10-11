import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './Navbar';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CreatorDashboard from './pages/CreatorDashboard';
import BrandDashboard from './pages/BrandDashboard';
import CreatorProfile from './pages/CreatorProfile';
import BrandProfile from './pages/BrandProfile';
import Inbox from './pages/Inbox';
import ChatView from './pages/ChatView';
import DiscoveryDashboard from './DiscoveryDashboard';
import BriefForm from './BriefForm';

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-nude-100">
      <Navbar />
      {children}
    </div>
  );
}

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-nude-500 text-sm">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'creator' ? '/creator' : '/brand'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-nude-500 text-sm">Loading…</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'creator' ? '/creator' : '/brand'} replace /> : <Landing />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'creator' ? '/creator' : '/brand'} replace /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'creator' ? '/creator' : '/brand'} replace /> : <Login />} />

      <Route path="/creator/:id" element={<Protected><AppShell><CreatorProfile /></AppShell></Protected>} />
      <Route path="/brand/:id" element={<Protected><AppShell><BrandProfile /></AppShell></Protected>} />
      <Route path="/inbox/:id" element={<Protected><AppShell><ChatView /></AppShell></Protected>} />

      <Route path="/discover" element={<Protected><AppShell><DiscoveryDashboard /></AppShell></Protected>} />
      <Route path="/creator" element={<Protected role="creator"><AppShell><CreatorDashboard /></AppShell></Protected>} />
      <Route path="/brand" element={<Protected role="brand"><AppShell><BrandDashboard /></AppShell></Protected>} />
      <Route path="/brief" element={<Protected role="brand"><AppShell><BriefForm /></AppShell></Protected>} />
      <Route path="/inbox" element={<Protected><AppShell><Inbox /></AppShell></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}