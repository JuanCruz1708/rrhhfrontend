import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const PuestoContext = createContext();

export const PuestoProvider = ({ children }) => {
  const [puestos, setPuestos] = useState([]);

  const obtenerPuestos = async () => {
    try {
      const response = await api.get('/puestos/');
      setPuestos(response.data);
    } catch (error) {
      console.error("Error al obtener puestos", error);
    }
  };

  useEffect(() => {
    obtenerPuestos();
  }, []);

  const agregarPuesto = async (nuevo) => {
      try {
          await api.post('/puestos/', nuevo);
          await obtenerPuestos();
      } catch (error) {
          console.error("Error al agregar puesto", error);
          throw error; // Para que el componente capture el error
      }
  };

  const editarPuesto = async (id, datosActualizados) => {
      try {
          await api.put(`/puestos/${id}`, datosActualizados);
          await obtenerPuestos();
          return { success: true };
      } catch (error) {
          console.error("Error al editar puesto", error.response?.data || error);
          return { success: false, error: error.response?.data?.detail || "Error al editar puesto" };
      }
  };

  const eliminarPuesto = async (id) => {
    try {
      await api.delete(`/puestos/${id}`);
      await obtenerPuestos();
    } catch (error) {
      console.error("Error al eliminar puesto", error);
    }
  };

  return (
    <PuestoContext.Provider value={{ puestos, agregarPuesto, eliminarPuesto, editarPuesto }}>
      {children}
    </PuestoContext.Provider>
  );
};

export const usePuestos = () => useContext(PuestoContext);