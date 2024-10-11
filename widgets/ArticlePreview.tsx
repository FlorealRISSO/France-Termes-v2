import { Card, Text, useTheme } from "react-native-paper"
import { StyleSheet } from 'react-native';
import { Link } from "@react-navigation/native";

const ArticlePreview = ({ term }) => {
    const theme = useTheme();
    return <Card style={styles.card}>
        <Link to={{ screen: 'Article', params: { articleId: term.id } }} style={styles.linkCard}>
            <Card.Content>
                <Text style={[styles.termText, { color: theme.colors.onSurface }]}>
                    {term.term}
                </Text>
                <Text style={[styles.domainText, { color: theme.colors.onSurfaceVariant }]}>
                    {term.domain}
                </Text>
                <Text style={[styles.englishText, { color: theme.colors.onSurface }]}>
                    {term.englishTerm}
                </Text>
            </Card.Content>
        </Link>
    </Card>
}

const styles = StyleSheet.create({
    card: { margin: 8 },
    termText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    domainText: {
        fontSize: 14,
    },
    englishText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    linkCard: { margin: 8, flex: 1 },
});

export default ArticlePreview;