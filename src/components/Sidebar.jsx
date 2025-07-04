import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, ClipboardList, Briefcase, Users, FileText, Activity, Search, FilePlus } from 'lucide-react';
import { useAuth } from '../data/AuthContext';

function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded hover:bg-slate-700 transition ${
      location.pathname === path ? 'bg-slate-700 text-blue-400' : ''
    }`;

  return (
    <div className="w-64 bg-slate-900 text-white h-full p-4 flex flex-col justify-between">
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-2">Sistema RRHH</h2>

        {/* Inicio */}
        <Link to="/" className={linkClass('/')}>
          <Home size={18} /> Inicio
        </Link>

        {/* Gestión Nómina */}
        <p className="text-gray-400 mt-4 mb-1 text-xs uppercase">Gestión Nómina</p>
        <Link to="/empleados" className={linkClass('/empleados')}>
          <User size={18} /> Empleados
        </Link>
        <Link to="/licencias" className={linkClass('/licencias')}>
          <ClipboardList size={18} /> Licencias
        </Link>
        <Link to="/puestos" className={linkClass('/puestos')}>
          <Briefcase size={18} /> Puestos
        </Link>
        <Link to="/centroscosto" className={linkClass('/centroscosto')}>
          <ClipboardList size={18} /> Centros de Costo
        </Link>
        <Link to="/organigrama" className={linkClass('/organigrama')}>
          <Users size={18} /> Organigrama
        </Link>

        {/* Reclutamiento */}
        <p className="text-gray-400 mt-4 mb-1 text-xs uppercase">Reclutamiento</p>
        <Link to="/busquedas" className={linkClass('/busquedas')}>
          <Search size={18} /> Búsquedas
        </Link>
        <Link to="/postulantes" className={linkClass('/postulantes')}>
          <FilePlus size={18} /> Postulantes
        </Link>

        {/* Asesoramiento */}
        <p className="text-gray-400 mt-4 mb-1 text-xs uppercase">Asesoramiento</p>
        <Link to="/formularios" className={linkClass('/formularios')}>
          <FileText size={18} /> Formularios
        </Link>
        <Link to="/simulador" className={linkClass('/simulador')}>
          <Activity size={18} /> Simulador
        </Link>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 p-2 rounded hover:bg-slate-700 text-red-400 hover:text-red-300 transition mt-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round"
          strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0
          01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Sidebar;