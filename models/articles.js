const db = require("../db/connection");

function checkArticleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No articles found" });
      }
    });
}
///////////
function readArticles(sort_by, order) {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No articles found" });
      }
      return rows;
    });
}

function readArticleById(article_id) {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url
      FROM articles WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Path Not Found" });
      }
      return rows[0];
    });
}

function addComment(article_id, author, body) {
  if (!author || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Missing required fields",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return db.query(
        `INSERT INTO comments (article_id, author, body)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [article_id, author, body]
      );
    })
    .then(({ rows }) => rows[0]);
}

function updateArticleVotes(article_id, inc_votes) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
        [inc_votes, article_id]
      );
    })
    .then(({ rows }) => rows[0]);
}

module.exports = {
  checkArticleExists,
  readArticles,
  readArticleById,
  addComment,
  updateArticleVotes,
};
