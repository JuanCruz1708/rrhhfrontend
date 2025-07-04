import React from 'react';
import { useAuth } from '../data/AuthContext';

function Header() {
  const { usuarioLogueado } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Sistema RRHH</h1>
      {usuarioLogueado && (
        <p className="text-sm text-gray-300">Bienvenido, {usuarioLogueado}</p>
      )}
    </header>
  );
}

export default Header;
