import { useMedia } from '../../context/MediaContext';
import { getOldestRandomItems } from '../../utils/recommendations';
import { useState, useMemo } from 'react';
import MediaDetailsModal from '../Media/MediaDetailsModal';

const RecentItemsList = () => {
    const { items } = useMedia();
    const [selectedItem, setSelectedItem] = useState(null);

    // Memoize to avoid re-shuffling on every render unless items change
    const { recentItems, oldestRandomItems } = useMemo(() => {
        // Recent: Top 5 newest
        const sortedNewest = [...items].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        const recent = sortedNewest.slice(0, 5);

        // Oldest Random Items (3 items from bottom 10%)
        // filtering out completed/dropped for improved relevance?
        // Prompt says "oldest added items that randomly selects some old items"
        // Usually you want to tackle backlog, so let's filter for backlog/in-progress for the 'from the vault' feature
        // to make it actionable.
        const backlogItems = items.filter(i => i.status === 'backlog' || i.status === 'in-progress');
        const oldestRandom = getOldestRandomItems(backlogItems, 3, 0.15); // Increased to 15% pool for variety

        return { recentItems: recent, oldestRandomItems: oldestRandom };
    }, [items]);

    if (items.length === 0) return null;

    const ItemRow = ({ item, label }) => (
        <div
            className="item-row glass-panel"
            onClick={() => setSelectedItem(item)}
        >
            <div className="row-content">
                {item.coverUrl ? (
                    <img src={item.coverUrl} alt={item.title} className="row-thumb" />
                ) : (
                    <span className={`category-dot ${item.category}`}></span>
                )}
                <span className="row-title">{item.title}</span>
            </div>
            <span className="row-meta">
                {label || new Date(item.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
        </div>
    );

    return (
        <div className="recents-grid mb-8">
            {/* Recently Added Column */}
            <div className="list-column">
                <h3 className="section-title">Recently Added</h3>
                <div className="list-stack">
                    {recentItems.map(item => (
                        <ItemRow key={item.id} item={item} />
                    ))}
                    {recentItems.length === 0 && <p className="empty-text">No items added yet.</p>}
                </div>
            </div>

            {/* From The Vault Column */}
            <div className="list-column">
                <h3 className="section-title">From The Vault</h3>
                <div className="list-stack">
                    {oldestRandomItems.map(item => (
                        <ItemRow key={item.id} item={item} label="Backlog Gem" />
                    ))}
                    {oldestRandomItems.length === 0 && <p className="empty-text">Vault empty.</p>}
                </div>
            </div>

            <MediaDetailsModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
            />

            <style>{`
                .recents-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .section-title {
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .list-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .item-row {
                    padding: 0.75rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: border-color 0.2s ease, transform 0.2s ease;
                }
                .item-row:hover {
                    border-color: var(--accent-primary);
                    transform: translateX(4px);
                }
                .row-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    overflow: hidden;
                }
                .category-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .row-thumb {
                    width: 24px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 4px;
                    flex-shrink: 0;
                    background: #333;
                }
                .category-dot.game { background: #f472b6; }
                .category-dot.movie { background: #22d3ee; }
                .category-dot.tv { background: #a78bfa; }
                .category-dot.book { background: #fbbf24; }
                .category-dot.music { background: #34d399; }
                
                .row-title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.95rem;
                }
                .row-meta {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-left: 1rem;
                    flex-shrink: 0;
                }
                .empty-text {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default RecentItemsList;
