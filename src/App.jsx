import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SessionScreen from './page/SessionScreen';
import Home from './page/Home';
import Signup from './page/Signup';
import Login from './page/Login';
import { AuthProvider, useAuth } from './AuthContext'; // Adjust the path as necessary

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router >
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="SessionScreen" element={<SessionScreen />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
