const { readArticles, readArticleById } = require("../models/articles")

const getArticles = (req, res) => {
    readArticles().then((articles) => {
        res.status(200).send({articles});
    })
};

const getArticleById = (req, res) => {
    const { article_id } = req.params;
    readArticleById(article_id).then((article) => {
        return res.status(200).send({article});
    })
};


module.exports = {
    getArticles, 
    getArticleById
};