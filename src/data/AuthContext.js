import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    // Persistencia de sesión al recargar
    return localStorage.getItem('usuarioLogueado') || null;
  });

  const login = async (usuario, password) => {
    try {
      const response = await api.post('/login/', { usuario, password });
      if (response.data.mensaje === "Login exitoso") {
        console.log("✅ Login exitoso:", response.data.usuario);
        setUsuarioLogueado(response.data.usuario);
        localStorage.setItem('usuarioLogueado', response.data.usuario);
        return { success: true };
      } else {
        console.log("❌ Credenciales inválidas");
        return { success: false, error: "Credenciales inválidas." };
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      return { success: false, error: "Error al conectar con el servidor." };
    }
  };

  const logout = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem('usuarioLogueado');
  };

  return (
    <AuthContext.Provider value={{ usuarioLogueado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);