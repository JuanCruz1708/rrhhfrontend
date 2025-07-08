import React, { useState } from 'react';
import { useCentrosCosto } from '../data/CentroCostoContext';
import { toast } from 'react-hot-toast';

function CentrosCosto() {
  const { centrosCosto, agregarCentroCosto, eliminarCentroCosto, editarCentroCosto } = useCentrosCosto();

  const [nuevo, setNuevo] = useState({ nombre: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [busquedaTexto, setBusquedaTexto] = useState('');

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre) {
      toast.error('El nombre del centro de costo es obligatorio');
      return;
    }
    try {
      await agregarCentroCosto(nuevo);
      toast.success('Centro de costo agregado correctamente');
      setNuevo({ nombre: '' });
      setMostrarFormulario(false);
    } catch {
      toast.error('Error al agregar centro de costo');
    }
  };

  const abrirEditar = (centro) => {
    setEditando(centro.id);
    setEditNombre(centro.nombre);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editNombre) {
      toast.error('El nombre del centro de costo es obligatorio');
      return;
    }
    const result = await editarCentroCosto(editando, { nombre: editNombre });
    if (result.success) {
      toast.success('Centro de costo editado correctamente');
      setEditando(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este centro de costo?')) {
      eliminarCentroCosto(id);
      toast.success('Centro de costo eliminado correctamente');
    }
  };

  const centrosFiltrados = centrosCosto.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaTexto.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Centros de Costo</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mostrarFormulario ? 'Cancelar' : 'Agregar Centro de Costo'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
          <input
            type="text"
            name="nombre"
            value={nuevo.nombre}
            onChange={handleChange}
            placeholder="Nombre del centro de costo"
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 md:col-span-2"
          >
            Confirmar Alta
          </button>
        </form>
      )}

      {/* Filtro de búsqueda */}
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded shadow-sm">
        <input
          type="text"
          placeholder="Buscar centro de costo..."
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
              {['Nombre', 'Acciones'].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {centrosFiltrados.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50">
                <td className="p-2 text-sm">{c.nombre}</td>
                <td className="p-2 text-sm">
                  <button onClick={() => abrirEditar(c)} className="text-blue-500 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">Eliminar</button>
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
            <h2 className="text-lg font-bold mb-4">Editar Centro de Costo</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                placeholder="Nombre del centro de costo"
                required
                className="w-full border p-2 rounded"
              />
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

export default CentrosCosto;