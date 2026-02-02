import { useState, useEffect } from 'react';
import { GENRES } from '../../constants/genres';
import { useMedia } from '../../context/MediaContext';
import Modal from '../UI/Modal';

const MediaDetailsModal = ({ isOpen, onClose, item }) => {
    const { updateItem } = useMedia();
    const [formData, setFormData] = useState(item || {});
    const [isEditing, setIsEditing] = useState(false);
    const [isCustomGenre, setIsCustomGenre] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData(item);
            setIsEditing(false);
            // Check if genre is custom
            const knownGenres = GENRES[item.category] || [];
            const isKnown = knownGenres.includes(item.genre);
            setIsCustomGenre(!isKnown && !!item.genre);
        }
    }, [item]);

    if (!item) return null;

    const handleSave = () => {
        updateItem(item.id, formData);
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        if (value === 'other') {
            setIsCustomGenre(true);
            handleChange('genre', '');
        } else {
            setIsCustomGenre(false);
            handleChange('genre', value);
        }
    };

    const renderSpecificFields = () => {
        if (!isEditing) {
            switch (item.category) {
                case 'game':
                    return (formData.status === 'backlog' || formData.status === 'in-progress') && formData.excitement ? (
                        <div className="detail-item"><label>Excitement</label><span>🔥 {formData.excitement}/10</span></div>
                    ) : null;
                case 'movie':
                    return (
                        <>
                            {formData.director && <div className="detail-item"><label>Director</label><span>{formData.director}</span></div>}
                            {formData.year && <div className="detail-item"><label>Year</label><span>{formData.year}</span></div>}
                            {formData.letterboxdRating && <div className="detail-item"><label>Letterboxd</label><span>{formData.letterboxdRating}</span></div>}
                        </>
                    );
                case 'tv':
                    return (
                        <>
                            <div className="detail-item"><label>Tracking</label><span>{formData.seasonType === 'specific' ? `Season ${formData.seasonNumber}` : 'Entire Show'}</span></div>
                            <div className="detail-item"><label>Length</label><span>{{ short: 'Mini Series', medium: 'Standard Season', long: 'Long Running' }[formData.showLength] || formData.showLength}</span></div>
                        </>
                    );
                case 'book':
                    return formData.author && <div className="detail-item"><label>Author</label><span>{formData.author}</span></div>;
                case 'music':
                    return formData.artist && <div className="detail-item"><label>Artist</label><span>{formData.artist}</span></div>;
                default:
                    return null;
            }
        }

        // Editing Mode Views
        switch (item.category) {
            case 'game':
                return (
                    (formData.status === 'backlog' || formData.status === 'in-progress') && (
                        <div className="form-group">
                            <label>Hype / Excitement (0-10)</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                value={formData.excitement}
                                onChange={e => handleChange('excitement', e.target.value)}
                                className="input-field"
                            />
                        </div>
                    )
                );
            case 'movie':
                return (
                    <div className="edit-grid">
                        <div className="form-group">
                            <label>Director</label>
                            <input value={formData.director} onChange={e => handleChange('director', e.target.value)} className="input-field" />
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <input type="number" value={formData.year} onChange={e => handleChange('year', e.target.value)} className="input-field" />
                        </div>
                        <div className="form-group">
                            <label>Rating</label>
                            <input type="number" step="any" value={formData.letterboxdRating} onChange={e => handleChange('letterboxdRating', e.target.value)} className="input-field" />
                        </div>
                    </div>
                );
            case 'tv':
                return (
                    <div className="edit-grid">
                        <div className="form-group">
                            <label>Type</label>
                            <select value={formData.seasonType} onChange={e => handleChange('seasonType', e.target.value)} className="input-field">
                                <option value="entire">Entire Show</option>
                                <option value="specific">Season X</option>
                            </select>
                        </div>
                        {formData.seasonType === 'specific' && (
                            <div className="form-group">
                                <label>Season #</label>
                                <input value={formData.seasonNumber} onChange={e => handleChange('seasonNumber', e.target.value)} className="input-field" />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Length</label>
                            <select value={formData.showLength} onChange={e => handleChange('showLength', e.target.value)} className="input-field">
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
                        <input value={formData.author} onChange={e => handleChange('author', e.target.value)} className="input-field" />
                    </div>
                );
            case 'music':
                return (
                    <div className="form-group">
                        <label>Artist</label>
                        <input value={formData.artist} onChange={e => handleChange('artist', e.target.value)} className="input-field" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Item' : 'Item Details'}>
            <div className="details-container">
                {/* Header Section */}
                <div className="details-header">
                    {isEditing ? (
                        <div className="form-group full-width">
                            <label>Title</label>
                            <input
                                value={formData.title}
                                onChange={e => handleChange('title', e.target.value)}
                                className="input-field title-input"
                            />
                        </div>
                    ) : (
                        <h2>{formData.title}</h2>
                    )}

                    <div className="badges">
                        <div className={`status-pill status-${formData.status} status-wrapper`}>
                            {isEditing ? (
                                <select
                                    value={formData.status}
                                    onChange={e => handleChange('status', e.target.value)}
                                    className="status-select"
                                >
                                    <option value="backlog">Backlog</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="dropped">Dropped</option>
                                </select>
                            ) : formData.status}
                        </div>
                        <span className="category-pill">{formData.category}</span>
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="metadata-section glass-panel">
                    {renderSpecificFields()}
                    {(formData.status === 'completed' || formData.status === 'dropped') && (
                        <div className="detail-item">
                            <label>Personal Rating</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    max="10"
                                    value={formData.personalRating || ''}
                                    onChange={e => handleChange('personalRating', e.target.value)}
                                    className="input-field"
                                    placeholder="0-10"
                                />
                            ) : (
                                <span>{formData.personalRating ? `${formData.personalRating}/10` : '-'}</span>
                            )}
                        </div>
                    )}
                    <div className="detail-item">
                        <label>Genre</label>
                        {isEditing ? (
                            isCustomGenre ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        value={formData.genre}
                                        onChange={e => handleChange('genre', e.target.value)}
                                        className="input-field"
                                        placeholder="Type genre..."
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomGenre(false)}
                                        className="btn-secondary"
                                        style={{ padding: '0 0.5rem' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <select
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
                            )
                        ) : (
                            <span>{formData.genre || '-'}</span>
                        )}
                    </div>
                </div>

                {/* Notes Section */}
                <div className="notes-section">
                    <label>Notes</label>
                    <textarea
                        value={formData.notes || ''}
                        onChange={e => handleChange('notes', e.target.value)}
                        placeholder="Add your thoughts, review, or progress notes here..."
                        className="notes-area"
                        readOnly={!isEditing}
                    />
                </div>

                {/* Actions */}
                <div className="action-row">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleSave} className="btn-primary">Save Changes</button>
                        </>
                    ) : (
                        <>
                            <button onClick={onClose} className="btn-secondary">Close</button>
                            <button onClick={() => setIsEditing(true)} className="btn-primary">Edit / Add Notes</button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .details-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .details-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .details-header h2 {
                    font-size: 1.5rem;
                    margin: 0;
                    background: var(--gradient-main);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .badges {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .category-pill {
                    font-size: 0.75rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius-full);
                    background: rgba(255, 255, 255, 0.1);
                    text-transform: capitalize;
                    color: var(--text-secondary);
                }
                .metadata-section {
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem;
                }
                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .detail-item label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .detail-item span {
                    font-weight: 500;
                }
                .notes-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .notes-area {
                    width: 100%;
                    min-height: 120px;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    color: white;
                    font-family: inherit;
                    resize: vertical;
                    line-height: 1.5;
                }
                .notes-area:focus {
                     outline: none;
                     border-color: var(--accent-primary);
                     background: rgba(0, 0, 0, 0.3);
                }
                .action-row {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .edit-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    grid-column: 1 / -1;
                }
                .status-wrapper {
                    padding: 0;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }
                .status-select {
                    background: transparent;
                    border: none;
                    color: inherit;
                    font-size: 0.75rem;
                    cursor: pointer;
                    outline: none;
                    padding: 0.25rem 0.75rem;
                    width: 100%;
                    height: 100%;
                    -webkit-appearance: none;
                    appearance: none;
                }
                .status-select option {
                    background: #1a1a1a;
                    color: white;
                }
                .full-width { width: 100%; }
                .title-input {
                    font-size: 1.25rem;
                    font-weight: bold;
                }
            `}</style>
        </Modal>
    );
};

export default MediaDetailsModal;
