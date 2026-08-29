import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  SafetyOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import vacmaisLogo from '../../../assets/vacmais-logo.png';

// "to: null" significa que a Page correspondente ainda não existe;
// esses itens continuam como link de placeholder por enquanto.
const mainNavItems = [
  { label: 'Home', icon: <HomeOutlined />, to: '/home' },
  { label: 'Aplicar Vacinas', icon: <SafetyOutlined />, to: null },
  { label: 'Buscar Paciente', icon: <UserAddOutlined />, to: null },
  { label: 'Histórico Vacinal', icon: <ClockCircleOutlined />, to: null },
];

const bottomNavItems = [
  { label: 'Configurações', icon: <SettingOutlined />, to: '/configuracoes' },
  { label: 'Sair', icon: <LogoutOutlined />, to: '/login' },
];

const linkClassName =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white';

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-emerald-950 text-emerald-50 lg:flex">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <img
            src={vacmaisLogo}
            alt="Logo Vac+"
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="text-lg font-bold">Vac+</span>
        </div>

        <p className="mt-1 text-xs font-semibold tracking-widest text-emerald-300">
          PROFISSIONAIS
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <Link to={item.to} className={linkClassName}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <a href="#" className={linkClassName}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-emerald-800 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className={linkClassName}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
