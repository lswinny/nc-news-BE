const express = require("express");
const cors = require('cors');
const app = express();
const { handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./controllers/app_error_handling");
const { getServerHealthCheck } = require("./controllers/serverHealthCheck");
const { getTopics } = require("./controllers/topics");
const { getArticles, getArticleById, postComment, patchArticleVotes } = require("./controllers/articles");
const { getUsers } = require("./controllers/users");
const { getCommentsByArticleId, deleteComment } = require("./controllers/comments")

app.use(cors());
app.use(express.json());
app.use('/api', express.static('public'));

app.get("/api/health", getServerHealthCheck);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.post("/api/articles/:article_id/comments", postComment)
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.use((req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
