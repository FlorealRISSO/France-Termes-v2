import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Link, useRoute } from '@react-navigation/native';
import {
    Appbar,
    IconButton,
    useTheme,
} from 'react-native-paper';
import { ArticleData } from '../utils/types';
import { useDatabase } from '../widgets/DatabaseProviderGeneric';
import ArticleDetails from '../widgets/ArticleDetails';
import ToponymDetails from '../widgets/ToponymDetail';
import { GenericSqlFetch } from '../utils/generic-sql-fetch';

const BASE_URL = 'https://www.culture.fr/franceterme/terme/';

const ArticlePage: React.FC = () => {
    const route = useRoute();
    const theme = useTheme();
    const { db, loading } = useDatabase();
    const { articleId } = route.params as { articleId: number };

    const metadata = GenericSqlFetch.fetchArticle(db, articleId);

    const toSee = GenericSqlFetch.fetchToSee(db, articleId);
    const toSeeTerms = [];
    for (const id of toSee) {
        try {
            const term = GenericSqlFetch.fetchPreview(db, id);
            if (term) {
                toSeeTerms.push(term);
            }
        } catch (error) {
            console.error(`Error fetching the article ${id}:`, error);
        }
    }
    const domains = GenericSqlFetch.fetchDomains(db, articleId);
    const isToponym = domains.length > 0 && domains[0].field === 'Toponymie';

    let term: string, synonyms: string[], antonyms: string[], translations: string[], articleData: ArticleData;
    let toponym: string, capital: string, siege: string;
    if (!isToponym) {
        [term, synonyms, antonyms, translations] = GenericSqlFetch.fetchTerms(db, articleId);
        articleData = {
            term: term,
            synonyms: synonyms,
            antonyms: antonyms,
            domains: domains,
            translation: translations,
            definition: metadata.definition || '',
            note: metadata.note || '',
            date: metadata.date,
        };
    } else {
        [toponym, capital, siege] = GenericSqlFetch.fetchToponym(db, articleId);
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Link to="/Home">
                    <IconButton icon="arrow-left" />
                </Link>
                <Appbar.Content title="Article" />
                <TouchableOpacity onPress={() => { Linking.openURL(BASE_URL + metadata.numero) }}>
                    <IconButton icon="link" />
                </TouchableOpacity>
            </Appbar.Header>
            {!isToponym &&
                < ArticleDetails articleData={articleData} toSeeTerms={toSeeTerms} />
            }
            {isToponym &&
                <ToponymDetails toponym={toponym} capital={capital} siege={siege} toSeeTerms={toSeeTerms} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
    },
});

export default ArticlePage;