import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { darkTheme } from '../theme';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CryptoProvider } from '../contexts/CryptoContext';

export default function RootLayout() {
  useEffect(() => {
    async function loadCustomFonts() {
      await Font.loadAsync({
        ...MaterialCommunityIcons.font,
      });
    }
    loadCustomFonts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={darkTheme}>
        <CryptoProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: darkTheme.colors.surface,
              },
              headerTintColor: darkTheme.colors.onSurface,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: darkTheme.colors.background,
              },
            }}>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </CryptoProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}