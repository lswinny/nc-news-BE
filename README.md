# NC News API
Hosted version: https://nc-news-be-98uw.onrender.com/api/

# Summary
The NC News API is a RESTful backend built with Node.js and Express and provides news articles, topics, users and comments using a PostgreSQL database.

# Requirements
-  Node.js ≥ 18.0.0  
-  PostgreSQL ≥ 12.0

# Set-up
Cloning
1. On the GitHub 'nc-news-BE' repo page, select code > https > copy
2. In VS Code, in the terminal, navigate to an appropriate folder in which to clone the repo and run this command in terminal: 
``` git clone https://github.com/lswinny/nc-news-BE.git ```

# Install Dependencies
To install all the required dependencies/devDependencies, run terminal command:  
``` npm install ```

# Seeding
1. Create two new files in the project root:'.env.development' and '.env.test' 
2. Inside each file, write 'PGDATABASE = ' followed by the respective database name which you'll find in the setup-dbs.sql file
3. Add these files to .gitignore by writing '.env.*' and 'node_modules' in the file.
4. Create the databases using terminal command: 
``` npm run setup-dbs ```
5. Seed the databases using terminal command: 
``` npm run seed ```

# Run Tests (uses Jest and Supertest)
Run all tests across all test files using terminal command: 
``` npm t ```

To run a specific test suite, use ``` npm t ``` followed by the test file name.

# Run locally (with live response to edits)
``` npm run nodemon ``` + run the fronend repo.