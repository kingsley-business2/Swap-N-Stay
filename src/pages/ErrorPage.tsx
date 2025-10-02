// ========================== src/pages/ErrorPage.tsx ==========================
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-5xl font-extrabold text-error mb-4">Oops!</h1>
      <h2 className="text-2xl font-semibold mb-6">An unexpected error occurred.</h2>
      <p className="mb-8">Please try refreshing the page or navigating back to the home screen.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
