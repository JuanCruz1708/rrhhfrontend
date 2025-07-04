import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useBusquedas } from '../data/BusquedaContext';
import { useEmpleados } from '../data/EmpleadoContext';
import { useLicencias } from '../data/LicenciaContext';
import { usePostulantes } from '../data/PostulanteContext';
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
        suggestedMax: Math.max(
          empleadosActivos,
          empleadosInactivos,
          ...Object.values(centroCostoCounts)
        ) + 2 // 🚀 deja 2 espacios más arriba
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido al Sistema de Gestión de RRHH</h1>
      <p className="mb-6 text-gray-700">
        Este sistema te permite gestionar de forma centralizada todos los procesos de Recursos Humanos de tu empresa:
        administración de empleados, licencias, búsquedas laborales y postulantes, visualizando métricas en tiempo real
        para decisiones ágiles y manteniendo el control de tu área de RRHH de forma intuitiva y ordenada.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empleados por Estado */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-center">📊 Empleados Actuales</h2>
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
        </div>

        {/* Empleados por Género */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-center">📊 Empleados por Género</h2>
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
        </div>

        {/* Empleados por Centro de Costo */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-center">📊 Empleados por Centro de Costo</h2>
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
        </div>
      </div>
    </div>
  );
};

export default Home;