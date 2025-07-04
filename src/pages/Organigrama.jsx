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

  const renderNodo = (nodo) => (
    <li key={nodo.id}>
      <div className="border rounded p-2 bg-white shadow mb-2">{nodo.nombre} {nodo.descripcion && `- ${nodo.descripcion}`}</div>
      {nodo.hijos.length > 0 && (
        <ul className="ml-6 border-l pl-4">
          {nodo.hijos.map((hijo) => renderNodo(hijo))}
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
