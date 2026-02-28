import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root')!

window.addEventListener('error', (e) => {
  root.innerHTML = '<pre style="color:red;padding:20px;white-space:pre-wrap">ERROR: ' + e.message + '</pre>'
})

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
