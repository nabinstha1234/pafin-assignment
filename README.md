# User CRUD REST API

This repository contains a CRUD (Create, Read, Update, Delete) REST API for managing users. The API is built using Node.js, TypeScript, Express, Inversify (IoC container), SOLID Principles, Jest for testing, JWT authentication for security, and PostgreSQL as the database. The API documentation is generated using apidoc.

## Installation Guide

### Clone Repository

```bash
git clone git@github.com:nabinstha1234/pafin-assignment.git
```

### Install Dependencies

```bash
pnpm install
```

### Set Up PostgreSQL Database

1. Install PostgreSQL and create a database.
2. Open the database/seeders/init.sql file and copy its contents.
3. Open a PostgreSQL query tool and paste the copied contents into the newly created database to set up the schema and initial data.

## Configure Environment

1. Copy the .env.example file and rename it to .env.
1. Update the content inside the .env file to match your database and other configuration details.

## Generate API Documentation

To generate the API documentation using apidoc, run the following command:

```bash
pnpm run docs
```

The documentation will be generated, and you can access it by navigating to the version route. For example: http://localhost:8080/v1

## Authorization Note

To perform CRUD operations on the user table, you need to authorize yourself as an admin user. Here's how:

1. Make a POST request to http://localhost:8080/v1/auth/login with the following payload:

```
{
  "email": "admin@email.com",
  "password": "admin"
}
```

2. You will receive a token in the response.
3. For other API endpoints, include the obtained token in the Authorization header with the format <b>Bearer your-token</b>.

## References

- Inversify: npm package
- PostgreSQL: Official website
- pg (Node.js PostgreSQL client): npm package
- apidoc (API Documentation Generator): npm package
