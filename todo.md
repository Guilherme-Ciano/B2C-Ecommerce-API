### 🚀 Next Sprint

This section focuses on the immediate, high-priority tasks to get the core functionality ready. The main goal here is to establish a secure and functional login system.

#### Authentication and Authorization

- [ ] **JWT Implementation**: Integrate `fastify-jwt` to issue signed tokens upon successful login.
- [ ] **Secure Routes**: Implement JWT validation hooks to protect the core API endpoints.
- [ ] **Role-Based Access Control (RBAC)**: Create a decorator or a hook to restrict access to certain routes based on the user's role (e.g., only sellers can create stores).

#### Core Functionality

- [ ] **Login Endpoint**: Finalize the `POST /users/login` route to return a JWT instead of the user object.
- [ ] **User Data DTOs**: Create separate DTOs for the output data (`UserResponseDTO`, `StoreResponseDTO`) to prevent sensitive information like `passwordHash` from being sent in API responses.
- [ ] **Store Creation**: Refactor the `POST /stores` route to use a **JWT token** to identify the `owner` instead of a payload field.

---

### ⏳ Pending

This section covers important features and improvements that are not critical for the MVP but are essential for a robust application.

#### Data & Querying

- [ ] **Database Transactions**: Implement transactions for multi-step operations (e.g., creating a user and a store simultaneously) to ensure data consistency.
- [ ] **Search and Filtering**: Add query parameters to the `GET /stores` endpoint to enable filtering by `name`, `category`, and other fields.
- [ ] **Sorting**: Allow clients to sort data in the `GET` endpoints by fields like `createdAt` or `name`.

#### Code Quality

- [ ] **Middleware/Hooks**: Centralize common logic (e.g., logging) into Fastify hooks.
- [ ] **JSDoc Comments**: Add JSDoc to all public methods in the `services` and `repositories` to improve code clarity and enable auto-generated documentation.

---

### ✅ Completed

This section serves as a record of completed work, providing a clear overview of the project's foundation.

#### Core Structure

- [x] Configured the project with Node.js, Fastify, TypeScript, Prisma, and Zod.
- [x] Set up a Dockerized PostgreSQL database.
- [x] Defined `User` and `Store` models in `schema.prisma`.
- [x] Generated Prisma client and migrations.

#### CRUD Operations

- [x] Implemented `UserRepository` and `StoreRepository` with full CRUD functionality.
- [x] Created `UserService` and `StoreService` with business logic.
- [x] Defined basic API routes for `User` and `Store` entities.
- [x] Implemented **User Registration** and a basic **Login** method.

### Middlewares

- [x] Implemented error handling for the Prisma & Zod

---
