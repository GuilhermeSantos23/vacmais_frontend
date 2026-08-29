import { SearchOutlined } from '@ant-design/icons';
import { formatFullDate } from '../../../utils/formatDate';
import { useUser } from '../../../hooks/useUser';
import UserAvatar from '../../common/UserAvatar/UserAvatar';

interface HeaderProps {
  userRole?: string;
  unity?: string;
}

// O nome e o avatar vêm do UserContext (compartilhado com a página
// Settings), assim o avatar escolhido em Configurações aparece aqui
// também. O valor padrão de unity é só um placeholder visual até a
// autenticação real existir.
function Header({
  userRole = 'Vac+ Profissionais',
  unity = 'Unidade não definida',
}: HeaderProps) {
  const { userName } = useUser();
  const today = formatFullDate(new Date());

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
      {/* Campo de busca */}
      <div className="relative min-w-0 flex-1">
        <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar paciente, histórico vacinal..."
          className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
        />
      </div>

      {/* Data e unidade */}
      <div className="hidden text-right text-sm text-gray-600 md:block">
        <p className="font-semibold text-gray-900">{today}</p>
        <p>Unidade: {unity}</p>
      </div>

      {/* Usuário */}
      <div className="hidden items-center gap-2 sm:flex">
        <UserAvatar size={36} />

        <div className="text-left text-sm">
          <p className="font-semibold text-gray-900">{userName}</p>
          <p className="text-gray-500">{userRole}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
