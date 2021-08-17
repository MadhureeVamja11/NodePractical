const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
  
}, {
    timestamps: true
});

// Find user by credentials
userSchema.statics.findByCredential = async function (email, password) {

    const user = await User.findOne({email})
    if (!user) {
        throw new Error('Invalid credentials!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid credentials!')
    }
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, config.JWT_SECRET, {expiresIn: "1 day"})

    user.tokens = user.tokens.concat({token});
    await user.save()

    return token
}

// Remove element from response json
userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Before saving user, manipulate password to hash string
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User
