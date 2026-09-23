import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthProvider';
import type { UserRole } from '../components/auth/AuthProvider';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const ChooseRole: React.FC = () => {
  const { user, refreshProfile, signOut } = useAuth();
  const [loading, setLoading] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = async (role: UserRole) => {
    if (!user) return;
    setLoading(role);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          role,
          onboarding_completed: false,
        });
      
      if (insertError) {
        // If it already exists (23505 unique_violation), just refresh profile to let ProtectedRoute handle it.
        if (insertError.code === '23505') {
           await refreshProfile();
           return;
        }
        throw insertError;
      }
      
      // Successfully created profile
      await refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to select role.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-celebrate-cream flex flex-col items-center justify-center p-4 relative">
      <button 
        onClick={async () => {
          await signOut();
        }}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-celebrate-navy/60 hover:text-celebrate-navy transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl w-full">
        <h1 className="font-serif text-3xl md:text-4xl text-celebrate-navy text-center mb-10">
          How do you want to use Celebrate?
        </h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center max-w-lg mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Card */}
          <div className="bg-white rounded-3xl p-8 border border-celebrate-navy/5 shadow-sm flex flex-col items-center text-center">
            <h2 className="font-serif text-2xl text-celebrate-navy mb-2">Plan your celebration</h2>
            <div className="flex justify-center mb-6 mt-2">
              <img 
                src="/mascot/client-role.webp" 
                alt="Client Mascot" 
                className="h-28 sm:h-36 md:h-40 object-contain transition-transform hover:scale-105 duration-300"
              />
            </div>
            <p className="text-celebrate-navy/70 mb-8 flex-1">
              Find the right people and bring your event together with less effort.
            </p>
            <Button
              className="w-full"
              disabled={loading !== null}
              onClick={() => handleSelectRole('client')}
            >
              {loading === 'client' ? 'Continuing...' : 'Continue as Client'}
            </Button>
          </div>

          {/* Planner Card */}
          <div className="bg-white rounded-3xl p-8 border border-celebrate-navy/5 shadow-sm flex flex-col items-center text-center">
            <h2 className="font-serif text-2xl text-celebrate-navy mb-2">Grow your event business</h2>
            <div className="flex justify-center mb-6 mt-2">
              <img 
                src="/mascot/planner-role.webp" 
                alt="Planner Mascot" 
                className="h-28 sm:h-36 md:h-40 object-contain transition-transform hover:scale-105 duration-300"
              />
            </div>
            <p className="text-celebrate-navy/70 mb-8 flex-1">
              Discover relevant opportunities and build your work with Celebrate.
            </p>
            <Button
              className="w-full"
              disabled={loading !== null}
              onClick={() => handleSelectRole('planner')}
            >
              {loading === 'planner' ? 'Continuing...' : 'Continue as Planner'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
