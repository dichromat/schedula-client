import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css//bootstrap.css'
import './styles.css'
import { UserdataProvider } from './contexts/userdata-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserdataProvider>
      <App />
    </UserdataProvider>
  </React.StrictMode>,
)
