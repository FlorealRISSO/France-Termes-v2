import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import HomePage from './pages/HomePage';
import { DatabaseProvider } from './widgets/DatabaseProviderGeneric';
import InformationPage from './pages/InformationPage';
import ArticlePage from './pages/ArticlePage';
import ResultsPage from './pages/ResultsPage';

type RootStackParamList = {
  Home: undefined;
  Information: undefined;
  Results: { query: string, filterParam: string };
  Article: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <DatabaseProvider>
        <NavigationContainer>
          <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Information" component={InformationPage} />
            <Stack.Screen name="Article" component={ArticlePage} />
            <Stack.Screen name="Results"  component={ResultsPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </DatabaseProvider>
    </PaperProvider>
  );
};

export default App;