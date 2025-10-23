const { readCommentsByArticleId } = require("../models/comments");

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return readCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCommentsByArticleId,
};
