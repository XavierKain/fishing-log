import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch(e) {
  document.getElementById('root')!.innerHTML = '<pre style="color:red;padding:20px">' + String(e) + '</pre>'
}
