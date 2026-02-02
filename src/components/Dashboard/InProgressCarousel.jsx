import { useRef } from 'react';
import { useMedia } from '../../context/MediaContext';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import MediaDetailsModal from '../Media/MediaDetailsModal';
import { useState } from 'react';

const InProgressCarousel = () => {
    const { items } = useMedia();
    const scrollContainerRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const inProgressItems = items.filter(item => item.status === 'in-progress');

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (inProgressItems.length === 0) return null;

    return (
        <div className="carousel-section mb-8">
            <div className="flex-between mb-4">
                <h2 className="text-xl">In Progress</h2>
                <div className="carousel-controls">
                    <button onClick={() => scroll('left')} className="control-btn" aria-label="Scroll left">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className="control-btn" aria-label="Scroll right">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="carousel-container" ref={scrollContainerRef}>
                {inProgressItems.map(item => (
                    <div
                        key={item.id}
                        className="carousel-item glass-panel"
                        onClick={() => setSelectedItem(item)}
                    >
                        <div className="item-content">
                            <span className="category-tag">{item.category}</span>
                            <h3 className="item-title">{item.title}</h3>

                            {item.category === 'tv' && (
                                <div className="progress-info">
                                    <span className="text-secondary text-sm">
                                        {item.seasonType === 'specific' ? `Season ${item.seasonNumber}` : 'Full Series'}
                                    </span>
                                </div>
                            )}

                            {item.category === 'game' && item.excitement > 0 && (
                                <div className="progress-info">
                                    <span className="text-secondary text-sm">Hype: {item.excitement}/10</span>
                                </div>
                            )}

                            {item.category === 'book' && item.author && (
                                <div className="progress-info">
                                    <span className="text-secondary text-sm">{item.author}</span>
                                </div>
                            )}

                            <div className="status-indicator">
                                <PlayCircle size={16} className="text-accent" />
                                <span className="text-accent text-sm font-medium">Playing Now</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <MediaDetailsModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
            />

            <style>{`
                .carousel-section {
                    position: relative;
                }
                .flex-between {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .text-xl { font-size: 1.25rem; font-weight: 600; }
                .text-accent { color: var(--accent-primary); }
                .font-medium { font-weight: 500; }
                .text-sm { font-size: 0.85rem; }
                
                .carousel-controls {
                    display: flex;
                    gap: 0.5rem;
                }
                .control-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .control-btn:hover {
                    background: var(--accent-primary);
                    color: white;
                }

                .carousel-container {
                    display: flex;
                    gap: 1rem;
                    overflow-x: auto;
                    padding-bottom: 1rem;
                    scroll-snap-type: x mandatory;
                    scrollbar-width: none; /* Firefox */
                }
                .carousel-container::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                }
                
                .carousel-item {
                    flex: 0 0 260px;
                    scroll-snap-align: start;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: transform 0.2s ease, border-color 0.2s ease;
                    min-height: 140px;
                    display: flex;
                    flex-direction: column;
                }
                .carousel-item:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-primary);
                }

                .item-content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    gap: 0.5rem;
                }

                .category-tag {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-secondary);
                    background: rgba(255,255,255,0.05);
                    padding: 0.15rem 0.5rem;
                    border-radius: 4px;
                    align-self: flex-start;
                }

                .item-title {
                    font-size: 1.1rem;
                    line-height: 1.3;
                    margin-bottom: auto;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    margin-top: 0.5rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
};

export default InProgressCarousel;
