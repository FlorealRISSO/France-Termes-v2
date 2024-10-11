import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadDatabase } from '../utils/web-sql-provider';
import { DB_URL } from '../utils/shared-const';

const DatabaseContext = createContext({ db: null, loading: true });

export const DatabaseProvider = ({ children }) => {
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadD = async () => {
            let db = null;
            try {
                db = await loadDatabase();
            } catch (error) {
                console.error('Error loading database:', error);
            } finally {
                setDb(db);
                setLoading(false);
            }
        };

        loadD();
    }, [DB_URL]);

    return (
        <DatabaseContext.Provider value={{ db, loading }}>
            {children}
        </DatabaseContext.Provider>
    );
};

// Custom hook to use the database context
export const useDatabase = () => {
    return useContext(DatabaseContext);
};