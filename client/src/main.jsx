import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import i18n from './i18n/index.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.js'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Presentation from './Presentation.jsx'
import Home from './Home.jsx'
import Auth from "./Auth.jsx"
import ReadBookPage from './pages/ReadBookPage'
import Upload from "./Upload.jsx";
import ModeratorPage from "./pages/ModeratorPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import QuarantinePage from "./pages/QuarantinePage.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import { AdminRoute, ModeratorRoute, ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ROUTES } from './constants';

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.PRESENTATION} element={<Presentation />} />
          <Route path={ROUTES.AUTH} element={<Auth />} />
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETUP}
            element={
              <ProtectedRoute>
                <SetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.UPLOAD}
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <ProtectedRoute>
                <ReadBookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderation/:bookId"
            element={
              <ProtectedRoute>
              <ModeratorRoute>
                <ModeratorPage />
              </ModeratorRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute>
              <AdminRoute>
                <AdminPage/>
              </AdminRoute>
                  </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_QUARANTINE}
            element={
              <ProtectedRoute>
              <AdminRoute>
                <QuarantinePage />
              </AdminRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>,
)

// Keep <html lang> in sync with current language
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('lang', i18n.language || 'fr');
}
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lng);
  }
});
