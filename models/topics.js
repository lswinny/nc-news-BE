const db = require("../db/connection");

function readTopics() {
    return db.query("SELECT description, slug FROM topics").then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No topics found" });
      }
        return rows
    });
    }

    module.exports = { readTopics };