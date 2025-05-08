import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb',
    secondary: '#64748b',
    tertiary: '#0f172a',
    background: '#f8fafc',
    surface: '#ffffff',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onTertiary: '#ffffff',
    onBackground: '#0f172a',
    onSurface: '#0f172a',
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#f8fafc',
      level3: '#f1f5f9',
      level4: '#e2e8f0',
      level5: '#cbd5e1',
    },
  },
  roundness: 12,
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60a5fa',
    secondary: '#94a3b8',
    tertiary: '#f8fafc',
    background: '#0f172a',
    surface: '#1e293b',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    onPrimary: '#0f172a',
    onSecondary: '#0f172a',
    onTertiary: '#0f172a',
    onBackground: '#f8fafc',
    onSurface: '#f8fafc',
    elevation: {
      level0: 'transparent',
      level1: '#1e293b',
      level2: '#0f172a',
      level3: '#020617',
      level4: '#1e293b',
      level5: '#334155',
    },
  },
  roundness: 12,
};

export { lightTheme, darkTheme };