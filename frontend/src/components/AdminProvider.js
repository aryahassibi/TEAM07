// src/context/AdminContext.js
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Check if user is logged in as an admin
    if (token && (role === 'product_manager' || role === 'sales_manager')) {
      setIsAdmin(true);
      setAdminRole(role);
    } else {
      setIsAdmin(false);
      setAdminRole(null);
    }
  }, []);

  const logoutAdmin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAdmin(false);
    setAdminRole(null);
    alert('You have been logged out.');
    navigate('/admin/login'); // Redirect to admin login page
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminRole, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
