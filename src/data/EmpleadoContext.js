import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axiosConfig';

const EmpleadoContext = createContext();

export const EmpleadoProvider = ({ children }) => {
  const [empleados, setEmpleados] = useState([]);

  const obtenerEmpleados = async () => {
    try {
      const response = await api.get('/empleados/');
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al obtener empleados", error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const agregarEmpleado = async (nuevo) => {
    try {
      await api.post('/empleados/', nuevo);
      await obtenerEmpleados();
    } catch (error) {
      console.error("Error al agregar empleado", error);
    }
  };

  const editarEmpleado = async (id, datosActualizados) => {
    try {
      await api.put(`/empleados/${id}`, datosActualizados);
      await obtenerEmpleados();
      return { success: true };
    } catch (error) {
      console.error("Error al editar empleado", error.response?.data || error);
      return { success: false, error: error.response?.data?.detail || "Error al editar empleado" };
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await api.delete(`/empleados/${id}`);
      await obtenerEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado", error);
    }
  };

  return (
    <EmpleadoContext.Provider value={{ empleados, agregarEmpleado, eliminarEmpleado, editarEmpleado }}>
      {children}
    </EmpleadoContext.Provider>
  );
};

export const useEmpleados = () => useContext(EmpleadoContext);