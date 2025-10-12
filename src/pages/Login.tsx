// ========================== src/pages/Login.tsx (RE-FIXED: Syntax and Navigation) ==========================
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../api/supabase';
// Ensure the import below is correct for your project:
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Navigate to root path, where AuthRedirect handles the final destination
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email before logging in');
        } else {
          toast.error(`Login failed: ${error.message}`);
        }
      } else {
        toast.success('Welcome back!');
        // Navigate to the root path ('/') after successful login
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
            autoComplete="email"
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
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
