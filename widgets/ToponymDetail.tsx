import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Title, Divider } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Term } from '../utils/types';
import ArticlePreview from './ArticlePreview';

interface ArticleDetailsProps {
  toponym: string;
  capital: string;
  siege: string;
  toSeeTerms: Term[];
}

const ToponymDetails: React.FC<ArticleDetailsProps> = ({ toponym, capital, siege, toSeeTerms }) => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Toponym */}
      <View style={styles.section}>
        <Title style={[styles.termText, { color: theme.colors.onSurface }]}>
          {toponym}
        </Title>
      </View>

      {/* Capital */}
      <View style={styles.section}>
        <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Capital</Text>
        <Text style={[styles.contentText, { color: theme.colors.onSurfaceVariant }]}>
          {capital}
        </Text>
      </View>

      { siege &&
      <View style={styles.section}>
        <Text style={[styles.headingText, { color: theme.colors.onSurface }]}>Siège</Text>
        <Text style={[styles.contentText, { color: theme.colors.onSurfaceVariant }]}>
          {siege}
        </Text>
      </View>
      }

      <Divider style={styles.divider} />

      {/* To see terms */}
      <View style={styles.section}>
        {toSeeTerms.map((term) => (
          <ArticlePreview key={term.id} term={term} />
        ))}
      </View>
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
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
  },
});

export default ToponymDetails;