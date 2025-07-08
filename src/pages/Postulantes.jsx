import React, { useState } from 'react';
import { usePostulantes } from '../data/PostulanteContext';
import { useBusquedas } from '../data/BusquedaContext';
import { toast } from 'react-hot-toast';

function Postulantes() {
  const { postulantes, agregarPostulante, eliminarPostulante, editarPostulante } = usePostulantes();
  const { busquedas } = useBusquedas();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [editando, setEditando] = useState(null);

  const [nuevo, setNuevo] = useState({
    nombre: '', email: '', telefono: '', direccion: '',
    estado: '', notas: '', busqueda: '', cv: ''
  });

  const [editData, setEditData] = useState({ ...nuevo });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setNuevo({ ...nuevo, cv: files[0] });
    } else {
      setNuevo({ ...nuevo, [name]: value });
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
      await agregarPostulante(formData);
      toast.success('Postulante agregado correctamente');
      setNuevo({ nombre: '', email: '', telefono: '', direccion: '', estado: '', notas: '', busqueda: '', cv: '' });
      setMostrarFormulario(false);
    } catch {
      toast.error('Error al agregar postulante');
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

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setEditData({ ...editData, cv: files[0] });
    } else {
      setEditData({ ...editData, [name]: value });
    }
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

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este postulante?')) {
      eliminarPostulante(id);
      toast.success('Postulante eliminado correctamente');
    }
  };

  const postulantesFiltrados = postulantes.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(busquedaTexto.toLowerCase())) ||
    (p.busqueda && p.busqueda.toLowerCase().includes(busquedaTexto.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Postulantes</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mostrarFormulario ? 'Cancelar' : 'Agregar Postulante'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
          {['nombre', 'email', 'telefono', 'direccion', 'notas'].map((field) => (
            <input key={field} type={field === 'email' ? 'email' : 'text'} name={field} value={nuevo[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="border p-2 rounded" />
          ))}
          <select name="estado" value={nuevo.estado} onChange={handleChange} className="border p-2 rounded">
            <option value="">Selecciona Estado</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Entrevistado">Entrevistado</option>
            <option value="Seleccionado">Seleccionado</option>
            <option value="Descartado">Descartado</option>
          </select>
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
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 md:col-span-3">Confirmar Alta</button>
        </form>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded shadow-sm">
        <input
          type="text"
          placeholder="Buscar postulante..."
          value={busquedaTexto}
          onChange={(e) => setBusquedaTexto(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded shadow mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              {['Nombre', 'Email', 'Teléfono', 'Búsqueda', 'Estado', 'CV', 'Acciones'].map((header) => (
                <th key={header} className="p-2 text-left text-sm font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {postulantesFiltrados.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50">
                <td className="p-2 text-sm">{p.nombre}</td>
                <td className="p-2 text-sm">{p.email}</td>
                <td className="p-2 text-sm">{p.telefono}</td>
                <td className="p-2 text-sm">{p.busqueda}</td>
                <td className="p-2 text-sm">{p.estado}</td>
                <td className="p-2 text-sm">
                  {p.cv ? (
                    <a
                      href={`${process.env.REACT_APP_BACKEND_URL}/${p.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver CV
                    </a>
                  ) : '–'}
                </td>
                <td className="p-2 text-sm">
                  <button onClick={() => abrirEditar(p)} className="text-blue-500 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Eliminar</button>
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
            <h2 className="text-lg font-bold mb-4">Editar Postulante</h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              {['nombre', 'email', 'telefono', 'direccion', 'notas'].map((field) => (
                <input key={field} type={field === 'email' ? 'email' : 'text'} name={field} value={editData[field]} onChange={handleEditChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="w-full border p-2 rounded" />
              ))}
              <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border p-2 rounded">
                <option value="">Selecciona Estado</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Entrevistado">Entrevistado</option>
                <option value="Seleccionado">Seleccionado</option>
                <option value="Descartado">Descartado</option>
              </select>
              <select name="busqueda" value={editData.busqueda} onChange={handleEditChange} required className="w-full border p-2 rounded">
                <option value="">Selecciona Búsqueda</option>
                {busquedas.map((b) => (
                  <option key={b.id} value={b.nombre}>{b.nombre}</option>
                ))}
              </select>
              <label className="w-full border p-2 rounded text-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                <span className="text-sm text-gray-700">{editData.cv ? editData.cv.name : "Subir CV (PDF)"}</span>
                <input type="file" name="cv" accept="application/pdf" onChange={handleEditChange} className="hidden" />
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