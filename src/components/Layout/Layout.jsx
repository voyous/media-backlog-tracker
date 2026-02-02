import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="content-container">
                    {children}
                </div>
            </main>

            <style>{`
        .app-layout {
          min-height: 100vh;
        }

        .main-content {
          margin-left: 280px;
          padding: 2rem;
          min-height: 100vh;
          width: calc(100% - 280px);
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            margin-bottom: 80px; /* Space for bottom nav */
            width: 100%;
            padding: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Layout;
