import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const require = createRequire(import.meta.url)
const { homepage } = require('../package.json') as { homepage?: string }

function getBasePath(command: string) {
  if (command !== 'build' || !homepage) {
    return '/'
  }

  try {
    const url = new URL(homepage)
    if (!url.hostname.endsWith('github.io')) {
      return '/'
    }

    return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`
  } catch {
    return '/'
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: getBasePath(command),
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:8000',
      },
    },
  }
})
