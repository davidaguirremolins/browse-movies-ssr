import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Router } from './router/router'
import Header from './components/Header/Header';

interface IRenderProps {
  path: string
}

export function render({ path }: IRenderProps) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <div className="app">
          <Header />
          <Router />
        </div>
      </StaticRouter>
    </StrictMode>
  )

  return { html }
}
