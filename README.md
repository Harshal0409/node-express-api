# RESTful API with Node.js, Express, MySQL

## Overview
This project is a simple RESTful API built with **Node.js** and **Express**, using **MySQL** for data storage. The API supports CRUD operations, asynchronous file handling for logging, rate limiting, and JWT-based authentication.

## Features
✅ CRUD operations for managing items
✅ Asynchronous file handling for metadata storage
✅ Rate limiting (100 requests per 15 minutes)
✅ JWT-based authentication for secure access
✅ Error handling for robustness

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-repo.git
cd your-repo
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
JWT_SECRET=your_jwt_secret
```

### **4. Set Up MySQL Database**
Run the following SQL commands to create the necessary tables:
```sql
CREATE TABLE items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### **5. Start the Server**
```bash
node app.js
```

---

## **API Endpoints**

### **Authentication**
#### **Register**
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### **Login**
```http
POST /api/auth/login
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "your_jwt_token"
}
```
Use this token in the **Authorization header** for protected routes.

### **Items (CRUD Operations)**
#### **Create an Item**
```http
POST /api/items
```
**Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token"
}
```
**Request Body:**
```json
{
  "name": "Item Name",
  "description": "Item Description"
}
```

#### **Get All Items**
```http
GET /api/items
```
**Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token"
}
```

#### **Get an Item by ID**
```http
GET /api/items/:id
```

#### **Update an Item**
```http
PUT /api/items/:id
```
**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

#### **Delete an Item**
```http
DELETE /api/items/:id
```

---

## **Rate Limiting**
Each user is limited to **100 requests per 15 minutes**. If exceeded, the API will return:
```json
{
  "status": 429,
  "message": "Rate limit exceeded. Try again later."
}
```

---

## **Error Handling**
The API includes robust error handling for:
- Invalid inputs
- Authentication failures
- Database connection issues
- Rate limit violations

---

## **Assumptions & Design Decisions**
- Authentication is handled using JWT tokens.
- Rate limiting is implemented based on IP addresses.
- Logs are stored asynchronously in `logs.json`.
- Database connection uses MySQL with prepared statements.

---

## **Testing the API**
- Use **Postman** or **cURL** to test API endpoints.
- Ensure you include the **Authorization: Bearer your_jwt_token** header for protected routes.

---

## **Contributors**
- Harshal

---

## **License**
This project is licensed under the MIT License.

