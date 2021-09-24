const User = require('../models/User');

const userData = async (req, res) => {

    try {
        const user = req.user;
        return res.render('data', {user});
    } catch (err) {
        console.log(err);
        return res.render('notFound');
    }
}

module.exports = userData;