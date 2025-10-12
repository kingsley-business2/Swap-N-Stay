// ========================== src/pages/Login.tsx (FIXED SNIPPET) ==========================

// ... (Existing code) ...

  // Redirect if already logged in (This is fine, but navigate should go to root)
  useEffect(() => {
    if (user) {
      // FIX 1: Change to '/' or keep it as /auth-redirect IF your AuthRedirect component is designed to handle it
      // Let's assume AuthRedirect is designed to handle the root path flow:
      navigate('/', { replace: true }); 
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
// ... (Login attempt logic) ...
      } else {
        toast.success('Welcome back!');
        // FIX 2: Navigate to the root path ('/') after successful login
        // The AuthRedirect component at '/' will handle the final destination.
        navigate('/'); 
      }
// ... (Rest of the file) ...
