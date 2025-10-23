const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

const request = require("supertest");
const app = require("../middlewear/app.js");
const comments = require("../db/data/test-data/comments.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/", () => {
  test("200: Responds with the core API page message", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("Welcome!");
      });
  });
  test("404: Responds with not found for an invalid path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBe(3);

        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(13);

        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
});
describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);

        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article by its article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(typeof article).toBe("object");
        expect(article.article_id).toBe(2);
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("400: Responds with an error message when a request is made for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not_an_article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: Please check the format of your input"
        );
      });
  });
});
describe("GET /api/articles/:id/comments", () => {
  test("200: Responds with all comments with a particular article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(3);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
        });
      });
  });
  test("400: Responds with an error message when a request is made for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not_an_article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: Please check the format of your input"
        );
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("200: Responds with a new comment added to an article when given an article_id", () => {
    const newComment = {
      author: "butter_bridge",
      body: "And I think to myself... what a wonderful world...!?",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.article_id).toBe(2);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe(
          "And I think to myself... what a wonderful world...!?"
        );
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
      });
  });
});
