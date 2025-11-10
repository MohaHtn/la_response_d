import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Presentation from './Presentation.jsx'
import Home from './Home.jsx'
import Auth from "./Auth.jsx"
import ReadBookPage from './pages/ReadBookPage'
import Upload from "./Upload.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/book/:bookId" element={<ReadBookPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
