const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        console.log('Hashed Password:',hashedPassword);
    } catch(error) {
        console.error('Error hashing password:',error);
    }
};

// Replace 'your_password_here' with the password you want to hash
const password = 'insertpasswordhere';

hashPassword(password);
