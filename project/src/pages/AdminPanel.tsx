import React from 'react';

function AdminPanel() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to the admin dashboard. Manage your application settings and users here.</p>
      </div>
    </div>
  );
}

export default AdminPanel;