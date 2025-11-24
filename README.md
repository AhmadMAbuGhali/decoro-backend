# 🛒 Decoro Backend (Node.js + Express + MongoDB)

Decoro is a complete backend system that provides product management, user authentication, orders, admin operations, email verification, payments, notifications, and real‑time chat.
This repository represents the official API for Decoro (Dashboard + Mobile App).

---

## 🚀 Key Features

- Full user authentication system (JWT + Refresh Tokens)
- Admin authentication & permissions
- Complete product management (CRUD + Cloudinary image upload)
- Cart & Orders system
- Admin user management
- Email verification (OTP)
- Product image gallery & main image upload
- Logging system with Winston
- Real‑time notifications (FCM) and admin–user chat (Socket.io)
- Enterprise‑level folder structure

---

## 🧱 Technologies Used

- Node.js (ESM Modules)
- Express.js
- MongoDB + Mongoose
- Cloudinary (Images)
- Nodemailer (Email OTP)
- JWT (Access & Refresh Tokens)
- Helmet + CORS + Morgan
- Multer (File uploads)
- Winston Logging
- Socket.io (Live Chat)
- Firebase Cloud Messaging (Push Notifications)

---

## 📦 Installation & Local Setup

### 1) Install Dependencies
```bash
npm install
```

### 2) Create `.env` File
Use the following values:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/decoro

JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

EMAIL_USER=xxx@gmail.com
EMAIL_PASS=xxxx_app_password

LOG_LEVEL=debug
ACCESS_EXPIRES=15m
REFRESH_TOKEN_DAYS=30

DEFAULT_ADMIN_EMAIL=admin@decoro.com
DEFAULT_ADMIN_PASSWORD=Admin@123
NODE_ENV=development
```

### 3) Start Server
```bash
npm start
```

Server will run on:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
src/
│
├── app.js
├── config/
├── core/
├── middleware/
├── models/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── admin/
│   ├── products/
│   ├── orders/
│   ├── privacy/
│   ├── notifications/
│   ├── chat/
│   ├── ratings/
│   └── payments/
└── utils/
```

---

# 🧠 API Documentation (Clean & Developer‑Friendly)

Base URL:
```
http://localhost:3000/api
```

---

# 🔵 AUTH

### Register  
POST `/auth/register`
```json
{ "name": "Ahmad", "email": "a@mail.com", "password": "123456" }
```

### Login  
POST `/auth/login`
```json
{ "email": "a@mail.com", "password": "123456" }
```

### Refresh  
POST `/auth/refresh`
```json
{ "refreshToken": "xxx" }
```

### Logout  
POST `/auth/logout`
```json
{ "refreshToken": "xxx" }
```

### My Profile  
GET `/auth/me`  
Headers: `Authorization: Bearer <token>`

---

# 🟣 Email Verification

### Send OTP  
POST `/verify/send`
```json
{ "email": "a@mail.com", "type": "email_verification" }
```

### Verify OTP  
POST `/verify/confirm`
```json
{
  "email": "a@mail.com",
  "code": "123456",
  "type": "email_verification"
}
```

---

# 🟢 Products

### Create Product (Admin)  
POST `/products`

### Get All Products  
GET `/products`

### Get Product By ID  
GET `/products/:id`

### Update  
PUT `/products/:id`

### Delete  
DELETE `/products/:id`

### Upload Main Image  
POST `/products/:id/image`  
Form‑Data:
```
image: file
```

### Upload Gallery  
POST `/products/:id/gallery`  
Form‑Data:
```
image: file[] (multiple)
```

### Delete Gallery Image  
POST `/products/:id/gallery/delete`
```json
{ "imageId": "public_id" }
```

---

# 🟠 Orders

### Create  
POST `/orders`
```json
{
  "user": "id",
  "products": [
    { "product": "id", "quantity": 2 }
  ],
  "totalPrice": 300,
  "status": "pending"
}
```

### Get All (Admin)  
GET `/orders`

### Get One  
GET `/orders/:id`

### Update Status  
PUT `/orders/:id/status`
```json
{ "status": "shipped" }
```

### Get User Orders  
GET `/orders/user/:userId`

### Delete  
DELETE `/orders/:id`

---

# 🔴 Admin Auth  
POST `/admin/auth/login`  
GET `/admin/auth/me`

---

# 🔴 Admin User Management  
GET `/admin/users`  
GET `/admin/users/:id`  
POST `/admin/users`  
PUT `/admin/users/:id`  
DELETE `/admin/users/:id`

---

# 🟡 Payments (Paymob + PayPal)

### Create Payment  
POST `/payments/create`
```json
{
  "amount": 150,
  "currency": "EGP",
  "provider": "paymob",
  "method": "card",
  "orderId": "order_id",
  "returnUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/cancel"
}
```

### Webhooks  
POST `/payments/webhook/paymob`  
POST `/payments/webhook/paypal`

---

# 🟪 Ratings

POST `/ratings/:productId`  
GET `/ratings/:productId`

---

# 🔔 Notifications

POST `/notifications`  
GET `/notifications`  
PUT `/notifications/:id/read`

---

# 💬 Chat (Real‑Time)

GET `/chat/:userId`  
POST `/chat/send`

(Socket.io handles live messaging)

---

# 📜 Privacy Policy

GET `/privacy`  
PUT `/privacy` (Admin)

---

## 🤝 Contributing
Pull requests are welcome.

---

## 📄 License
MIT License
