import React, { useEffect } from 'react';

const Admin = () => {
  useEffect(() => {
    window.location.href = '/admin';
  }, []);

  return <div>Redirecting to admin panel...</div>;
};

export default Admin;