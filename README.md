# Crypto-Fun - Aplicación de Criptomonedas con React Native y Expo

Este proyecto es una aplicación móvil para seguimiento y análisis de criptomonedas, desarrollada con React Native y Expo. La aplicación consume la API de Coinlore para proporcionar información en tiempo real sobre precios, volúmenes, capitalización de mercado y otros datos relevantes de criptomonedas.

## Tabla de Contenidos

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Modelos de Datos](#modelos-de-datos)
- [Servicios de API](#servicios-de-api)
  - [BaseApiService](#baseapiservice)
  - [CoinloreApiService](#coinloreapiservice)
- [Componentes Principales](#componentes-principales)
- [Pruebas Unitarias](#pruebas-unitarias)
- [Implementación de Pruebas](#implementación-de-pruebas)
  - [Herramientas y Configuración](#herramientas-y-configuración)
  - [Comandos de Prueba](#comandos-de-prueba)
- [Configuración del Proyecto](#configuración-del-proyecto)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
- [Configuración de Git](#configuración-de-git)

## Arquitectura del Proyecto

El proyecto sigue una arquitectura modular con separación clara de responsabilidades y está estructurado de la siguiente manera:

```
crypto-fun/
├── app/                      # Enrutamiento basado en archivos (Expo Router)
│   ├── (tabs)/               # Pantallas principales con navegación por tabs
│   │   ├── index.tsx         # Dashboard principal
│   │   ├── markets.tsx       # Pantalla de mercados
│   │   ├── exchanges.tsx     # Pantalla de exchanges
│   │   └── _layout.tsx       # Configuración de la navegación por tabs
│   ├── coin-detail.tsx       # Vista detallada de criptomoneda
│   └── _layout.tsx           # Layout principal de la aplicación
├── assets/                   # Recursos estáticos (imágenes, fuentes, etc.)
├── components/               # Componentes reutilizables de UI
├── constants/                # Constantes y configuraciones globales
├── contexts/                 # Contextos de React para gestión de estado global
├── hooks/                    # Hooks personalizados de React
├── models/                   # Modelos de datos y tipos
│   ├── types/                # Definiciones de tipos TypeScript
│   │   ├── api.ts            # Tipos para parámetros y respuestas de API
│   │   ├── chart.ts          # Tipos para datos y configuración de gráficos
│   │   ├── crypto.ts         # Tipos para datos de criptomonedas
│   │   ├── ui.ts             # Tipos para componentes de UI
│   │   └── index.ts          # Exportaciones de tipos
│   ├── schemas/              # Esquemas de validación (implementación futura)
│   └── interfaces/           # Interfaces de componentes (implementación futura)
├── services/                 # Servicios para comunicación con APIs
│   ├── BaseApiService.ts     # Clase base para servicios API
│   └── CoinloreApiService.ts # Implementación específica para API Coinlore
├── theme/                    # Definiciones de temas, estilos y diseño
├── utils/                    # Utilidades y funciones auxiliares
└── __tests__/               # Pruebas unitarias e integración
    └── services/            # Pruebas específicas para servicios
```

## Tecnologías Utilizadas

- **React Native (0.79.2)**: Framework principal para desarrollo móvil multiplataforma
- **Expo (53.0.8)**: Plataforma para simplificar el desarrollo de React Native
- **TypeScript (5.8.3)**: Superconjunto tipado de JavaScript para desarrollo robusto
- **Expo Router (5.0.6)**: Sistema de enrutamiento basado en archivos
- **React Navigation (7.1.6)**: Navegación y enrutamiento entre pantallas
- **Axios (1.9.0)**: Cliente HTTP para comunicación con APIs
- **React Native Chart Kit (6.12.0)**: Visualización de datos y gráficos
- **React Native Paper (5.14.0)**: Componentes UI con Material Design
- **React Native Reanimated (3.17.4)**: Animaciones fluidas y de alto rendimiento
- **Jest (29.7.0)** y **ts-jest (29.3.2)**: Framework de pruebas
- **Rainbow ME Animated Charts**: Visualizaciones avanzadas para datos financieros

## Modelos de Datos

El proyecto utiliza una estructura de tipos TypeScript bien organizada para garantizar la coherencia de datos:

### Tipos de Criptomonedas

- **Ticker**: Datos completos de una criptomoneda (precio, cambio porcentual, volumen)
- **GlobalData**: Información global del mercado (capitalización total, dominancia BTC/ETH)
- **Exchange**: Detalles de exchanges de criptomonedas
- **CoinMarket**: Datos de mercados específicos para una criptomoneda
- **MarketMetrics**: Métricas para el panel de control
- **PriceAlert**: Configuración de alertas de precio

### Tipos de UI y Gráficos

- Tipos específicos para componentes de UI
- Configuraciones de gráficos y visualizaciones
- Tipos para gestión de estado y temas

## Servicios de API

### BaseApiService

Clase abstracta base que proporciona la funcionalidad común para todos los servicios de API:

- Configuración y creación de instancias de Axios
- Interceptores de solicitud y respuesta
- Manejo centralizado de errores (errores de red, límites de tasa, errores de servidor)
- Métodos HTTP básicos (GET, POST) con tipos genéricos

```typescript
// Extracto de BaseApiService.ts
protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await this.api.get<T>(url, config);
  return response.data;
}
```

### CoinloreApiService

Servicio concreto que extiende BaseApiService e implementa funcionalidades específicas para la API de Coinlore:

- Patrón Singleton para garantizar una única instancia
- Endpoints para datos de mercado de criptomonedas (tickers, global, exchanges)
- Métodos de utilidad para filtrado y ordenamiento de datos
- Tipado completo de todos los modelos de datos

```typescript
// Extracto de CoinloreApiService.ts
async getTopGainers(limit: number = 10): Promise<Ticker[]> {
  const { data } = await this.getTickers({ limit: 100 });
  return data
    .sort((a, b) => parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h))
    .slice(0, limit);
}
```

## Componentes Principales

La aplicación cuenta con varias pantallas y componentes clave:

- **Dashboard (index.tsx)**: Panel principal con resumen del mercado y monedas principales
- **Markets (markets.tsx)**: Listado completo de criptomonedas con filtros y búsqueda
- **Exchanges (exchanges.tsx)**: Directorio de exchanges con métricas de volumen
- **Coin Detail (coin-detail.tsx)**: Vista detallada de una criptomoneda con gráficos y estadísticas

Los componentes aprovechan características avanzadas como:
- **Expo Router**: Navegación basada en archivos para una experiencia de aplicación nativa
- **React Native Reanimated**: Animaciones optimizadas para transiciones fluidas
- **Rainbow ME Charts**: Visualizaciones interactivas de datos históricos de precios

## Pruebas Unitarias

El proyecto incluye pruebas exhaustivas para todos los servicios utilizando Jest:

- **BaseApiService.test.ts**: Pruebas para la clase base de servicio API
  - Configuración de instancia Axios
  - Interceptores de solicitud y respuesta
  - Manejo de errores HTTP
  - Métodos HTTP (GET, POST)

- **CoinloreApiService.test.ts**: Pruebas para el servicio específico de Coinlore
  - Patrón Singleton
  - Todos los endpoints de API
  - Métodos de utilidad (searchCoins, getTopGainers, etc.)
  - Gestión de casos límite y valores inválidos

Las pruebas alcanzan una cobertura completa para garantizar la robustez y confiabilidad del código.

## Implementación de Pruebas

### Herramientas y Configuración

- **Jest**: Framework principal configurado con `jest.config.js`
- **ts-jest**: Integración con TypeScript
- **axios-mock-adapter**: Simulación de respuestas HTTP para pruebas aisladas

### Comandos de Prueba

- **Ejecutar todas las pruebas**: `npm test`
- **Ejecución en modo watch**: `npm run test:watch`
- **Generar informe de cobertura**: `npm run test:coverage`

## Configuración del Proyecto

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator o Android Emulator para desarrollo local
- Expo Go en un dispositivo físico para pruebas rápidas

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone [url-repositorio]
   cd crypto-fun
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

4. Ejecutar pruebas:
   ```bash
   npm test
   ```

5. Generar informe de cobertura:
   ```bash
   npm run test:coverage
   ```

6. Resetear proyecto (útil para limpiar caché):
   ```bash
   npm run reset-project
   ```

## Configuración de Git

El proyecto incluye configuraciones específicas para gestión de código:

- **.gitignore**: Exclusión de archivos no versionados (node_modules, build, coverage)
- **.gitattributes**: Normalización de finales de línea y manejo de archivos binarios
- **.npmignore**: Configuración para publicación de paquete NPM
- **.husky**: Hooks de pre-commit para asegurar calidad del código

---

© 2023 Crypto-Fun. Todos los derechos reservados.
