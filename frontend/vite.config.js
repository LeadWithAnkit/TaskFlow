import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    allowedHosts: ['taskfloww-production-e5f8.up.railway.app', 'taskfloww-production.up.railway.app'],
  },
})