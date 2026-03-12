'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiLogout } from 'react-icons/hi';
import {
  HiViewGrid,
  HiUser,
  HiDocumentText,
  HiQuestionMarkCircle,
  HiChartPie,
  HiOutlineCollection,
} from 'react-icons/hi';

const navItems = [
  { name: 'Daybook', icon: HiViewGrid, path: '/daybook' },
  { name: 'Customers', icon: HiUser, path: '/customers' },
  { name: 'Invoices', icon: HiDocumentText, path: '/invoices' },
  { name: 'Balance', icon: HiQuestionMarkCircle, path: '/balance' },
  { name: 'Transactions', icon: HiChartPie, path: '/transactions' },
  { name: 'Accounts', icon: HiOutlineCollection, path: '/accounts' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Don't show layout on login page
  if (pathname === '/login' || !isAuthenticated || isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-300 border-r border-slate-700/50 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-20 border-b border-slate-700/50 flex items-center justify-center">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HP</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Haram Packages
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all"
          >
            <div className="p-2 rounded-lg bg-slate-800/50">
              {isSidebarOpen ? (
                <HiChevronDoubleLeft className="w-5 h-5" />
              ) : (
                <HiChevronDoubleRight className="w-5 h-5" />
              )}
            </div>
            {isSidebarOpen && <span className="font-medium">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 p-4 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400"
          >
            <div className="p-2 rounded-lg bg-slate-800/50">
              <HiLogout className="w-5 h-5" />
            </div>
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-900">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
