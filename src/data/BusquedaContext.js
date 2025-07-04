import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const BusquedaContext = createContext();

export const BusquedaProvider = ({ children }) => {
  const [busquedas, setBusquedas] = useState([]);

  const obtenerBusquedas = async () => {
    try {
      const response = await api.get('/busquedas/');
      setBusquedas(response.data);
    } catch (error) {
      console.error("Error al obtener búsquedas", error);
    }
  };

  useEffect(() => {
    obtenerBusquedas();
  }, []);

  const agregarBusqueda = async (nueva) => {
    try {
      await api.post('/busquedas/', nueva);
      await obtenerBusquedas();
    } catch (error) {
      console.error("Error al agregar búsqueda", error);
    }
  };

  const editarBusqueda = async (id, datosActualizados) => {
      try {
          await api.put(`/busquedas/${id}`, datosActualizados);
          await obtenerBusquedas();
          return { success: true };
      } catch (error) {
          console.error("Error al editar búsqueda", error.response?.data || error);
          return { success: false, error: error.response?.data?.detail || "Error al editar búsqueda" };
      }
  };

  const eliminarBusqueda = async (id) => {
    try {
      await api.delete(`/busquedas/${id}`);
      await obtenerBusquedas();
    } catch (error) {
      console.error("Error al eliminar búsqueda", error);
    }
  };

  return (
    <BusquedaContext.Provider value={{ busquedas, agregarBusqueda, eliminarBusqueda, editarBusqueda }}>
      {children}
    </BusquedaContext.Provider>
  );
};

export const useBusquedas = () => useContext(BusquedaContext);
