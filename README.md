# Data Fluid

A lightweight, event-driven data layer library for JavaScript and TypeScript applications.

## Features

*   Simple event subscription and triggering mechanism.
*   Supports "once" and "on" event listeners.
*   Retroactive event firing for late subscribers.
*   Written in TypeScript, providing type safety.
*   Distributed in multiple module formats (ESM, CJS, IIFE).

## Installation

You can install Data Fluid using npm, yarn, or pnpm:

```bash
# Using pnpm (recommended for this project)
pnpm install data-fluid

# Using npm
npm install data-fluid

# Using yarn
yarn add data-fluid
```

## Basic Usage

Here's how to get started with Data Fluid:

```typescript
import { DataFluidFactory, DataFluid, FluidData } from 'data-fluid';

// Create a new Data Fluid instance
// You can optionally provide a name for the instance
const fluidInstance: DataFluid = DataFluidFactory.create('myInstance');

// Add an event listener that runs on every iteration of the event
fluidInstance.on('user:action', (data: FluidData) => {
  console.log('User action:', data);
});

// Add an event listener that will only run the callback on the first iteration
fluidInstance.once('app:initialized', (data: FluidData) => {
  console.log('App initialized with config:', data);
  // This listener will automatically be removed after firing once
});

// Trigger an event
fluidInstance.trigger('user:action', {
  type: 'button_click',
  buttonText: 'SubmitForm',
  page: '/contact',
});

fluidInstance.trigger('app:initialized', {
  configLoaded: true,
  timestamp: Date.now(),
});

// Get an instance by name
const retrievedInstance = DataFluidFactory.getByName('myInstance');
if (retrievedInstance) {
  console.log('Successfully retrieved instance:', retrievedInstance);
}

// Get all instances
const allInstances = DataFluidFactory.getAll();
console.log('All DataFluid instances:', allInstances);
```

## API

### `DataFluidFactory`

*   `create(name?: string): DataFluid`: Creates a new `DataFluid` instance. If a name is provided, the instance can be retrieved later using `getByName`.
*   `getByName(name: string): DataFluid | null`: Retrieves a previously created `DataFluid` instance by its name.
*   `getAll(): Record<string, DataFluid>`: Retrieves all named `DataFluid` instances.

### `DataFluid` Instance

*   `on(eventName: string, callback: FluidCallback, retroactive?: boolean): void`: Subscribes to an event. The callback is executed every time the event is triggered.
    *   `retroactive` (default: `true`): If true, the callback will be immediately invoked for any past occurrences of the event.
*   `once(eventName: string, callback: FluidCallback, retroactive?: boolean): void`: Subscribes to an event for a single invocation. After the callback is executed once, it's automatically removed.
    *   `retroactive` (default: `true`): If true and the event has occurred in the past, the callback will be immediately invoked once, and then removed.
*   `off(eventName: string, callback: FluidCallback): void`: Removes a specific callback for an event.
*   `trigger(eventName: string, eventData: FluidData): void`: Triggers an event, invoking all subscribed callbacks with the provided data.

## Available Scripts

This project uses pnpm as its package manager.

*   `pnpm run clean`: Removes the `dist` directory.
*   `pnpm run typecheck`: Runs TypeScript compiler for static type checking.
*   `pnpm run build:dev`: Builds the library for development (unminified, with sourcemaps).
*   `pnpm run build`: Creates a production build (minified, with sourcemaps, type declarations).
*   `pnpm run watch`: Watches for file changes and rebuilds for development.
*   `pnpm run lint`: Lints the codebase using ESLint.
*   `pnpm run format`: Formats the codebase using Prettier.
*   `pnpm run test`: Runs tests using Vitest.
*   `pnpm run test:watch`: Runs tests in watch mode.
*   `pnpm run coverage`: Generates a test coverage report.
*   `pnpm run prepublishOnly`: Script that runs before publishing (includes typecheck, lint, test, build).

## Module Formats

Data Fluid is distributed in the following formats from the `dist` directory:

*   **ESM (ECMAScript Module):** `dist/index.mjs` (for modern bundlers and browsers)
*   **CJS (CommonJS):** `dist/index.cjs` (for Node.js environments)
*   **IIFE (Immediately Invoked Function Expression):** `dist/datafluid.min.js` (for direct browser usage, exposes `DataFluid` global)
*   **Type Declarations:** `dist/types/main.d.ts`

## Building from Source

If you need to build the library from source:

1.  Clone the repository:
    ```bash
    git clone https://github.com/JJMeijer/data-fluid.git
    cd data-fluid
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Build the library:
    ```bash
    pnpm run build
    ```
    The distributable files will be in the `dist` folder.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
```
