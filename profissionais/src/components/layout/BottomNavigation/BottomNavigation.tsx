import {
  HomeOutlined,
  SafetyOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const bottomNavItems = [
  { label: 'Home', icon: <HomeOutlined /> },
  { label: 'Aplicar Vacinas', icon: <SafetyOutlined /> },
  { label: 'Buscar Paciente', icon: <UserAddOutlined /> },
  { label: 'Histórico Vacinal', icon: <ClockCircleOutlined /> },
  { label: 'Configurações', icon: <SettingOutlined /> },
];

function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white lg:hidden">
      <ul className="flex justify-between px-1 py-1">
        {bottomNavItems.map((item) => (
          <li key={item.label} className="flex-1">
            <a
              href="#"
              className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] text-gray-500 hover:text-emerald-700"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNavigation;
