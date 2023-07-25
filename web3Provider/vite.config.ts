// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'


// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NgmiPolyfill } from "vite-plugin-ngmi-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    NgmiPolyfill(),
  ],
  define: { 
    'process.env': {},
    global: {}, 
    'process.env.VUE_APP_WALLET_CONNECT_V2_ID': JSON.stringify(process.env.VITE_VUE_APP_WALLET_CONNECT_V2_ID)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      buffer: 'vite-compatible-readable-buffer',
      process: "process/browser",
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis',
            //"process.env.VUE_APP_WALLET_CONNECT_V2_ID": 'import.meta.env.VITE_VUE_APP_WALLET_CONNECT_V2_ID',
            //"process.env.VUE_APP_RPC_URL_1": 'import.meta.env.VITE_VUE_APP_RPC_URL_1',
            //"process.env.VUE_APP_RPC_URL_5": 'import.meta.env.VITE_VUE_APP_RPC_URL_5',
            //"process.env.VUE_APP_WALLET_CONNECT_BRIDGE": 'import.meta.env.VITE_VUE_APP_WALLET_CONNECT_BRIDGE',
            //"process.env.VUE_APP_WALLET_CONNECT_PING": 'import.meta.env.VITE_VUE_APP_WALLET_CONNECT_PING',
        },
        // Enable esbuild polyfill plugins
        plugins: [
            NodeGlobalsPolyfillPlugin({
                buffer: true,
                process: true
            }),
            NodeModulesPolyfillPlugin()
        ]
    }
  }
})
function EnvironmentPlugin(arg0: {
  // Uses 'development' if the NODE_ENV environment variable is not defined.
  NODE_ENV: string
  // Have in mind that variables coming from process.env are always strings.
  DEBUG: string
  // Required: will fail if the API_KEY environment variable is not provided.
  API_KEY: undefined
  // Optional: will not fail if the APP_VERSION environment variable is missing.
  APP_VERSION: null
}): import("vite").PluginOption {
  throw new Error('Function not implemented.')
}

