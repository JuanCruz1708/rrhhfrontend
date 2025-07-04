import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Empleados from './pages/Empleados';
import Licencias from './pages/Licencias';
import Puestos from './pages/Puestos';
import CentrosCosto from './pages/CentrosCosto';
import Organigrama from './pages/Organigrama';
import Busquedas from './pages/Busquedas';
import Postulantes from './pages/Postulantes';
import Formularios from './pages/Formularios';
import Simulador from './pages/Simulador';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './data/AuthContext';
import { EmpleadoProvider } from './data/EmpleadoContext';
import { LicenciaProvider } from './data/LicenciaContext';
import { BusquedaProvider } from './data/BusquedaContext';
import { PostulanteProvider } from './data/PostulanteContext';
import { CentroCostoProvider } from './data/CentroCostoContext';
import { PuestoProvider } from './data/PuestoContext';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
    const { usuarioLogueado } = useAuth();

    if (!usuarioLogueado) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/empleados" element={<PrivateRoute><Empleados /></PrivateRoute>} />
                    <Route path="/licencias" element={<PrivateRoute><Licencias /></PrivateRoute>} />
                    <Route path="/puestos" element={<PrivateRoute><Puestos /></PrivateRoute>} />
                    <Route path="/centroscosto" element={<PrivateRoute><CentrosCosto /></PrivateRoute>} />
                    <Route path="/organigrama" element={<PrivateRoute><Organigrama /></PrivateRoute>} />
                    <Route path="/busquedas" element={<PrivateRoute><Busquedas /></PrivateRoute>} />
                    <Route path="/postulantes" element={<PrivateRoute><Postulantes /></PrivateRoute>} />
                    <Route path="/formularios" element={<PrivateRoute><Formularios /></PrivateRoute>} />
                    <Route path="/simulador" element={<PrivateRoute><Simulador /></PrivateRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <EmpleadoProvider>
                    <LicenciaProvider>
                        <BusquedaProvider>
                            <PostulanteProvider>
                                <CentroCostoProvider>
                                    <PuestoProvider>
                                        <AppRoutes />
                                    </PuestoProvider>
                                </CentroCostoProvider>
                            </PostulanteProvider>
                        </BusquedaProvider>
                    </LicenciaProvider>
                </EmpleadoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;