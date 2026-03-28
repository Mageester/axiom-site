import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import SmoothScrollProvider from './components/SmoothScrollProvider.tsx'
import { registerGsapPlugins } from './lib/gsap.ts'
import './index.css'

registerGsapPlugins()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <SmoothScrollProvider>
                <App />
            </SmoothScrollProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
