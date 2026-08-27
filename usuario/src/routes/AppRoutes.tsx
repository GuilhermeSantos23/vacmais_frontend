import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';
import Home from '../pages/Home/Home';
import UnidadesProximas from '../pages/UnidadesProximas/UnidadesProximas';
import Settings from '../pages/Settings/Settings';
import Calendario from '../pages/Calendario/Calendario';
import Servicos from '../pages/Servicos/Servicos';
import CadernetaVacinacao from '../pages/CadernetaVacinacao/CadernetaVacinacao';
import HistoricoVacinal from '../pages/HistoricoVacinal/HistoricoVacinal';
import InformacoesVacinais from '../pages/Informacoes/InformacoesVacinais';
import Missao from '../pages/Missao/Missao';

// Rota de layout: tudo que for uma página "logada" é renderizado dentro
// do MainLayout, através do <Outlet />. Como o MainLayout só é montado
// uma vez para todo esse grupo de rotas, o UserProvider e o AlertProvider
// (que ficam dentro dele) mantêm o estado ao navegar entre as páginas.
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
        <Route path="/cadastro" element={<Cadastro />} />

        <Route element={<AreaLogada />}>
          <Route path="/home" element={<Home />} />
          <Route path="/unidades-proximas" element={<UnidadesProximas />} />
          <Route path="/configuracoes" element={<Settings />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/caderneta-vacinacao" element={<CadernetaVacinacao />} />
          <Route path="/historico-vacinal" element={<HistoricoVacinal />} />
          <Route
            path="/informacoes-vacinais"
            element={<InformacoesVacinais />}
          />
          <Route path="/missao" element={<Missao />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
