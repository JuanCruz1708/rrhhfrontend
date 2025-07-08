import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useBusquedas } from '../data/BusquedaContext';
import { useEmpleados } from '../data/EmpleadoContext';
import { useLicencias } from '../data/LicenciaContext';
import { usePostulantes } from '../data/PostulanteContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const Home = () => {
  const { empleados } = useEmpleados();
  const { licencias } = useLicencias();
  const { busquedas } = useBusquedas();
  const { postulantes } = usePostulantes();

  const empleadosActivos = empleados.filter(e => e.estado === 'Activo').length;
  const empleadosInactivos = empleados.filter(e => e.estado === 'Inactivo').length;
  const licenciasActivas = licencias.length;
  const busquedasAbiertas = busquedas.filter(b => b.estado === 'Activo').length;
  const totalPostulantes = postulantes.length;

  const generoCounts = empleados.reduce((acc, curr) => {
    const genero = curr.genero || 'Sin asignar';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {});

  const centroCostoCounts = empleados.reduce((acc, curr) => {
    const nombre = curr.centro_costo?.nombre || 'Sin asignar';
    acc[nombre] = (acc[nombre] || 0) + 1;
    return acc;
  }, {});

  const barOptions = {
    plugins: {
      datalabels: {
        color: '#000',
        font: { weight: 'bold', size: 14 },
        formatter: Math.round,
        anchor: 'end',
        align: 'top',
      },
      legend: { display: false },
      tooltip: { callbacks: { label: context => `${context.parsed.y} empleados` } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
        suggestedMax: Math.max(empleadosActivos, empleadosInactivos, ...Object.values(centroCostoCounts)) + 2
      }
    }
  };

  const exportarDashboard = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Dashboard RRHH', 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Métrica', 'Cantidad']],
      body: [
        ['Empleados Activos', empleadosActivos],
        ['Empleados Inactivos', empleadosInactivos],
        ['Licencias Activas', licenciasActivas],
        ['Búsquedas Abiertas', busquedasAbiertas],
        ['Postulantes Registrados', totalPostulantes]
      ]
    });

    doc.save(`dashboard_rrhh_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">🏢 Bienvenido al Sistema de Gestión de RRHH</h1>
      <p className="mb-6 text-gray-700 max-w-3xl">
        Este sistema integral permite a tu empresa gestionar empleados, licencias, búsquedas y postulantes,
        facilitando la toma de decisiones mediante métricas en tiempo real y herramientas automatizadas de gestión.
      </p>

      <button
        onClick={exportarDashboard}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        📥 Exportar Dashboard en PDF
      </button>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Empleados Activos</p>
          <p className="text-2xl font-bold text-blue-600">{empleadosActivos}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Licencias Activas</p>
          <p className="text-2xl font-bold text-yellow-600">{licenciasActivas}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Búsquedas Abiertas</p>
          <p className="text-2xl font-bold text-purple-600">{busquedasAbiertas}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Postulantes</p>
          <p className="text-2xl font-bold text-pink-600">{totalPostulantes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empleados por Estado */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2 text-center">👥 Empleados por Estado</h2>
          {empleados.length === 0 ? (
            <p className="text-center text-gray-500">Sin datos disponibles</p>
          ) : (
            <Bar
              data={{
                labels: ['Activos', 'Inactivos'],
                datasets: [{
                  data: [empleadosActivos, empleadosInactivos],
                  backgroundColor: ['#3b82f6', '#ef4444']
                }]
              }}
              options={barOptions}
            />
          )}
        </div>

        {/* Empleados por Género */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2 text-center">👥 Empleados por Género</h2>
          {empleados.length === 0 ? (
            <p className="text-center text-gray-500">Sin datos disponibles</p>
          ) : (
            <Pie
              data={{
                labels: Object.keys(generoCounts),
                datasets: [{
                  data: Object.values(generoCounts),
                  backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981']
                }]
              }}
              options={{
                plugins: {
                  datalabels: {
                    color: '#fff',
                    font: { weight: 'bold', size: 16 },
                    formatter: Math.round
                  },
                  legend: { position: 'bottom' }
                }
              }}
            />
          )}
        </div>

        {/* Empleados por Centro de Costo */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2 text-center">🏢 Empleados por Centro de Costo</h2>
          {empleados.length === 0 ? (
            <p className="text-center text-gray-500">Sin datos disponibles</p>
          ) : (
            <Bar
              data={{
                labels: Object.keys(centroCostoCounts),
                datasets: [{
                  data: Object.values(centroCostoCounts),
                  backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
                }]
              }}
              options={barOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;