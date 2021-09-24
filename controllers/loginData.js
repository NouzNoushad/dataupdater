const User = require('../models/User');
const bcrypt = require('bcrypt');

const loginData = (req, res) => {

    try {
        let errors = [];
        return res.render('login', {errors});
    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

const postLoginData = async (req, res) => {

    try {
        let errors = [];
        //validation
        const { email, password } = req.body;
        //check all fields
        if (!email || !password) {
            errors.push({ message: 'All fields are required' });
        }
        //password limited to 5 characters
        if (password.length > 5) {
            errors.push({ message: 'Password should atleast 5 characters' });
        }
        //errors
        if (errors.length > 0) {
            return res.render('login', { errors });

        } else {
            const user = await User.findOne({ email: email });
            if (user) {
                //check password match
                const matchPassword = await bcrypt.compare(password, user.password);
                //create jwt token
                const token = await user.generateJwtToken();
                //save token in browser cookie
                res.cookie('userjwt', token, {
                    expires: new Date(Date.now() + 200000000),
                    httpOnly: true
                })

                if (!matchPassword) {
                    errors.push({ message: 'Invalid password' });
                    return res.render('login', { errors });

                } else {
                    req.flash('success_msg', 'You are logged In successfully');
                    return res.render('data', { user });
                }
            }
            
        }
    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}
module.exports = {
    loginData,
    postLoginData
}