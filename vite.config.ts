import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env variables with VITE_ prefix
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    define: {
      // Expose environment variables to the client-side code
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.VITE_WHATSAPP_TOKEN': JSON.stringify(env.VITE_WHATSAPP_TOKEN),
      'process.env.VITE_META_APP_ID': JSON.stringify(env.VITE_META_APP_ID),
      'process.env.VITE_META_APP_SECRET': JSON.stringify(env.VITE_META_APP_SECRET),
      'process.env.VITE_GOOGLE_CLOUD_CREDENTIALS_PATH': JSON.stringify(env.VITE_GOOGLE_CLOUD_CREDENTIALS_PATH)
    },
    resolve: {
      alias: {
        // Path aliases for cleaner imports
        '@': path.resolve(__dirname, '.'),
        '@components': path.resolve(__dirname, './components'),
        '@pages': path.resolve(__dirname, './pages'),
        '@services': path.resolve(__dirname, './services'),
        '@contexts': path.resolve(__dirname, './contexts'),
        '@constants': path.resolve(__dirname, './constants')
      }
    },
    server: {
      // Development server configuration
      port: 3000,
      open: true,
      cors: true
    },
    build: {
      // Production build optimization
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  };
});
