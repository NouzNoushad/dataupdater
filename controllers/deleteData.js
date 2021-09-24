const User = require("../models/User")

const deleteData = async (req, res) => {

    try {
        const user = await User.findOneAndRemove({ _id: req.params.id });
        req.flash('success_msg', `${user.name} has deleted the data successfully`);
        return res.redirect('/register');

    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

module.exports = deleteData;