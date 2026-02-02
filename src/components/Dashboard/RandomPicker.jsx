import { useState } from 'react';
import { useMedia } from '../../context/MediaContext';
import { getWeightedRandomItem } from '../../utils/recommendations';
import { Dices, Sparkles, Trophy, Tv, Book, Music, Film, Gamepad2 } from 'lucide-react';
import MediaDetailsModal from '../Media/MediaDetailsModal';

const RandomPicker = () => {
    const { items } = useMedia();
    const [pickedItem, setPickedItem] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: 'game', icon: Gamepad2, label: 'Game', color: '#f472b6' },
        { id: 'movie', icon: Film, label: 'Movie', color: '#22d3ee' },
        { id: 'tv', icon: Tv, label: 'TV Show', color: '#a78bfa' },
        { id: 'book', icon: Book, label: 'Book', color: '#fbbf24' },
        { id: 'music', icon: Music, label: 'Music', color: '#34d399' }
    ];

    const handlePick = (category) => {
        setSelectedCategory(category);
        setIsAnimating(true);
        setPickedItem(null);

        // Simulate "searching" or "spinning" animation
        setTimeout(() => {
            const result = getWeightedRandomItem(items, category);
            setPickedItem(result);
            setIsAnimating(false);
        }, 1500);
    };

    return (
        <div className="picker-section mb-8">
            <h2 className="flex-center section-header">
                <Sparkles size={24} className="mr-2 text-warning" />
                What to Unstack
            </h2>

            <div className="picker-grid">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className="picker-card glass-panel"
                        onClick={() => handlePick(cat.id)}
                        disabled={isAnimating}
                        style={{ '--hover-color': cat.color }}
                    >
                        <cat.icon size={32} style={{ color: cat.color }} />
                        <span className="picker-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Selection Result Overlay / Area */}
            {isAnimating && (
                <div className="picking-overlay glass-modal">
                    <div className="spinner">
                        <Dices size={48} className="animate-spin-slow" />
                        <p>Rolling the dice for a {selectedCategory}...</p>
                    </div>
                </div>
            )}

            <MediaDetailsModal
                isOpen={!!pickedItem}
                onClose={() => setPickedItem(null)}
                item={pickedItem}
            />

            <style>{`
                .picker-section {
                    text-align: center;
                }
                .section-header {
                    margin-bottom: 2rem;
                    gap: 0.5rem;
                }
                .mr-2 { margin-right: 0.5rem; }
                .text-warning { color: #fbbf24; }

                .picker-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .picker-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    gap: 0.75rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .picker-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--hover-color);
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.5), 
                                0 0 15px var(--hover-color);
                }
                
                .picker-card:active {
                    transform: scale(0.95);
                }

                .picker-label {
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 0.05em;
                }

                .picking-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    animation: fadeIn 0.3s ease;
                }

                .spinner {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                    color: var(--accent-primary);
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default RandomPicker;
