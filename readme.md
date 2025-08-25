# B2C E-commerce API

## Overview

This project is a **RESTful API** built for a B2C (Business-to-Consumer) e-commerce platform. The architecture is modular and follows a **Domain-Driven Design (DDD)** pattern, with well-defined layers for `routes`, `services`, and `repositories`.

The API is designed to be the backbone of a complete e-commerce platform, managing entities such as `Users` and `Stores`. It handles CRUD operations, data validation, and business logic to ensure system integrity and security.

---

## Tech Stack

- **Language**: TypeScript
- **Web Framework**: Fastify
- **Type Provider**: `fastify-type-provider-zod`
- **Data Validation**: Zod
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: `bcryptjs`
- **Runtime Environment**: Node.js
- **Containers**: Docker

---

## Project Structure

The project is organized into logical layers to ensure a clear separation of concerns.

- `src/`: Contains all the application source code.
  - `controllers/`: Request handling logic (if used).
  - `services/`: Business logic, such as data validation, password hashing, and operation coordination.
  - `repositories/`: Database access layer, responsible for Prisma queries.
  - `routes/`: API endpoint definitions and input validation.
  - `utils/`: Utilities, including Zod schemas, types, and error messages.
  - `app.ts`: Where Fastify is configured and routes are registered.

---

## How to Run the Project

### Prerequisites

- Node.js
- Docker
- npm or yarn

### Instructions

1.  **Clone the repository:**

    ```bash
    git clone [REPO_URL]
    cd [PROJECT_NAME]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn
    ```

3.  **Set up the database with Docker Compose:**

    ```bash
    docker-compose up -d
    ```

4.  **Configure Prisma:**
    - Create a `.env` file with your database URL (`DATABASE_URL`).
    - Run migrations to create the tables in your database:
      ```bash
      npx prisma migrate dev
      ```

5.  **Generate the Prisma client:**

    ```bash
    npx prisma generate
    ```

6.  **Start the application:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

The API will be running at `http://localhost:3000`.

---

## API Endpoints

All API endpoints are documented using Swagger/OpenAPI. The documentation provides detailed information on each route, including accepted parameters, request bodies, and expected responses.

Once the application is running, the interactive documentation is available at:
`http://localhost:3000/docs`
