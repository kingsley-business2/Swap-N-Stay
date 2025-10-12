// ========================== src/pages/AuthCallback.tsx ==========================
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase typically handles the session logic automatically on this page load.
        // We just need to redirect the user after a moment.
        toast.success('Authentication complete! Redirecting...');

        // Redirect to the profile setup page to ensure all user data is captured.
        // The AuthRedirectRoute will take over from here.
        const redirectTimer = setTimeout(() => {
            navigate('/setup-profile', { replace: true });
        }, 3000); 

        return () => clearTimeout(redirectTimer);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen p-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Finalizing sign-in...</h2>
                <span className="loading loading-dots loading-lg text-primary"></span>
                <p className="mt-4 text-gray-500">Please wait.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
