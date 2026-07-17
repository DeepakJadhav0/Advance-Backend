# Express Architecture Learning Project (ES Modules)

This project demonstrates different architectural patterns in Express.js applications using **ES Modules** (`import`/`export`). We have now implemented up to **Phase 3: Service Layer Pattern**.

## 📋 Table of Contents
1. [Phase 1: Basic Implementation (No Patterns)](#phase-1-basic-implementation-no-patterns)
2. [Phase 2: MVC Pattern](#phase-2-mvc-pattern)
3. [Phase 3: Service Layer Pattern (Current)](#phase-3-service-layer-pattern-current)
4. [Why We Need a Service Layer](#why-we-need-a-service-layer)
5. [Phase 4: Repository Pattern (Planned)](#phase-4-repository-pattern)
6. [Upcoming: Dependency Injection](#upcoming-dependency-injection)
7. [Upcoming: Clean Architecture](#upcoming-clean-architecture)
8. [Upcoming: Feature-Based Folder Structure](#upcoming-feature-based-folder-structure)
9. [Running the Application](#running-the-application)
10. [Testing the API](#testing-the-api)

---

### Phase 1: Basic Implementation (No Patterns)

**Description:**  
All logic in route handlers, direct data access (in‑memory array), no separation of concerns.

**Status:** Not demonstrated in current code (initial starting point).

---

### Phase 2: MVC Pattern

We separated concerns into three layers:

- **Model**: `src/models/User.js` – handles data storage and retrieval (CRUD operations).
- **Controller**: `src/controllers/userController.js` – handles HTTP requests and responses, calls the model for data operations.
- **Routes**: `src/routes/users.js` – maps URL paths to controller functions.
- **Server**: `src/server.js` – sets up Express, middleware, mounts routes, and starts the server.

**Data Flow:**  
```
HTTP Request → Routes → Controller → Model → Data Storage
```

**Files (ES Module syntax):**  
- `src/models/User.js` – factory function returning an object with CRUD methods.  
- `src/controllers/userController.js` – exports controller functions.  
- `src/routes/users.js` – imports controller functions and sets up routes.  
- `src/server.js` – imports routes and starts the server.

---

### Phase 3: Service Layer Pattern (Current)

We added a **service layer** between the controller and the model to encapsulate business logic (validation, rules, workflows).

**New File:**  
- `src/services/userService.js` – contains the `UserService` class with methods for user operations, including validation.

**Updated Data Flow:**  
```
HTTP Request → Routes → Controller → Service ↔ Model → Data Storage
```

**Responsibilities:**

| Layer | Responsibility |
|-------|----------------|
| **Controller** | Handles HTTP concerns only: reads `req`, writes `res`, translates errors to HTTP status codes. |
| **Service** | Contains **pure business logic**: validation (required fields, email format), rules, workflows. No knowledge of `req`/`res` or Express. |
| **Model** | Handles data persistence (CRUD). Knows nothing about HTTP or business rules. |

**Service (`src/services/userService.js`):**
```javascript
import createUserRepository from '../models/User.js';

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // ----- READ -----
  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = this.userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  // ----- CREATE -----
  async createUser(userData) {
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required');
    }
    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    return this.userRepository.create(userData);
  }

  // ----- UPDATE -----
  async updateUser(id, userData) {
    const existing = this.userRepository.findById(id);
    if (!existing) throw new Error('User not found');
    if (userData.email && !this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    return this.userRepository.update(id, userData);
  }

  // ----- DELETE -----
  async deleteUser(id) {
    const existing = this.userRepository.findById(id);
    if (!existing) throw new Error('User not found');
    return this.userRepository.delete(id);
  }

  // ----- Helper -----
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

**Controller (`src/controllers/userController.js`):**
```javascript
import UserService from '../services/userService.js';
import createUserRepository from '../models/User.js';

// Create repository and service instances
const userRepository = createUserRepository();
const userService = new UserService(userRepository);

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (
      error.message === 'Name and email are required' ||
      error.message === 'Invalid email format'
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      parseInt(req.params.id),
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    if (
      error.message === 'User not found' ||
      error.message === 'Invalid email format'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(parseInt(req.params.id));
    if (result) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
```

**Benefits of the Service Layer:**
- ✅ **Reusability:** The same `userService.createUser(data)` can be called from REST, GraphQL, CLI, WebSocket, etc.
- ✅ **Testability:** Business logic can be unit‑tested without mocking Express objects.
- ✅ **Maintainability / SRP:** Controllers change only when the HTTP contract changes; services change only when business rules change.
- ✅ **Separation of Concerns:** Clear division between HTTP handling, business rules, and data access.

---

### Why We Need a Service Layer

In a pure MVC setup, business logic (validation, rules) often ends up in the controller, leading to:

| Problem | Explanation |
|---------|-------------|
| **Duplication** | Another controller (admin, CLI, GraphQL) would need to copy‑paste the same validation. |
| **Hard to Test** | Testing validation requires mocking `req`/`res` objects. |
| **Tight Coupling** | Controller knows *how* validation works; changing a rule forces a controller change. |
| **SRP Violation** | Controller does two jobs: HTTP handling and business rules. |
| **No Reuse Across Layers** | Cannot reuse controller logic from a background job or script. |

The service layer solves these by extracting pure business logic into a reusable, testable class.

---

### Phase 4: Repository Pattern (Planned)

We will refactor the model into a true repository that abstracts data storage (easy swap to a database).  
The service will depend on a repository interface rather than a concrete in‑memory array.

**Benefits:**
- Data access logic centralized and interchangeable.
- Business logic unaware of storage details.
- Easier unit testing with mock repositories.

---

### Upcoming: Dependency Injection

Instead of hard‑coding `new UserService()` or `new UserRepository()`, we will inject dependencies (e.g., repository into service, service into controller).  
This will make classes more testable and decoupled.

---

### Upcoming: Clean Architecture

We will organize code by concern with inner layers (business rules, entities) independent of outer layers (frameworks, database).  
Dependencies will point inward.

---

### Upcoming: Feature‑Based Folder Structure

We will group files by feature (e.g., `src/features/users/`) rather than by technical role (controllers, models, etc.).  
This scales better for large applications.

---

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto‑reload (development)
npm dev
```

The server runs on `http://localhost:3000`.

---

## 🔧 Testing the API

Once the server is running, test the endpoints:

```bash
# Get all users
curl http://localhost:3000/users

# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get user by ID
curl http://localhost:3000/users/1

# Update user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'

# Delete user
curl -X DELETE http://localhost:3000/users/1
```

### Validation Examples

```bash
# Missing name
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
# → {"message":"Name and email are required"}

# Invalid email
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "not-an-email"}'
# → {"message":"Invalid email format"}
```

---

## 📝 What We've Learned So Far

**MVC + Service Layer Benefits (ES Modules):**
- Clear separation: Controller (HTTP) → Service (Business) → Model (Data).
- Business logic is reusable across different interfaces (REST, GraphQL, CLI, etc.).
- Unit testing of service logic is straightforward without Express mocks.
- Changes to business rules do not require changes to the controller or routes.
- Sets a clean foundation for adding Dependency Injection, Repository Pattern, Clean Architecture, and Feature‑Based Folder Structure.

**Current State:**  
We have implemented ES Modules, MVC, and a Service Layer with validation. The API behaves exactly as before but with improved internal structure.

**Next Steps:**  
Implement the Repository Pattern to further decouple the service from the data storage mechanism, then introduce Dependency Injection, followed by Clean Architecture and a Feature‑Based Folder Layout.

*Let me know if you'd like to proceed with the next pattern (Repository) or have any other questions!*  
