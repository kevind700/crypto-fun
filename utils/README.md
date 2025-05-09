# Módulo de Utilidades

Este directorio contiene las funciones de utilidad reutilizables para todo el proyecto.

## Estructura

- `index.ts` - Punto de entrada principal que exporta todas las utilidades
- `dataTransformers.ts` - Funciones para transformar datos de criptomonedas
- `formatters.ts` - Funciones para formatear valores (precios, números grandes, etc.)

## Uso

Para usar cualquier utilidad en el proyecto, importa directamente desde el módulo principal:

```typescript
import { formatLargeNumber, getTopGainers } from '@/utils';
```

## Funciones Disponibles

### Transformadores de Datos

- `sortTickersByPercentChange` - Ordena criptomonedas por cambio porcentual
- `getTopGainers` - Obtiene las criptomonedas con mayores ganancias
- `getTopLosers` - Obtiene las criptomonedas con mayores pérdidas
- `searchCoins` - Busca criptomonedas por nombre, símbolo o ID
- `sortTickersByMarketCap` - Ordena criptomonedas por capitalización de mercado
- `sortTickersByVolume` - Ordena criptomonedas por volumen de operaciones

### Formateadores

- `formatPrice` - Formatea un precio con decimales apropiados
- `formatLargeNumber` - Formatea números grandes con separadores de miles
- `formatPercentChange` - Formatea un cambio porcentual con signo + o -
- `getChangeColor` - Obtiene el color apropiado para mostrar un cambio porcentual
- `formatValue` - Formatea valores numéricos con sufijos apropiados (T, B, M, K)
- `formatVolume` - Formatea volúmenes de trading con sufijos apropiados
- `getChangeBackgroundColor` - Obtiene el color de fondo para un cambio porcentual
- `getChangeBorderColor` - Obtiene el color de borde para un cambio porcentual

## Notas de Desarrollo

- Todas las utilidades deben ser funciones puras sin efectos secundarios
- Se recomienda añadir documentación JSDoc para todas las funciones
- Las nuevas utilidades deben exportarse desde `index.ts`
- Evitar duplicación de código entre este módulo y otros módulos de utilidades específicos 