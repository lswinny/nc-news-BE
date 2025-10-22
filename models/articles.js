const db = require("../db/connection");

function readArticles() {
  return db
    .query (
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => rows);
}

function readArticleById(article_id) {
  return db.query (`SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url
      FROM articles WHERE article_id = $1`, [article_id])
      .then(({ rows }) => rows[0]);
}

module.exports = { readArticles, readArticleById };
