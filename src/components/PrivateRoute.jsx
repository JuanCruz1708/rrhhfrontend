import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../data/AuthContext'; // CORRECT PATH

function PrivateRoute({ children }) {
  const { usuarioLogueado } = useAuth();
  return usuarioLogueado ? children : <Navigate to="/login" />;
}

export default PrivateRoute;