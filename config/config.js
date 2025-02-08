if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  "development": {
    "username": process.env.DB_USER_DEV,
    "password": process.env.DB_PASS_DEV,
    "database": process.env.DB_DATABASE_DEV,
    "host": process.env.DB_HOST_DEV,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER_PROD,
    "password": process.env.DB_PASS_PROD,
    "database": process.env.DB_DATABASE_PROD,
    "host": process.env.DB_HOST_PROD,
    "dialect": "postgres",
    "dialectOptions": {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  }
}
