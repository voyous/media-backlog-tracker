import { useState, useEffect } from 'react';
import { GENRES } from '../../constants/genres';
import { useMedia } from '../../context/MediaContext';
import Modal from '../UI/Modal';

const AddMediaModal = ({ isOpen, onClose, defaultCategory = 'game' }) => {
    const { addItem } = useMedia();
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
        seasonType: 'entire',
        seasonNumber: '',
        showLength: 'medium',
        author: '',
        artist: '',
    });

    const [formData, setFormData] = useState(getInitialState(defaultCategory));

    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialState(defaultCategory));
            setIsCustomGenre(false);
        }
    }, [isOpen, defaultCategory]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, genre: '' }));
        setIsCustomGenre(false);
    }, [formData.category]);

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Manual Validation for Mobile reliability
        if (!formData.title || !formData.title.trim()) {
            // Using browser alert as a fallback for mobile if native tooltip doesn't show
            // Ideally should be a toast, but this ensures feedback
            const input = document.querySelector('input[name="title"]');
            if (input) input.focus();
            return;
        }

        addItem(formData);
        onClose();
        setFormData(getInitialState(defaultCategory));
        setIsCustomGenre(false);
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
                return null;
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
                            <label>Rating</label>
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
                        <div className="form-group">
                            <label>Length</label>
                            <select name="showLength" value={formData.showLength} onChange={handleChange} className="input-field">
                                <option value="short">Mini Series</option>
                                <option value="medium">Standard Season</option>
                                <option value="long">Long Running</option>
                            </select>
                        </div>
                    </div>
                );
            case 'book':
                return (
                    <div className="form-group">
                        <label>Author</label>
                        <input
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="e.g. Frank Herbert"
                            className="input-field"
                        />
                    </div>
                );
            case 'music':
                return (
                    <div className="form-group">
                        <label>Artist</label>
                        <input
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            placeholder="e.g. Radiohead"
                            className="input-field"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Item">
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

                {/* Hidden submit button to enable 'Enter' key submission */}
                <button type="submit" style={{ display: 'none' }} />

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
            </form>

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
            `}</style>
        </Modal>
    );
};

export default AddMediaModal;
