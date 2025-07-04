import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h2 className="text-3xl font-bold mb-4">404 - Página no encontrada</h2>
      <p className="mb-6 text-gray-500">La página que buscas no existe o ha sido movida.</p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
