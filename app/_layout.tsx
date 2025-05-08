import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CryptoProvider } from '../contexts/CryptoContext';
import { darkTheme } from '../theme';

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
      <StatusBar style="light" />
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}