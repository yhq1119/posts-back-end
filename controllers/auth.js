const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        const { name, email, password } = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({
            name,
            email,
            password,
            profile,
            username
        })

        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            // res.json({
            //     user:success
            // })
            res.json({
                message: 'Signup success! Please signin.'
            })
        })
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Email has not registered, Please signup.'
            })
        }

        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Incorrect password.'
            })
        }

        // generate a token and send to client
        const expire = { expiresIn: '1d' }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, expire)

        res.cookie('token', token, expire)

        const { _id, username, name, email, role } = user
        return res.json({
            token, user: { _id, username, name, email, role }
        })
    })

}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Successfully Signout.'
    })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
})


exports.signup1 = (req, res) => {

    const {
        name,
        email,
        password
    } = req.body

    res.json({
        user: { name, email, password }
    })
}

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id
    User.findById({ _id: authUserId })
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                })
            }

            req.profile = user
            next()
        })
}

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id
    User.findById({ _id: adminUserId })
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                })
            }

            if (user.role !== 1) {
                return res.status(400).json({
                    error: 'Admin resource. Access denied.'
                })
            }

            req.profile = user
            next()
        })
}


