import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { formatFullDate, formatShortDate } from '../../../utils/formatDate';
import { useUser } from '../../../hooks/useUser';
import { useAlert } from '../../../hooks/useAlert';
import UserAvatar from '../../common/UserAvatar/UserAvatar';

interface HeaderProps {
  onMenuClick: () => void;
  userRole?: string;
  region?: string;
}

// O nome e o avatar do usuário vêm do UserContext (compartilhado com a
// página Settings). Os valores padrão abaixo são apenas placeholders visuais
// para os dados que ainda não têm origem em um backend/autenticação.
function Header({
  onMenuClick,
  userRole = 'Vac+ Cidadãos',
  region = 'Região não definida',
}: HeaderProps) {
  const { userName } = useUser();
  const { hasUnreadNotification } = useAlert();
  const today = formatFullDate(new Date());

  return (
    <header className="flex items-center justify-end gap-4 border-b border-gray-200 bg-white px-4 py-3 lg:gap-5 lg:px-8">
      <div className="hidden text-right text-sm text-gray-600 md:block">
        <p className="font-semibold text-gray-900">{today}</p>
        <p>Região: {region}</p>
      </div>

      <button
        type="button"
        aria-label="Notificações"
        className="relative text-lg text-gray-500 hover:text-gray-700"
      >
        <BellOutlined />
        {hasUnreadNotification && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
        )}
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        <UserAvatar size={36} />
        <div className="text-left text-sm">
          <p className="font-semibold text-gray-900">{userName}</p>
          <p className="text-gray-500">{userRole}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="text-xl text-gray-700 lg:hidden"
      >
        <MenuOutlined />
      </button>
    </header>
  );
}

export default Header;
