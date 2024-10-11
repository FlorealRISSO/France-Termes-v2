# FranceTermes

*[English Version](./README-EN.md)*

## Disponibilité

- [Web App](http://france-termes.risso.eu/)
- Android (lien à venir)

## Qu'est-ce que FranceTermes ?

FranceTermes est une application moderne et conviviale basée sur [France Terme](http://www.culture.fr/franceterme/), un service officiel du ministère français de la Culture. L'objectif principal de cette application est de rendre facilement accessibles les termes recommandés par la Commission d'enrichissement de la langue française et publiés au Journal officiel de la République française.

Dans un monde où l'anglais domine souvent dans les domaines techniques et scientifiques, FranceTermes joue un rôle crucial dans la promotion et la préservation de la langue française. Elle permet aux utilisateurs de découvrir des équivalents français pour des termes étrangers, principalement anglais, dans divers domaines spécialisés.

## Fonctionnalités principales

1. **Recherche avancée** : 
   - Recherche de mots en français ou en anglais
   - Recherche par domaine (ex: informatique, médecine, économie)
   - Suggestions de termes pendant la saisie

2. **Découverte de nouveaux termes** :
   - Onglet "Nouveautés" présentant les termes récemment ajoutés
   - Fonction "Découvrir" proposant des termes aléatoires pour élargir son vocabulaire

3. **Informations détaillées** :
   - Définition complète de chaque terme
   - Équivalent(s) étranger(s)
   - Domaine(s) d'application
   - Date de publication au Journal officiel

4. **Fonctionnalités pratiques** :
   - Mode hors-ligne pour une utilisation sans connexion internet
   - Partage facile des termes sous forme d'image
   - Liens directs vers les fiches sur le site officiel FranceTerme

5. **Mise à jour automatique** :
   - Téléchargement régulier des nouvelles données pour rester à jour

## Nouvelle version : De Flutter à React Native

Cette nouvelle version de FranceTermes marque une évolution significative par rapport à la version originale développée il y a deux ans :

1. **Technologie** : Recodée entièrement en React Native, remplaçant l'ancienne version Flutter.

2. **Accessibilité** : Disponible en tant que web app, éliminant la dépendance aux magasins d'applications et rendant le service accessible à tous sans contrainte.

3. **Performance** : Optimisée pour une expérience utilisateur fluide, que ce soit sur mobile ou navigateur web.

4. **Design** : Interface utilisateur repensée pour plus d'ergonomie et d'esthétique.

5. **Fonctionnalités étendues** : Ajout de nouvelles fonctionnalités basées sur les retours des utilisateurs de la première version.

## Fonctionnement technique

Le processus de création et de mise à jour de FranceTermes se déroule en plusieurs étapes :

1. **Extraction des données** :
   - Utilisation d'un parser personnalisé ([disponible ici](https://github.com/FlorealRISSO/France-Termes-Parser))
   - Transformation des données XML officielles en format SQL exploitable

2. **Hébergement des données** :
   - Base de données SQL hébergée sur [ce dépôt GitHub](https://github.com/FlorealRISSO/France-Terme-SQL-DB)
   - Facilite les mises à jour et permet un re-téléchargement aisé par l'application

3. **Application web** :
   - Code source disponible sur [ce dépôt GitHub](https://github.com/FlorealRISSO/FlorealRISSO.github.io)
   - Utilise React Native Web pour une expérience cohérente entre mobile et web

4. **Mise à jour automatique** :
   - L'application vérifie régulièrement les mises à jour de la base de données
   - Téléchargement et intégration transparents des nouvelles données

5. **Configuration de la base de données** :

En raison des limitations d'Expo SQLite sur le web, une configuration spécifique est nécessaire pour utiliser sql.js sur le web et Expo SQLite sur Android. Cela nécessite une modification du code source selon la plateforme cible :

Dans le fichier `widgets/DatabaseProviderGeneric.tsx`, vous devrez modifier la ligne d'import selon que vous compilez pour le web ou pour Android :

   ```typescript
   // Pour le web :
   import { DatabaseProvider, useDatabase } from "./DatabaseProviderWeb";

   // Pour Android :
   // import { DatabaseProvider, useDatabase } from "./DatabaseProviderExpo";

   export { DatabaseProvider, useDatabase };
   ```

Cette configuration permet d'utiliser la bonne implémentation de base de données selon la plateforme, tout en maintenant une interface cohérente pour le reste de l'application.

## Captures d'écran

(À ajouter - Inclure des captures d'écran de l'interface web et mobile montrant les principales fonctionnalités)

## Contribution et signalement de bugs

FranceTermes est un projet open-source et les contributions sont les bienvenues. Si vous souhaitez contribuer ou si vous rencontrez des problèmes :

1. Consultez les issues ouvertes pour voir si le problème a déjà été signalé.
2. Pour un nouveau problème, ouvrez une nouvelle issue en décrivant en détail le bug ou la suggestion d'amélioration.
3. Pour les contributions, veuillez faire un fork du projet et soumettre une pull request avec vos modifications.

## Licence

- **Code de l'application** : Licence [MIT](./LICENSE)
- **Données** : Licence ouverte [Etalab](https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf)

## Contact et support

Pour toute question, suggestion ou problème technique, n'hésitez pas à me contacter.

