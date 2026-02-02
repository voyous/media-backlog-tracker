import { useState, useEffect } from 'react';
import { GENRES } from '../../constants/genres';
import { useMedia } from '../../context/MediaContext';
import Modal from '../UI/Modal';
import { fetchMovieDetails } from '../../services/tmdb';

import MediaSearch from './MediaSearch';

const AddMediaModal = ({ isOpen, onClose, defaultCategory = 'game' }) => {
    const { addItem } = useMedia();
    const [mode, setMode] = useState('search'); // 'search' | 'manual'
    const [pendingItem, setPendingItem] = useState(null); // Item selected from search waiting for confirmation
    const [isCustomGenre, setIsCustomGenre] = useState(false);

    // Initial State Helper
    const getInitialState = (category = 'game') => ({
        title: '',
        category,
        status: 'backlog',
        rating: 0,
        excitement: 0,
        genre: '',
        notes: '',
        director: '',
        year: '',
        letterboxdRating: '',
        tmdbRating: '', // API Rating
        seasonType: 'entire',
        seasonNumber: '',
        showLength: 'medium',
        author: '',
        artist: '',
        coverUrl: '',
    });

    const [formData, setFormData] = useState(getInitialState(defaultCategory));

    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialState(defaultCategory));
            setIsCustomGenre(false);
            setMode('search');
            setPendingItem(null);
        }
    }, [isOpen, defaultCategory]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, genre: '' }));
        setIsCustomGenre(false);
    }, [formData.category]);

    const handleSearchSelect = async (item) => {
        // Prepare base data
        const baseData = {
            ...formData,
            title: item.title,
            year: item.year || formData.year,
            coverUrl: item.coverUrl || '',
            ...(item.artist && { artist: item.artist }),
            ...(item.author && { author: item.author }),
            ...(item.pages && { pages: item.pages }),
            ...(item.rating !== undefined && { tmdbRating: item.rating }), // Allow 0
            ...(item.tmdbRating !== undefined && { tmdbRating: item.tmdbRating }),
            ...(item.genre && { genre: item.genre }),
            ...(item.director && { director: item.director }),
            sourceData: item // Save the raw item just in case for debugging
        };

        // If Movie and missing director (e.g. from expanded result), fetch it now
        if (formData.category === 'movie' && !baseData.director && item.apiId) {
            try {
                const details = await fetchMovieDetails(item.apiId);
                if (details && details.director) {
                    baseData.director = details.director;
                }
            } catch (err) {
                console.error("Failed to fetch extra movie details, skipping...", err);
            }
        }

        console.log('Processed Search Item for Add:', baseData); // DEBUG LOG

        // Determine next step based on Category
        if (formData.category === 'game') {
            setPendingItem(baseData); // Wait for Hype
        } else if (formData.category === 'tv') {
            setPendingItem(baseData); // Wait for Season/Show selection
        } else {
            // Instant Add for others
            addItem(baseData);
            onClose();
        }
    };

    const confirmAdd = (overrides = {}) => {
        if (!pendingItem) return;
        addItem({ ...pendingItem, ...overrides });
        onClose();
    };

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!formData.title || !formData.title.trim()) {
            const input = document.querySelector('input[name="title"]');
            if (input) input.focus();
            return;
        }

        addItem(formData);
        onClose();
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        if (value === 'other') {
            setIsCustomGenre(true);
            setFormData(prev => ({ ...prev, genre: '' }));
        } else {
            setIsCustomGenre(false);
            setFormData(prev => ({ ...prev, genre: value }));
        }
    };

    if (!isOpen) return null;

    const renderSpecificFields = () => {
        switch (formData.category) {
            case 'game':
                if (formData.status === 'backlog' || formData.status === 'in-progress') {
                    return (
                        <div className="form-group">
                            <label>Hype / Excitement (0-10)</label>
                            <input
                                name="excitement"
                                type="number"
                                min="0"
                                max="10"
                                value={formData.excitement}
                                onChange={handleChange}
                                placeholder="0"
                                className="input-field"
                            />
                        </div>
                    );
                }
                return (
                    <div className="form-group" style={{ width: '100px', marginTop: '1rem' }}>
                        <label>Year</label>
                        <input
                            name="year"
                            type="number"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="2024"
                            className="input-field"
                        />
                    </div>
                );
            case 'movie':
                return (
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Director</label>
                            <input
                                name="director"
                                value={formData.director}
                                onChange={handleChange}
                                placeholder="e.g. Christopher Nolan"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group" style={{ width: '100px' }}>
                            <label>Year</label>
                            <input
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="2024"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group" style={{ width: '100px' }}>
                            <label>Letterboxd</label>
                            <input
                                name="letterboxdRating"
                                type="number"
                                step="any"
                                value={formData.letterboxdRating}
                                onChange={handleChange}
                                placeholder="0.0"
                                className="input-field"
                            />
                        </div>
                    </div>
                );
            case 'tv':
                return (
                    <div className="form-stack">
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label>Type</label>
                                <select name="seasonType" value={formData.seasonType} onChange={handleChange} className="input-field">
                                    <option value="entire">Entire Show</option>
                                    <option value="specific">Specific Season</option>
                                </select>
                            </div>
                            {formData.seasonType === 'specific' && (
                                <div className="form-group flex-1">
                                    <label>Season #</label>
                                    <input
                                        name="seasonNumber"
                                        value={formData.seasonNumber}
                                        onChange={handleChange}
                                        placeholder="1"
                                        className="input-field"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'book':
                return (
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Author</label>
                            <input
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="e.g. Frank Herbert"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group" style={{ width: '100px' }}>
                            <label>Year</label>
                            <input
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="2024"
                                className="input-field"
                            />
                        </div>
                    </div>
                );
            case 'music':
                return (
                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Artist</label>
                            <input
                                name="artist"
                                value={formData.artist}
                                onChange={handleChange}
                                placeholder="e.g. Radiohead"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group" style={{ width: '100px' }}>
                            <label>Year</label>
                            <input
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="2024"
                                className="input-field"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderPendingState = () => {
        if (formData.category === 'game') {
            return (
                <div className="pending-state">
                    <h3>How hyped are you?</h3>
                    <p className="subtext">For {pendingItem.title}</p>
                    <div className="hype-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                                key={num}
                                className={`hype-btn ${num >= 8 ? 'high' : num >= 5 ? 'mid' : 'low'}`}
                                onClick={() => confirmAdd({ excitement: num })}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        if (formData.category === 'tv') {
            return (
                <div className="pending-state">
                    <h3>What are you tracking?</h3>
                    <p className="subtext">For {pendingItem.title}</p>
                    <div className="tracking-options">
                        <button className="tracking-btn" onClick={() => confirmAdd({ seasonType: 'entire' })}>
                            Entire Show
                        </button>
                        <div className="season-input-row">
                            <button className="tracking-btn" onClick={() => confirmAdd({ seasonType: 'specific', seasonNumber: document.getElementById('season-input').value || 1 })}>
                                Season
                            </button>
                            <input id="season-input" type="number" defaultValue="1" className="input-field mini" onClick={(e) => e.stopPropagation()} />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={pendingItem ? 'Confirm Details' : 'Add New Item'}>
            {pendingItem ? (
                renderPendingState()
            ) : (
                <form onSubmit={handleSubmit} className="form-stack">
                    {/* Category Selection */}
                    <div className="category-tabs">
                        {['game', 'movie', 'tv', 'book', 'music'].map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className={`category-tab ${formData.category === cat ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="mode-tabs">
                        <button
                            type="button"
                            className={`mode-tab ${mode === 'search' ? 'active' : ''}`}
                            onClick={() => setMode('search')}
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            className={`mode-tab ${mode === 'manual' ? 'active' : ''}`}
                            onClick={() => setMode('manual')}
                        >
                            Manual Entry
                        </button>
                    </div>

                    {mode === 'search' ? (
                        <div className="search-mode-container">
                            <MediaSearch
                                category={formData.category}
                                onSelect={handleSearchSelect}
                            />
                            <div className="search-helper-text">
                                <p>Search to auto-fill details.</p>
                                <p>Can't find it? Switch to <b>Manual Entry</b>.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="manual-mode-container animate-fade-in">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter title..."
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                                        <option value="backlog">Backlog</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="dropped">Dropped</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label>Genre</label>
                                    {isCustomGenre ? (
                                        <div className="custom-genre-wrapper" style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                name="genre"
                                                value={formData.genre}
                                                onChange={handleChange}
                                                placeholder="Type genre..."
                                                className="input-field"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsCustomGenre(false)}
                                                className="btn-secondary"
                                                style={{ padding: '0 0.75rem' }}
                                                title="Back to list"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleGenreChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Genre...</option>
                                            {GENRES[formData.category]?.map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                            <option value="other">+ Other / Custom</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {renderSpecificFields()}

                        </div>
                    )}

                    {/* Hidden submit button to enable 'Enter' key submission */}
                    <button type="submit" style={{ display: 'none' }} />

                    {mode === 'manual' && (
                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleSubmit}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }}
                            >
                                Add Item
                            </button>
                        </div>
                    )}
                </form>
            )}

            <style>{`
                .form-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .form-row {
                    display: flex;
                    gap: 1rem;
                }
                .flex-1 { flex: 1; }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }
                .category-tabs {
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.25rem;
                    border-radius: var(--radius-full);
                    margin-bottom: 1rem;
                }
                .category-tab {
                    flex: 1;
                    padding: 0.5rem;
                    border-radius: var(--radius-full);
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                    text-transform: capitalize;
                }
                .category-tab.active {
                    background: var(--bg-card);
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .category-tab:hover:not(.active) {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }
                .mode-tabs {
                    display: flex;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    margin-bottom: 1.5rem;
                }
                .mode-tab {
                    flex: 1;
                    padding: 0.75rem;
                    color: var(--text-secondary);
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .mode-tab.active {
                    color: var(--accent-primary);
                    border-color: var(--accent-primary);
                }
                .search-helper-text {
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-top: 2rem;
                    opacity: 0.7;
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

                /* Pending State UI */
                .pending-state {
                    text-align: center;
                    padding: 1rem 0;
                }
                .pending-state h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
                .subtext { color: var(--text-secondary); margin-bottom: 2rem; }
                
                .hype-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 0.75rem;
                }
                .hype-btn {
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    background: rgba(255,255,255,0.05);
                    font-weight: bold;
                    transition: all 0.2s;
                }
                .hype-btn:hover { transform: scale(1.1); }
                .hype-btn.low:hover { background: #fbbf24; color: black; }
                .hype-btn.mid:hover { background: #f97316; color: white; }
                .hype-btn.high:hover { background: #ef4444; color: white; }

                .tracking-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .tracking-btn {
                    padding: 1rem;
                    background: rgba(255,255,255,0.1);
                    border-radius: var(--radius-md);
                    font-size: 1.1rem;
                    transition: background 0.2s;
                }
                .tracking-btn:hover { background: var(--accent-primary); color: white; }
                .season-input-row {
                    display: flex;
                    gap: 0.5rem;
                }
                .season-input-row .tracking-btn { flex: 1; }
                .input-field.mini { width: 80px; text-align: center; }
            `}</style>
        </Modal>
    );
};

export default AddMediaModal;
