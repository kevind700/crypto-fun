# Crypto-Fun - Aplicación de Criptomonedas con React Native y Expo

Este proyecto es una aplicación móvil para seguimiento y análisis de criptomonedas, desarrollada con React Native y Expo. La aplicación consume la API de Coinlore para proporcionar información en tiempo real sobre precios, volúmenes, capitalización de mercado y otros datos relevantes de criptomonedas.

## Tabla de Contenidos

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Servicios de API](#servicios-de-api)
  - [BaseApiService](#baseapiservice)
  - [CoinloreApiService](#coinloreapiservice)
- [Tipos de Datos](#tipos-de-datos)
- [Pruebas Unitarias](#pruebas-unitarias)
- [Implementación de Pruebas](#implementación-de-pruebas)
  - [Herramientas y Configuración](#herramientas-y-configuración)
  - [Comandos de Prueba](#comandos-de-prueba)
- [Configuración del Proyecto](#configuración-del-proyecto)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
- [Configuración de Git](#configuración-de-git)

## Arquitectura del Proyecto

El proyecto sigue una arquitectura de servicios modular y está estructurado de la siguiente manera:

```
crypto-fun/
├── app/               # Directorio principal de la aplicación (enrutamiento basado en archivos)
├── assets/            # Recursos estáticos (imágenes, fuentes, etc.)
├── components/        # Componentes reutilizables de UI
├── constants/         # Constantes y configuraciones globales
├── contexts/          # Contextos de React para gestión de estado global
├── hooks/             # Hooks personalizados de React
├── services/          # Servicios para comunicación con APIs
│   ├── BaseApiService.ts         # Clase base para servicios API
│   ├── CoinloreApiService.ts     # Implementación específica para API Coinlore
│   └── types.ts                  # Tipos y interfaces para datos de API
├── theme/             # Definiciones de temas, estilos y diseño
├── utils/             # Utilidades y funciones auxiliares
└── __tests__/         # Pruebas unitarias e integración
    └── services/      # Pruebas específicas para servicios
```

## Tecnologías Utilizadas

- **React Native (0.79.2)**: Framework principal para desarrollo móvil multiplataforma
- **Expo (53.0.8)**: Plataforma para simplificar el desarrollo de React Native
- **TypeScript (5.8.3)**: Superconjunto tipado de JavaScript para desarrollo robusto
- **Axios (1.9.0)**: Cliente HTTP para comunicación con APIs
- **React Navigation (7.1.6)**: Navegación y enrutamiento entre pantallas
- **Jest (29.7.0)**: Framework de pruebas
- **React Native Chart Kit**: Visualización de datos y gráficos
- **React Native Paper**: Componentes UI con Material Design
- **Expo Router**: Sistema de enrutamiento basado en archivos
- **Expo Reanimated**: Animaciones fluidas y de alto rendimiento

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

## Tipos de Datos

El proyecto utiliza TypeScript para proporcionar tipado estricto en toda la aplicación. Los principales tipos incluyen:

- **Ticker**: Representa información de una criptomoneda (precio, cambio porcentual, volumen)
- **GlobalData**: Datos globales del mercado (capitalización total, volumen, dominancia BTC/ETH)
- **Exchange**: Detalles sobre exchanges de criptomonedas
- **CoinMarket**: Información sobre mercados específicos para una criptomoneda
- **SocialStats**: Estadísticas sociales (GitHub, Twitter, Reddit) para proyectos de criptomonedas

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

## Configuración de Git

El proyecto incluye configuraciones específicas para gestión de código:

- **.gitignore**: Exclusión de archivos no versionados (node_modules, build, coverage)
- **.gitattributes**: Normalización de finales de línea y manejo de archivos binarios
- **.npmignore**: Configuración para publicación de paquete NPM

---

© 2023 Crypto-Fun. Todos los derechos reservados.
