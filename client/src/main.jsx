import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Presentation from './Presentation.jsx'
import Home from './Home.jsx'
import Page4 from './Page4.jsx'
import Auth from "./Auth.jsx"
import ReadBookPage from './pages/ReadBookPage'
import ModerationPage from './pages/ModerationPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/app" element={<App />} />
        <Route path="/book/:bookId" element={<ReadBookPage />} />
        <Route path="/moderation/:bookId" element={<ModerationPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
