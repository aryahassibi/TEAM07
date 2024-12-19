// src/context/AdminContext.js
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

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
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminRole, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate the 'children' prop
};

export default AdminContext;
