const jwt = require('jsonwebtoken');
const User = require('./../models/user')

const config = require('../config')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})
        if (!token) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log("e",e)
        res.status(401).send({error : 'You are not authorized!'})
    }
}

module.exports = auth