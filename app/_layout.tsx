import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '../theme';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CryptoProvider } from '../contexts/CryptoContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

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
      <PaperProvider theme={theme}>
        <CryptoProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: theme.colors.background,
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