import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';

export const AuthCallback: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Once loading is complete and session is established,
    // navigate to a protected route to let normal resolution take over.
    // We send them to /choose-role, which acts as the resolution hub for new users.
    // If they already have a profile, the ProtectedRoute on /choose-role will correctly bounce them to their home.
    if (!loading) {
      if (session) {
        navigate('/choose-role', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen bg-celebrate-cream flex items-center justify-center p-4">
      <div className="text-celebrate-navy font-medium">Completing sign in...</div>
    </div>
  );
};
