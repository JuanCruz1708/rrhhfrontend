import React, { useState } from 'react';
import { usePuestos } from '../data/PuestoContext';
import { toast } from 'react-hot-toast';

function Puestos() {
  const { puestos, agregarPuesto, eliminarPuesto, editarPuesto } = usePuestos();

  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    jefe_id: '',
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ ...nuevo });
  const [busquedaTexto, setBusquedaTexto] = useState('');

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre) {
      toast.error('El nombre del puesto es obligatorio');
      return;
    }
    const puestoData = {
      ...nuevo,
      jefe_id: nuevo.jefe_id === '' ? null : parseInt(nuevo.jefe_id),
    };
    try {
      await agregarPuesto(puestoData);
      toast.success('Puesto agregado correctamente');
      setNuevo({ nombre: '', descripcion: '', jefe_id: '' });
      setMostrarFormulario(false);
    } catch {
      toast.error('Error al agregar puesto');
    }
  };

  const abrirEditar = (puesto) => {
    setEditando(puesto.id);
    setEditData({
      nombre: puesto.nombre,
      descripcion: puesto.descripcion || '',
      jefe_id: puesto.jefe_id || '',
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.nombre) {
      toast.error('El nombre del puesto es obligatorio');
      return;
    }
    const datosEditados = {
      ...editData,
      jefe_id: editData.jefe_id === '' ? null : parseInt(editData.jefe_id),
    };
    const result = await editarPuesto(editando, datosEditados);
    if (result.success) {
      toast.success('Puesto editado correctamente');
      setEditando(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este puesto?')) {
      eliminarPuesto(id);
      toast.success('Puesto eliminado correctamente');
    }
  };

  const puestosFiltrados = puestos.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(busquedaTexto.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Puestos</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mostrarFormulario ? 'Cancelar' : 'Agregar puesto'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
          <input
            type="text"
            name="nombre"
            value={nuevo.nombre}
            onChange={handleChange}
            placeholder="Nombre del puesto"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="descripcion"
            value={nuevo.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="border p-2 rounded"
          />
          <select
            name="jefe_id"
            value={nuevo.jefe_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Selecciona Puesto Superior (opcional)</option>
            {puestos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-1 md:col-span-3"
          >
            Confirmar Alta
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded shadow-sm">
        <input
          type="text"
          placeholder="Buscar puesto..."
          value={busquedaTexto}
          onChange={(e) => setBusquedaTexto(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              {['Nombre', 'Descripción', 'Puesto Superior', 'Acciones'].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {puestosFiltrados.map((p) => {
              const jefe = puestos.find((j) => j.id === p.jefe_id);
              return (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="p-2 text-sm">{p.nombre}</td>
                  <td className="p-2 text-sm">{p.descripcion}</td>
                  <td className="p-2 text-sm">{jefe ? jefe.nombre : '-'}</td>
                  <td className="p-2 text-sm">
                    <button onClick={() => abrirEditar(p)} className="text-blue-500 hover:underline mr-2">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Eliminar</button>
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
            <h2 className="text-lg font-bold mb-4">Editar Puesto</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input
                type="text"
                name="nombre"
                value={editData.nombre}
                onChange={handleEditChange}
                placeholder="Nombre del puesto"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="descripcion"
                value={editData.descripcion}
                onChange={handleEditChange}
                placeholder="Descripción"
                className="w-full border p-2 rounded"
              />
              <select
                name="jefe_id"
                value={editData.jefe_id}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecciona Puesto Superior (opcional)</option>
                {puestos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Puestos;