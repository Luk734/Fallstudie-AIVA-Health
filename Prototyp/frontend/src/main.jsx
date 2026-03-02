import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ── Design Tokens + Globale Styles (US-11) ─────────────────────────────────
// Reihenfolge ist wichtig:
//   1. tokens.css → definiert die CSS-Variablen (Farben, Abstände, etc.)
//   2. global.css → nutzt die Variablen für Base-Styles (Reset, Body, etc.)
// Danach laden Komponenten ihre eigenen CSS-Dateien die tokens referenzieren.
import './styles/tokens.css'
import './styles/global.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
