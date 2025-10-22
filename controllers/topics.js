const { readTopics } = require("../models/topics")

const getTopics = (req, res) => {
    readTopics().then((topics) => {
        res.status(200).send({topics});
    })
};


module.exports = {
    getTopics,
};