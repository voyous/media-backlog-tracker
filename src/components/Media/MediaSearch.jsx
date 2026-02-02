import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchTmdb } from '../../services/tmdb';
import { searchItunes } from '../../services/itunes';
import { searchGames } from '../../services/rawg';

const MediaSearch = ({ category, onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            if (!['movie', 'tv', 'music', 'game', 'book'].includes(category)) return;

            setIsLoading(true);
            try {
                let data = [];
                if (category === 'movie') data = await searchTmdb(query, 'movie');
                else if (category === 'tv') data = await searchTmdb(query, 'tv');
                else if (category === 'music') data = await searchItunes(query);
                else if (category === 'book') data = await searchOpenLibrary(query);
                else if (category === 'game') data = await searchGames(query);

                setResults(data);
                setShowDropdown(true);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, category]);

    const handleSelect = (item) => {
        setQuery('');
        setResults([]);
        setShowDropdown(false);
        onSelect(item);
    };

    if (!['movie', 'tv', 'music', 'game', 'book'].includes(category)) return null;

    return (
        <div className="search-container" ref={dropdownRef}>
            <div className={`search-input-wrapper ${isLoading ? 'loading' : ''}`}>
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length === 0) setShowDropdown(false);
                    }}
                    placeholder={`Search ${category === 'music' ? 'albums' : category + 's'}...`}
                    className="search-input"
                />
                {isLoading && <Loader2 size={16} className="spinner-icon" />}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="search-dropdown glass-panel">
                    {results.map((item) => (
                        <div
                            key={item.apiId}
                            className="search-result-item"
                            onClick={() => handleSelect(item)}
                        >
                            {item.coverUrl ? (
                                <img src={item.coverUrl} alt={item.title} className="result-thumb" />
                            ) : (
                                <div className="result-thumb-placeholder" />
                            )}
                            <div className="result-info">
                                <div className="result-title">{item.title}</div>
                                <div className="result-meta">
                                    {item.year && <span>{item.year}</span>}
                                    {item.artist && <span>• {item.artist}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="search-attribution">
                        {category === 'music' ? 'Results from iTunes' : 'Results from TMDB'}
                    </div>
                </div>
            )}

            <style>{`
                .search-container {
                    position: relative;
                    margin-bottom: 1.5rem;
                    z-index: 50; /* Ensure dropdown is on top */
                }
                .search-input-wrapper {
                    position: relative;
                }
                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }
                .spinner-icon {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                    animation: spin 1s linear infinite;
                }
                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-md);
                    color: white;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                }
                .search-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    background: rgba(0, 0, 0, 0.3);
                }
                
                .search-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 0.5rem;
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: #1e1e24; /* Solid background for legibility */
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    border-radius: var(--radius-md);
                }
                .search-result-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .search-result-item:hover {
                    background: rgba(255,255,255,0.05);
                }
                .search-result-item:last-child {
                    border-bottom: none;
                }
                .result-thumb {
                    width: 40px;
                    height: 40px; /* Square for consistency or 60 for poster? let's do 40x40 object-cover */
                    object-fit: cover;
                    border-radius: 4px;
                    background: #333;
                }
                .result-thumb-placeholder {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    background: #333;
                }
                .result-info {
                    flex: 1;
                    overflow: hidden;
                }
                .result-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .result-meta {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
                .search-attribution {
                    font-size: 0.65rem;
                    text-align: center;
                    padding: 0.25rem;
                    color: var(--text-secondary);
                    opacity: 0.5;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
                @keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default MediaSearch;
