import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';
import RecuperarAcesso from '../pages/RecuperarAcesso/RecuperarAcesso';
import DocumentoLegal from '../pages/Legal/DocumentoLegal';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha';
import Home from '../pages/Home/Home';
import UnidadesProximas from '../pages/UnidadesProximas/UnidadesProximas';
import Settings from '../pages/Settings/Settings';
import Calendario from '../pages/Calendario/Calendario';
import CadernetaVacinacao from '../pages/CadernetaVacinacao/CadernetaVacinacao';
import HistoricoVacinal from '../pages/HistoricoVacinal/HistoricoVacinal';
import InformacoesVacinais from '../pages/Informacoes/InformacoesVacinais';
import UserProvider from '../contexts/UserProvider';
import AlertProvider from '../contexts/AlertProvider';
import { useUser } from '../hooks/useUser';

function AreaLogada() { return <MainLayout><Outlet /></MainLayout>; }

function RotaProtegida() {
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

function RotaSemTrocaObrigatoria() {
  const { mustChangePassword } = useUser();
  if (mustChangePassword) return <Navigate to="/alterar-senha" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AlertProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-acesso" element={<RecuperarAcesso />} />
            <Route path="/termos-de-uso" element={<DocumentoLegal tipo="termos" />} />
            <Route path="/politica-de-privacidade" element={<DocumentoLegal tipo="privacidade" />} />
            <Route element={<RotaProtegida />}>
              <Route element={<RequirePasswordChange />}>
              <Route path="/alterar-senha" element={<AlterarSenha />} />
            </Route>
              <Route element={<RotaSemTrocaObrigatoria />}>
                <Route element={<AreaLogada />}>
                  <Route path="/home" element={<Home />} />
                <Route path="/unidades-proximas" element={<UnidadesProximas />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/caderneta-vacinacao" element={<CadernetaVacinacao />} />
                <Route path="/historico-vacinal" element={<HistoricoVacinal />} />
                  <Route path="/informacoes-vacinais" element={<InformacoesVacinais />} />
                </Route>
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AlertProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
export default AppRoutes;
