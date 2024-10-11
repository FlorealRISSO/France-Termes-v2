# FranceTermes

*[Version Française](./README.md)*

## Availability

- [Web App](http://france-termes.risso.eu/)
- Android (link coming soon)

## What is FranceTermes?

FranceTermes is a modern, user-friendly application based on [France Terme](http://www.culture.fr/franceterme/), an official service of the French Ministry of Culture. The main objective of this application is to make easily accessible the terms recommended by the Commission d'enrichissement de la langue française and published in the Journal officiel de la République française.

In a world where English often dominates in technical and scientific fields, FranceTermes plays a crucial role in promoting and preserving the French language. It enables users to discover French equivalents for foreign, mainly English, terms in a variety of specialized fields.

## Main features

1. **Advanced search** :
   - Search for words in French or English
   - Search by field (e.g. IT, medicine, economics)
   - Suggested terms as you type

2. **Discover new terms** :
   - New” tab showing recently added terms
   - Discover” function proposing random terms to expand your vocabulary

3. **Detailed information** :
   - Full definition of each term
   - Foreign equivalent(s)
   - Field(s) of application
   - Date of publication in the Official Journal

4. **Practical features** :
   - Offline mode for use without an Internet connection
   - Easy sharing of terms as images
   - Direct links to records on the official FranceTerme website

5. **Automatic updates** :
   - Regular download of new data to keep you up to date

## New version: From Flutter to React Native

This new version of FranceTermes marks a significant evolution from the original version developed two years ago:

1. **Technology**: Recoded entirely in React Native, replacing the old Flutter version.

2. **Accessibility**: Available as a web app, eliminating dependence on app stores and making the service accessible to all without constraint.

3. **Performance**: Optimized for a smooth user experience, whether on mobile or web browser.

4. **Design**: User interface redesigned for improved ergonomics and aesthetics.

5. **Extended functionality**: New features added based on feedback from users of the first version.

## Technical operation

The process of creating and updating FranceTermes takes place in several stages:

1. **Data extraction** :
   - Use of a custom parser ([available here](https://github.com/FlorealRISSO/France-Termes-Parser))
   - Transformation of official XML data into usable SQL format

2. **Data hosting** :
   - SQL database hosted on [this GitHub repository](https://github.com/FlorealRISSO/France-Terme-SQL-DB)
   - Facilitates updates and easy re-downloading by the application

3. **Web application**:
   - Source code available on [this GitHub repository](https://github.com/FlorealRISSO/FlorealRISSO.github.io)
   - Uses React Native Web for a consistent mobile/web experience

4. **Automatic updates**:
   - Application regularly checks for database updates
   - Seamless download and integration of new data

5. **Database configuration** :

Due to the limitations of Expo SQLite on the web, a specific configuration is required to use sql.js on the web and Expo SQLite on Android. This requires modification of the source code according to the target platform:

In the `widgets/DatabaseProviderGeneric.tsx` file, you'll need to modify the import line depending on whether you're compiling for the web or for Android:

 ```typescript
 // For the web :
 import { DatabaseProvider, useDatabase } from “./DatabaseProviderWeb”;

 // For Android :
 // import { DatabaseProvider, useDatabase } from “./DatabaseProviderExpo”;

 export { DatabaseProvider, useDatabase };
 ```

This configuration allows you to use the right database implementation for each platform, while maintaining a consistent interface for the rest of the application.

## Screenshots

(To be added - Include screenshots of web and mobile interface showing key features)

## Contribution and bug reporting

FranceTermes is an open-source project and contributions are welcome. If you would like to contribute or if you encounter any problems:

1. Check the open issues to see if the problem has already been reported.
2. For a new problem, open a new issue with a detailed description of the bug or suggestion for improvement.
3. For contributions, please fork the project and submit a pull request with your modifications.

## License

- **Application code** : [MIT](./LICENSE) license
- **Data**: Open license [Etalab](https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf)

## Contact and support

If you have any questions, suggestions or technical problems, please don't hesitate to contact me.
