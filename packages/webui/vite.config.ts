import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@trustack/node-modules-polyfill';
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from '@trustack/rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';
const devMode = process.env.NODE_ENV === 'development';

const resolveConfig = {
  alias: {
    events:
      'node_modules/@trustack/rollup-plugin-node-polyfills/polyfills/events.js',
  },
};

if (!devMode) {
  // both Buffer and buffer are required for some packages
  (resolveConfig.alias as { [find: string]: string }).buffer =
    'node_modules/@trustack/rollup-plugin-node-polyfills/polyfills/buffer-es6.js';
  (resolveConfig.alias as { [find: string]: string }).Buffer =
    'node_modules/@trustack/rollup-plugin-node-polyfills/polyfills/buffer-es6.js';
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    ...resolveConfig,
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
      target: 'es2020',
      supported: { bigint: true },
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        inject({ Buffer: ['Buffer', 'Buffer'] }),
        rollupNodePolyFill(),
      ],
    },
  },
  plugins: [react({ tsDecorators: true })],
});
