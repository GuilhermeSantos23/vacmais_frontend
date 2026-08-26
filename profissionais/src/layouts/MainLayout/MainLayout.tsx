import type { ReactNode } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import BottomNavigation from '../../components/layout/BottomNavigation/BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />

        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6">
          {children}
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}

export default MainLayout;
