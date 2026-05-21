import { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'My Tasks', href: '/tasks' },
  ];

  if (user?.role === 'ADMIN') {
    navigation.push({ name: 'Users', href: '/users' });
  }

  return (
    <div className="min-h-screen font-sans bg-[#FAF9F6] text-gray-800 flex flex-col md:flex-row relative overflow-hidden">
      {/* Fixed Background Layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.06] filter invert pointer-events-none"
        style={{ backgroundImage: "url('/bg_network.png')" }}
      ></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#F4F4F6]/20 to-[#FAF9F6] pointer-events-none"></div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200/80 p-4 z-40 relative">
        <h1 className="text-xl font-bold tracking-[0.2em] text-gray-800 uppercase flex items-center space-x-2">
          <svg className="w-6 h-6 text-[#B89047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          <span className="bg-clip-text bg-gradient-to-r from-gray-900 to-[#B89047]">TaskFlow</span>
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200/80 flex-col z-30 transition-all absolute md:relative w-full h-[calc(100vh-73px)] md:h-screen top-[73px] md:top-0 left-0`}>
        <div className="hidden md:flex h-20 items-center px-8 border-b border-gray-200/80 shrink-0">
          <h1 className="text-xl font-bold tracking-[0.2em] text-gray-800 uppercase flex items-center space-x-2">
            <svg className="w-6 h-6 text-[#B89047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            <span className="bg-clip-text bg-gradient-to-r from-gray-900 to-[#B89047]">TaskFlow</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#B89047]/10 text-[#9A7831] border-l-4 border-[#B89047] shadow-sm font-bold'
                    : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-gray-200/80 shrink-0 bg-gray-50/50">
          <div className="flex items-center space-x-3 px-2 py-2 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-[#B89047] font-semibold tracking-wide uppercase truncate mt-0.5">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-[#9A7831] hover:border-[#DFBA73] transition-all"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
