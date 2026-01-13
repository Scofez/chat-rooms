import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from './lib/easy-auth';
import { LoginPage } from './components/LoginPage';
import type { JSX } from 'react';

// A simple wrapper to protect chat routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // We use the method you defined in your library!
  return authStore.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Chat Routes */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <>
              <h1>Welcome User</h1>
              <p>Your authenticated session is active.</p>
              </>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;