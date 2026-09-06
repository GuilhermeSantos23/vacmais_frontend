import type { ReactNode } from 'react';
import {
  TeamOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  RiseOutlined,
} from '@ant-design/icons';

// Um indicador exibido no dashboard.
interface Indicador {
  id: number;
  label: string;
  valor: string | number;
  tendencia?: string;
  icone: ReactNode;
  corFundoIcone: string;
  corIcone: string;
}

// Dados fictícios apenas para reproduzir a interface visual.
const indicadores: Indicador[] = [
  {
    id: 1,
    label: 'Profissionais',
    valor: 25,
    icone: <TeamOutlined />,
    corFundoIcone: 'bg-blue-50',
    corIcone: 'text-blue-500',
  },
  {
    id: 2,
    label: 'Estoque crítico',
    valor: 9,
    icone: <WarningOutlined />,
    corFundoIcone: 'bg-red-50',
    corIcone: 'text-red-500',
  },
  {
    id: 3,
    label: 'Vacinas entregues (mês)',
    valor: 1350,
    tendencia: '+8.4%',
    icone: <MedicineBoxOutlined />,
    corFundoIcone: 'bg-emerald-50',
    corIcone: 'text-emerald-600',
  },
  {
    id: 4,
    label: 'Campanhas ativos',
    valor: 23,
    icone: <BellOutlined />,
    corFundoIcone: 'bg-amber-50',
    corIcone: 'text-amber-500',
  },
];

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Carla!</h1>
      <p className="mt-0.5 text-sm text-gray-500">
        Acompanhe os indicadores estratégicos da sua região em tempo real.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.id}
            className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${indicador.corFundoIcone} ${indicador.corIcone}`}
              >
                {indicador.icone}
              </div>
              <p className="text-sm text-gray-500">{indicador.label}</p>
            </div>

            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{indicador.valor}</p>

              {indicador.tendencia && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  <RiseOutlined />
                  {indicador.tendencia}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
