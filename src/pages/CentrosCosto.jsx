import React, { useState } from 'react';
import { useCentrosCosto } from '../data/CentroCostoContext';
import { toast } from 'react-hot-toast';

function CentrosCosto() {
  const { centrosCosto, agregarCentroCosto, eliminarCentroCosto, editarCentroCosto } = useCentrosCosto();
  const [nuevo, setNuevo] = useState({ nombre: '' });

  const [editando, setEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');

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
    } catch (error) {
      toast.error('Error al agregar centro de costo');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este centro de costo?')) {
      eliminarCentroCosto(id);
      toast.success('Centro de costo eliminado correctamente');
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Centros de Costo</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input type="text" name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre del centro de costo" required className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
      </form>

      <div className="grid gap-2">
        {centrosCosto.map((c) => (
          <div key={c.id} className="border p-2 rounded flex justify-between items-center">
            <div>{c.nombre}</div>
            <div className="flex gap-2">
              <button onClick={() => abrirEditar(c)} className="text-blue-500 hover:text-blue-700">Editar</button>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

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

export default CentrosCosto;