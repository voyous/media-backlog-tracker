import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Film, Tv, Book, Music, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/movies', label: 'Movies', icon: Film },
    { path: '/tv', label: 'TV Shows', icon: Tv },
    { path: '/books', label: 'Books', icon: Book },
    { path: '/music', label: 'Music', icon: Music },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="logo-container">
        <h1 className="logo-text text-gradient">Unstack</h1>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {currentUser && (
          <div className="user-profile">
            <div className="user-info">
              <User size={16} className="text-secondary" />
              <span className="user-email">{currentUser.email}</span>
            </div>
            <button onClick={logout} className="logout-btn" title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: calc(100vh - 2rem);
          position: fixed;
          left: 1rem;
          top: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .logo-container {
          margin-bottom: 2rem;
          padding: 0 0.5rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          transition: var(--transition-short);
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(139, 92, 246, 0.1);
          color: var(--accent-primary);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: fixed;
            bottom: 0;
            left: 0;
            top: auto;
            border-radius: 0;
            padding: 0.5rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            border-left: none;
            border-right: none;
            border-bottom: none;
            background: rgba(24, 25, 31, 0.95);
          }
          
          .logo-container, .sidebar-footer {
            display: none;
          }

          .nav-menu {
            flex-direction: row;
            justify-content: space-around;
          }

          .nav-item {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.5rem;
            font-size: 0.75rem;
          }

          .nav-label {
            font-size: 10px;
          }
        }

        .sidebar-footer {
            margin-top: auto;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 1rem;
        }
        .user-profile {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem;
            background: rgba(0,0,0,0.2);
            border-radius: var(--radius-md);
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            overflow: hidden;
        }
        .user-email {
            font-size: 0.75rem;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 140px;
        }
        .logout-btn {
            color: var(--text-secondary);
            padding: 0.4rem;
            border-radius: var(--radius-sm);
            transition: all 0.2s ease;
            cursor: pointer;
        }
        .logout-btn:hover {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
