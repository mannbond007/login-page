import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Lock, Trash2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'profile' | 'password';
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'password' | 'danger'>(initialTab);
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Account delete double verification state
  const [deleteVerification, setDeleteVerification] = useState('');
  
  // Request feedback states
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveSubTab(initialTab);
      setName(user?.name || '');
      setBio(user?.bio || '');
      // Reset password states
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setDeleteVerification('');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen, initialTab, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    
    if (!name.trim()) {
      setErrorMsg('Name is required');
      return;
    }
    
    try {
      setSubmitting(true);
      await updateProfile(name, bio);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('All password fields are required');
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    try {
      setSubmitting(true);
      await changePassword(currentPassword, newPassword);
      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    
    if (deleteVerification !== 'delete my account') {
      setErrorMsg('Please type the validation phrase exactly');
      return;
    }
    
    try {
      setSubmitting(true);
      await deleteAccount();
      // Auth state will redirect automatically
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete account');
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking box
              className="w-full max-w-lg glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-lg font-bold text-white">Account Settings</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs navigation */}
              <div className="flex px-6 pt-3 border-b border-white/5 text-sm gap-1 bg-white/[0.01]">
                <button
                  onClick={() => { setActiveSubTab('profile'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
                    activeSubTab === 'profile'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => { setActiveSubTab('password'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
                    activeSubTab === 'password'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </button>
                <button
                  onClick={() => { setActiveSubTab('danger'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
                    activeSubTab === 'danger'
                      ? 'border-red-500 text-red-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Danger Zone</span>
                </button>
              </div>

              {/* Body Content Container */}
              <div className="p-6 overflow-y-auto flex-1 text-left">
                {/* Feedback alerts */}
                {successMsg && (
                  <div className="mb-4 p-4 rounded-xl border border-green-500/10 bg-green-500/5 text-green-400 text-sm flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="mb-4 p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-sm flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Sub Tab: Profile Edit */}
                {activeSubTab === 'profile' && (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                        placeholder="John Doe"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Biography / Status
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm h-24 resize-none"
                        placeholder="Tell us about yourself..."
                        disabled={submitting}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                      {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                      <span>Save Changes</span>
                    </button>
                  </form>
                )}

                {/* Sub Tab: Password Change */}
                {activeSubTab === 'password' && (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                        placeholder="••••••••"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                        placeholder="••••••••"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input text-sm"
                        placeholder="••••••••"
                        disabled={submitting}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                      {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                      <span>Change Password</span>
                    </button>
                  </form>
                )}

                {/* Sub Tab: Danger Zone */}
                {activeSubTab === 'danger' && (
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex gap-3">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div className="space-y-1">
                        <span className="font-bold">This action is permanent!</span>
                        <p className="text-xs text-red-400/80 leading-relaxed">
                          Deleting your account will purge your credentials, stats, and security logs from our databases.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Type <span className="text-red-400 font-bold">delete my account</span> to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteVerification}
                        onChange={(e) => setDeleteVerification(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white glass-input border-red-500/20 focus:border-red-500 text-sm"
                        placeholder="delete my account"
                        disabled={submitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || deleteVerification !== 'delete my account'}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 transition-colors shadow-lg shadow-red-500/10 flex items-center justify-center gap-2"
                    >
                      {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                      <span>Delete My Account</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
