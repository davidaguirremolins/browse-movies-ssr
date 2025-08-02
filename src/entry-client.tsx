import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router/router'
import Header from './components/Header/Header';

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <div className="app">
        <Header />
        <Router />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
