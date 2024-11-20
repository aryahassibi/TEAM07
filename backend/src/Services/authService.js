const bcrypt = require('bcrypt');
const UsersController = require('../Controllers/userController');

const usersController = new UsersController();

async function register(user) {
    try {
        user.password_hash = await bcrypt.hash(user.password, 10);  // Hash the password, salt is 10 here

        delete user.password; // Remove plain password

        const userId = await usersController.save(user);   // by using save method user
        return { message: 'Registration successful', userId };
    } catch (err) {
        throw new Error('Registration failed: ' + err.message);
    }
}

async function login(email, password) {
    try {
        // Fetch user by email
        const user = await usersController.getUserByEmail(email);

        // Validate password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }

        // Exclude password_hash in response
        const { password_hash, ...userDetails } = user;
        return userDetails;
    } catch (err) {
        throw new Error('Login failed: ' + err.message);
    }
}

module.exports = { register, login };
