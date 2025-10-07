// ========================== src/pages/admin/AdminReports.tsx ==========================
import React from 'react';
import { Link } from 'react-router-dom';

const AdminReports: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Admin</Link>
        <h1 className="text-3xl font-bold">Content Reports</h1>
      </div>

      <div className="card bg-base-200 p-8 text-center">
        <p className="text-lg mb-2">No reported content at this time.</p>
        <p className="text-gray-600">
          When users report products or services, they will appear here for review.
        </p>
      </div>
    </div>
  );
};

export default AdminReports;
