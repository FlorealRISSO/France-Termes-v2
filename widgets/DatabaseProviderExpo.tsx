import React, { createContext, useContext, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { DB_URL } from '../utils/shared-const';
import { fetchGitHubRepoContents } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DatabaseContext = createContext({ db: null, loading: true });

export const DatabaseProvider = ({ children }) => {
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);
    const dbName = 'myDatabase2.db';
    const key: string = 'localSha';

    useEffect(() => {
        const loadLocalDatabase = async (fileInfo: FileSystem.FileInfo) => {
            if (fileInfo.exists) {
                const database = await SQLite.openDatabaseAsync(dbName);
                return database;
            }
            return null;
        }

        const loadDatabase = async () => {
            const dbPath = FileSystem.documentDirectory + 'SQLite/' + dbName;
            const localSha = await AsyncStorage.getItem(key);

            let json;
            let db;
            const fileInfo = await FileSystem.getInfoAsync(dbPath);
            try {
                json = await fetchGitHubRepoContents();
            } catch (error) {
                console.log('Failed to fetch data:', error);
                console.log('Loading local database');
                db = await loadLocalDatabase(fileInfo);
                setDb(db);
                setLoading(false);
                return;
            }

            if (localSha === json.sha) {
                console.log('Loading local database');
                db = await loadLocalDatabase(fileInfo);
                setDb(db);
                setLoading(false);
                return;
            }

            const { uri } = await FileSystem.downloadAsync(DB_URL, dbPath);
            await AsyncStorage.setItem(key, json.sha);
            db = await SQLite.openDatabaseAsync(dbName);

            if (db) {
                setDb(db);
                setLoading(false);
            }
        }
        loadDatabase();
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