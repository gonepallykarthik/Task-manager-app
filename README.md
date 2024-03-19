
# TASK MANAGER APP

Task Manager App is a robust backend API application for managing tasks.


## Installation

Install TASK_APP with npm

```bash
  npm install TASK_APP
  cd TASK_APP
```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/gonepallykarthik/Task-manager-app.git
```

Go to the project directory

```bash
  cd my-project
```

### Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL` `DATABASE_NAME`
`TOKEN_SECRET`



## API Reference

#### Get User Profile

```http
  GET /api.task-manager/v1/users/me

  make sure that you are providing auth token (Bearer) in Authorization Tab
```


#### Create new User

```http
  POST /api.task-manager/v1/users

  request body should be JSON
```


#### Update User details

```http
  PATCH /api.task-manager/v1/users/me

  make sure that you are providing auth token (Bearer) in Authorization Tab
```

#### Delete User

```http
  DELETE /api.task-manager/v1/users/me

  make sure that you are providing auth token (Bearer) in Authorization Tab
```

#### User Login

```http
  POST /api.task-manager/v1/user/login

  Request body should contain email and password (JSON)
```

## For Tasks 


#### Get All Tasks

```http
  GET /api.task-manager/v1/tasks
```

#### Craete a new Task  

```http
  POST /api.task-manager/v1/task

  request body should contain 
  description -> string, 
  completed -> boolean (True or False)
  (JSON)
```


#### Get Task by ID 

```http
  GET /api.task-manager/v1/tasks/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectID` | **Required**. Id of item to fetch |




#### Update Task by ID 

```http
  PATCH /api.task-manager/v1/tasks/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectID` | **Required**. Id of item to fetch |


#### Delete Task by ID 

```http
  DELETE /api.task-manager/v1/tasks/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectID` | **Required**. Id of item to fetch |

## 🛠 Skills
## Skills

- **Node.js**: Backend JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database used for storing task and user data.
- **Bcrypt**: Library for hashing passwords for secure storage.
- **JWT**: JSON Web Tokens for user authentication.
- **Multer**: Middleware for handling file uploads.
- **Email Sending**: Functionality for sending emails.
 


## Contributing

Contributions are always welcome!

