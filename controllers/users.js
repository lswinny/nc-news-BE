const { readUsers } = require("../models/users")

const getUsers = (req, res) => {
    readUsers().then((users) => {
        res.status(200).send({users});
    }).catch((err) => {
        next (err)
    })
};


module.exports = {
    getUsers,
};