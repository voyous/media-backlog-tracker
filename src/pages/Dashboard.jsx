import { useMedia } from '../context/MediaContext';
import InProgressCarousel from '../components/Dashboard/InProgressCarousel';
import CategoryStats from '../components/Dashboard/CategoryStats';
import RecentItemsList from '../components/Dashboard/RecentStacks';
import RandomPicker from '../components/Dashboard/RandomPicker';

const Dashboard = () => {
    const { items } = useMedia();

    if (items.length === 0) {
        return (
            <div className="fade-in container text-center">
                <h1 className="text-gradient mb-8">Welcome Back</h1>
                <p className="text-secondary mb-8">Your backlog is empty. Start adding some items!</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h1 className="text-gradient mb-8">Dashboard</h1>

            {/* In Progress Row */}
            <InProgressCarousel />

            {/* Stats Row */}
            <CategoryStats />

            {/* Random Picker */}
            <RandomPicker />

            {/* Recent & Random Lists */}
            <RecentItemsList />

            <style>{`
                .container {
                    padding-bottom: 4rem;
                }
                .mb-8 { margin-bottom: 2rem; }
                .text-center { text-align: center; }
                .text-secondary { color: var(--text-secondary); }
            `}</style>
        </div>
    );
};

export default Dashboard;
