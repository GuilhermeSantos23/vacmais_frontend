import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import ClinicasPrivadas from '../pages/ClinicasPrivadas/ClinicasPrivadas';
import UBSs from '../pages/UBSs/UBSs';
import Settings from '../pages/Settings/Settings';
import ComingSoon from '../pages/ComingSoon/ComingSoon';

// Rota de layout: tudo que for uma página "logada" é renderizada dentro
// do MainLayout, através do <Outlet />. Como o MainLayout só é montado
// uma vez para todo esse grupo de rotas, o estado do layout (sidebar,
// menu mobile etc.) se mantém ao navegar entre as páginas.
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
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        <Route element={<AreaLogada />}>
          <Route path="/clinicas-privadas" element={<ClinicasPrivadas />} />
          <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
          <Route path="/ubs" element={<UBSs />} />
          <Route path="/estoque-regional" element={<ComingSoon title="Estoque Regional" />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
