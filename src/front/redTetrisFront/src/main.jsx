import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App/App.jsx'
import { BrowserRouter } from "react-router-dom";

export const	address = import.meta.env.VITE_API_ADDRESS;

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
)
