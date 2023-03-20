This repo is created specifically for [this](https://github.com/BuilderIO/qwik/issues/3449) issue.

# Steps to reproduce

1. clone the repo in the above url
2. run npm install
3. run wrangler d1 create DB to create a new d1 database
4. copy the credentials of your database and add them to wrangler.toml file in your root directory.

```toml
[[ d1_databases ]]
binding = "<BINDING_NAME>"
database_name = "<DATABASE_NAME>"
database_id = "<UUID>"
```

5. run wrangler d1 execute DB --local --file=./schema.sql to execute the schema against your database.
6. run npm run build
7. run npm run deploy
8. go to http://127.0.0.1:8788/error-code-3/ to see the first error in your terminal.
9. go to http://127.0.0.1:8788/err-invalid-state/ to see the second error in your terminal.
