import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Presentation from './Presentation.jsx'
import Home from './Home.jsx'
import Auth from "./Auth.jsx"
import ReadBookPage from './pages/ReadBookPage'
import Upload from "./Upload.jsx";
import ModeratorPage from "./pages/ModeratorPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// Petite fonction utilitaire pour lire le type d'utilisateur
function getUserType() {
  try {
    return localStorage.getItem('userType') || 'USER';
  } catch {
    return 'USER';
  }
}

// Route prot9g9e pour l9admin
function AdminRoute({ children }) {
  const userType = getUserType();
  if (userType !== 'ADMIN') {
    // Si ce n'est pas un admin, on renvoie vers la home
    return <Navigate to="/home" replace />;
  }
  return children;
}

// Route protégée pour les modérateurs et admins
function ModeratorRoute({ children }) {
  const userType = getUserType();
  console.log('ModeratorRoute - userType:', userType);

  // Autoriser ADMIN et MODERATOR à accéder à la page de modération
  if (userType !== 'MODERATOR' && userType !== 'ADMIN') {
    console.log('Access denied - redirecting to /home');
    return <Navigate to="/home" replace />;
  }
  return children;
}

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
        <Route
          path="/moderation/:bookId"
          element={
            <ModeratorRoute>
              <ModeratorPage />
            </ModeratorRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
