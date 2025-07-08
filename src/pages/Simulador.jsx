import React, { useState } from 'react';
import { situacionesSimuladas as simuladorPreload } from '../data/simuladorPreload';
import jsPDF from 'jspdf';

function Simulador() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [situacionSeleccionada, setSituacionSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const categorias = [...new Set(simuladorPreload.map((s) => s.categoria))];
  const situacionesFiltradas = simuladorPreload.filter(
    (s) => s.categoria === categoriaSeleccionada && s.situacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleExportarPDF = () => {
    if (!situacionSeleccionada) return;
    const doc = new jsPDF();
    const contenido = `
      [SIMULACIÓN]
      Categoría: ${situacionSeleccionada.categoria}
      Situación: ${situacionSeleccionada.situacion}

      Respuestas:
      - ${situacionSeleccionada.respuesta1 || ''}
      - ${situacionSeleccionada.respuesta2 || ''}
      - ${situacionSeleccionada.respuesta3 || ''}
    `;
    const lines = doc.splitTextToSize(contenido, 180);
    doc.text(lines, 10, 20);
    doc.save(`simulacion_${situacionSeleccionada.situacion}.pdf`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧩 Simulador de Situaciones Laborales</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {categorias.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCategoriaSeleccionada(cat);
              setSituacionSeleccionada(null);
              setBusqueda('');
            }}
            className={`px-4 py-2 rounded border ${
              categoriaSeleccionada === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {categoriaSeleccionada && (
        <>
          <input
            type="text"
            placeholder="🔍 Buscar situación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded mb-4 w-full md:w-1/2"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {situacionesFiltradas.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSituacionSeleccionada(s)}
                className={`p-2 border rounded text-left ${
                  situacionSeleccionada?.situacion === s.situacion ? 'bg-blue-100' : 'bg-white hover:bg-gray-100'
                }`}
              >
                {s.situacion}
              </button>
            ))}
          </div>
        </>
      )}

      {situacionSeleccionada && (
        <div className="mt-4 p-4 border rounded bg-white shadow relative">
          <h3 className="text-lg font-semibold mb-2">{situacionSeleccionada.situacion}</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-700">
            {situacionSeleccionada.respuesta1 && <li>{situacionSeleccionada.respuesta1}</li>}
            {situacionSeleccionada.respuesta2 && <li>{situacionSeleccionada.respuesta2}</li>}
            {situacionSeleccionada.respuesta3 && <li>{situacionSeleccionada.respuesta3}</li>}
          </ul>

          <button
            onClick={handleExportarPDF}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Exportar Simulación en PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Simulador;