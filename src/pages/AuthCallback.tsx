// ========================== src/App.tsx (Check inside <AppContent />'s <Routes>) ==========================

// ...
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Re-enter this line exactly as written: */}
          <Route path="/auth/callback" element={<AuthCallbackRoute />} />
          
          {/* Core App Routes */}
// ...
