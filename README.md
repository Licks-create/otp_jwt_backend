# User Registration and Authentication API

## Introduction
This project is aimed at developing a secure user registration and authentication system using Express.js and MongoDB. It includes APIs for user registration, email verification, user information update, user login, and retrieval of user information using JWT token authentication.

## Technologies Used
- Express.js
- MongoDB
- JSON Web Tokens (JWT)
- Node.js

## Setup Instructions
1. Clone the repository from GitHub.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the local server using `npm run server`.

## API Endpoints

### 1. User Registration
- **URL:** `/api/register`
- **Method:** POST
- **Request Body:**
  - email (string): User's email address
  - password (string): User's password
- **Response:** 
  - Success: Status 200 OK
  - Error: Status 400 Bad Request
    
### 2. Send OTP for Email Verification
- **URL:** `/api/generateOTP`
- **Method:** POST
- **Request Body:**
  - email (string): User's email address
  - password (string): User's password
- **Response:** 
  - Success: Status 200 OK
  - Error: Status 400 Bad Request

### 3.1 Validate User Account
- **URL:** `/api/verifyOTP`
- **Method:** POST
- **Request Body:**
  - email (string): User's email address
  - otp (string): One-time password sent to the user's email
- **Response:** 
  - Success: Status 200 OK
  - Error: Status 400 Bad Request
    
### 3.2 Update Information
- **URL:** `/api/updateUser`
- **Method:** PUT
- **Request Body:**
  - email (string): User's email address
  - location (string)
  - age (string)
  - work_Details (string)
- **Response:** 
  - Success: Status 200 OK
  - Error: Status 400 Bad Request
    
### 4. User Login and JWT Token Generation
- **URL:** `/api/login`
- **Method:** POST
- **Request Body:**
  - email (string): User's email address
  - password (string): User's password
- **Response:** 
  - Success: JWT token with Status 200 OK
  - Error: Status 401 Unauthorized

### Paste the token in header as Baerer token i.e 'Bearer token'

### 5. Retrieve User Information
- **URL:** `/api/userinfo`
- **Method:** GET
- **Request Header:**
  - Authorization: Bearer <JWT Token>
- **Response:** 
  - Success: User information with Status 200 OK
  - Error: Status 401 Unauthorized

## Screenshots
Attached screenshots of each API from POSTMAN.

## MongoDB Schema
```javascript
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  location: {
    type: String
  },
  age: {
    type: Number
  },
  work_details: {
    type: String
  }
});
