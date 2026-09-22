import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'client' | 'planner';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-celebrate-cream flex items-center justify-center">
        <div className="text-celebrate-navy font-medium">Loading Celebrate...</div>
      </div>
    );
  }

  // Not authenticated:
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated + no profile:
  if (!profile) {
    if (location.pathname !== '/choose-role') {
      return <Navigate to="/choose-role" replace />;
    }
    return <>{children}</>;
  }

  // Authenticated + profile + onboarding incomplete:
  if (!profile.onboarding_completed) {
    const targetOnboarding = `/onboarding/${profile.role}`;
    if (location.pathname !== targetOnboarding) {
      return <Navigate to={targetOnboarding} replace />;
    }
    return <>{children}</>;
  }

  // Authenticated + profile + onboarding complete
  // (We are fully onboarded)
  
  // If they try to hit choose-role or onboarding again, bounce them to their home
  if (
    location.pathname === '/choose-role' ||
    location.pathname.startsWith('/onboarding')
  ) {
    return <Navigate to={`/${profile.role}`} replace />;
  }

  // Role-Specific Route Protection
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to={`/${profile.role}`} replace />;
  }

  return <>{children}</>;
};
