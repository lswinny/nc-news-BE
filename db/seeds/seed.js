const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createLookupObj } = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS comments; 
    DROP TABLE IF EXISTS articles; 
    DROP TABLE IF EXISTS topics; 
    DROP TABLE IF EXISTS users;`
    )
    .then(() => {
      return db.query(
        `CREATE TABLE users (
    username VARCHAR(30) PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    avatar_url VARCHAR(1000)
    );`
      );
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
       slug VARCHAR(30) PRIMARY KEY,
       description VARCHAR(100) NOT NULL,
        img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        topic VARCHAR(30) NOT NULL,
        FOREIGN KEY (topic) REFERENCES topics(slug),
        author VARCHAR(30) NOT NULL,
        FOREIGN KEY (author) REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INTEGER DEFAULT 0,
        article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            article_id INTEGER NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles(article_id),
            body TEXT NOT NULL,
            votes INTEGER DEFAULT 0,
            author VARCHAR(30) NOT NULL,
            FOREIGN KEY (author) REFERENCES users(username),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const sqlString = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(sqlString);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.description, topic.slug, topic.img_url];
      });
      const sqlString2 = format(
        `INSERT INTO topics (description, slug, img_url) VALUES %L`,
        formattedTopics
      );
      return db.query(sqlString2);
    })
    .then(() => {
      return articleData.map((article) => {
        return convertTimestampToDate(article);
      });
    })
    .then((timestampCorrectedData) => {
      const formattedArticles = timestampCorrectedData.map((article) => {
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes,
          article.article_img_url,
        ];
      });
      const sqlString3 = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(sqlString3);
    })
    .then((insertedArticlesResult) => {
      const insertedArticles = insertedArticlesResult.rows;
      const articleLookup = createLookupObj(
        insertedArticles,
        "title",
        "article_id"
      );
      const timestampedComments = commentData.map(convertTimestampToDate);

      const formattedComments = timestampedComments.map((comment) => {
        const article_id = articleLookup[comment.article_title];
        return [
          article_id,
          comment.body,
          comment.votes,
          comment.author,
          comment.created_at,
        ];
      });

      const sqlString4 = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );

      return db.query(sqlString4);
    });
};

module.exports = seed;
