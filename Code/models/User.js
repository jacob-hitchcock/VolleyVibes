const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String,required: true,unique: true },
    email: { type: String,required: true,unique: true },
    password: { type: String,required: true },
    role: { type: String,enum: ['admin'],default: 'admin' },
    createdAt: { type: Date,default: Date.now },
    updatedAt: { type: Date,default: Date.now }
});

// Hash the password before saving the user model
userSchema.pre('save',async function(next) {
    if(this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password,salt);
        } catch(error) {
            next(error);
        }
    }
    next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password,this.password);
};

const User = mongoose.model('User',userSchema);

module.exports = User;
