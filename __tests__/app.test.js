const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

const request = require("supertest");
const app = require("../app.js");
const comments = require("../db/data/test-data/comments.js");
const jestSorted = require("jest-sorted");

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
  const validColumns = ["title", "topic", "author", "votes", "created_at"];

  test("200: Responds with all articles when no filters applied", () => {
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
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("200: Responds with articles sorted by each valid column in descending order", () => {
    return Promise.all(
      validColumns.map((column) => {
        return request(app)
          .get(`/api/articles?sort_by=${column}&order=desc`)
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length).toBe(13);
            expect(body.articles).toBeSortedBy(column, { descending: true });
          });
      })
    );
  });
  test("200: Responds with articles sorted by each valid column in ascending order", () => {
    return Promise.all(
      validColumns.map((column) => {
        return request(app)
          .get(`/api/articles?sort_by=${column}&order=asc`)
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length).toBe(13);
            expect(body.articles).toBeSortedBy(column, { descending: false });
          });
      })
    );
  });
  test("200: Responds with articles filtered by a specified existing topic query", () => {
    return request(app)
      .get(`/api/articles?topic=cats`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toEqual(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: Topic exists but has no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
        expect(body.msg).toBe("Topic exists but has no associated articles");
      });
  });
  test("400: Responds with error for invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=treehugger&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by or order value");
      });
  });
  test("400: Responds with error for invalid order value", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=treehugger")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by or order value");
      });
  });
  test("404: Responds with error for non-existant topic", () => {
    return request(app)
      .get("/api/articles?topic=scuba%20diving")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No topic found");
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
  test("200: Responds with an article by its article_id, including comment count", () => {
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
        expect(typeof article.comment_count).toBe("number");
      });
  });
  test("400: Responds with error message when request for article_id is invalid type", () => {
    return request(app)
      .get("/api/articles/not_an_article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: Please check the format of your input"
        );
      });
  });
  test("404: Responds with error message when article_id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/678")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
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
  test("200: Responds with an empty array when article_id exists but has no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments found");
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
  test("404: Responds with error message when article_id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/678/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No articles found");
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
  test("400: Responds with error message when post lacks the required fields", () => {
    const newComment = { author: "butter_bridge" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Missing required fields");
      });
  });
  test("400: Responds with error message when article_id is not a number", () => {
    const newComment = {
      author: "butter_bridge",
      body: "BODY DATA",
    };
    return request(app)
      .post("/api/articles/not_an_article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: Please check the format of your input"
        );
      });
  });
  test("404: Responds with error message when article_id is valid but does not exist", () => {
    const newComment = {
      author: "butter_bridge",
      body: "BODY DATA",
    };

    return request(app)
      .post("/api/articles/860/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with increased number of votes in an article when given an article_id", () => {
    const update = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(2);
        expect(typeof article.votes).toBe("number");
        expect(article.votes).toBe(10);
      });
  });
  test("200: Responds with reduced number of votes in an article when given an article_id", () => {
    const update = { inc_votes: -100 };

    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(2);
        expect(typeof article.votes).toBe("number");
        expect(article.votes).toBe(-100);
      });
  });
  test("400: Responds with error message when patch lacks the required fields", () => {
    const update = {};
    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: inc_votes must be a number");
      });
  });
  test("400: Responds with error message when inc_votes is not a number", () => {
    const update = { inc_votes: "lemons" };
    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: inc_votes must be a number");
      });
  });
  test("400: Responds with error message when given an invalid article_id", () => {
    const update = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/not_an_article")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: Please check the format of your input"
        );
      });
  });
  test("404: Responds with error message when article_id is valid but does not exist", () => {
    const update = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/678")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content when given a comment_id to delete a comment", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
        expect(response.text).toBe("");
      });
  });
  test("400: Responds with error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/pumpkin")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: Please check the format of your input"
        );
      });
  });
  test("404: Responds with error message when valid comment_id does not exist", () => {
    return request(app)
      .patch("/api/comments/2")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("Deletes the comment and confirms that it's gone", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {
        return request(app).get("/api/comments/3").expect(404);
      });
  });
});
