import { useState, type ReactNode } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import BottomNavigation from '../../components/layout/BottomNavigation/BottomNavigation';
import HamburgerMenu from '../../components/layout/HamburguerMenu/HamburguerMenu';
import UserProvider from '../../contexts/UserProvider';
import AlertProvider from '../../contexts/AlertProvider';
import AlertPopup from '../../components/common/AlertPopup/AlertPopup';

interface MainLayoutProps {
  children: ReactNode;
}

// UserProvider e AlertProvider ficam aqui porque o MainLayout é montado
// uma única vez para toda a área logada (as rotas internas só trocam o
// conteúdo do <main>), então o avatar do usuário e o alerta continuam
// os mesmos ao navegar entre as Pages.
function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <UserProvider>
      <AlertProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />

          <div className="flex min-h-screen flex-1 flex-col">
            <Header onMenuClick={() => setIsMenuOpen(true)} />

            <main
              id="app-content"
              className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6"
            >
              {children}
            </main>

            <BottomNavigation />
          </div>

          <HamburgerMenu
            open={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
          <AlertPopup />
        </div>
      </AlertProvider>
    </UserProvider>
  );
}

export default MainLayout;
