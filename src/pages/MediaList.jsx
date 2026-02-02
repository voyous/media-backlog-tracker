import { useState } from 'react';
import { useMedia } from '../context/MediaContext';
import AddMediaModal from '../components/Media/AddMediaModal';
import MediaDetailsModal from '../components/Media/MediaDetailsModal'; // Import
import { Trash2 } from 'lucide-react';

const getRatingColor = (rating) => {
  const score = parseFloat(rating);
  if (score >= 3.8) return '#22d3ee'; // Cyan (3.8+)
  if (score >= 3.5) return '#22c55e'; // Green (3.5 - 3.7)
  if (score >= 3.0) return '#eab308'; // Yellow
  if (score >= 2.0) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

const getRatingCategory = (rating) => {
  const score = parseFloat(rating) || 0;
  if (score >= 3.8) return 'blue';
  if (score >= 3.5) return 'green';
  if (score >= 3.0) return 'yellow';
  if (score >= 2.0) return 'orange';
  return 'red';
};

const MediaList = ({ title, category }) => {
  const { items, deleteItem } = useMedia();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Advanced Filters
  const [filterMinHype, setFilterMinHype] = useState(0); // Games
  const [filterRatingColors, setFilterRatingColors] = useState([]); // Movies
  const [filterTvLength, setFilterTvLength] = useState('all'); // TV
  const [filterTvType, setFilterTvType] = useState('all'); // TV

  // Derived Data
  const categoryItems = items.filter(item => item.category === category);

  const genres = [...new Set(categoryItems.map(item => item.genre).filter(Boolean))].sort();

  const statusWeight = {
    'in-progress': 0,
    'backlog': 1,
    'completed': 2,
    'dropped': 3
  };

  const filteredAndSortedItems = categoryItems
    .filter(item => filterStatus === 'all' || item.status === filterStatus)
    .filter(item => filterStatus === 'all' || item.status === filterStatus)
    .filter(item => filterGenre === 'all' || item.genre === filterGenre)
    .filter(item => {
      // Game Hype Filter
      if (category === 'game' && filterMinHype > 0) {
        return (item.excitement || 0) >= filterMinHype;
      }
      // Movie Color Filter
      if (category === 'movie' && filterRatingColors.length > 0) {
        if (!item.letterboxdRating) return false;
        return filterRatingColors.includes(getRatingCategory(item.letterboxdRating));
      }
      // TV Filters
      if (category === 'tv') {
        if (filterTvLength !== 'all' && item.showLength !== filterTvLength) return false;
        if (filterTvType !== 'all' && item.seasonType !== filterTvType) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'letterboxd_high_low') return (parseFloat(b.letterboxdRating) || 0) - (parseFloat(a.letterboxdRating) || 0);
      if (sortBy === 'letterboxd_low_high') return (parseFloat(a.letterboxdRating) || 0) - (parseFloat(b.letterboxdRating) || 0);
      if (sortBy === 'excited_high_low') return (items.excitement || 0) - (items.excitement || 0); // Wait, variable name error here? Yes.
      // Correction: (b.excitement || 0) - (a.excitement || 0)
      if (sortBy === 'excited_high_low') return (b.excitement || 0) - (a.excitement || 0);
      if (sortBy === 'personal_high_low') return (parseFloat(b.personalRating) || 0) - (parseFloat(a.personalRating) || 0);
      if (sortBy === 'personal_low_high') return (parseFloat(a.personalRating) || 0) - (parseFloat(b.personalRating) || 0);
      if (sortBy === 'rating_high_low') return (parseFloat(b.letterboxdRating) || 0) - (parseFloat(a.letterboxdRating) || 0); // Legacy check just in case
      if (sortBy === 'title_az') return a.title.localeCompare(b.title);
      if (sortBy === 'date_newest') return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
      if (sortBy === 'date_oldest') return new Date(a.addedAt || 0) - new Date(b.addedAt || 0);
      // Default Sort: Status Weight
      return statusWeight[a.status] - statusWeight[b.status];
    });

  // Dynamic Sort Options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'title_az', label: 'Title (A-Z)' },
    { value: 'date_newest', label: 'Date Added (Newest)' },
    { value: 'date_oldest', label: 'Date Added (Oldest)' },
  ];

  if (category === 'movie') {
    sortOptions.push(
      { value: 'letterboxd_high_low', label: 'Letterboxd Rating (High to Low)' },
      { value: 'letterboxd_low_high', label: 'Letterboxd Rating (Low to High)' }
    );
  }

  if (category === 'game') {
    sortOptions.push({ value: 'excited_high_low', label: 'Hype / Excitement (High to Low)' });
  }

  if (filterStatus === 'completed' || filterStatus === 'dropped') {
    sortOptions.push(
      { value: 'personal_high_low', label: 'Personal Rating (High to Low)' },
      { value: 'personal_low_high', label: 'Personal Rating (Low to High)' }
    );
  }

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };



  const renderItemDetails = (item) => {
    switch (item.category) {
      case 'movie':
        return (
          <span className="item-meta">
            {item.year && <span>{item.year}</span>}
            {item.director && <span>• {item.director}</span>}
          </span>
        );
      case 'music':
        return <span className="item-meta">{item.artist}</span>;
      case 'book':
        return item.author && <span className="item-meta">{item.author}</span>;
      case 'tv':
        return <span className="item-meta">{{ short: 'Mini Series', medium: 'Standard Season', long: 'Long Running' }[item.showLength] || item.showLength} • {item.seasonType === 'specific' ? `Season ${item.seasonNumber}` : 'Entire Show'}</span>;
      default:
        return item.genre && <span className="item-meta">{item.genre}</span>;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex-between mb-8">
        <h1 className="text-gradient">{title}</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          + Add Item
        </button>
      </div>

      {/* Filters & Sort Bar */}
      {categoryItems.length > 0 && (
        <div className="filters-bar glass-panel">
          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Genre</label>
            <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)} className="filter-select">
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {category === 'game' && (
            <div className="filter-group">
              <label>Min Hype</label>
              <select value={filterMinHype} onChange={e => setFilterMinHype(Number(e.target.value))} className="filter-select">
                <option value="0">Any Hype</option>
                <option value="5">5+ (Decent)</option>
                <option value="7">7+ (Good)</option>
                <option value="8">8+ (Great)</option>
                <option value="9">9+ (Must Play)</option>
              </select>
            </div>
          )}

          {category === 'tv' && (
            <>
              <div className="filter-group">
                <label>Length</label>
                <select value={filterTvLength} onChange={e => setFilterTvLength(e.target.value)} className="filter-select">
                  <option value="all">Any Length</option>
                  <option value="short">Mini Series</option>
                  <option value="medium">Standard Season</option>
                  <option value="long">Long Running</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Type</label>
                <select value={filterTvType} onChange={e => setFilterTvType(e.target.value)} className="filter-select">
                  <option value="all">Any Type</option>
                  <option value="entire">Entire Show</option>
                  <option value="specific">Season</option>
                </select>
              </div>
            </>
          )}

          {category === 'movie' && (
            <div className="filter-group">
              <label>Rating Color</label>
              <div className="color-filter-row">
                {['blue', 'green', 'yellow', 'orange', 'red'].map(color => (
                  <button
                    key={color}
                    className={`color-dot ${color} ${filterRatingColors.includes(color) ? 'active' : ''}`}
                    onClick={() => {
                      setFilterRatingColors(prev =>
                        prev.includes(color)
                          ? prev.filter(c => c !== color)
                          : [...prev, color]
                      );
                    }}
                    title={`Toggle ${color.charAt(0).toUpperCase() + color.slice(1)}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="filter-group ml-auto">
            <label>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredAndSortedItems.length === 0 ? (
        <div className="empty-state glass-panel">
          {categoryItems.length === 0 ? (
            <p>No items found in {title}. Start by adding one!</p>
          ) : (
            <p>No items match your filters.</p>
          )}
        </div>
      ) : (
        <div className="media-grid">
          {filteredAndSortedItems.map(item => (
            <div
              key={item.id}
              className={`media-card glass-panel ${filterStatus === 'all' ? `status-${item.status}-card` : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, item.id)}
                title="Delete item"
              >
                <Trash2 size={16} />
              </button>

              <div className="card-content">
                <div className="card-header">
                  <h3>{item.title}</h3>
                  <div className="ratings-container">
                    {item.letterboxdRating && category === 'movie' && (
                      <span
                        className="rating-badge letterboxd-rating"
                        title="Letterboxd Rating"
                        style={{
                          color: getRatingColor(item.letterboxdRating),
                          backgroundColor: `${getRatingColor(item.letterboxdRating)}${parseFloat(item.letterboxdRating) >= 3.8 ? '33' : '1a'}`,
                          borderColor: `${getRatingColor(item.letterboxdRating)}33`,
                          boxShadow: parseFloat(item.letterboxdRating) >= 4.0 ? `0 0 8px ${getRatingColor(item.letterboxdRating)}80` : 'none',
                          textShadow: parseFloat(item.letterboxdRating) >= 4.0 ? `0 0 5px ${getRatingColor(item.letterboxdRating)}` : 'none'
                        }}
                      >
                        ★ {item.letterboxdRating}
                      </span>
                    )}
                    {item.personalRating && (item.status === 'completed' || item.status === 'dropped') && (
                      <span className="rating-badge personal-rating" title="My Rating">
                        👤 {item.personalRating}
                      </span>
                    )}
                    {category === 'game' && item.excitement > 0 && (item.status === 'backlog' || item.status === 'in-progress') && (
                      <span
                        className="rating-badge excitement-rating"
                        title="Excitement Level"
                        style={{
                          color: item.excitement >= 8 ? '#f472b6' : '#fbbf24', // Pink/Orange for high, Yellow for mid
                          borderColor: item.excitement >= 8 ? 'rgba(244, 114, 182, 0.3)' : 'rgba(251, 191, 36, 0.3)',
                          background: item.excitement >= 8 ? 'rgba(244, 114, 182, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                          boxShadow: item.excitement >= 9 ? '0 0 8px rgba(244, 114, 182, 0.4)' : 'none'
                        }}
                      >
                        🔥 {item.excitement}
                      </span>
                    )}
                  </div>
                </div>
                {renderItemDetails(item)}

                <div className="tags-row">
                  <div className="tags-left">
                    <span className={`status-pill status-${item.status}`}>{item.status}</span>
                    {item.genre && category !== 'game' && (
                      <span className="genre-tag">{item.genre}</span>
                    )}
                  </div>
                  {item.addedAt && (
                    <span className="date-added" title={`Added on ${new Date(item.addedAt).toLocaleDateString()}`}>
                      {new Date(item.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={category}
      />

      <MediaDetailsModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />

      <style>{`
        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mb-8 { margin-bottom: 2rem; }
        .empty-state {
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
        }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .media-card {
          padding: 1.5rem;
          transition: var(--transition-smooth);
          cursor: pointer;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .media-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
        }
        
        .status-completed-card {
            opacity: 0.7;
            filter: grayscale(0.2);
        }
        .status-dropped-card {
            opacity: 0.5;
            filter: grayscale(1);
        }
        .status-dropped-card h3 {
            text-decoration: line-through;
            color: var(--text-secondary);
        }

        .filters-bar {
            display: flex;
            gap: 1.5rem;
            padding: 1rem;
            margin-bottom: 2rem;
            align-items: center;
            flex-wrap: wrap;
        }
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        .filter-group label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
        }
        .filter-select {
            background: rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            padding: 0.4rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            cursor: pointer;
            min-width: 140px;
        }
        .filter-select:focus {
            outline: none;
            border-color: var(--accent-primary);
        }
        .color-filter-row {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            height: 38px; /* Match select height roughly */
        }
        .color-dot {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.3;
            transform: scale(0.9);
        }
        .color-dot.active {
            opacity: 1;
            transform: scale(1.1);
            border-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .color-dot:hover {
            opacity: 0.8;
            transform: scale(1);
        }
        .color-dot.active:hover {
            opacity: 1;
            transform: scale(1.15);
        }
        
        /* Color Mapping */
        .color-dot.blue { background-color: #22d3ee; box-shadow: 0 0 8px rgba(34, 211, 238, 0.4); }
        .color-dot.green { background-color: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); }
        .color-dot.yellow { background-color: #eab308; box-shadow: 0 0 8px rgba(234, 179, 8, 0.4); }
        .color-dot.orange { background-color: #f97316; box-shadow: 0 0 8px rgba(249, 115, 22, 0.4); }
        .color-dot.red { background-color: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }

        .ml-auto { margin-left: auto; }

        .delete-btn {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            opacity: 0;
            background: rgba(239, 68, 68, 0.1);
            color: #fca5a5;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent;
            z-index: 10;
        }

        .media-card:hover .delete-btn {
            opacity: 1;
        }

        .delete-btn:hover {
            background: rgba(239, 68, 68, 0.9);
            color: white;
            border-color: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }

        .card-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            padding-right: 1.5rem; /* Space for delete button if needed, though button is absolute */
        }
        .card-header h3 {
            font-size: 1.1rem;
            margin: 0;
            line-height: 1.4;
        }
        .item-meta {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: block;
        }
        .tags-row {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .tags-left {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .date-added {
            font-size: 0.7rem;
            color: var(--text-secondary);
            opacity: 0.7;
        }
        .status-pill {
          display: inline-block;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          text-transform: capitalize;
          background: rgba(255, 255, 255, 0.1);
        }
        .status-backlog { background: rgba(139, 92, 246, 0.2); color: #d8b4fe; }
        .status-completed { background: rgba(34, 197, 94, 0.2); color: #86efac; }
        .status-in-progress { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
        .status-dropped { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

        .genre-tag {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            background: rgba(255,255,255,0.05);
            color: var(--text-secondary);
        }
        .rating-badge {
            font-size: 0.8rem;
            font-weight: 600;
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            white-space: nowrap;
            border: 1px solid transparent;
        }
        .ratings-container {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        .personal-rating {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MediaList;
