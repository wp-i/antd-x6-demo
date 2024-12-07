import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: 'https://api.m.jd.com/api',
                changeOrigin: true,
                // rewrite: (path) => {
                //   return path.replace(/^\/api/, "")
                // },
            },
            "/gptApi": {
                target: 'http://askloophub.com:8100',
                changeOrigin: true,
                rewrite: (path) => {
                    return path.replace(/^\/gptApi/, "")
                },
            },
        },
    },
    plugins: [react()],
})
