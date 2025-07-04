import React, { useState } from 'react';
import { usePostulantes } from '../data/PostulanteContext';
import { useBusquedas } from '../data/BusquedaContext';
import { toast } from 'react-hot-toast';

function Postulantes() {
  const { postulantes, agregarPostulante, eliminarPostulante, editarPostulante } = usePostulantes();
  const { busquedas } = useBusquedas();

  const [nuevo, setNuevo] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    estado: '',
    notas: '',
    busqueda: '',
    cv: ''
  });

  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ ...nuevo });

  const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === 'cv') {
          if (files.length > 0) {
              setNuevo({ ...nuevo, cv: files[0] });
          }
      } else {
          setNuevo({ ...nuevo, [name]: value });
      }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setEditData({ ...editData, cv: files[0] });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.email || !nuevo.busqueda) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(nuevo).forEach(key => {
        formData.append(key, nuevo[key]);
      });
      await agregarPostulante(nuevo);
      toast.success('Postulante agregado correctamente');
      setNuevo({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        estado: '',
        notas: '',
        busqueda: '',
        cv: ''
      });
    } catch {
      toast.error('Error al agregar postulante');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este postulante?')) {
      eliminarPostulante(id);
      toast.success('Postulante eliminado correctamente');
    }
  };

  const abrirEditar = (p) => {
    setEditando(p.id);
    setEditData({
      nombre: p.nombre,
      email: p.email,
      telefono: p.telefono || '',
      direccion: p.direccion || '',
      estado: p.estado || '',
      notas: p.notas || '',
      busqueda: p.busqueda,
      cv: p.cv || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.nombre || !editData.email || !editData.busqueda) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    const formData = new FormData();
    Object.keys(editData).forEach(key => {
      formData.append(key, editData[key]);
    });
    const result = await editarPostulante(editando, formData);
    if (result.success) {
      toast.success('Postulante editado correctamente');
      setEditando(null);
    } else {
      toast.error(result.error);
    }
  };

  const postulantesOrdenados = [...postulantes].sort((a, b) => {
    const aVal = a.busqueda || "";
    const bVal = b.busqueda || "";
    return aVal.localeCompare(bVal);
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Postulantes</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre" required className="border p-2 rounded" />
        <input type="email" name="email" value={nuevo.email} onChange={handleChange} placeholder="Email" required className="border p-2 rounded" />
        <input type="text" name="telefono" value={nuevo.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded" />
        <input type="text" name="direccion" value={nuevo.direccion} onChange={handleChange} placeholder="Dirección" className="border p-2 rounded" />
        <select name="estado" value={nuevo.estado} onChange={handleChange} className="border p-2 rounded">
          <option value="">Selecciona Estado</option>
          <option value="En Revisión">En Revisión</option>
          <option value="Entrevistado">Entrevistado</option>
          <option value="Seleccionado">Seleccionado</option>
          <option value="Descartado">Descartado</option>
        </select>
        <input type="text" name="notas" value={nuevo.notas} onChange={handleChange} placeholder="Notas" className="border p-2 rounded" />
        <select name="busqueda" value={nuevo.busqueda} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Selecciona Búsqueda</option>
          {busquedas.map((b) => (
            <option key={b.id} value={b.nombre}>{b.nombre}</option>
          ))}
        </select>
        <label className="border p-2 rounded text-center cursor-pointer bg-gray-100 hover:bg-gray-200">
          <span className="text-sm text-gray-700">
              {nuevo.cv ? nuevo.cv.name : "Subir CV (PDF)"}
          </span>
          <input
            type="file"
            name="cv"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 md:col-span-1">Agregar Postulante</button>
      </form>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Búsqueda</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {postulantesOrdenados.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 whitespace-nowrap">{p.nombre}</td>
                <td className="px-4 py-2 whitespace-nowrap">{p.email}</td>
                <td className="px-4 py-2 whitespace-nowrap">{p.telefono || "-"}</td>
                <td className="px-4 py-2 whitespace-nowrap">{p.busqueda || "-"}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button onClick={() => abrirEditar(p)} className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Postulante</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input type="text" name="nombre" value={editData.nombre} onChange={handleEditChange} placeholder="Nombre" required className="w-full border p-2 rounded" />
              <input type="email" name="email" value={editData.email} onChange={handleEditChange} placeholder="Email" required className="w-full border p-2 rounded" />
              <input type="text" name="telefono" value={editData.telefono} onChange={handleEditChange} placeholder="Teléfono" className="w-full border p-2 rounded" />
              <input type="text" name="direccion" value={editData.direccion} onChange={handleEditChange} placeholder="Dirección" className="w-full border p-2 rounded" />
              <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Estado</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Entrevistado">Entrevistado</option>
                <option value="Seleccionado">Seleccionado</option>
                <option value="Descartado">Descartado</option>
              </select>
              <input type="text" name="notas" value={editData.notas} onChange={handleEditChange} placeholder="Notas" className="w-full border p-2 rounded" />
              <select name="busqueda" value={editData.busqueda} onChange={handleEditChange} required className="w-full border p-2 rounded">
                <option value="">Selecciona Búsqueda</option>
                {busquedas.map((b) => (
                  <option key={b.id} value={b.nombre}>{b.nombre}</option>
                ))}
              </select>
              <label className="w-full border p-2 rounded text-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                <span className="text-sm text-gray-700">    
                    {editData.cv ? editData.cv.name : "Subir CV (PDF)"}
                </span>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={handleEditChange}
                  className="hidden"
                />
              </label>
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

export default Postulantes;