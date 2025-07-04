import React, { useState, useEffect } from 'react';
import { useEmpleados } from '../data/EmpleadoContext';
import api from '../axiosConfig';
import { toast } from 'react-hot-toast';

function Empleados() {
  const { empleados, agregarEmpleado, eliminarEmpleado, editarEmpleado } = useEmpleados();
  const [nuevo, setNuevo] = useState({
    legajo: '', apellido: '', nombre: '', dni: '', genero: '', telefono: '',
    email: '', direccion: '', puesto_id: '', centro_costo_id: '', estado: '',
  });
  const [puestos, setPuestos] = useState([]);
  const [centrosCosto, setCentrosCosto] = useState([]);
  const [filtroCentro, setFiltroCentro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ ...nuevo });

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
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.legajo || !nuevo.apellido || !nuevo.nombre || !nuevo.dni || !nuevo.genero || !nuevo.estado) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    try {
      await agregarEmpleado(nuevo);
      toast.success('Empleado agregado correctamente');
      setNuevo({
        legajo: '', apellido: '', nombre: '', dni: '', genero: '', telefono: '',
        email: '', direccion: '', puesto_id: '', centro_costo_id: '', estado: '',
      });
      setMostrarFormulario(false);
    } catch {
      toast.error('Error al agregar empleado');
    }
  };

  const abrirEditar = (empleado) => {
    setEditando(empleado.id);
    setEditData({
      legajo: empleado.legajo,
      apellido: empleado.apellido,
      nombre: empleado.nombre,
      dni: empleado.dni,
      genero: empleado.genero || '',
      telefono: empleado.telefono || '',
      email: empleado.email || '',
      direccion: empleado.direccion || '',
      puesto_id: empleado.puesto_id || '',
      centro_costo_id: empleado.centro_costo_id || '',
      estado: empleado.estado,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const datosEditados = {
      ...editData,
      puesto_id: editData.puesto_id === '' ? null : parseInt(editData.puesto_id),
      centro_costo_id: editData.centro_costo_id === '' ? null : parseInt(editData.centro_costo_id),
    };
    const result = await editarEmpleado(editando, datosEditados);
    if (result.success) {
      toast.success('Empleado editado correctamente');
      setEditando(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
      eliminarEmpleado(id);
      toast.success('Empleado eliminado correctamente');
    }
  };

  const empleadosFiltrados = empleados.filter((e) =>
    (filtroCentro === '' || e.centro_costo_id == filtroCentro) &&
    (filtroEstado === '' || e.estado === filtroEstado) &&
    (e.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      e.apellido.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      e.legajo.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      e.dni.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      (e.email && e.email.toLowerCase().includes(busquedaTexto.toLowerCase())) ||
      (e.telefono && e.telefono.toLowerCase().includes(busquedaTexto.toLowerCase()))
    )
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Empleados</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mostrarFormulario ? 'Cancelar' : 'Agregar empleado'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
          {['legajo', 'apellido', 'nombre', 'dni', 'telefono', 'email', 'direccion'].map((field) => (
            <input key={field} type={field === 'email' ? 'email' : 'text'} name={field} value={nuevo[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="border p-2 rounded" />
          ))}
          <select name="genero" value={nuevo.genero} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Género</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
          <select name="puesto_id" value={nuevo.puesto_id} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Puesto</option>
            {puestos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <select name="centro_costo_id" value={nuevo.centro_costo_id} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Centro de Costo</option>
            {centrosCosto.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <select name="estado" value={nuevo.estado} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-1 md:col-span-3">Confirmar Alta</button>
        </form>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded shadow-sm">
        <select value={filtroCentro} onChange={(e) => setFiltroCentro(e.target.value)} className="border p-2 rounded">
          <option value="">Filtrar por Centro de Costo</option>
          {centrosCosto.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="border p-2 rounded">
          <option value="">Filtrar por Estado</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <input
          type="text"
          placeholder="Buscar empleado..."
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
              {['Legajo', 'Apellido', 'Nombre', 'DNI', 'Género', 'Teléfono', 'Email', 'Dirección', 'Puesto', 'Centro de Costo', 'Estado', 'Acciones'].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map((e) => (
              <tr key={e.id} className="hover:bg-blue-50">
                <td className="p-2 text-sm">{e.legajo}</td>
                <td className="p-2 text-sm">{e.apellido}</td>
                <td className="p-2 text-sm">{e.nombre}</td>
                <td className="p-2 text-sm">{e.dni}</td>
                <td className="p-2 text-sm">{e.genero}</td>
                <td className="p-2 text-sm">{e.telefono}</td>
                <td className="p-2 text-sm">{e.email}</td>
                <td className="p-2 text-sm">{e.direccion}</td>
                <td className="p-2 text-sm">{e.puesto?.nombre || ''}</td>
                <td className="p-2 text-sm">{e.centro_costo?.nombre || ''}</td>
                <td className="p-2 text-sm">{e.estado}</td>
                <td className="p-2 text-sm">
                  <button onClick={() => abrirEditar(e)} className="text-blue-500 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:underline">Eliminar</button>
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
            <h2 className="text-lg font-bold mb-4">Editar Empleado</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              {['legajo', 'apellido', 'nombre', 'dni', 'telefono', 'email', 'direccion'].map((field) => (
                <input key={field} type={field === 'email' ? 'email' : 'text'} name={field} value={editData[field]} onChange={handleEditChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="w-full border p-2 rounded" />
              ))}
              <select name="genero" value={editData.genero} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Género</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
              <select name="puesto_id" value={editData.puesto_id} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Puesto</option>
                {puestos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <select name="centro_costo_id" value={editData.centro_costo_id} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Centro de Costo</option>
                {centrosCosto.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
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

export default Empleados;