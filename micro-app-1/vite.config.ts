import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './MyComponent': './src/components/MyComponent.tsx', 
      },
      shared: ['react', 'react-dom'],
    }),
    {
      name: 'vite-plugin-notify-host-on-rebuild',
      apply(config, { command }) {
        return Boolean(command === 'build' && config.build?.watch);
      },
      async buildEnd(error) {
        if (!error) {
          try {
            await fetch('http://localhost:5000/__fullReload');
          } catch (e) {
            // noop
          }
        }
      },
    }
  ],
  preview: {
    host: 'localhost',
    port: 5001,
    strictPort: true,
  },
  server: {
    port: 5001,
    hmr: true,
  },
  build: {
    target: 'esnext'
  }
})