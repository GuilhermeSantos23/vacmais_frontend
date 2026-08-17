import {
  HomeOutlined,
  EnvironmentOutlined,
  FolderOutlined,
  BookOutlined,
  CompassOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import vacmaisLogo from '../../../assets/vacmais-logo.png';


const mainNavItems = [
  { label: 'Home', icon: <HomeOutlined /> },
  { label: 'Unidades próximas', icon: <EnvironmentOutlined /> },
  { label: 'Histórico Vacinal', icon: <FolderOutlined /> },
  { label: 'Caderneta de Vacinação', icon: <BookOutlined /> },
  { label: 'Missão', icon: <CompassOutlined /> },
  { label: 'Informações vacinais', icon: <InfoCircleOutlined /> },
  { label: 'Calendário', icon: <CalendarOutlined /> },
  { label: 'Serviços', icon: <ToolOutlined /> },
];


const bottomNavItems = [
  { label: 'Configurações', icon: <SettingOutlined /> },
  { label: 'Sair', icon: <LogoutOutlined /> },
];

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
        CIDADÃO
      </p>
    </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-emerald-800 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
