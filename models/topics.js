const db = require("../db/connection");

function checkTopicExists(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No topic found" });
      }
    });
}

function readTopics() {
  return db.query("SELECT description, slug FROM topics").then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No topic found" });
    }
    return rows;
  });
}

module.exports = { checkTopicExists, readTopics };
