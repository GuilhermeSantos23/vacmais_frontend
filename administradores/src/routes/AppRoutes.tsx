import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha';
import UserProvider from '../contexts/UserProvider';
import { useUser } from '../hooks/useUser';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profissionais from '../pages/Profissionais/Profissionais';
import Estoque from '../pages/Estoque/Estoque';
import Movimentacoes from '../pages/Movimentacoes/Movimentacoes';
import Campanhas from '../pages/Campanhas/Campanhas';
import Settings from '../pages/Settings/Settings';

function RequireAuthentication() {
  const { isAuthenticated, isAuthLoading } = useUser();
  if (isAuthLoading) return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Verificando sessão...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequirePasswordChange() {
  const { mustChangePassword } = useUser();
  if (!mustChangePassword) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function RequirePasswordAlreadyChanged() {
  const { mustChangePassword } = useUser();
  if (mustChangePassword) return <Navigate to="/alterar-senha" replace />;
  return <Outlet />;
}

function AreaLogada() {
  return <MainLayout><Outlet /></MainLayout>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route element={<RequireAuthentication />}>
            <Route element={<RequirePasswordChange />}>
              <Route path="/alterar-senha" element={<AlterarSenha />} />
            </Route>
            <Route element={<RequirePasswordAlreadyChanged />}>
              <Route element={<AreaLogada />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profissionais" element={<Profissionais />} />
                <Route path="/estoque" element={<Estoque />} />
                <Route path="/movimentacoes" element={<Movimentacoes />} />
                <Route path="/campanhas" element={<Campanhas />} />
                <Route path="/configuracoes" element={<Settings />} />
              </Route>
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
export default AppRoutes;
