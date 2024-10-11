import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Link } from '@react-navigation/native';
import {
  Appbar,
  IconButton,
  Text,
  useTheme,
  List,
  Button,
} from 'react-native-paper';

const InformationPage = () => {
  const theme = useTheme();
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Link to="/Home">
          <IconButton icon="arrow-left" />
        </Link>
        <Appbar.Content title="Informations" />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          À propos de France Termes
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          France Termes est une application conçue pour aider les utilisateurs à découvrir et apprendre la terminologie française dans divers domaines. Elle est basée sur les données du site officiel France Terme, maintenu par le ministère français de la Culture.
        </Text>

        <List.Section>
          <List.Subheader>Fonctionnalités principales</List.Subheader>
          <List.Item
            title="Recherche de mots"
            left={props => <List.Icon {...props} icon="magnify" />}
          />
          <List.Item
            title="Recherche par domaine"
            left={props => <List.Icon {...props} icon="book-open-variant" />}
          />
          <List.Item
            title="Nouveautés"
            description="Découvrez les derniers ajouts à la langue française"
            left={props => <List.Icon {...props} icon="new-box" />}
          />
          <List.Item
            title="Découverte aléatoire"
            left={props => <List.Icon {...props} icon="shuffle-variant" />}
          />
          <List.Item
            title="Fonctionnement hors-ligne"
            left={props => <List.Icon {...props} icon="wifi-off" />}
          />
        </List.Section>
        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          Cette application est un projet open source sous licence MIT, développé pour le plaisir et l'apprentissage. Elle utilise les données ouvertes fournies par le ministère de la Culture français.
        </Text>
        <Button
          mode="contained"
          onPress={() => openLink('https://github.com/FlorealRISSO')}
          style={styles.button}
        >
          GitHub du développeur
        </Button>
        <Button
          mode="contained"
          onPress={() => openLink('https://www.linkedin.com/in/flor%C3%A9al-risso-2b595b257/')}
          style={styles.button}
        >
          LinkedIn du développeur
        </Button>
        <Button
          mode="contained"
          onPress={() => openLink('https://www.culture.fr/franceterme/')}
          style={styles.button}
        >
          Site officiel France Terme
        </Button>
      </ScrollView>
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
  button: {
    marginTop: 10,
  },
});

export default InformationPage;