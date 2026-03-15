import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from './lib/easy-auth';
import { LoginPage } from './components/LoginPage';
import type { JSX } from 'react';
import { ChatDashboard } from './components/ChatDashboard';

// A simple wrapper to protect chat routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // We use the method you defined in your library!
  return authStore.isAuthenticated() ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  // If already logged in, push them straight to the chat
  return authStore.isAuthenticated() ? <Navigate to="/chat" replace /> : children;
};
function App() {
  console.log('Is Authenticated:', authStore.isAuthenticated());

  return (
    <Router>
      <Routes>
        {/* Correct way to wrap a public route */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Protected Chat Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <ChatDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all redirect */}
        <Route 
          path="*" 
          element={<Navigate to={authStore.isAuthenticated() ? "/" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;