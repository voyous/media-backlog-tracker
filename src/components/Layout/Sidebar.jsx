import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Film, Tv, Book, Music } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/games', label: 'Games', icon: Gamepad2 },
        { path: '/movies', label: 'Movies', icon: Film },
        { path: '/tv', label: 'TV Shows', icon: Tv },
        { path: '/books', label: 'Books', icon: Book },
        { path: '/music', label: 'Music', icon: Music },
    ];

    return (
        <aside className="sidebar glass-panel">
            <div className="logo-container">
                <h1 className="logo-text text-gradient">Backlog</h1>
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
          
          .logo-container {
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
      `}</style>
        </aside>
    );
};

export default Sidebar;
