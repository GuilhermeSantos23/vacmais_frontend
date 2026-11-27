import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha';
import UserProvider from '../contexts/UserProvider';
import { useUser } from '../hooks/useUser';
import Home from '../pages/home/Home';
import Settings from '../pages/Settings/Settings';
import Caderneta from '../pages/Caderneta/Caderneta';
import Aplicacoes from '../pages/Aplicacoes/Aplicacoes';
import Historico from '../pages/Historico/Historico';

function RequireAuthentication() {
  const { isAuthenticated, isAuthLoading } = useUser();
  if (isAuthLoading) return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Verificando sessão...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequirePasswordChange() {
  const { mustChangePassword } = useUser();
  if (!mustChangePassword) return <Navigate to="/home" replace />;
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
                <Route path="/home" element={<Home />} />
                <Route path="/cadernetas" element={<Caderneta />} />
                <Route path="/aplicacoes" element={<Aplicacoes />} />
                <Route path="/historico" element={<Historico />} />
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
