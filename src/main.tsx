import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { App } from './App';
import Login from './pages/Login';
import './index.css';

const GITHUB_PAGES_REPO_SEGMENT = 'phillips-academy';

function getRouterBasename(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const { pathname } = window.location;
  if (
    pathname === `/${GITHUB_PAGES_REPO_SEGMENT}` ||
    pathname.startsWith(`/${GITHUB_PAGES_REPO_SEGMENT}/`)
  ) {
    return `/${GITHUB_PAGES_REPO_SEGMENT}`;
  }
  return undefined;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <Router basename={getRouterBasename()}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
