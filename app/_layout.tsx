/**
 * Root Layout Component
 * 
 * This is the root layout component for the entire application. It sets up the
 * following key application elements:
 * - Custom fonts loading
 * - Gesture handling with react-native-gesture-handler
 * - Status bar configuration
 * - Safe area handling with react-native-safe-area-context
 * - Theme provider with react-native-paper
 * - Global state management with CryptoContext
 * - Navigation stack configuration with expo-router
 * 
 * The layout follows Expo's recommended structure and best practices.
 */

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

/**
 * Root layout component that sets up the application's navigation stack and providers
 * @returns {JSX.Element} Root layout component
 */
export default function RootLayout() {
  /**
   * Effect hook to load custom fonts when component mounts
   * This ensures that icon fonts and other custom fonts are available throughout the app
   */
  useEffect(() => {
    async function loadCustomFonts() {
      await Font.loadAsync({
        ...MaterialCommunityIcons.font,
      });
    }
    loadCustomFonts();
  }, []);

  return (
    /**
     * GestureHandlerRootView is required for gesture-based interactions
     * It must wrap the entire application to work properly
     */
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Set the status bar to light mode for better visibility on dark theme */}
      <StatusBar style="light" />
      
      {/* SafeAreaProvider handles safe area insets on notched devices */}
      <SafeAreaProvider>
        {/* PaperProvider applies the Material Design theme across the app */}
        <PaperProvider theme={darkTheme}>
          {/* CryptoProvider manages global state for cryptocurrency data */}
          <CryptoProvider>
            {/* 
              Stack navigator configuration
              This sets up the navigation structure for the entire app
            */}
            <Stack
              screenOptions={{
                // Default styling for all screens in the stack
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
                // Remove the default back button title text
                headerBackTitle: '',
              }}>
              {/* 
                Main tabs route configuration
                headerShown is set to false since tabs have their own headers
              */}
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