const db = require("../db/connection");
const { checkArticleExists } = require("./articles")

function readCommentsByArticleId(article_id) {
  return checkArticleExists(article_id).then(() => {
    return db
      .query(
        `SELECT comment_id, votes, created_at, author, body, article_id  
         FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`,
        [article_id]
      )
      .then(({ rows }) => rows);
  });
}


function readCommentByCommentId(comment_id){
  return db
    .query(
      `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
      return rows;
    });
}

module.exports = { readCommentsByArticleId, readCommentByCommentId };
