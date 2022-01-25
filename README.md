# ffxiv-market-tester
Simple api server to teach myself GraphQL + Dockerization, and to re-orient myself with Node, Sequelize, PostgreSQL.

Basic Functionality is modeled after [GarlandTools crafting lists](https://garlandtools.org/db):
- A user can save/keep track of FFXIV item recipes 
- A recipe is composed of multiple ingredients (item + quantity)
- A user can also browse through items
- The user can also fetch the current in-game market price for items/ingredients via the [Universalis API](https://universalis.app/docs/index.html)
- Market prices are saved in the db, so it will always return the most recently fetched price until it is re-fetched from the server.
# Current Framework
```
- db                        // some helper scripts/data used to seed the database
    - raw_json
    - normalize.py
- server                    // Implemented as an Apollo GraphQL server
    - src
        - database          // sequelize models/migrations/seeders
        - resolvers         // GraphQL
        - schema            // GraphQL
        - tests             // tests
        - universalis       // API connector used as RESTDataSource for Apollo
```
# Setup-steps
1. Make `.env` file with the DB_credentials of choice (use `.env.sample` for reference):
```
POSTGRES_DB={...}
POSTGRES_USER={...}
POSTGRES_PASSWORD={...}
```
2. Run `docker-compose up` to start the SQL and API server.
3. Run `npx sequelize-cli db:seed:all` to seed the database.
**TODO**: set up docker-compose to do the seeding automatically only once
4. Access API at `http://localhost:4000` ([Apollo Sandbox link](https://studio.apollographql.com/sandbox/explorer?endpoint=http%3A%2F%2Flocalhost%3A4000%2F))
5. Run tests with `npm run tests`

# TODOS (incomplete stuff)
- Add more tests (input/output validation, unit tests, etc.).
    - only basic createUser, login, and getUsers with/without token tests have been added.
- Containerize/seperate authentication/authorization to its own separate image/endpoint
- Set up a frontend client for actual use (the server does not "calculate" the total cost of a recipe, we can put that into the frontend client)
- Expand the "saved recipe" model so the user can "expand" recipes continuously and not just at one level.
- Do the seeding from inside the server docker container
- 3rd Party API calls are costly
    - To update all items, the model has to be "flattened" into an array of items
    - Once all item prices have been updated, we need to re-run the query
    - Basically doubles the query time
- Set up jwt token invalidation on user delete