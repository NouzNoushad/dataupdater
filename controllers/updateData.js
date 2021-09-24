const User = require("../models/User");
const File = require('../models/File');
const { v4: uuidv4 } = require('uuid');

const updateData = async (req, res) => {

    try {
        let errors = [];
        const user = await User.findById(req.params.id);
        return res.render('update', { user, errors });

    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

const postUpdateData = async (req, res) => {

    try {
        let image;
        let errors = [];
        const user = await User.findById(req.params.id);
        req.upload(req, res, async (err) => {
            if (err) {
                errors.push({ message: `${err}` });
            }
            if (!req.file) {
                image = user.image;
                
            } else {
                req.file.uuid = uuidv4();
                image = await File.create(req.file);
            }

            //validations
            const { name, email, phone, profession } = req.body;
            //check all fields
            if (!name || !email || !phone || !profession) {
                errors.push({ message: 'All fields are required' });
            }
            //check phone number
            if (phone && !Number(phone)) {
                errors.push({ message: 'Please provide valid phone number' });
            }
            //phone number max 15
            if (phone.length > 15) {
                errors.push({ message: 'Phone number should not exceed 15 digits' });
            }
            //errors
            if (errors.length > 0) {
                return res.render('update', { errors, user });
            }
            else {
                //update user data
                const updateData = await User.findOneAndUpdate({ _id: req.params.id }, {
                    $set: {
                        image: image.filename,
                        name,
                        email,
                        phone,
                        profession
                    }
                });
                req.flash('success_msg', `${updateData.name} has updated the data successfully`);
                return res.redirect('/data');
            }

        })
    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

module.exports = {
    updateData,
    postUpdateData

}