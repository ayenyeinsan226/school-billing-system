import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' // Tailwind CSS ပါဝင်မည့်ဖိုင်

const container = document.getElementById('root')
if (!container) {
  throw new Error('Failed to find the root element')
}
const rootElement = createRoot(container) 

rootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)