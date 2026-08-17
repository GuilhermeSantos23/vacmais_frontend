import {
  HomeOutlined,
  EnvironmentOutlined,
  FolderOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';


const bottomNavItems = [
  { label: 'Home', icon: <HomeOutlined /> },
  { label: 'Unidades', icon: <EnvironmentOutlined /> },
  { label: 'Histórico', icon: <FolderOutlined /> },
  { label: 'Caderneta', icon: <BookOutlined /> },
  { label: 'Informações', icon: <InfoCircleOutlined /> },
  { label: 'Calendário', icon: <CalendarOutlined /> },
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
