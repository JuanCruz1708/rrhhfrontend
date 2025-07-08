import React from 'react';
import { usePuestos } from '../data/PuestoContext';

function Organigrama() {
  const { puestos } = usePuestos();

  const construirJerarquia = () => {
    const mapa = {};
    puestos.forEach((p) => {
      mapa[p.id] = { ...p, hijos: [] };
    });

    const raiz = [];
    puestos.forEach((p) => {
      if (p.jefe_id) {
        mapa[p.jefe_id]?.hijos.push(mapa[p.id]);
      } else {
        raiz.push(mapa[p.id]);
      }
    });

    return raiz;
  };

  const renderNodo = (nodo, nivel = 0) => (
    <li key={`${nodo.id}-${nivel}`} className="mb-2">
      <div
        className={`rounded p-2 shadow text-sm font-medium ${
          nivel === 0
            ? 'bg-blue-100 text-blue-800'
            : nivel === 1
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {nodo.nombre}
        {nodo.descripcion && ` - ${nodo.descripcion}`}
      </div>
      {nodo.hijos.length > 0 && (
        <ul className="ml-6 border-l-2 border-gray-300 pl-4">
          {nodo.hijos.map((hijo) => renderNodo(hijo, nivel + 1))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Organigrama</h2>
      {puestos.length === 0 ? (
        <p className="text-gray-500">No hay puestos para mostrar en el organigrama.</p>
      ) : (
        <ul>
          {construirJerarquia().map((nodo) => renderNodo(nodo))}
        </ul>
      )}
    </div>
  );
}

export default Organigrama;