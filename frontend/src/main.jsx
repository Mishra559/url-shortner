import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0D0D0D',
            color: '#F5F2EB',
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: '0',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#E84B2B', secondary: '#F5F2EB' },
          },
          error: {
            iconTheme: { primary: '#E84B2B', secondary: '#F5F2EB' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
