const {
  readArticles,
  readArticleById,
  addComment,
} = require("../models/articles");

const getArticles = (req, res, next) => {
  readArticles()
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

module.exports = {
  getArticles,
  getArticleById,
  postComment,
};
