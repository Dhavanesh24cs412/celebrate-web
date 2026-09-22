import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthProvider';
import { Button } from '../components/ui/Button';

export const Auth: React.FC = () => {
  const { session, loading: authLoading } = useAuth();
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // If already authenticated and state is resolved, ProtectedRoute logic handles redirection,
  // but we can also add a quick redirect here to prevent flashing auth page for logged-in users.
  if (!authLoading && session) {
    // If they land on /auth but are already logged in, the callback/ProtectedRoute will sort them.
    // We can just redirect to /choose-role and let the router handle it.
    return <Navigate to="/choose-role" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // On success, the AuthProvider onAuthStateChange will pick it up
        // and re-render this component, triggering the <Navigate> above if session exists.
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.session) {
          // Auto signed in
        } else {
          setMessage('Check your email for the confirmation link.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-celebrate-cream flex flex-col items-center justify-center p-4 relative">
      <Link 
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-celebrate-navy/60 hover:text-celebrate-navy transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 md:p-10 border border-celebrate-navy/5">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-celebrate-navy mb-3">
            Welcome to Celebrate
          </h1>
          <p className="text-celebrate-navy/70 text-sm">
            Plan your celebration with the right people, or grow your event business with the right opportunities.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">
            {message}
          </div>
        )}

        <Button 
          variant="outline"
          className="w-full mb-6 py-6 font-medium text-celebrate-navy border-celebrate-navy/20 hover:bg-celebrate-cream"
          onClick={handleGoogleSignIn}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-celebrate-navy/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-celebrate-navy/50">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full h-12 px-4 rounded-xl border border-celebrate-navy/20 focus:outline-none focus:ring-2 focus:ring-celebrate-navy/50 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-celebrate-navy mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full h-12 px-4 rounded-xl border border-celebrate-navy/20 focus:outline-none focus:ring-2 focus:ring-celebrate-navy/50 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignIn ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-celebrate-navy/70 hover:text-celebrate-navy transition-colors font-medium"
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError(null);
              setMessage(null);
            }}
          >
            {isSignIn ? "Don't have an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
        
      </div>
    </div>
  );
};
