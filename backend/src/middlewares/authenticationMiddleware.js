// authentication middleware for review submission
// NOT TESTED OR USED IN ROUTES
const authenticationMiddleware = (req, res, next) => {
  const user = req.user; // Assuming user information is populated here (e.g., from a JWT token or session)

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: You must be logged in to submit a review.' });
  }

  next(); // Allow the request to proceed to the review submission route
};

module.exports = authenticationMiddleware;
