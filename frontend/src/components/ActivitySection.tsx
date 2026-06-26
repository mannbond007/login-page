import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LogIn, Key, UserCheck, Trash2, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityLog {
  _id: string;
  action: string;
  timestamp: string;
}

export const ActivitySection: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/activities');
      setActivities(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching dashboard activities:', err);
      setError('Unable to fetch recent activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getActivityDetails = (action: string) => {
    switch (action) {
      case 'User Logged In':
        return {
          icon: LogIn,
          colorClass: 'bg-green-500/10 text-green-400 border-green-500/20',
          title: 'Logged In Securely',
          description: 'Access token issued via auth flow',
        };
      case 'User Registered':
        return {
          icon: ShieldCheck,
          colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          title: 'Account Registered',
          description: 'A new secure profile was created',
        };
      case 'Profile Updated':
        return {
          icon: UserCheck,
          colorClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
          title: 'Profile Updated',
          description: 'Name or biography modified',
        };
      case 'Password Changed':
        return {
          icon: Key,
          colorClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          title: 'Password Changed',
          description: 'User credential secret rotated',
        };
      case 'Account Deleted':
        return {
          icon: Trash2,
          colorClass: 'bg-red-500/10 text-red-400 border-red-500/20',
          title: 'Account Deleted',
          description: 'Permanent profile erasure logs',
        };
      default:
        return {
          icon: ShieldCheck,
          colorClass: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
          title: action,
          description: 'Security operation completed',
        };
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="glass rounded-3xl p-6 md:p-8 border border-white/5 bg-dark-900/40 relative overflow-hidden flex flex-col text-left h-full"
    >
      <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
        <h2 className="text-xl font-bold text-white">Security & Activity Logs</h2>
        <button
          onClick={fetchActivities}
          className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors"
          title="Refresh activities"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6 flex-1 justify-center py-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-32 h-4 bg-white/5 rounded" />
                <div className="w-48 h-3 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass p-6 rounded-2xl border border-red-500/10 bg-red-500/5 mb-4 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="relative border-l border-white/5 pl-6 ml-4 flex-1 flex flex-col gap-6">
          {activities.map((activity) => {
            const details = getActivityDetails(activity.action);
            const Icon = details.icon;
            return (
              <div key={activity._id} className="relative group text-left">
                {/* Timeline dot */}
                <div className="absolute -left-[35px] top-0.5">
                  <div className={`p-1.5 rounded-lg border ${details.colorClass} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-semibold text-sm text-white">
                    {details.title}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {getRelativeTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {details.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
