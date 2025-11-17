import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})


// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//     plugins: [
//     tailwindcss(),
//   ],
//   server: {
//     hmr: {
//       overlay: false,
//     },
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
//   },
// });