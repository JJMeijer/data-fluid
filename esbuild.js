require('esbuild').build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/datafluid.min.js',
  minify: true,
}).catch(() => process.exit(1));
