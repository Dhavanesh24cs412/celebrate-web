import React from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { Button } from '../../components/ui/Button';

export const ClientHome: React.FC = () => {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-celebrate-cream p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl p-10 shadow-sm border border-celebrate-navy/5 flex flex-col items-center mt-10">
        <h1 className="font-serif text-4xl text-celebrate-navy mb-8">Welcome to Celebrate</h1>
        <p className="text-celebrate-navy/70 mb-8 text-center">
          You are successfully signed in as a Client.
        </p>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};
