import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Page2 from './Auth.jsx'
import Home from './Home.jsx'
import Page4 from './Page4.jsx'
import Auth from "./Auth.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/moderator" element={<ModeratorPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
