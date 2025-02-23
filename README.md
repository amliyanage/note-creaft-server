# Note Craft Server 🚀

**Note Craft Server** is the backend API for the **Note Craft** note-taking application. It provides endpoints for managing user notes, authentication, and syncing across devices. This server is built with a focus on scalability, security, and ease of integration with the frontend application.

## Features 🔧

- **User Authentication**: Secure login and registration system using JWT.
- **CRUD Operations**: Create, Read, Update, and Delete notes.
- **Tagging**: Add and manage tags for organizing notes.
- **Note Sharing**: Share notes with other users (if applicable).
- **Search Notes**: Search through user notes by keywords or tags.

## Technologies Used 🛠

- **Node.js**: JavaScript runtime environment for building scalable server-side applications.
- **Express.js**: Web framework for Node.js to handle routing and middleware.
- **MongoDB**: NoSQL database for storing user data and notes.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: Used for user authentication and authorization.
- **Bcrypt.js**: Used to hash and secure passwords.
- **Dotenv**: For managing environment variables.

## Getting Started ⚡

Follow these steps to set up the **Note Craft Server** locally:

### 1. Clone the repository:

```bash
git clone https://github.com/amliyanage/note-craft-server.git
```

### 2. Install dependencies:

Navigate into the project directory and install the required dependencies:

```bash
cd note-craft-server
npm install
```

### 3. Configure Environment Variables:

Create a `.env` file in the root directory of the project and set the following environment variables:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

- **MONGO_URI**: Your MongoDB database connection string.
- **JWT_SECRET**: A secret key used to sign and verify JWT tokens.
- **PORT**: The port on which the server will run.

### 4. Start the server:

Run the following command to start the server:

```bash
npm start
```

The server will start and listen on the configured port (default: `3001`).

## License 📜

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
