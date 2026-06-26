import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Cpu, Key, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-3xl glass border border-white/5 bg-dark-900/60 p-6 md:p-12 mb-8"
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[60px] -z-10" />
      
      {/* Subtle grid lines for high-fidelity SaaS look */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main greeting content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 tracking-wide mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SESSION DEPLOYED SECURELY</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white leading-tight"
          >
            Welcome Back, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">{user?.name}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-xl"
          >
            {user?.bio || 'Manage your account securely with our modern authentication system.'}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 border border-emerald-500/30 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>View Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-colors"
            >
              Dashboard Stats
            </button>
          </motion.div>
        </div>

        {/* Floating cards animation column */}
        <div className="lg:col-span-5 relative h-64 lg:h-72 w-full flex items-center justify-center">
          {/* Card 1: Token Status */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 left-6 md:left-12 glass p-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-black/30 border border-white/5 max-w-[200px]"
          >
            <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-400">JWT Token</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active
              </div>
            </div>
          </motion.div>

          {/* Card 2: Environment info */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-2 right-6 md:right-12 glass p-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-black/30 border border-white/5 max-w-[220px]"
          >
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-400">Security Mode</div>
              <div className="text-sm font-bold text-white">HttpOnly + ROT</div>
            </div>
          </motion.div>

          {/* Center decorative element */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
