// authorization middleware for managers to edit review status
// NOT TESTED OR USED IN ROUTES
const authorizationMiddleware = (req, res, next) => {
    const user = req.user; // Assuming user is added to the request (e.g., via JWT or session)
  
    if (!user || user.role !== 'sales_manager' && user.role !== 'product_manager') {
      return res.status(403).json({ message: 'Forbidden: You must be a manager to perform this action.' });
    }
  
    next();
};
  
module.exports = authorizationMiddleware;