import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, 'dist')
const app = express()
const PORT = process.env.PORT || 3000

// Serve Vite build (includes all public/ assets copied by Vite)
app.use(express.static(dist))

// Catch-all: serve the single-page app for any unmatched URL
app.use((_req, res) => res.sendFile(join(dist, 'index.html')))

app.listen(PORT, () => console.log(`Portfolio → http://localhost:${PORT}`))
