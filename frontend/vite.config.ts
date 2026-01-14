import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
// Build: 2026-01-14 - Cache cleared
export default defineConfig({
  plugins: [
    react(),
    viteCompression(),
    // Disabled CSS inlining - causing preload errors
    /*
    {
      name: 'inline-css',
      apply: 'build',
      enforce: 'post',
      generateBundle(_, bundle) {
        const htmlFile = bundle['index.html'];
        if (!htmlFile) return;

        // Identify CSS files
        const cssFiles = Object.keys(bundle).filter(key => key.endsWith('.css'));

        cssFiles.forEach(cssFileName => {
          const cssAsset = bundle[cssFileName];
          if (!cssAsset || cssAsset.type !== 'asset') return;

          const cssContent = cssAsset.source;
          // Ensure htmlFile is also treated as an asset
          if (htmlFile.type !== 'asset') return;

          const htmlSource = htmlFile.source as string;

          // Regex to find the link tag pointing to this CSS file
          // Matches: <link rel="stylesheet" crossorigin href="/assets/index-XXXX.css">
          // We handle potential leading ./ or /
          const filename = cssFileName.split('/').pop();
          const regex = new RegExp(`<link[^>]*href="[./]*assets/${filename}"[^>]*>`, 'g');

          if (regex.test(htmlSource)) {
            // Replace link with style tag
            htmlFile.source = htmlSource.replace(regex, `<style>${cssContent}</style>`);
            // Remove the external CSS file from the output
            delete bundle[cssFileName];
            console.log(`[Vite] Inlined ${cssFileName} into index.html`);
          }
        });
      }
    }
    */
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          'vendor-canvas': ['html2canvas'],
          'country-data': ['country-state-city']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
