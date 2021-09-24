const User = require('../models/User');
const jwt = require('jsonwebtoken');

const jwtToken = async (req, res, next) => {

    try {
        const token = req.cookies.userjwt;
        if (token == 'undefined') {
            req.flash('error_msg', 'Invalid password');
            return res.redirect('/login');
        }
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: verify._id, 'tokens.token': token });
        if (!user) {
            req.flash('error_msg', 'User data doesnot exist');
            return res.redirect('/register')

        } else {
            req.user = user;
            return next();
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = jwtToken;