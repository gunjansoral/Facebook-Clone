const User = require('../models/User')
const Post = require('../models/Post')
const Code = require('../models/Code')
const { validateEmail, validateLength, validateUsername } = require('../helpers/validation')
const { sendVerificationEmail, sendResetCode } = require('../helpers/mailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateToken } = require('../helpers/tokens')
const generateCode = require('../helpers/generateCode')

exports.register = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            bYear,
            bMonth,
            bday,
            gender
        } = req.body

        //validation check
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'invalid email'
            })
        }

        const check = await User.findOne({ email })
        if (check) {
            return res.status(400).json({
                message: 'this email is already taken, please enter a different email address'
            })
        }
        if (!validateLength(firstname, 2, 30)) {
            return res.status(400).json({
                message: 'first name must be between 2 to 30 characters'
            })
        }
        if (!validateLength(lastname, 2, 30)) {
            return res.status(400).json({
                message: 'lastname name must be between 2 to 30 characters'
            })
        }
        if (!validateLength(password, 6, 40)) {
            return res.status(400).json({
                message: 'password must be atleast 6 characters'
            })
        }
        const cryptedPassword = await bcrypt.hash(password, 12)

        let tempUsername = firstname + lastname
        let newUsername = await validateUsername(tempUsername)
        // return
        const user = await new User(
            {
                firstname,
                lastname,
                username: newUsername,
                email,
                password: cryptedPassword,
                bYear,
                bMonth,
                bday,
                gender
            }
        ).save()

        //email verification
        const emailVerificationToken = generateToken({ id: user._id.toString() }, '30m')
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
        sendVerificationEmail(user.email, user.firstname, url)
        const token = generateToken({ id: user._id.toString() }, '7d')
        res.send({
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            picture: user.picture,
            verified: user.verified,
            message: 'succesfully registered, please activate your account to start',
            token: token
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.activateAccount = async (req, res) => {
    try {
        const validUser = req.user.id
        const { token } = req.body
        const user = jwt.verify(token, process.env.TOKEN_SECRET)
        const check = await User.findById(user.id)

        if (validUser !== user.id) {
            return res.status(400).json({
                message: "You don't have the authorization to complete this operation.",
            })
        }
        if (check.verified == true) {
            return res
                .status(400)
                .json({ message: "This email is already activated." })
        } else {
            await User.findByIdAndUpdate(user.id, { verified: true })
            return res
                .status(200)
                .json({ message: "Account has beeen activated successfully." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'email is not connected to any account' })
        }
        const check = await bcrypt.compare(password, user.password)
        if (!check) {
            return res.status(400).json({ message: 'invalid credentials, try again' })
        }
        const token = generateToken({ id: user._id.toString() }, '7d')
        res.send({
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            picture: user.picture,
            verified: user.verified,
            token: token
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.sendVerification = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById(id)
        if (user.verified === true) {
            return res.status(400).json({
                message: 'This account is already activated.'
            })
        }
        const emailVerificationToken = generateToken({ id: user._id.toString() }, '30m')
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
        sendVerificationEmail(user.email, user.firstname, url)
        return res.status(200).json({
            message: 'Email verification link has been sent to your email.'
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.findUser = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).select('-password')
        if (!user) {
            return res.status(400).json({
                message: 'Account does not exist.'
            })
        }
        return res.status(200).json({
            email: user.email,
            picture: user.picture
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
exports.sendResetPasswordCode = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).select('-password')
        await Code.findOneAndRemove({ user: user._id })
        const code = generateCode(5)
        const savedCode = new Code({
            code,
            user: user._id
        }).save()
        sendResetCode(user.email, user.firstname, code)
        return res.status(200).json({
            message: 'Email reset code has been sent to your email'
        })
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
exports.validateResetCode = async (req, res) => {
    try {
        const { email, code } = req.body
        const user = await User.findOne({ email })
        const dbCode = await Code.findOne({ user: user._id })
        if (code !== dbCode.code) {
            return res.status(400).json({
                message: 'Verification code is wrong..'
            })
        }
        return res.status(200).json({
            message: "cCde is verified"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.changePassword = async (req, res) => {
    const { email, password } = req.body
    const cryptedPassword = await bcrypt.hash(password, 12)
    await User.findOneAndUpdate({ email },
        {
            password: cryptedPassword
        })
    return res.status(200).json({
        message: "Password has changed"
    })
}
exports.getProfile = async (req, res) => {
    try {
        const { username } = req.params
        const profile = await User.findOne({ username }).select('-password')
        if (!profile) {
            return res.json({ ok: false })
        }
        const posts = await Post.find({ user: profile._id }).populate('user')
        res.json({ ...profile.toObject(), posts })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}