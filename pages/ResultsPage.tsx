import { Link } from '@react-navigation/native';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, IconButton, useTheme } from 'react-native-paper';
import { useDatabase } from '../widgets/DatabaseProviderGeneric';
import ArticlePreview from '../widgets/ArticlePreview';
import { GenericSqlFetch } from '../utils/generic-sql-fetch';

const ResultsPage = ({ route }: { route: any }) => {
  const { query, filterParam } = route.params;
  const theme = useTheme();
  const { db, loading } = useDatabase();

  const terms = GenericSqlFetch.fetchResults(db, query, filterParam);
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Link to="/Home">
          <IconButton icon="arrow-left" />
        </Link>
        <Appbar.Content title="Results" />
      </Appbar.Header>
      <FlatList
        data={terms}
        renderItem={({ item }) => <ArticlePreview key={item.id} term={item} />}
        keyExtractor={(item) => item.id.toString() + Math.random()}
      />
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ResultsPage;