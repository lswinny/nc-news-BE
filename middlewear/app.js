const express = require("express");
const app = express();
const { handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./app_error_handling");
const { getServerHealthCheck } = require("../controllers/serverHealthCheck");
const { getTopics } = require("../controllers/topics");
const { getArticles, getArticleById, postComment, patchArticleVotes } = require("../controllers/articles");
const { getUsers } = require("../controllers/users");
const { getCommentsByArticleId, deleteComment } = require("../controllers/comments")

app.use(express.json());

app.get("/api/", getServerHealthCheck);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment)
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use((req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
