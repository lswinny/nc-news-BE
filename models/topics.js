const db = require("../db/connection");

function readTopics() {
    return db.query("SELECT description, slug FROM topics").then(({rows}) => {
        return rows
    });
    }

    module.exports = { readTopics };