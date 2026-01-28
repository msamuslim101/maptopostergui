import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Global Error Handler for debugging startup issues
window.onerror = function (message, source, lineno, colno, error) {
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '0';
    errorContainer.style.left = '0';
    errorContainer.style.width = '100%';
    errorContainer.style.height = '100%';
    errorContainer.style.backgroundColor = '#1a0000';
    errorContainer.style.color = '#ff3333';
    errorContainer.style.zIndex = '999999';
    errorContainer.style.padding = '20px';
    errorContainer.style.overflow = 'auto';
    errorContainer.style.fontFamily = 'monospace';
    errorContainer.style.whiteSpace = 'pre-wrap';

    errorContainer.innerHTML = `
        <h1>Startup Error</h1>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
        <p><strong>Stack:</strong> ${error?.stack || 'No stack trace'}</p>
    `;

    document.body.appendChild(errorContainer);
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
