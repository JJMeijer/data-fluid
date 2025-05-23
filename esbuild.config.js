import esbuild from 'esbuild';
import { exec } from 'child_process';

const isProduction = process.env.NODE_ENV === 'production';

// Function to run TypeScript compiler for type checking and declaration generation
const tscPlugin = {
  name: 'typescript-checker',
  setup(build) {
    build.onEnd(result => {
      if (result.errors.length > 0) {
        console.error('esbuild found errors, skipping type checking.');
        return;
      }
      console.log('esbuild build successful, running type checking and declaration emit...');
      exec('npx tsc --emitDeclarationOnly --project tsconfig.json', (err, stdout, stderr) => {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) console.error('TypeScript checking failed:', err);
        else console.log('TypeScript checking and declaration emit successful.');
      });
    });
  },
};

const baseConfig = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  sourcemap: true,
  minify: isProduction,
  plugins: isProduction ? [tscPlugin] : [], // Only run tsc on production builds
};

// Build configurations
const buildConfigs = [
  {
    ...baseConfig,
    format: 'esm',
    outfile: 'dist/index.mjs',
    platform: 'neutral',
    splitting: true, // if you have multiple entry points or dynamic imports
    target: 'es2020', // Or your desired target
  },
  {
    ...baseConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs',
    platform: 'node', // CJS is primarily for Node
    target: 'es2020',
  },
  {
    ...baseConfig,
    entryPoints: ['src/main.ts'], // Potentially a different entry for IIFE if needed
    format: 'iife',
    globalName: 'DataFluid', // Your library's global name
    outfile: 'dist/datafluid.min.js',
    platform: 'browser',
    target: 'es2020',
    // For IIFE, we don't want the tscPlugin to run multiple times if not necessary,
    // assuming declarations are generated based on the primary ESM/CJS builds.
    // If you want types with the IIFE specifically, adjust plugin logic.
    plugins: isProduction && baseConfig.outfile === 'dist/index.mjs' ? [tscPlugin] : [] 
  },
];

// Watch configuration for development
const watchConfig = {
    ...baseConfig,
    format: 'esm', // Or your preferred format for development
    outfile: 'dist/index.dev.js', // A dedicated dev output
    platform: 'neutral',
    target: 'esnext', // Use latest for dev
    minify: false, // No minification for dev
    plugins: [
        { // Custom plugin for logging
            name: 'watch-logger',
            setup(build) {
                build.onStart(() => console.log('esbuild watch: building...'));
                build.onEnd(result => {
                    if (result.errors.length > 0) {
                        console.error('esbuild watch: build failed:', result.errors);
                    } else {
                        console.log('esbuild watch: build succeeded.');
                        // Optionally, run tsc for type checking in watch mode without emitting declarations
                        // exec('npx tsc --noEmit --project tsconfig.json', (err, stdout, stderr) => {
                        //   if (stdout) console.log(stdout.trim());
                        //   if (stderr) console.error(stderr.trim());
                        // });
                    }
                });
            }
        }
    ]
};


async function build() {
  if (process.argv.includes('--watch')) {
    console.log('Starting esbuild in watch mode...');
    const ctx = await esbuild.context(watchConfig);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    console.log('Starting esbuild production build...');
    try {
      await Promise.all(buildConfigs.map(config => esbuild.build(config)));
      console.log('All esbuild production builds successful.');
      // Manually trigger TSC for declarations after all builds are done
      // This ensures it runs once after all outputs are generated.
      if (isProduction) {
        console.log('Running final type checking and declaration emit...');
        exec('npx tsc --emitDeclarationOnly --project tsconfig.json', (err, stdout, stderr) => {
          if (stdout) console.log(stdout.trim());
          if (stderr) console.error(stderr.trim());
          if (err) console.error('Final TypeScript checking failed:', err);
          else console.log('Final TypeScript checking and declaration emit successful.');
        });
      }
    } catch (e) {
      console.error('esbuild build failed:', e);
      process.exit(1);
    }
  }
}

build().catch(e => {
    console.error(e);
    process.exit(1);
});
