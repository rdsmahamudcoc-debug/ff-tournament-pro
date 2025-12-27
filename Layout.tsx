
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { TEXT } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, settings, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pt-16">
      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-800 border-b border-slate-700 z-50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">FF</div>
          <h1 className="font-bold text-lg hidden sm:block">ফ্রি ফায়ার প্রো</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-orange-400">Balance: ৳{currentUser.balance}</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600"
              >
                👤
              </button>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="bg-red-600/20 text-red-500 p-2 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                title="লগআউট"
              >
                🚪
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-orange-600 px-4 py-1.5 rounded-lg font-bold text-sm"
            >
              লগইন
            </button>
          )}
        </div>
      </header>

      {/* Marquee Notice */}
      <div className="mt-16 bg-orange-600/10 border-y border-orange-500/20 py-2 overflow-hidden relative">
        <div className="animate-marquee inline-block text-orange-400 text-sm font-medium">
          {settings.marqueeNotice}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        {children}
      </main>

      {/* Bottom Navbar (Mobile) */}
      <nav className="fixed bottom-0 w-full bg-slate-800 border-t border-slate-700 flex justify-around items-center py-2 z-50 md:top-16 md:bottom-auto md:bg-transparent md:border-none md:justify-start md:gap-8 md:px-10">
        <NavLink to="/" icon="🏠" label={TEXT.HOME} />
        <NavLink to="/tournaments" icon="🏆" label={TEXT.TOURNAMENTS} />
        <NavLink to="/wallet" icon="💰" label={TEXT.WALLET} />
        {currentUser?.role === 'ADMIN' && (
          <NavLink to="/admin" icon="⚙️" label="অ্যাডমিন" />
        )}
        <NavLink to="/profile" icon="👤" label={TEXT.PROFILE} />
      </nav>
    </div>
  );
};

const NavLink: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => (
  <Link to={to} className="flex flex-col items-center gap-1 text-slate-400 hover:text-orange-500 transition-colors">
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] md:text-sm font-medium">{label}</span>
  </Link>
);

export default Layout;
