# REST API Server for ToDo-List

This project serves as a REST API server to manage a ToDo list. Employing Clean Architecture (Hexogonal) ensures scalable and organized development, facilitating the separation of concerns as well as efficient adaptations and expansions in the future.

## Technologies

![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)

## Features

- **TypeScript Code**: Ensures robustness and maintainability.
- **Testing**: Enhances quality and reliability.
- **CI with GitHub Actions**: Automates testing and changes.

## Important: Project Levels

### Nivel ⭐️

- ✅ **Document and Attach API Tests**: Ensure to document and attach results from API testing using tools like Postman or Insomnia to your project. This provides evidence of correct API behavior.

### Nivel ⭐️⭐️

- ✅ **No-Cache Middleware**: Include middleware that adds the `Cache-control: no-cache` header to ensure that responses are not cached.
- ✅ **Enable CORS**: Implement Cross-Origin Resource Sharing (CORS) in responses, whether through Express or another middleware. This allows your API to be accessed from different domains.
- ✅ **Unauthorized Middleware**: Add middleware that returns an HTTP Status 401 - Unauthorized if the request header does not contain basic authentication (username and password).

### Nivel ⭐️⭐️⭐️

- ✅ **Add Testing for API Functionality**: Incorporate tests to check the correct functioning of the API. This helps ensure that your API behaves as expected under various conditions and uses.


## Getting Started

### Prerequisites

Before starting, make sure you have installed:

- Node.js
- npm

These are essential for running and managing the project's dependencies.

### Clone the Repository

```
git clone https://github.com/Fanur1991/Fanur1991-ITA_sprint_4
cd sprint-4
```
## Scripts

### `npm run dev`

Run the project in development mode using TypeScript and ESM.

### `npm run tsc`

Compile TypeScript files to JavaScript.

### `npm run tsc:watch`

Start the TypeScript compiler in watch mode.

### `npm start`

Start the server and the client part of the project simultaneously.

### `npm test`

Run tests using Jest to verify the proper functioning of the throttle function.

## Important: Testing Information

To run the tests, which include tests of the API methods, we use `supertest`.

`supertest` is a high-level HTTP testing library that mimics server calls in a test environment. This allows you to test your API endpoints to ensure they respond as expected under various circumstances and inputs.

## API Documentation

### ToDoController Methods

- **GET `/api/tasks`**
  - **Description**: Fetches all tasks.
  - **Success Response**: Returns an array of Todo objects.
  - **Error Response**: Returns an error message on failure.

- **POST `/api/tasks`**
  - **Description**: Adds a new task. Requires a title in the request body.
  - **Success Response**: Returns the created Task object.
  - **Error Response**: Returns an error message if the title is missing or invalid.

- **PATCH `/api/tasks/:id`**
  - **Description**: Updates an existing task by ID and updatedAt date.
  - **Success Response**: Returns the updated Task object.
  - **Error Response**: Returns an error message if the Toask with the specified ID does not exist.

- **DELETE `/api/tasks/:id`**
  - **Description**: Deletes a task by ID.
  - **Success Response**: Returns a message confirming the deletion of the Todo.
  - **Error Response**: Returns an error message on failure.

## Folder and Directory Structure

```
tests/
│   ├── application/
│   │      └── TaskService.test.ts
│   └── infrastructure/
│          └── delete/
│          │     └── deleteTaskController.test.ts
│          ├── get/
│          │     └── getTaskController.test.ts
│          ├── add/
│          │     └── addTaskController.test.ts
│          └── update/
│               └── updateTaskController.test.ts
application/
│   ├── dto/
│          └── AddTaskDTO.ts
│          ├── ChangeTaskDTO.ts
│          └── DeleteTaskDTO.ts
│   └── services/
|          └── TaskService.ts
core/
|   ├── domain/
|          └── entities/
|               └── Task.ts
│   └── repositories/
│          └── taskRepository.ts
infrastructure/
│   └── adapters/
│          └──TaskController.ts
│   └── repositories/
│          └── InMemoryTaskRepository.ts
│   └── routes/
│          └── TaskRouter.ts
│   └── webserver/
|          └── app.ts
utils/
|   └── getFullDate.ts
index.ts
```

## License

This project is distributed under the Apache 2.0 license.

---

Developed by [Fanur Khusainov](https://www.linkedin.com/in/fanur-khusainov-ab86b2102/) with ❤️ and ☕.
