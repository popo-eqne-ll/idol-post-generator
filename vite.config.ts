import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // すべてのアセットをインライン化
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // 動的インポートもインライン化
      },
    },
  },
})
