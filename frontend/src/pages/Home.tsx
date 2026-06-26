import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileMenu } from '../components/MobileMenu';
import { HeroSection } from '../components/HeroSection';
import { StatsSection } from '../components/StatsSection';
import { ProfilePreviewCard } from '../components/ProfilePreviewCard';
import { ActivitySection } from '../components/ActivitySection';
import { EditProfileModal } from '../components/EditProfileModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ShieldAlert, KeyRound, UserMinus } from 'lucide-react';

export const Home: React.FC = () => {
  // Dashboard navigation tab state
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Edit profile/password modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editModalTab, setEditModalTab] = useState<'profile' | 'password'>('profile');

  const openEditModal = (tab: 'profile' | 'password') => {
    setEditModalTab(tab);
    setIsEditModalOpen(true);
  };

  // Page Transition variants
  const tabContentVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' as const } }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      {/* Grid Pattern and Radial Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none -z-10" />

      {/* Dynamic Background Blurs */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-emerald-950/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-teal-950/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '3s' }} />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Page Body: Sidebar + Main Content */}
      <div className="flex flex-1 relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Mobile menu drawer */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-62px)]">
          <AnimatePresence mode="wait">
            {/* Tab 1: HOME view */}
            {activeTab === 'home' && (
              <motion.div
                key="home"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <HeroSection setActiveTab={setActiveTab} />
                <StatsSection />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 h-full">
                    <ProfilePreviewCard onEditClick={openEditModal} />
                  </div>
                  <div className="lg:col-span-7 h-full">
                    <ActivitySection />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: DASHBOARD metrics view */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-left">
                  <h1 className="text-3xl font-extrabold text-white mb-2">Metrics Console</h1>
                  <p className="text-gray-400 text-sm">Real-time statistics and access records for your profile</p>
                </div>
                <StatsSection />
                <ActivitySection />
              </motion.div>
            )}

            {/* Tab 3: PROFILE detail view */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div className="lg:col-span-12 text-left">
                  <h1 className="text-3xl font-extrabold text-white mb-2">User Profile</h1>
                  <p className="text-gray-400 text-sm">View details and edit account details</p>
                </div>
                <div className="lg:col-span-5">
                  <ProfilePreviewCard onEditClick={openEditModal} />
                </div>
                <div className="lg:col-span-7 space-y-6">
                  {/* Account overview glass details panel */}
                  <div className="glass p-6 rounded-3xl border border-white/5 bg-dark-900/40 text-left">
                    <h3 className="text-lg font-bold text-white mb-4">Security Parameters</h3>
                    <div className="space-y-4 text-sm text-gray-300">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-gray-400">Password status</span>
                        <span className="text-green-400 font-medium">Hashed (bcryptjs)</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-gray-400">Multi-device safety</span>
                        <span className="text-emerald-400 font-medium">Token rotation enabled</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-400">Account status</span>
                        <span className="text-teal-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                          Authenticated
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass p-6 rounded-3xl border border-white/5 bg-dark-900/40 text-left">
                    <h3 className="text-lg font-bold text-white mb-2">Device Metadata</h3>
                    <p className="text-xs text-gray-500 mb-4">Current session details cached locally</p>
                    <div className="space-y-2 text-xs text-gray-400 font-mono">
                      <div>User Agent: {window.navigator.userAgent}</div>
                      <div>Language: {window.navigator.language}</div>
                      <div>Screen Resolution: {window.screen.width}x{window.screen.height}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 4: SETTINGS configuration view */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="text-left mb-6">
                  <h1 className="text-3xl font-extrabold text-white mb-2 font-sans flex items-center gap-2">
                    <Settings className="w-8 h-8 text-emerald-400" />
                    Settings Panel
                  </h1>
                  <p className="text-gray-400 text-sm">Configure security rules, token details, or terminate profiles.</p>
                </div>

                <div className="glass rounded-3xl p-6 border border-white/5 bg-dark-900/40 space-y-6 text-left">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-emerald-400" />
                    Quick Shortcuts
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => openEditModal('profile')}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left flex items-start gap-3 group"
                    >
                      <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">Modify Profile</div>
                        <p className="text-xs text-gray-400 mt-0.5">Edit biography and names</p>
                      </div>
                    </button>

                    <button
                      onClick={() => openEditModal('password')}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left flex items-start gap-3 group"
                    >
                      <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">Rotate Passwords</div>
                        <p className="text-xs text-gray-400 mt-0.5">Update credentials</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 border border-red-500/10 bg-red-950/10 text-left space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-1 flex items-center gap-2">
                      <UserMinus className="w-5 h-5" />
                      Danger Zone
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Permanently terminate your account. All statistics, login records, and authentication tokens will be deleted immediately. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => openEditModal('profile')} // Opens settings modal, user can select Danger Zone tab
                    className="px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-semibold text-sm transition-colors"
                  >
                    Delete Aegis Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Edit settings modal container */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTab={editModalTab}
      />
    </div>
  );
};
