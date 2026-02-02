import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MediaList from './pages/MediaList';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        } />
        <Route path="/games" element={
          <PrivateRoute>
            <Layout><MediaList title="Games" category="game" /></Layout>
          </PrivateRoute>
        } />
        <Route path="/movies" element={
          <PrivateRoute>
            <Layout><MediaList title="Movies" category="movie" /></Layout>
          </PrivateRoute>
        } />
        <Route path="/tv" element={
          <PrivateRoute>
            <Layout><MediaList title="TV Shows" category="tv" /></Layout>
          </PrivateRoute>
        } />
        <Route path="/books" element={
          <PrivateRoute>
            <Layout><MediaList title="Books" category="book" /></Layout>
          </PrivateRoute>
        } />
        <Route path="/music" element={
          <PrivateRoute>
            <Layout><MediaList title="Music" category="music" /></Layout>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
