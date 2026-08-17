import { Drawer } from 'antd';
import {
  CloseOutlined,
  CompassOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Missão', icon: <CompassOutlined /> },
  { label: 'Serviços', icon: <ToolOutlined /> },
  { label: 'Configurações', icon: <SettingOutlined /> },
  { label: 'Sair', icon: <LogoutOutlined /> },
];

const DARK_GREEN = '#022c22';

function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  return (
    <Drawer
      placement="right"
      open={open}
      onClose={onClose}
      width={260}
      closeIcon={<CloseOutlined className="!text-emerald-100" />}
      styles={{
        header: {
          backgroundColor: DARK_GREEN,
          borderBottom: '1px solid #065f46',
        },
        body: {
          backgroundColor: DARK_GREEN,
          padding: '12px',
        },
      }}
    >
      <ul className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm !text-emerald-100 hover:bg-emerald-900 hover:!text-white"
            >
              <span className="text-base !text-emerald-100">
                {item.icon}
              </span>

              <span className="!text-emerald-100">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}

export default HamburgerMenu;
