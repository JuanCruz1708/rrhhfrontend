import React, { useState, useEffect } from 'react';
import { useBusquedas } from '../data/BusquedaContext';
import api from '../axiosConfig';
import { toast } from 'react-hot-toast';

function Busquedas() {
  const { busquedas, agregarBusqueda, eliminarBusqueda, editarBusqueda } = useBusquedas();
  const [puestos, setPuestos] = useState([]);
  const [centrosCosto, setCentrosCosto] = useState([]);

  const [nueva, setNueva] = useState({
    nombre: '',
    puesto: '',
    descripcion: '',
    fecha_apertura: '',
    fecha_inicio: '',
    estado: '',
    responsable: '',
    centro_costo: '',
  });

  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ ...nueva });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resPuestos = await api.get('/puestos/');
        const resCentros = await api.get('/centros_costo/');
        setPuestos(resPuestos.data);
        setCentrosCosto(resCentros.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setNueva({ ...nueva, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nueva.nombre || !nueva.puesto || !nueva.fecha_apertura || !nueva.fecha_inicio) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    if (new Date(nueva.fecha_apertura) > new Date(nueva.fecha_inicio)) {
      toast.error('La fecha de inicio de búsqueda no puede ser posterior a la fecha estimativa de incorporación');
      return;
    }
    try {
      await agregarBusqueda(nueva);
      toast.success('Búsqueda agregada correctamente');
      setNueva({
        nombre: '',
        puesto: '',
        descripcion: '',
        fecha_apertura: '',
        fecha_inicio: '',
        estado: '',
        responsable: '',
        centro_costo: '',
      });
    } catch {
      toast.error('Error al agregar búsqueda');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta búsqueda?')) {
      eliminarBusqueda(id);
      toast.success('Búsqueda eliminada correctamente');
    }
  };

  const abrirEditar = (busqueda) => {
    setEditando(busqueda.id);
    setEditData({
      nombre: busqueda.nombre,
      puesto: busqueda.puesto,
      descripcion: busqueda.descripcion || '',
      fecha_apertura: busqueda.fecha_apertura,
      fecha_inicio: busqueda.fecha_inicio,
      estado: busqueda.estado || '',
      responsable: busqueda.responsable || '',
      centro_costo: busqueda.centro_costo || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.nombre || !editData.puesto || !editData.fecha_apertura || !editData.fecha_inicio) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    if (new Date(editData.fecha_apertura) > new Date(editData.fecha_inicio)) {
      toast.error('La fecha de inicio de búsqueda no puede ser posterior a la fecha estimativa de incorporación');
      return;
    }
    const result = await editarBusqueda(editando, editData);
    if (result.success) {
      toast.success('Búsqueda editada correctamente');
      setEditando(null);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Búsquedas</h2>

      {/* Formulario ordenado */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="nombre" value={nueva.nombre} onChange={handleChange} placeholder="Nombre de la búsqueda" required className="border p-2 rounded" />
        
        {/* Puesto */}
        <select name="puesto" value={nueva.puesto} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Selecciona Puesto</option>
          {puestos.map((p) => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>

        <input type="text" name="descripcion" value={nueva.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" />
        
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Fecha de inicio de búsqueda</label>
          <input type="date" name="fecha_apertura" value={nueva.fecha_apertura} onChange={handleChange} required className="border p-2 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Fecha estimativa de incorporación</label>
          <input type="date" name="fecha_inicio" value={nueva.fecha_inicio} onChange={handleChange} required className="border p-2 rounded" />
        </div>

        {/* Estado */}
        <select name="estado" value={nueva.estado} onChange={handleChange} className="border p-2 rounded">
          <option value="">Selecciona Estado</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <input type="text" name="responsable" value={nueva.responsable} onChange={handleChange} placeholder="Responsable" className="border p-2 rounded" />
        
        {/* Centro de Costo */}
        <select name="centro_costo" value={nueva.centro_costo} onChange={handleChange} className="border p-2 rounded">
          <option value="">Selecciona Centro de Costo</option>
          {centrosCosto.map((c) => (
            <option key={c.id} value={c.nombre}>{c.nombre}</option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 md:col-span-1">Agregar Búsqueda</button>
      </form>

      {/* Listado */}
      <div className="grid gap-2">
        {busquedas.map((b) => (
          <div key={b.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              {b.nombre} - {b.puesto} (Inicio: {b.fecha_apertura} | Incorporación: {b.fecha_inicio})
            </div>
            <div className="flex gap-2">
              <button onClick={() => abrirEditar(b)} className="text-blue-500 hover:text-blue-700">Editar</button>
              <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Búsqueda</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input type="text" name="nombre" value={editData.nombre} onChange={handleEditChange} placeholder="Nombre de la búsqueda" required className="w-full border p-2 rounded" />
              
              {/* Puesto */}
              <select name="puesto" value={editData.puesto} onChange={handleEditChange} required className="w-full border p-2 rounded">
                <option value="">Selecciona Puesto</option>
                {puestos.map((p) => (
                  <option key={p.id} value={p.nombre}>{p.nombre}</option>
                ))}
              </select>

              <input type="text" name="descripcion" value={editData.descripcion} onChange={handleEditChange} placeholder="Descripción" className="w-full border p-2 rounded" />
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Fecha de inicio de búsqueda</label>
                <input type="date" name="fecha_apertura" value={editData.fecha_apertura} onChange={handleEditChange} required className="w-full border p-2 rounded" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Fecha estimativa de incorporación</label>
                <input type="date" name="fecha_inicio" value={editData.fecha_inicio} onChange={handleEditChange} required className="w-full border p-2 rounded" />
              </div>

              {/* Estado */}
              <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>

              <input type="text" name="responsable" value={editData.responsable} onChange={handleEditChange} placeholder="Responsable" className="w-full border p-2 rounded" />

              {/* Centro de Costo */}
              <select name="centro_costo" value={editData.centro_costo} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Centro de Costo</option>
                {centrosCosto.map((c) => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>

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

export default Busquedas;