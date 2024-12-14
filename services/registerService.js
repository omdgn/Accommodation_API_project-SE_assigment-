const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const registerUserService = async ({ username, email, password, role }) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new Error('Error: Incorrect or previously registered account.');
    }

    const newUser = await User.create({ username, email, password, role });

    return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
    };
};

const loginUserService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found.');
    }

    if (user.password !== password) {
        throw new Error('The password is not correct.');
    }

    const token = generateToken(user); // Token oluştur
    return token;
};

module.exports = { registerUserService, loginUserService };
