import { createContext, useContext, useState, useEffect } from 'react';

const MediaContext = createContext();

const STORAGE_KEY = 'media_backlog_data';

export const MediaProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // Helper for non-secure contexts (HTTP on mobile)
    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const addItem = (item) => {
        const newItem = {
            id: generateId(),
            addedAt: new Date().toISOString(),
            status: 'backlog',
            rating: 0,
            image: '',
            notes: '',
            ...item
        };
        setItems((prev) => [newItem, ...prev]);
    };

    const updateItem = (id, updates) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const deleteItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const getStats = () => {
        const stats = {
            total: items.length,
            byCategory: {},
            byStatus: {}
        };

        items.forEach(item => {
            stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
            stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
        });

        return stats;
    };

    return (
        <MediaContext.Provider value={{ items, addItem, updateItem, deleteItem, getStats }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};
