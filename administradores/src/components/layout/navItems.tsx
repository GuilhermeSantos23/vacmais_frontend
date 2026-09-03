import type { ReactNode } from 'react';
import {
  AppstoreOutlined,
  TeamOutlined,
  InboxOutlined,
  SwapOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

export interface NavItem {
  label: string;
  icon: ReactNode;
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <AppstoreOutlined /> },
  { label: 'Profissionais', icon: <TeamOutlined /> },
  { label: 'Estoque', icon: <InboxOutlined /> },
  { label: 'Movimentações', icon: <SwapOutlined /> },
];

export const bottomNavItems: NavItem[] = [
  { label: 'Configurações', icon: <SettingOutlined /> },
  { label: 'Sair', icon: <LogoutOutlined /> },
];
