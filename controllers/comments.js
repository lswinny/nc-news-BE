const { readCommentsByArticleId, readCommentByCommentId } = require("../models/comments");

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return readCommentsByArticleId(article_id)
    .then((comments) => {
      if(comments.length === 0){
        res.status(200).send({comments:[], msg: "No comments found"})
      } else {
      res.status(200).send({ comments: comments });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return readCommentByCommentId(comment_id)
  .then(() => {
    res.status(204).send();
  })
  .catch((err) => {
    next(err)
})
}

module.exports = {
  getCommentsByArticleId,
  deleteComment
};
