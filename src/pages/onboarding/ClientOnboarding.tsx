import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/auth/AuthProvider';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const ClientOnboarding: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || profile?.role !== 'client') return;
    
    setError(null);
    setLoading(true);
    
    try {
      // 1. Insert into client_profiles
      const { error: insertError } = await supabase
        .from('client_profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName,
          phone,
          city,
        });

      if (insertError) throw insertError;

      // 2. Call complete_onboarding
      const { error: rpcError } = await supabase.rpc('complete_onboarding');
      if (rpcError) throw rpcError;

      // 3. Refresh profile and navigate
      await refreshProfile();
      navigate('/client');
    } catch (err: any) {
      setError(err.message || 'An error occurred saving your profile.');
      setLoading(false);
    }
  };

  const handleGoBack = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from('profiles').delete().eq('id', user.id);
      await refreshProfile();
      // ProtectedRoute will automatically catch the null profile and redirect to /choose-role
    } catch (err) {
      console.error('Failed to go back:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-celebrate-cream flex flex-col items-center justify-center p-4 relative">
      <button 
        onClick={handleGoBack}
        disabled={loading}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-celebrate-navy/60 hover:text-celebrate-navy transition-colors font-medium disabled:opacity-50"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-8 md:p-10 border border-celebrate-navy/5">
        
        <h1 className="font-serif text-3xl text-celebrate-navy mb-2 text-center">
          Complete your profile
        </h1>
        <p className="text-celebrate-navy/70 text-center mb-8">
          Just a few details before you start planning.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-1.5" htmlFor="displayName">
              Display Name
            </label>
            <input
              id="displayName"
              required
              className="w-full h-12 px-4 rounded-xl border border-celebrate-navy/20 focus:outline-none focus:ring-2 focus:ring-celebrate-navy/50 bg-white"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-1.5" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              className="w-full h-12 px-4 rounded-xl border border-celebrate-navy/20 focus:outline-none focus:ring-2 focus:ring-celebrate-navy/50 bg-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-1.5" htmlFor="city">
              City
            </label>
            <input
              id="city"
              required
              className="w-full h-12 px-4 rounded-xl border border-celebrate-navy/20 focus:outline-none focus:ring-2 focus:ring-celebrate-navy/50 bg-white"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Finish Setup'}
          </Button>
        </form>
      </div>
    </div>
  );
};
