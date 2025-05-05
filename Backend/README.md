# Hospital Management System Backend

## Authentication System

### Admin Authentication Routes

#### POST `/admin/login`
- Authenticates admin users
- Request body: 
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- Responses:
  - Success: Returns JWT token and admin details
  - Error: Returns error message for invalid credentials

#### POST `/admin/logout`
- Logs out admin user
- Requires authentication token (cookie or Bearer token)
- Blacklists the current token
- Responses:
  - Success: "logout successful"
  - Error: Redirect to login page

#### GET `/admin/profile`
- Retrieves admin profile information
- Requires authentication token
- Responses:
  - Success: Returns admin profile data
  - Error: Returns 401 Unauthorized

### Security Features

#### Token Blacklisting
- Implements token blacklisting for logged-out sessions
- Blacklisted tokens expire after 24 hours
- Schema:
  ```javascript
  {
    token: String,
    createdAt: Date (expires after 86400 seconds)
  }
  ```

#### Authentication Middleware
- Verifies JWT tokens
- Checks token blacklist
- Attaches admin user to request object
- Protected routes require this middleware

### Environment Variables Required
- `JWT_SECRET`: Secret key for JWT token generation
- `SESSION_SECRET`: Secret for session management
- `PORT`: Server port number

### Dependencies
- bcrypt: Password hashing
- jsonwebtoken: JWT token handling
- express-validator: Request validation
- connect-flash: Flash messages
- express-session: Session management
- cookie-parser: Cookie handling

### Root Route
- `GET /`
  - Returns "Hello World!"
  - Used to verify API is running

## Middleware
- Express session enabled
- Connect-flash for notifications
- Body parser for:
  - URL encoded data (forms)
  - JSON data