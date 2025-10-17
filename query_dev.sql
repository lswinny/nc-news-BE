const db = require('./db/connection');

\c nc_news

-- SELECT username FROM users;
-- SELECT * FROM articles WHERE articles.topic = 'coding';
-- SELECT * FROM comments WHERE comments.votes < 0;
-- SELECT * FROM topics;
-- SELECT * FROM articles WHERE articles.author = 'grumpy19';
-- SELECT * FROM comments WHERE comments.votes > 10