# API Documentation

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.vercel.app`

## Authentication

All endpoints (except `/api/auth/login`) require a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <token>
```

## Endpoints

### Authentication Endpoints

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Authentication**: Not required
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@haram-packages.com",
      "firstName": "Admin",
      "lastName": "User"
    }
  }
  ```

#### Verify Token
- **Endpoint**: `GET /api/auth/verify`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token is valid",
    "user": {
      "userId": 1,
      "username": "admin"
    }
  }
  ```

### Package Endpoints

#### Get All Packages
- **Endpoint**: `GET /api/packages`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Starter Package",
        "description": "Basic package for beginners",
        "price": 29.99,
        "quantity": 100,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Create Package
- **Endpoint**: `POST /api/packages`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "name": "New Package",
    "description": "Package description",
    "price": 99.99,
    "quantity": 50
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Package created successfully",
    "data": {
      "id": 4,
      "name": "New Package",
      "description": "Package description",
      "price": 99.99,
      "quantity": 50,
      "createdAt": "2024-03-12T12:00:00.000Z"
    }
  }
  ```

### User Endpoints

#### Get User Profile
- **Endpoint**: `GET /api/users`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "admin",
      "email": "admin@haram-packages.com",
      "firstName": "Admin",
      "lastName": "User",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

## Error Responses

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Missing or invalid token |
| 401 | Invalid credentials | Wrong username/password |
| 500 | Internal Server Error | Server-side error |

## Examples

### Login and Get Packages

```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const { token } = await loginResponse.json();

// 2. Get packages with token
const packagesResponse = await fetch('/api/packages', {
  headers: { Authorization: `Bearer ${token}` }
});

const { data: packages } = await packagesResponse.json();
```

### Using API Utility

```javascript
import { loginUser, getPackages } from '@/lib/api';

// Login
const loginResult = await loginUser('admin', 'admin123');
if (loginResult.success) {
  localStorage.setItem('token', loginResult.token);
}

// Get packages
const packagesResult = await getPackages();
if (packagesResult.success) {
  console.log(packagesResult.data);
}
```

## Rate Limiting

Currently, there is no rate limiting configured. For production, consider implementing:
- Per-IP rate limiting
- Per-user rate limiting
- API key based rate limiting

## CORS

CORS is configured in `next.config.js` to allow cross-origin requests from all domains. For production, update this to specific domains:

```javascript
// In next.config.js
headers: async () => {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' }
    ]
  }];
}
```

## Authentication Flow

1. **User logs in** via `POST /api/auth/login`
2. **Receive JWT token** in response
3. **Store token** in localStorage
4. **Include token** in subsequent API requests
5. **Server verifies** token on each request
6. **If token expires**, user is redirected to login

## Token Expiration

- **Duration**: 7 days
- **On Expiration**: API returns 401, user is automatically redirected to login

## Database Models

See `prisma/schema.prisma` for complete database schema.

---

**Last Updated**: March 2024
