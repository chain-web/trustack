import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@trustack/node-modules-polyfill';
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from '@trustack/rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      events:
        'node_modules/@trustack/rollup-plugin-node-polyfills/polyfills/events.js',
      buffer:
        'node_modules/@trustack/rollup-plugin-node-polyfills/polyfills/buffer-es6.js',
      Buffer:
        'node_modules/@trustack/rollup-plugin-node-polyfills/polyfills/buffer-es6.js',
    },
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
  base: '/dist',
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
