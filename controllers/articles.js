const {
  readArticles,
  readArticleById,
  addComment,
  updateArticleVotes,
} = require("../models/articles");

const getArticles = (req, res, next) => {

  const { sort_by = "created_at", order = "desc" } = req.query;
  const validSortColumns = [
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
    "created_at"
  ];
  const validOrders = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by) || !validOrders.includes(order)) {
    return next({ status: 400, msg: "Invalid sort_by column or order value" });
  }

  readArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return readArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { author, body } = req.body;
  return addComment(article_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    return next({
      status: 400,
      msg: "Bad request: inc_votes must be a number",
    });
  }

  return updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticleById,
  postComment,
  patchArticleVotes,
};
