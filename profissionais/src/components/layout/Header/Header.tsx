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
  unity = 'UBS Pimentas',
}: HeaderProps) {
  const { userName } = useUser();
  const today = formatFullDate(new Date());

  return (
    <header className="flex items-center justify-end gap-4 border-b border-gray-200 bg-white px-4 py-4 lg:gap-5 lg:px-10">
      <div className="hidden shrink-0 text-right text-sm text-gray-600 md:block">
        <p className="font-semibold text-gray-900">{today}</p>
        <p>Unidade: {unity}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <UserAvatar size={36} />

        <div className="text-left text-sm">
          <p className="font-semibold text-gray-900">Dr(a) {userName}</p>
          <p className="text-gray-500">{userRole}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
