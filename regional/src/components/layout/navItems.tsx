import type { ReactNode } from 'react';
import {
  AppstoreOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

export interface NavItem {
  label: string;
  icon: ReactNode;
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <AppstoreOutlined /> },
  { label: 'UBSs', icon: <MedicineBoxOutlined /> },
  { label: 'Clínicas Privadas', icon: <BankOutlined /> },
  { label: 'Regiões', icon: <EnvironmentOutlined /> },
  { label: 'Estoque Regional', icon: <InboxOutlined /> },
];

export const bottomNavItems: NavItem[] = [
  { label: 'Configurações', icon: <SettingOutlined /> },
  { label: 'Sair', icon: <LogoutOutlined /> },
];
