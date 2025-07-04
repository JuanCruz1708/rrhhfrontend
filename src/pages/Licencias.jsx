import React, { useState } from 'react';
import { useLicencias } from '../data/LicenciaContext';
import { useEmpleados } from '../data/EmpleadoContext';
import { toast } from 'react-hot-toast';

function Licencias() {
  const { licencias, agregarLicencia, eliminarLicencia, editarLicencia } = useLicencias();
  const { empleados } = useEmpleados();

  const [nueva, setNueva] = useState({
    empleado_id: '',
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    observaciones: '',
  });

  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ ...nueva });

  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEmpleado, setFiltroEmpleado] = useState('');

  const handleChange = (e) => {
    setNueva({ ...nueva, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nueva.empleado_id || !nueva.tipo || !nueva.fecha_inicio || !nueva.fecha_fin) {
      toast.error('Completa todos los campos requeridos');
      return;
    }
    if (new Date(nueva.fecha_inicio) > new Date(nueva.fecha_fin)) {
      toast.error('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }
    try {
      await agregarLicencia(nueva);
      toast.success('Licencia agregada correctamente');
      setNueva({ empleado_id: '', tipo: '', fecha_inicio: '', fecha_fin: '', observaciones: '' });
    } catch {
      toast.error('Error al agregar licencia');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta licencia?')) {
      eliminarLicencia(id);
      toast.success('Licencia eliminada correctamente');
    }
  };

  const abrirEditar = (licencia) => {
    setEditando(licencia.id);
    setEditData({
      empleado_id: licencia.empleado_id,
      tipo: licencia.tipo,
      fecha_inicio: licencia.fecha_inicio,
      fecha_fin: licencia.fecha_fin,
      observaciones: licencia.observaciones || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.empleado_id || !editData.tipo || !editData.fecha_inicio || !editData.fecha_fin) {
      toast.error('Completa todos los campos requeridos');
      return;
    }
    if (new Date(editData.fecha_inicio) > new Date(editData.fecha_fin)) {
      toast.error('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }
    const datosEditados = {
      ...editData,
      empleado_id: parseInt(editData.empleado_id),
    };
    const result = await editarLicencia(editando, datosEditados);
    if (result.success) {
      toast.success('Licencia editada correctamente');
      setEditando(null);
    } else {
      toast.error(result.error);
    }
  };

  const licenciasFiltradas = licencias.filter((l) => {
    const empleado = empleados.find((e) => e.id === l.empleado_id);
    const coincideTipo = filtroTipo === '' || l.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
    const coincideEmpleado =
      filtroEmpleado === '' ||
      (empleado && (`${empleado.apellido} ${empleado.nombre}`).toLowerCase().includes(filtroEmpleado.toLowerCase()));
    return coincideTipo && coincideEmpleado;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Licencias</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
        <select name="empleado_id" value={nueva.empleado_id} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Selecciona Empleado</option>
          {empleados.map((e) => (
            <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>
          ))}
        </select>
        <input type="text" name="tipo" value={nueva.tipo} onChange={handleChange} placeholder="Tipo de licencia" required className="border p-2 rounded" />
        <div className="flex flex-col">
          <label htmlFor="fecha_inicio" className="text-sm font-medium">Fecha desde:</label>
          <input type="date" name="fecha_inicio" id="fecha_inicio" value={nueva.fecha_inicio} onChange={handleChange} required className="border p-2 rounded" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fecha_fin" className="text-sm font-medium">Fecha hasta:</label>
          <input type="date" name="fecha_fin" id="fecha_fin" value={nueva.fecha_fin} onChange={handleChange} required className="border p-2 rounded" />
        </div>
        <input type="text" name="observaciones" value={nueva.observaciones} onChange={handleChange} placeholder="Observaciones" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
            Agregar Licencia
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          placeholder="Filtrar por tipo de licencia"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={filtroEmpleado}
          onChange={(e) => setFiltroEmpleado(e.target.value)}
          placeholder="Buscar por empleado"
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Empleado</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Fecha desde</th>
              <th className="p-2 border">Fecha hasta</th>
              <th className="p-2 border">Observaciones</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {licenciasFiltradas.map((l) => {
              const empleado = empleados.find((e) => e.id === l.empleado_id);
              return (
                <tr key={l.id} className="border-t">
                  <td className="p-2 border">{empleado ? `${empleado.apellido}, ${empleado.nombre}` : 'No encontrado'}</td>
                  <td className="p-2 border">{l.tipo}</td>
                  <td className="p-2 border">{l.fecha_inicio}</td>
                  <td className="p-2 border">{l.fecha_fin}</td>
                  <td className="p-2 border">{l.observaciones}</td>
                  <td className="p-2 border">
                    <button onClick={() => abrirEditar(l)} className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                    <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Licencia</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <select name="empleado_id" value={editData.empleado_id} onChange={handleEditChange} required className="w-full border p-2 rounded">
                <option value="">Selecciona Empleado</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>
                ))}
              </select>
              <input type="text" name="tipo" value={editData.tipo} onChange={handleEditChange} placeholder="Tipo de licencia" required className="w-full border p-2 rounded" />
              <input type="date" name="fecha_inicio" value={editData.fecha_inicio} onChange={handleEditChange} required className="w-full border p-2 rounded" />
              <input type="date" name="fecha_fin" value={editData.fecha_fin} onChange={handleEditChange} required className="w-full border p-2 rounded" />
              <input type="text" name="observaciones" value={editData.observaciones} onChange={handleEditChange} placeholder="Observaciones" className="w-full border p-2 rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditando(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Licencias;