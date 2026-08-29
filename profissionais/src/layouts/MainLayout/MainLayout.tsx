import type { ReactNode } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import BottomNavigation from '../../components/layout/BottomNavigation/BottomNavigation';
import UserProvider from '../../contexts/UserProvider';

interface MainLayoutProps {
  children: ReactNode;
}

// UserProvider fica aqui porque o MainLayout é montado uma única vez para
// toda a área logada (as rotas internas só trocam o conteúdo do <main>),
// então o nome/avatar do usuário continuam os mesmos ao navegar entre as
// Pages. O id="app-content" no <main> é usado pelo controle de Brilho em
// Preferências (ver PreferencesTab) para não quebrar o position:fixed do
// BottomNavigation.
function MainLayout({ children }: MainLayoutProps) {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />

          <main id="app-content" className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6">
            {children}
          </main>

          <BottomNavigation />
        </div>
      </div>
    </UserProvider>
  );
}

export default MainLayout;
