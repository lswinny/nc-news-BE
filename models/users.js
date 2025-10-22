const db = require("../db/connection");

function readUsers() {
  return db.query(`SELECT username, name, avatar_url FROM users`)
    .then(({ rows }) => rows);
}

module.exports = { readUsers };