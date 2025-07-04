import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const LicenciaContext = createContext();

export const LicenciaProvider = ({ children }) => {
  const [licencias, setLicencias] = useState([]);

  const obtenerLicencias = async () => {
    try {
      const response = await api.get('/licencias/');
      setLicencias(response.data);
    } catch (error) {
      console.error("Error al obtener licencias", error);
    }
  };

  useEffect(() => {
    obtenerLicencias();
  }, []);

  const agregarLicencia = async (nueva) => {
    try {
      await api.post('/licencias/', nueva);
      await obtenerLicencias();
    } catch (error) {
      console.error("Error al agregar licencia", error);
    }
  };

  const editarLicencia = async (id, datosActualizados) => {
      try {
          await api.put(`/licencias/${id}`, datosActualizados);
          await obtenerLicencias();
          return { success: true };
      } catch (error) {
          console.error("Error al editar licencia", error.response?.data || error);
          return { success: false, error: error.response?.data?.detail || "Error al editar licencia" };
      }
  };

  const eliminarLicencia = async (id) => {
    try {
      await api.delete(`/licencias/${id}`);
      await obtenerLicencias();
    } catch (error) {
      console.error("Error al eliminar licencia", error);
    }
  };

  return (
    <LicenciaContext.Provider value={{ licencias, agregarLicencia, eliminarLicencia, editarLicencia }}>
      {children}
    </LicenciaContext.Provider>
  );
};

export const useLicencias = () => useContext(LicenciaContext);
