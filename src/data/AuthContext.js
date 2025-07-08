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
          console.log("🔹 Respuesta del login:", response.data);

          if (response.data.mensaje === "Login exitoso") {
              console.log("🔹 Usuario recibido:", response.data.usuario);

              if (response.data.usuario) {
                  setUsuarioLogueado(response.data.usuario);
                  localStorage.setItem('usuarioLogueado', response.data.usuario);
                  return { success: true };
              } else {
                  console.error("❌ El usuario en la respuesta está vacío o undefined.");
                  return { success: false, error: "Error interno al recibir usuario." };
              }
          } else {
              return { success: false, error: "Credenciales inválidas." };
          }
      } catch (error) {
          console.error("❌ Error al intentar login:", error);
          let errorMsg = "Error al conectar con el servidor.";
          if (error.response && error.response.status === 401) {
              errorMsg = "Usuario o contraseña incorrectos.";
          }
          return { success: false, error: errorMsg };
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