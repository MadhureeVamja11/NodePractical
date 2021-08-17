const User = require('./../models/user')

class UserController {
    /**
     * Signup user
     * @param {*} req
     * @param {*} res
     */
     async signup(req, res) {
        const user = new User(req.body)
        try {
            await user.save();
            const token = await user.generateAuthToken()
            res.status(201).send({user, token})
        } catch (e) {
            res.status(400).send(e)
        }
    }

    /**
     * login user
     * @param {*} req
     * @param {*} res
     */
     async login(req, res) {
        try {
            const user = await User.findByCredential(req.body.email, req.body.password);
            const token = await user.generateAuthToken()
            res.status(200).send({ user, token })
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    /**
     * logout user
     * @param {*} req
     * @param {*} res
     */
     async logout(req, res) {
        try {
            const user = req.user
            user.tokens = user.tokens.filter((token) => {
                token.token !== req.token
            })
            user.save()
            res.status(200).send({message: "Logout successfully!"})
        } catch (e) {
            res.status(500).send({error: e.message})
        }
    }

   
}

module.exports = UserController