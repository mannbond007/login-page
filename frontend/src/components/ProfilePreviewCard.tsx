import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, Calendar, Edit3, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfilePreviewCardProps {
  onEditClick: (tab: 'profile' | 'password') => void;
}

export const ProfilePreviewCard: React.FC<ProfilePreviewCardProps> = ({ onEditClick }) => {
  const { user } = useAuth();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-[50px] -z-10" />

      {/* Profile Header: Avatar and Role Badge */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/5">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity" />
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="relative w-20 h-20 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="relative w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center border border-white/10 text-emerald-400 font-bold text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">
            {user?.name}
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-xs font-semibold text-emerald-300 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>{user?.role}</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            {user?.bio}
          </p>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="py-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="p-2 bg-white/5 rounded-lg border border-white/5">
            <Mail className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Email Address</div>
            <div className="text-sm font-medium text-white">{user?.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <div className="p-2 bg-white/5 rounded-lg border border-white/5">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Member Since</div>
            <div className="text-sm font-medium text-white">
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => onEditClick('profile')}
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 hover:border-white/10 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
        <button
          onClick={() => onEditClick('password')}
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300 hover:text-emerald-200 rounded-xl border border-emerald-500/20 transition-colors"
        >
          <KeyRound className="w-4 h-4" />
          <span>Password</span>
        </button>
      </div>
    </motion.div>
  );
};
