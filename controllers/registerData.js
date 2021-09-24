const File = require('../models/File');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const registerData = (req, res) => {

    try {
        let errors = [];
        return res.render('register', {errors});
    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

const postRegisterData = (req, res) => {
    
    try {
        let errors = [];
        req.upload(req, res, async (err) => {

            if (err) {
                errors.push({ message: `${err}` });
            }
            if (req.file) {

                req.file.uuid = uuidv4();
                const image = await File.create(req.file);

                //validations
                const { name, email, phone, profession, password, cpassword } = req.body;
                //check all fields
                if (!name || !email || !phone || !profession || !password || !cpassword) {
                    errors.push({ message: 'All fields are required' });
                }
                //check password match
                if (password !== cpassword) {
                    errors.push({ message: 'Password do not match. please try again' });
                }
                //password limited to 5 characters
                if (password.length > 5) {
                    errors.push({ message: 'Password should atleast 5 characters' });
                }
                //phone number max 15
                if (phone.length > 15) {
                    errors.push({ message: 'Phone number should not exceed 15 digits' });
                }
                //error
                if (errors.length > 0) {
                    return res.render('register', { errors });

                } else {
                    const user = await User.findOne({ email: email });
                    if (user) {
                        errors.push({ message: 'email is already taken' });

                    } else {
                        //create new user
                        const newUser = new User({
                            image: image.filename,
                            name,
                            email,
                            phone,
                            profession,
                            password,
                            cpassword
                        });

                        //bcrypt password and cpassword -> userschema
                        await newUser.save();
                        req.flash('success_msg', 'Your data has been registered successfully');
                        return res.redirect('/login');
                    }
                }
            } else {
                errors.push({ message: 'Please upload an image' });
                return res.render('register', { errors });
            }
        });

    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

module.exports = { registerData, postRegisterData };