import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const PostulanteContext = createContext();

export const PostulanteProvider = ({ children }) => {
  const [postulantes, setPostulantes] = useState([]);

  const obtenerPostulantes = async () => {
    try {
      const response = await api.get('/postulantes/');
      const data = response.data;

      // Ordenar por búsqueda alfabéticamente, si existe
      data.sort((a, b) => {
        const aVal = a.busqueda || "";
        const bVal = b.busqueda || "";
        return aVal.localeCompare(bVal);
      });

      setPostulantes(data);
    } catch (error) {
      console.error("Error al obtener postulantes", error);
    }
  };

  useEffect(() => {
    obtenerPostulantes();
  }, []);

  const agregarPostulante = async (nuevo) => {
    try {
      const response = await api.post('/postulantes/', nuevo, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const nuevoPostulante = response.data;
      console.log("Postulante agregado:", nuevoPostulante);

      setPostulantes(prev => {
        const updated = [...prev, nuevoPostulante];
        updated.sort((a, b) => {
          const aVal = a.busqueda || "";
          const bVal = b.busqueda || "";
          return aVal.localeCompare(bVal);
        });
        return updated;
      });

    } catch (error) {
      console.error("Error al agregar postulante", error.response?.data || error);
    }
  };

  const editarPostulante = async (id, datosActualizados) => {
      try {
        // 🔹 Enviar JSON puro sin FormData
        const response = await api.put(`/postulantes/${id}`, datosActualizados);

        const postulanteEditado = response.data;
        console.log("Postulante editado:", postulanteEditado);

        setPostulantes(prev => {
          const updated = prev.map(p => p.id === id ? postulanteEditado : p);

          updated.sort((a, b) => {
            const aVal = a.busqueda || "";
            const bVal = b.busqueda || "";
            return aVal.localeCompare(bVal);
          });

          return updated;
        });

        return { success: true };
      } catch (error) {
        console.error("Error al editar postulante", error.response?.data || error);
        return { success: false, error: error.response?.data?.detail || "Error al editar postulante" };
      }
  };

  const eliminarPostulante = async (id) => {
    try {
      await api.delete(`/postulantes/${id}`);
      setPostulantes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar postulante", error);
    }
  };

  return (
    <PostulanteContext.Provider value={{ postulantes, agregarPostulante, eliminarPostulante, editarPostulante }}>
      {children}
    </PostulanteContext.Provider>
  );
};

export const usePostulantes = () => useContext(PostulanteContext);