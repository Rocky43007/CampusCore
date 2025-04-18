import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EventsScreen from '~/screens/EventsScreen';
import HomeScreen from '~/screens/HomeScreen';
import './global.css';

export type RootStackParamList = {
  Home: undefined;
  Events: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} // Hide default header to use custom AppHeader
          />
          <Stack.Screen
            name="Events"
            component={EventsScreen}
            options={{ headerShown: false }} // Hide default header to use custom AppHeader
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
