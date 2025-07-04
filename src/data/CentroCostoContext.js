import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const CentroCostoContext = createContext();

export const CentroCostoProvider = ({ children }) => {
  const [centrosCosto, setCentrosCosto] = useState([]);

  const obtenerCentros = async () => {
    try {
      const response = await api.get('/centros_costo/');
      setCentrosCosto(response.data);
    } catch (error) {
      console.error("Error al obtener centros de costo", error);
    }
  };

  useEffect(() => {
    obtenerCentros();
  }, []);

  const agregarCentroCosto = async (nuevo) => {
    try {
      await api.post('/centros_costo/', nuevo);
      await obtenerCentros();
    } catch (error) {
      console.error("Error al agregar centro de costo", error);
    }
  };

  const editarCentroCosto = async (id, datosActualizados) => {
      try {
          await api.put(`/centros_costo/${id}`, datosActualizados);
          await obtenerCentros();
          return { success: true };
      } catch (error) {
          console.error("Error al editar centro de costo", error.response?.data || error);
          return { success: false, error: error.response?.data?.detail || "Error al editar centro de costo" };
      }
  };

  const eliminarCentroCosto = async (id) => {
    try {
      await api.delete(`/centros_costo/${id}`);
      await obtenerCentros();
    } catch (error) {
      console.error("Error al eliminar centro de costo", error);
    }
  };

  return (
    <CentroCostoContext.Provider value={{ centrosCosto, agregarCentroCosto, eliminarCentroCosto, editarCentroCosto }}>
      {children}
    </CentroCostoContext.Provider>
  );
};

export const useCentrosCosto = () => useContext(CentroCostoContext);