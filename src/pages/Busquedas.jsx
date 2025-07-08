import React, { useState, useEffect } from 'react';
import { useBusquedas } from '../data/BusquedaContext';
import api from '../axiosConfig';
import { toast } from 'react-hot-toast';

function Busquedas() {
  const { busquedas, agregarBusqueda, eliminarBusqueda, editarBusqueda } = useBusquedas();
  const [puestos, setPuestos] = useState([]);
  const [centrosCosto, setCentrosCosto] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busquedaTexto, setBusquedaTexto] = useState('');

  const [nueva, setNueva] = useState({
    nombre: '', puesto: '', descripcion: '', fecha_apertura: '',
    fecha_inicio: '', estado: '', responsable: '', centro_costo: '',
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nueva.nombre || !nueva.puesto || !nueva.fecha_apertura || !nueva.fecha_inicio) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    if (new Date(nueva.fecha_apertura) > new Date(nueva.fecha_inicio)) {
      toast.error('La fecha de inicio no puede ser posterior a la fecha estimada de incorporación');
      return;
    }
    try {
      await agregarBusqueda(nueva);
      toast.success('Búsqueda agregada correctamente');
      setNueva({
        nombre: '', puesto: '', descripcion: '', fecha_apertura: '',
        fecha_inicio: '', estado: '', responsable: '', centro_costo: '',
      });
      setMostrarFormulario(false);
    } catch {
      toast.error('Error al agregar búsqueda');
    }
  };

  const abrirEditar = (b) => {
    setEditando(b.id);
    setEditData({
      nombre: b.nombre, puesto: b.puesto, descripcion: b.descripcion || '',
      fecha_apertura: b.fecha_apertura, fecha_inicio: b.fecha_inicio,
      estado: b.estado || '', responsable: b.responsable || '',
      centro_costo: b.centro_costo || '',
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.nombre || !editData.puesto || !editData.fecha_apertura || !editData.fecha_inicio) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    if (new Date(editData.fecha_apertura) > new Date(editData.fecha_inicio)) {
      toast.error('La fecha de inicio no puede ser posterior a la fecha estimada de incorporación');
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

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta búsqueda?')) {
      eliminarBusqueda(id);
      toast.success('Búsqueda eliminada correctamente');
    }
  };

  const busquedasFiltradas = busquedas.filter((b) =>
    b.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
    b.puesto.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
    (b.responsable && b.responsable.toLowerCase().includes(busquedaTexto.toLowerCase())) ||
    (b.centro_costo && b.centro_costo.toLowerCase().includes(busquedaTexto.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Búsquedas</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mostrarFormulario ? 'Cancelar' : 'Agregar Búsqueda'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
          <input type="text" name="nombre" value={nueva.nombre} onChange={handleChange} placeholder="Nombre de la búsqueda" required className="border p-2 rounded" />
          <select name="puesto" value={nueva.puesto} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Selecciona Puesto</option>
            {puestos.map((p) => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
          </select>
          <input type="text" name="descripcion" value={nueva.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" />
          <input type="date" name="fecha_apertura" value={nueva.fecha_apertura} onChange={handleChange} required className="border p-2 rounded" />
          <input type="date" name="fecha_inicio" value={nueva.fecha_inicio} onChange={handleChange} required className="border p-2 rounded" />
          <select name="estado" value={nueva.estado} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <input type="text" name="responsable" value={nueva.responsable} onChange={handleChange} placeholder="Responsable" className="border p-2 rounded" />
          <select name="centro_costo" value={nueva.centro_costo} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Centro de Costo</option>
            {centrosCosto.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 md:col-span-3">Confirmar Alta</button>
        </form>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded shadow-sm">
        <input
          type="text"
          placeholder="Buscar búsqueda..."
          value={busquedaTexto}
          onChange={(e) => setBusquedaTexto(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              {['Nombre', 'Puesto', 'Fecha Inicio', 'Fecha Incorporación', 'Estado', 'Responsable', 'Centro de Costo', 'Acciones'].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {busquedasFiltradas.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50">
                <td className="p-2 text-sm">{b.nombre}</td>
                <td className="p-2 text-sm">{b.puesto}</td>
                <td className="p-2 text-sm">{b.fecha_apertura}</td>
                <td className="p-2 text-sm">{b.fecha_inicio}</td>
                <td className="p-2 text-sm">{b.estado}</td>
                <td className="p-2 text-sm">{b.responsable}</td>
                <td className="p-2 text-sm">{b.centro_costo}</td>
                <td className="p-2 text-sm">
                  <button onClick={() => abrirEditar(b)} className="text-blue-500 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Búsqueda</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input type="text" name="nombre" value={editData.nombre} onChange={handleEditChange} placeholder="Nombre de la búsqueda" required className="w-full border p-2 rounded" />
              <select name="puesto" value={editData.puesto} onChange={handleEditChange} required className="w-full border p-2 rounded">
                <option value="">Selecciona Puesto</option>
                {puestos.map((p) => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
              </select>
              <input type="text" name="descripcion" value={editData.descripcion} onChange={handleEditChange} placeholder="Descripción" className="w-full border p-2 rounded" />
              <input type="date" name="fecha_apertura" value={editData.fecha_apertura} onChange={handleEditChange} required className="w-full border p-2 rounded" />
              <input type="date" name="fecha_inicio" value={editData.fecha_inicio} onChange={handleEditChange} required className="w-full border p-2 rounded" />
              <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <input type="text" name="responsable" value={editData.responsable} onChange={handleEditChange} placeholder="Responsable" className="w-full border p-2 rounded" />
              <select name="centro_costo" value={editData.centro_costo} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Centro de Costo</option>
                {centrosCosto.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
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