import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Tells Vite to listen on all networks
    allowedHosts: [
      '1d33552d-4bd4-4ec4-b6a0-baf89f244662-00-1docqbo5lguio.pike.replit.dev', // The exact URL from your screenshot
      '.replit.dev' // Allows any future Replit URLs
    ]
  }
})