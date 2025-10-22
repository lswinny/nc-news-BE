const express = require("express");
const app = express();
const { getServerHealthCheck } = require("./controllers/serverHealthCheck");
const { getTopics } = require("./controllers/topics");
const { getArticles, getArticleById } = require("./controllers/articles");
const { getUsers } = require("./controllers/users");

app.use(express.json());

app.get("/api/", getServerHealthCheck);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);


module.exports = app;
