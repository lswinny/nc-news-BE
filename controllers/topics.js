const { readTopics } = require("../models/topics")

const getTopics = (req, res, next) => {
    readTopics().then((topics) => {
        res.status(200).send({topics});
    }).catch((err) => {
        next (err)
    })
};


module.exports = {
    getTopics,
};