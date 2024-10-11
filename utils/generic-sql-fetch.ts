import { Platform } from 'react-native';
import { WebSqlFetch } from './web-sql-fetch'
import { ExpoSqlFetch } from './expo-sql-fetch'
import { Term, Article, ArticleData, Domain } from './types';

class GenericSqlFetch {
    static fetchResults = (db, query: string, selectedDomain: string): Term[] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchResults(db, query, selectedDomain);
        }
        return ExpoSqlFetch.fetchResults(db, query, selectedDomain);
    }

    static fetchSuggestions = (db, query: string, selectedDomain: string): [number, string][] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchSuggestions(db, query, selectedDomain);
        }
        return ExpoSqlFetch.fetchSuggestions(db, query, selectedDomain);
    }

    static fetchAllDomains = (db): string[] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchAllDomains(db);
        }
        return ExpoSqlFetch.fetchAllDomains(db);
    }

    static fetchNewTerms = (db): Term[] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchNewTerms(db);
        }
        return ExpoSqlFetch.fetchNewTerms(db);
    }

    static fetchDiscoverTerms(db: any) {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchDiscoverTerms(db);
        }
        return ExpoSqlFetch.fetchDiscoverTerms(db);
    }

    static fetchToSee = (db, articleId: number): number[] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchToSee(db, articleId);
        }
        return ExpoSqlFetch.fetchToSee(db, articleId);
    }

    static fetchArticle = (db, articleId: number): Article => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchArticle(db, articleId);
        }
        return ExpoSqlFetch.fetchArticle(db, articleId);
    }

    static fetchTerms = (db, articleId: number): [string, string[], string[], string[]] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchTerms(db, articleId);
        }
        return ExpoSqlFetch.fetchTerms(db, articleId);
    }

    static fetchPreview = (db, articleId: number): Term | null => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchPreview(db, articleId);
        }
        return ExpoSqlFetch.fetchPreview(db, articleId);
    }

    static fetchDomains = (db, articleId: number): Domain[] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchDomains(db, articleId);
        }
        return ExpoSqlFetch.fetchDomains(db, articleId);
    }

    static fetchToponym = (db, articleId: number): [string, string, string] => {
        if (Platform.OS === 'web') {
            return WebSqlFetch.fetchToponym(db, articleId);
        }
        return ExpoSqlFetch.fetchToponym(db, articleId);
    }
}

export { GenericSqlFetch };