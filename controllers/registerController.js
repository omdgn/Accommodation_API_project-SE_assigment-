const { registerUserService, loginUserService } = require('../services/registerService');

// Kayıt İşlemi
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const newUser = await registerUserService({ username, email, password, role });
        res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Giriş İşlemi
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await loginUserService({ email, password });
        res.status(200).json({ success: true, message: 'Login successful.', token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { registerUser, loginUser };
