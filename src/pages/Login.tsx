// ========================== src/pages/Login.tsx ==========================
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Sign In / Sign Up</h2>
      <p>Authentication form goes here (e.g., Supabase Auth UI or custom form).</p>
      <button className="btn btn-accent mt-4 w-full">Go to Sign Up</button>
    </div>
  );
};

export default Login;
