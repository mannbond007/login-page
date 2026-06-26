import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, Shield, Home, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, toggleMobileMenu }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full glass border-b border-white/5 bg-dark-950/70 backdrop-blur-md px-4 py-3 flex items-center justify-between"
    >
      {/* Left section: Logo & App Name */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 text-gray-400 hover:text-white md:hidden hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-wider text-white hidden sm:inline-block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AegisAuth
          </span>
        </div>
      </div>

      {/* Center section: Navigation Tabs */}
      <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 z-10" />
              <span className="z-10">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right section: Profile, Name & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pl-3 border-l border-white/5 md:border-none">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-gray-300 hidden md:inline-block">
            {user?.name}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </motion.nav>
  );
};
