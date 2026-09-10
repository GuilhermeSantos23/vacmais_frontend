import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout/MainLayout';

import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import Dashboard from '../pages/Dashboard/Dashboard';
import ClinicasPrivadas from '../pages/ClinicasPrivadas/ClinicasPrivadas';
import UBSs from '../pages/UBSs/UBSs';
import Settings from '../pages/Settings/Settings';
import ComingSoon from '../pages/ComingSoon/ComingSoon';

function AreaLogada() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Esqueci minha senha */}
        <Route
          path="/esqueci-senha"
          element={<EsqueciSenha />}
        />

        {/* Área logada */}
        <Route element={<AreaLogada />}>
<<<<<<< HEAD
          <Route path="/clinicas-privadas" element={<ClinicasPrivadas />} />
          <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
          <Route path="/ubs" element={<UBSs />} />
          <Route path="/estoque-regional" element={<ComingSoon title="Estoque Regional" />} />
          <Route path="/configuracoes" element={<Settings />} />
=======

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Clínicas privadas */}
          <Route
            path="/clinicas-privadas"
            element={<ClinicasPrivadas />}
          />

          {/* UBSs */}
          <Route
            path="/ubs"
            element={<ComingSoon title="UBSs" />}
          />

          {/* Estoque Regional */}
          <Route
            path="/estoque-regional"
            element={<ComingSoon title="Estoque Regional" />}
          />

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={<Settings />}
          />

>>>>>>> 0d663a4f89d97164c75cfb5d3d12aa5f291d2250
        </Route>

        {/* Página inicial */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Página não encontrada */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;