import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            setItems([]);
            return;
        }

        const itemsRef = collection(db, 'users', currentUser.uid, 'items');
        const q = query(itemsRef, orderBy('addedAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(fetchedItems);
        });

        return unsubscribe;
    }, [currentUser]);

    const addItem = async (item) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'users', currentUser.uid, 'items'), {
                addedAt: new Date().toISOString(),
                status: 'backlog',
                rating: 0,
                image: '',
                notes: '',
                ...item
            });
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const updateItem = async (id, updates) => {
        if (!currentUser) return;

        try {
            const itemRef = doc(db, 'users', currentUser.uid, 'items', id);
            await updateDoc(itemRef, updates);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const deleteItem = async (id) => {
        if (!currentUser) return;

        try {
            const itemRef = doc(db, 'users', currentUser.uid, 'items', id);
            await deleteDoc(itemRef);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
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
