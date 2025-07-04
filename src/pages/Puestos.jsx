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

  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({
    nombre: '',
    descripcion: '',
    jefe_id: '',
  });

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre) {
      toast.error('El nombre del puesto es obligatorio');
      return;
    }

    const puestoData = {
      ...nuevo,
      jefe_id: nuevo.jefe_id === '' ? null : parseInt(nuevo.jefe_id)
    };

    try {
      await agregarPuesto(puestoData);
      toast.success('Puesto agregado correctamente');
      setNuevo({ nombre: '', descripcion: '', jefe_id: '' });
    } catch (error) {
      toast.error('Error al agregar puesto');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este puesto?')) {
      eliminarPuesto(id);
      toast.success('Puesto eliminado correctamente');
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Puestos</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre del puesto" required className="border p-2 rounded" />
        <input type="text" name="descripcion" value={nuevo.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" />
        <select name="jefe_id" value={nuevo.jefe_id} onChange={handleChange} className="border p-2 rounded">
          <option value="">Selecciona Jefe (opcional)</option>
          {puestos.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 md:col-span-1">Agregar Puesto</button>
      </form>

      <div className="grid gap-2">
        {puestos.map((p) => (
          <div key={p.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              {p.nombre} {p.descripcion && `- ${p.descripcion}`} {p.jefe_id && `(Jefe ID: ${p.jefe_id})`}
            </div>
            <div className="flex gap-2">
              <button onClick={() => abrirEditar(p)} className="text-blue-500 hover:text-blue-700">Editar</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Puesto</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input type="text" name="nombre" value={editData.nombre} onChange={handleEditChange} placeholder="Nombre del puesto" required className="w-full border p-2 rounded" />
              <input type="text" name="descripcion" value={editData.descripcion} onChange={handleEditChange} placeholder="Descripción" className="w-full border p-2 rounded" />
              <select name="jefe_id" value={editData.jefe_id} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Jefe (opcional)</option>
                {puestos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
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

export default Puestos;