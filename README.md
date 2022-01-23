# ffxiv-market-tester
Simple api server to teach myself GraphQL + Dockerization, functionality is modeled after [GarlandTools crafting lists](https://garlandtools.org/db) but with automatic [Universalis API](https://universalis.app/docs/index.html) integration instead of just manual input.

# Setup-steps
1. Make `.env` file with the DB_credentials of choice:
```
POSTGRES_DB={...}
POSTGRES_USER={...}
POSTGRES_PASSWORD={...}
```

2. Run `docker-compose up` to start the SQL server and seed it with data.