# Models Directory

This directory contains all the models, types, interfaces, and schemas used throughout the application.

## Structure

- **`types/`**: Contains TypeScript types and interfaces organized by domain

  - `crypto.ts`: Types for cryptocurrency data (Ticker, Exchange, GlobalData, etc.)
  - `api.ts`: Types for API parameters and requests
  - `ui.ts`: Types for UI components and state
  - `chart.ts`: Types for chart data and configuration
  - `index.ts`: Re-exports all types for easier importing

- **`schemas/`**: Reserved for validation schemas (future implementation)

- **`interfaces/`**: Reserved for component interfaces (future implementation)

## Usage

Import types directly from their specific modules for better code splitting:

```typescript
import { Ticker, Exchange } from "../models/types/crypto";
import { TickersParams } from "../models/types/api";
```

Or import everything from the main models index for convenience:

```typescript
import { Ticker, TickersParams } from "../models";
```

## Best Practices

1. **Domain Specific Types**: Keep types organized by domain for better maintainability
2. **Documentation**: Document all types with JSDoc comments
3. **Naming Conventions**: Use PascalCase for interfaces and types
4. **Avoid Circular Dependencies**: Be careful not to create circular dependencies between type files
