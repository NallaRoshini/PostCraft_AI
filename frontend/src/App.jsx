import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatApp from "./ChatApp";
import Login from "./Login";
import Register from "./Register";
import { AuthProvider, useAuth } from "./AuthContext";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer/>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
