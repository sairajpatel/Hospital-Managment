# Hospital Management System Backend

## API Routes Documentation

### Base URL
The server runs on `http://localhost:{PORT}` where PORT is defined in your environment variables.

### Admin Routes
Base path: `/admin`

#### Authentication
- `POST /admin/login`
  - Authenticates admin user
  - Required body: 
    ```json
    {
      "email": "admin@email.com",
      "password": "password"
    }
    ```
- `GET /admin/logout`
  - Logs out admin user
  - Destroys session and clears token

### Root Route
- `GET /`
  - Returns "Hello World!"
  - Used to verify API is running

## Authentication
- Uses JWT tokens for authentication
- Token is stored in session
- Flash messages used for success/error notifications

## Environment Variables Required
- `PORT` - Server port number
- `SESSION_SECRET` - Session secret key
- `JWT_SECRET` - JWT signing secret
- MongoDB connection string (refer to .env.example)

## Middleware
- Express session enabled
- Connect-flash for notifications
- Body parser for:
  - URL encoded data (forms)
  - JSON data