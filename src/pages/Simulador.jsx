import React, { useState } from 'react';
import { situacionesSimuladas as simuladorPreload } from '../data/simuladorPreload';

function Simulador() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [situacionSeleccionada, setSituacionSeleccionada] = useState(null);

  const categorias = [...new Set(simuladorPreload.map((s) => s.categoria))];

  const situacionesFiltradas = simuladorPreload.filter(
    (s) => s.categoria === categoriaSeleccionada
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Simulador de Situaciones Laborales</h2>

      <select
        value={categoriaSeleccionada}
        onChange={(e) => {
          setCategoriaSeleccionada(e.target.value);
          setSituacionSeleccionada(null);
        }}
        className="border p-2 rounded mb-4"
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      {categoriaSeleccionada && (
        <select
          value={situacionSeleccionada?.situacion || ''}
          onChange={(e) => {
            const sit = situacionesFiltradas.find((s) => s.situacion === e.target.value);
            setSituacionSeleccionada(sit);
          }}
          className="border p-2 rounded mb-4 ml-2"
        >
          <option value="">Selecciona una situación</option>
          {situacionesFiltradas.map((s, idx) => (
            <option key={idx} value={s.situacion}>{s.situacion}</option>
          ))}
        </select>
      )}

      {situacionSeleccionada && (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          <h3 className="font-semibold mb-2">{situacionSeleccionada.situacion}</h3>
          <ul className="list-disc ml-5 space-y-1">
            {situacionSeleccionada.respuesta1 && <li>{situacionSeleccionada.respuesta1}</li>}
            {situacionSeleccionada.respuesta2 && <li>{situacionSeleccionada.respuesta2}</li>}
            {situacionSeleccionada.respuesta3 && <li>{situacionSeleccionada.respuesta3}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Simulador;
