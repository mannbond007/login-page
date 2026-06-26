import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glowing blur effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Premium loading spinner */}
        <div className="relative flex flex-col items-center z-10">
          <div className="w-16 h-16 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium tracking-wide animate-pulse">
            Establishing secure connection...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
