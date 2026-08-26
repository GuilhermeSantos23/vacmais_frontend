import { BellOutlined, SearchOutlined } from '@ant-design/icons';
import { formatFullDate } from '../../../utils/formatDate';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  region?: string;
}

// Os valores padrão abaixo são apenas placeholders visuais.
// Quando o login/autenticação existir, esses dados virão do usuário logado.
function Header({
  userName = 'Usuário',
  userRole = 'Vac+ Cidadãos',
  region = 'Região não definida',
}: HeaderProps) {
  const today = formatFullDate(new Date());

  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
      {/* Campo de busca */}
      <div className="relative min-w-0 flex-1">
        <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar histórico vacinal, serviços..."
          className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
        />
      </div>

      {/* Data e região */}
      <div className="hidden text-right text-sm text-gray-600 md:block">
        <p className="font-semibold text-gray-900">{today}</p>
        <p>Região: {region}</p>
      </div>

      {/* Notificações */}
      <button
        type="button"
        aria-label="Notificações"
        className="text-lg text-gray-500 hover:text-gray-700"
      >
        <BellOutlined />
      </button>

      {/* Usuário */}
      <div className="hidden items-center gap-2 sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-emerald-950">
          {initials}
        </span>

        <div className="text-left text-sm">
          <p className="font-semibold text-gray-900">{userName}</p>
          <p className="text-gray-500">{userRole}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;