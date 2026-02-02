import { useMedia } from '../../context/MediaContext';

const CategoryStats = () => {
    const { items } = useMedia();

    const categories = ['game', 'movie', 'tv', 'book', 'music'];

    const stats = categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        const total = catItems.length;
        if (total === 0) return null;

        const completed = catItems.filter(i => i.status === 'completed' || i.status === 'dropped').length;
        const remaining = total - completed;
        const percentage = Math.round((completed / total) * 100);

        return {
            id: cat,
            label: cat,
            remaining,
            percentage,
            total
        };
    }).filter(Boolean);

    if (stats.length === 0) return null;

    return (
        <div className="stats-grid mb-8">
            {stats.map(stat => (
                <div key={stat.id} className="stat-card glass-panel">
                    <div className="stat-header">
                        <span className="stat-category">{stat.label}</span>
                        <span className="stat-percent">{stat.percentage}% Done</span>
                    </div>
                    <div className="stat-body">
                        <div className="stat-value">{stat.remaining}</div>
                        <div className="stat-label">Remaining</div>
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${stat.percentage}%` }}
                        />
                    </div>
                </div>
            ))}

            <style>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem;
                }
                .stat-card {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .stat-category {
                    text-transform: capitalize;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .stat-percent {
                    font-size: 0.75rem;
                    color: var(--accent-primary);
                }
                .stat-body {
                    display: flex;
                    align-items: baseline;
                    gap: 0.4rem;
                }
                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    line-height: 1;
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
                .progress-bar-bg {
                    height: 4px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: auto;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: var(--accent-primary);
                    border-radius: 2px;
                    transition: width 1s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CategoryStats;
