// ========================== src/pages/Login.tsx ==========================
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../api/supabase';

const Login: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Sign In / Sign Up</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: 'default' }}
        providers={[]} // REMOVED Google/GitHub - email/password only
      />
    </div>
  );
};

export default Login;
