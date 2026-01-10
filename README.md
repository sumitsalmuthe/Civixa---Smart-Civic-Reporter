#  Smart Civic Reporter (Civixa)

A full-stack civic complaint management platform where citizens can report issues
and authorities can track, manage, and resolve them efficiently.

## Features

###  Citizen
- Register & Login with JWT authentication
- Raise civic complaints with:
  - Title
  - Description
  - Area / locality
  - Up to 3 images (Cloudinary)
- Track complaint status (Pending / In Progress / Resolved)
- View status history & authority remarks
- Delete complaint (only if pending & no authority action)

### Authority
- Secure authority login
- View all citizen complaints
- Filter & search complaints
- View uploaded images (preview + download)
- Update complaint status with official remarks
- View complete complaint timeline

### Security
- Role-based authentication (Citizen / Authority)
- JWT protected routes
- Secure password hashing (bcrypt)

## Tech Stack

### Frontend
- React.js
- Axios
- Inline CSS + Responsive CSS
- Role-based UI rendering

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file handling)
- Cloudinary (image storage)

### Database
- MongoDB Atlas

### Tools
- Git & GitHub
- Postman


##  Folder Structure

backend/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── complaintController.js
│   └── notificationController.js
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── User.js
│   ├── Complaint.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   └── notificationRoutes.js
└── server.js

frontend/
├── components/
├── pages/
├── services/
├── styles/
└── App.jsx


##  Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


---

##  Screenshots (OPTIONAL but powerful)

```md
## Screenshots

- Citizen Dashboard
- Complaint Form with Image Upload
- Authority Dashboard
- Image Preview & Download

## Future Enhancements
- Real-time notifications (Socket.io)
- Google Maps location tagging
- Complaint SLA timer
- Admin analytics dashboard


## Author

**Sumit Salmuthe**  
Full-Stack Developer  
