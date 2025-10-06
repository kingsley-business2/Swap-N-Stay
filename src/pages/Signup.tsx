// ========================== src/pages/Signup.tsx ==========================
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabase';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log('Signup result:', authData, authError);

      if (authError) {
        toast.error(`Signup failed: ${authError.message}`);
        return;
      }

      // Check if email confirmation is required
      if (authData.user && authData.user.identities?.length === 0) {
        toast.error('User already exists');
        return;
      }

      if (authData.user) {
        if (authData.session) {
          // User is immediately logged in (if email confirmations are disabled)
          toast.success('Account created successfully! Welcome!');
          navigate('/auth-redirect');
        } else {
          // Email confirmation required
          toast.success('Account created! Please check your email to confirm your account.');
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            minLength={6}
          />
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
