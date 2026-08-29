import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  SafetyOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

// "to: null" significa que a Page correspondente ainda não existe;
// esses itens continuam como link de placeholder por enquanto.
const bottomNavItems = [
  { label: 'Home', icon: <HomeOutlined />, to: '/home' },
  { label: 'Aplicar Vacinas', icon: <SafetyOutlined />, to: null },
  { label: 'Buscar Paciente', icon: <UserAddOutlined />, to: null },
  { label: 'Histórico Vacinal', icon: <ClockCircleOutlined />, to: null },
  { label: 'Configurações', icon: <SettingOutlined />, to: '/configuracoes' },
  { label: 'Sair', icon: <LogoutOutlined />, to: '/login' },
];

const itemClassName =
  'flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] text-gray-500 hover:text-emerald-700';

function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white lg:hidden">
      <ul className="flex justify-between px-1 py-1">
        {bottomNavItems.map((item) => (
          <li key={item.label} className="flex-1">
            {item.to ? (
              <Link to={item.to} className={itemClassName}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <a href="#" className={itemClassName}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNavigation;
