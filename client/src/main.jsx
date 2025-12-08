import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Presentation from './Presentation.jsx'
import Home from './Home.jsx'
import Auth from "./Auth.jsx"
import ReadBookPage from './pages/ReadBookPage'
import Upload from "./Upload.jsx";
import ModeratorPage from "./pages/ModeratorPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import QuarantinePage from "./pages/QuarantinePage.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import { AdminRoute, ModeratorRoute } from './components/ProtectedRoute.jsx';
import { ROUTES } from './constants';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.PRESENTATION} element={<Presentation />} />
        <Route path={ROUTES.AUTH} element={<Auth />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.SETUP} element={<SetupPage />} />
        <Route path={ROUTES.UPLOAD} element={<Upload />} />
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
          path={ROUTES.ADMIN}
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_QUARANTINE}
          element={
            <AdminRoute>
              <QuarantinePage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
