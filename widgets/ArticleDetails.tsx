import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Chip, Title, Subheading, Divider } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ArticleData, Term } from '../utils/types';
import ArticlePreview from './ArticlePreview';

const ArticleDetails: React.FC<{ articleData: ArticleData, toSeeTerms: Term[] }> = ({ articleData, toSeeTerms }) => {
    const theme = useTheme();
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Term and Translation */}
            <View style={styles.section}>
                <Title style={[styles.termText, { color: theme.colors.onSurface }]}>
                    {articleData.term}
                </Title>
                {articleData.translation.map((translation, index) => (
                <Subheading
                    key={index}
                    style={[styles.translationText, { color: theme.colors.onSurfaceVariant }]}>
                    {translation}
                </Subheading>
                ))}
            </View>

            {/* Synonyms */}
            {articleData.synonyms && articleData.synonyms.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Synonyms</Text>
                    <View style={styles.chipContainer}>
                        {articleData.synonyms.map((synonym, index) => (
                            <Chip key={index} style={styles.chip}>{synonym}</Chip>
                        ))}
                    </View>
                </View>
            )}

            {/* Antonyms */}
            {articleData.antonyms && articleData.antonyms.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Antonyms</Text>
                    <View style={styles.chipContainer}>
                        {articleData.antonyms.map((antonym, index) => (
                            <Chip key={index} style={styles.chip}>{antonym}</Chip>
                        ))}
                    </View>
                </View>
            )}

            {/* Domains and Subdomains */}
            <View style={styles.section}>
                <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Domaines / Sous-domaines</Text>
                <View style={styles.domainContainer}>
                    {articleData.domains.map((domain, index) => (
                        <View key={index} style={styles.domainBlock}>
                            <Text style={styles.domainText}>{domain.field}</Text>
                            {domain.subfields.length > 0 && (
                                <View style={styles.subfieldsContainer}>
                                    {domain.subfields.map((subfield, subIndex) => (
                                        <Text key={subIndex} style={styles.subfieldText}>• {subfield}</Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>

            <Divider style={styles.divider} />

            {/* Definition */}
            {articleData.definition.length > 0 &&
                <View style={styles.section}>
                    <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Définition</Text>
                    <Text style={[styles.definitionText, { color: theme.colors.onSurfaceVariant }]}>
                        {articleData.definition}
                    </Text>
                </View>}

            {/* Note */}
            {articleData.note.length > 3 &&
                <View style={styles.section}>
                    <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Note</Text>
                    <Text style={[styles.definitionText, { color: theme.colors.onSurfaceVariant }]}>
                        {articleData.note}
                    </Text>
                </View>}

            {/* Date */}
            <View style={styles.section}>
                <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Date</Text>
                <Text style={[styles.definitionText, { color: theme.colors.onSurfaceVariant }]}>
                    {articleData.date}
                </Text>
            </View>
            { /* To see terms */ }
            <Divider style={styles.divider} />
                {toSeeTerms.map((term) => (
                    <ArticlePreview key={term.id} term={term} />
                ))
                }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    termText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    translationText: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    headingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    definitionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    chip: {
        margin: 4,
    },
    domainContainer: {
        flexDirection: 'column',
    },
    domainBlock: {
        marginBottom: 16, // Add spacing between each domain block
    },
    domainText: {
        fontSize: 16,
        fontWeight: 'medium',
        marginBottom: 4, // Space between field and subfields
    },
    subfieldsContainer: {
        marginLeft: 16, // Indent subfields for better hierarchy
    },
    subfieldText: {
        fontSize: 15,
    },
    noteCard: {
        padding: 12,
    },
    noteText: {
        fontSize: 14,
    },
    divider: {
        marginVertical: 16,
    },
});

export default ArticleDetails;
