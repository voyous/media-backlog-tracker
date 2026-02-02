import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MediaList from './pages/MediaList';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games" element={<MediaList title="Games" category="game" />} />
          <Route path="/movies" element={<MediaList title="Movies" category="movie" />} />
          <Route path="/tv" element={<MediaList title="TV Shows" category="tv" />} />
          <Route path="/books" element={<MediaList title="Books" category="book" />} />
          <Route path="/music" element={<MediaList title="Music" category="music" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
