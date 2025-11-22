# 🛒 Decoro Backend (Node.js + Express + MongoDB)

Decoro هو مشروع Backend متكامل يوفر إدارة منتجات، مستخدمين، طلبات، نظام تحقق عبر البريد الإلكتروني، وصلاحيات Admin كاملة.  
هذا المستودع يمثل النسخة الرسمية للـ API الخاصة بتطبيق Decoro (Web Dashboard + Mobile App).

---

## 🚀 المميزات الأساسية

- نظام تسجيل دخول وتسجيل مستخدمين (JWT + Refresh Tokens)
- نظام تسجيل دخول خاص بالأدمن
- إدارة كاملة للمنتجات (CRUD + رفع الصور على Cloudinary)
- نظام سلة / طلبات (Orders)
- إدارة مستخدمين للأدمن
- إرسال أكواد تحقق عبر البريد (OTP Email Verification)
- رفع صور رئيسية وصور معرض منتج
- نظام Logs باستخدام Winston
- أفضل ممارسات الهيكلة المتقدمة Enterprise Folder Structure

---

## 🧱 التقنيات المستخدمة

- Node.js (ESM Modules)
- Express.js
- MongoDB + Mongoose
- Cloudinary (للصور)
- Nodemailer (للتحقق)
- JWT Access Tokens + Refresh Tokens
- Helmet + CORS + Morgan
- Multer (لرفع الصور)
- Winston Logging

---

## 📦 تثبيت المشروع وتشغيله محليًا

### 1) تثبيت الحزم
```bash
npm install
```

### 2) إنشاء ملف البيئة `.env`
استخدم القيم التالية:

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

### 3) تشغيل السيرفر
```bash
npm start
```

السيرفر سيعمل على:
```
http://localhost:3000
```

---

## 📁 هيكل المشروع

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
│   └── verify/
└── utils/
```

---

# 🧠 API Documentation (مختصر وواضح للمطورين)

Base URL:
```
http://localhost:3000/api
```

---

## 🔵 AUTH

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
Headers: `Bearer accessToken`

---

## 🟣 Email Verification

### Send Code
POST `/verify/send`
```json
{ "email": "a@mail.com", "type": "email_verification" }
```

### Confirm
POST `/verify/confirm`
```json
{
  "email": "a@mail.com",
  "code": "123456",
  "type": "email_verification"
}
```

---

## 🟢 Products

### Create Product (Admin)
POST `/products`

### Get All
GET `/products`

### Get One
GET `/products/:id`

### Update
PUT `/products/:id`

### Delete
DELETE `/products/:id`

### Upload Main Image
POST `/products/:id/image`

Form-Data:
```
image: file
```

### Upload Gallery Images
POST `/products/:id/gallery`

Form-Data:
```
image: file[] (multiple)
```

### Delete Gallery Image
POST `/products/:id/gallery/delete`
```json
{ "imageId": "public_id" }
```

---

## 🟠 Orders

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

### Get one
GET `/orders/:id`

### Update status
PUT `/orders/:id/status`
```json
{ "status": "shipped" }
```

### Get user orders
GET `/orders/user/:userId`

### Delete
DELETE `/orders/:id`

---

## 🔴 Admin

### Admin Login
POST `/admin/auth/login`

### Admin Me
GET `/admin/auth/me`

---

## 🔴 Admin Users

### Get All Users
GET `/admin/users`

### Get One User
GET `/admin/users/:id`

### Create User
POST `/admin/users`

### Update User
PUT `/admin/users/:id`

### Delete User
DELETE `/admin/users/:id`

---

## 📌 المساهمة بالمشروع
PRs مرحب بها. يرجى المحافظة على أسلوب الكود ونظافة البنية.

---

## 📄 الرخصة
MIT License