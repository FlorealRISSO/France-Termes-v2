import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { useDatabase } from '../widgets/DatabaseProviderGeneric';
import { GenericSqlFetch } from '../utils/generic-sql-fetch';
import ArticlePreview from '../widgets/ArticlePreview';

import {
    Appbar,
    SegmentedButtons,
    IconButton,
    Searchbar,
    Text,
    useTheme,
    ActivityIndicator,
} from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';


const TermsList = ({ selectedSegment }) => {
    const { db } = useDatabase();
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        if (db) {
            const newTerms = GenericSqlFetch.fetchNewTerms(db);
            const discoverTerms = GenericSqlFetch.fetchDiscoverTerms(db);

            setTerms(selectedSegment === 'new' ? newTerms : discoverTerms);
        }
    }, [db, selectedSegment]);

    if (!terms.length) {
        return (
            <View style={styles.tempText}>
                <Text>Aucun terme trouvé.</Text>
            </View>
        );
    }

    return (
        <FlatList style={styles.flatList}
            data={terms}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ArticlePreview term={item} />}
        />
    );
}

const DomainDropdown = ({ selectedDomain, setSelectedDomain }) => {
    const [domains, setDomains] = useState([]);
    const { db } = useDatabase();

    useEffect(() => {
        if (db) {
            const allDomains = GenericSqlFetch.fetchAllDomains(db);
            const formattedDomains = allDomains.map(([name]) => ({
                label: name,
                value: name
            })) || [];
            setDomains([{ label: 'Tous les domaines', value: '' }, ...formattedDomains]);
        }
    }, [db]);

    if (!domains.length) {
        return null;
    }
    return (
        <View style={styles.dropdownContainer}>
            <Dropdown
                label="Sélectionner un domaine"
                value={selectedDomain}
                onSelect={setSelectedDomain}
                options={domains}
            />
        </View>
    );
};

const HomePage = () => {
    const [selectedSegment, setSelectedSegment] = useState('new');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const { db, loading } = useDatabase();
    const navigation = useNavigation();
    const theme = useTheme();

    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            fetchSuggestions(query);
        } else {
            setSuggestions([]);
        }
    };

    const fetchSuggestions = (query: string) => {
        if (db) {
            const result = GenericSqlFetch.fetchSuggestions(db, query, selectedDomain);
            setSuggestions(result.map((row: [number, string]) => ({ id: row[0], term: row[1] })) || []);
        }
    };

    const handleSuggestionPress = (term) => {
        setSearchQuery(term.term);
        navigation.navigate('Results', { query: term.term, filterParam: selectedDomain || '' });
    };

    const onSubmitEditing = (e) => {
        const query = e.nativeEvent.text;
        if (query) {
            navigation.navigate('Results', { query, filterParam: selectedDomain || '' });
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Appbar.Header>
                    <Link to="/Information">
                        <IconButton icon="information" />
                    </Link>
                    <Appbar.Content title="France Termes" />
                </Appbar.Header>
                <ActivityIndicator animating={true} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Link to="/Information">
                    <IconButton icon="information" />
                </Link>
                <Appbar.Content title="France Termes" />
            </Appbar.Header>

            <Searchbar
                placeholder="Recherche"
                onChangeText={onChangeSearch}
                onSubmitEditing={onSubmitEditing}
                value={searchQuery}
                style={styles.searchbar}
            />
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id.toString() + Math.random()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.suggestion} onPress={() => handleSuggestionPress(item)}>
                            <Text>{item.term}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                />
            )}

            <DomainDropdown selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />

            <SegmentedButtons
                value={selectedSegment}
                onValueChange={setSelectedSegment}
                buttons={[
                    { value: 'new', label: 'Nouveau' },
                    { value: 'discover', label: 'Découvrir' },
                ]}
                style={styles.segmentedButtons}
            />

            <TermsList selectedSegment={selectedSegment} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    segmentedButtons: {
        margin: 16,
    },
    searchbar: {
        margin: 16,
    },
    tempText: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    suggestionsList: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginHorizontal: 16,
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownContainer: {
        marginHorizontal: 16,
        borderRadius: 4,
    },
    flatList: {
        flex: 1,
    }
});

export default HomePage;
