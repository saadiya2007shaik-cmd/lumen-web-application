import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <button
      onClick={() => navigate(to)}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
        isActive(to) ? 'bg-nude-600 text-white shadow-sm' : 'text-nude-700 hover:text-nude-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <nav className="sticky top-0 z-40 bg-nude-100/80 backdrop-blur-md border-b border-nude-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate(user ? (user.role === 'creator' ? '/creator' : '/brand') : '/')} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-nude-600 flex items-center justify-center">
            <span className="text-white font-serif text-lg">L</span>
          </div>
          <span className="font-serif-display text-2xl text-nude-900">Lumen</span>
        </button>

        {/* Middle nav */}
        {user && (
          <div className="hidden md:flex items-center gap-1 bg-white/60 rounded-full p-1 border border-nude-200">
            {user.role === 'creator' ? (
              <>
                <NavLink to="/creator">Dashboard</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/inbox">Inbox</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/brand">Dashboard</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/brief">New Brief</NavLink>
                <NavLink to="/inbox">Inbox</NavLink>
              </>
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white border border-nude-200 rounded-full hover:border-nude-400 transition-colors"
              >
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-nude-800 hidden md:inline">{user.name}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-nude-200 rounded-2xl shadow-lg py-2 fade-in">
                  <div className="px-4 py-3 border-b border-nude-100">
                    <p className="text-sm font-medium text-nude-900">{user.name}</p>
                    <p className="text-xs text-nude-500">
                      {user.role === 'creator' ? `@${user.handle}` : user.company || user.email}
                    </p>
                  </div>
                  {user.role === 'creator' && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate(`/profile/${user.id}`); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-nude-700 hover:bg-nude-50 transition-colors"
                    >
                      View public profile
                    </button>
                  )}
                  <button
                    onClick={() => { setMenuOpen(false); logout(); navigate('/'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-sm text-nude-700 hover:text-nude-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2 bg-nude-700 text-white text-sm rounded-full hover:bg-nude-800 transition-colors"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}