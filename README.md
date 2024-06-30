# Software co. Practical Task

This project implements a User and Role management system using Node.js, Express, MongoDB, and Mongoose. It provides CRUD operations for users and roles, login/signup functionality, access module management, and more.

## Project Structure

The project structure includes the following components:

- `models/`: Contains Mongoose models for User and Role.
- `routes/`: Contains API routes for User and Role management.
- `controllers/`: Contains controller functions for handling requests and responses.
- `services/`: Contains business logic and database interaction logic.
- `validation/`: Contains validation for the api request.
- `utils/`: Contains utility functions, such as common response & middlewares.

## Tasks Implemented

### 1. User Module and Role Module CRUD Operations

- **User Module:**
  - Create, Read, Update, Delete (CRUD) operations for managing user details.
  - User model includes basic details and a reference to the Role module.

- **Role Module:**
  - CRUD operations for managing roles.
  - Role model includes roleName, access modules, createdAt, and active status.

### 2. User List API

- In this API listed users along with search and pagination.
- Populates roleName and access modules from the Role module for each user.

### 3. Login and Signup APIs

- **Signup API:** Allows users to register with basic details.
- **Login API:** Authenticates users based on credentials (e.g., email and password).

### 4. Update List of Access Modules

- Managed to handle this task along with update role endpoint to add unique access modules to a role or to remove access modules from a role.

### 5. Check User Access to Modules

- In this API for checking if user has access to a specific module based on their role.

### 6. Update Many Users with Same Data & Update Many Users with Different Data

- This task i have done in single api with the help of flag named "all_user" where i use to update all the users data with same value and for different data i am accepting array of object to update the different user with different data.

### Additional Notes

- **Search Functionality:** Implemented search functionality as well pagination in list APIs of role and user.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>

2. **Install the dependencies:**
   ```bash
   npm install

3. **Set up environment variables:**
  - Create a .env file in the root directory (added in repo it self).

4. **Start the server:**
   ```bash
   npm start //for starting server
   npm run dev //for starting development server

3. **API Documentation:**
  - Added the postman collection into the folder.
  - To access the swagger preffer this : [swagger-url](http://localhost:3000/swagger-doc/#/).
  
