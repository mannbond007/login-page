import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, UserCheck, Calendar, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsData {
  accountStatus: string;
  role: string;
  joinDate: string;
  lastLogin: string;
}

export const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError('Unable to retrieve stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Framer Motion variant for stagger entrance
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 animate-pulse flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-white/5 rounded-xl" />
              <div className="w-20 h-4 bg-white/5 rounded-lg" />
            </div>
            <div className="w-32 h-7 bg-white/5 rounded-lg mt-2" />
            <div className="w-24 h-4 bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass p-6 rounded-2xl border border-red-500/10 bg-red-500/5 mb-8 flex items-center gap-3 text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error || 'Failed to load stats details'}</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Account Status',
      value: stats.accountStatus,
      subtext: 'Secure connection',
      icon: ShieldCheck,
      colorClass: 'text-green-400 bg-green-500/10 border-green-500/20',
      gradientBorder: 'hover:border-green-500/40',
    },
    {
      title: 'User Role',
      value: stats.role,
      subtext: 'Permissions level',
      icon: UserCheck,
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      gradientBorder: 'hover:border-emerald-500/40',
    },
    {
      title: 'Join Date',
      value: formatDate(stats.joinDate),
      subtext: 'Registered member',
      icon: Calendar,
      colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      gradientBorder: 'hover:border-teal-500/40',
    },
    {
      title: 'Last Login',
      value: formatDate(stats.lastLogin),
      subtext: formatTime(stats.lastLogin),
      icon: Clock,
      colorClass: 'text-lime-400 bg-lime-500/10 border-lime-500/20',
      gradientBorder: 'hover:border-lime-500/40',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass glass-hover p-6 rounded-2xl border border-white/5 flex flex-col text-left transition-all duration-300 relative overflow-hidden group ${card.gradientBorder}`}
          >
            {/* Subtle glow layer */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl border ${card.colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
                METRIC
              </span>
            </div>

            <h3 className="text-gray-400 text-sm font-medium mb-1">
              {card.title}
            </h3>

            <div className="text-xl font-bold text-white tracking-tight mb-1">
              {card.value}
            </div>

            <div className="text-xs text-gray-500 font-medium">
              {card.subtext}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
