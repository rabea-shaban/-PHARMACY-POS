import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { MobileSidebar } from './MobileSidebar.js';
import { Header } from './Header.js';
import { useAppSelector } from '../../store/hooks.js';
import { cn } from '../../lib/utils.js';

export const AppLayout: React.FC = () => {
  const { sidebarOpen, direction } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-[#F0F6FA] dark:bg-[#0B0F17] font-sans text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop / Tablet Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          direction === 'rtl'
            ? sidebarOpen ? 'md:mr-64' : 'md:mr-20'
            : sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
