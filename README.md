# Streamify - MERN Stack Streaming & Chat Application

Streamify is a comprehensive real-time communication platform built using the MERN stack (MongoDB, Express, React, Node.js). It integrates Stream.io for high-quality video calling and chat functionalities.

## 🚀 Features

- **Authentication**: Secure user login and signup using JWT and bcrypt.
- **Real-time Chat**: Fully functional chat system powered by Stream Chat.
- **Video & Audio Calls**: High-quality communication using Stream Video SDK.
- **Friend System**: Manage friends and connections.
- **Notifications**: Stay updated with real-time notifications.
- **Responsive Design**: Built with Tailwind CSS and DaisyUI for a modern, responsive user interface.
- **State Management**: Uses Zustand for efficient client-side state management.
- **Data Fetching**: Optimized with React Query.

## 🛠️ Tech Stack

### Frontend
- **React** (v19)
- **Vite** (Build tool)
- **Tailwind CSS** & **DaisyUI** (Styling)
- **React Router** (Navigation)
- **Zustand** (State Management)
- **React Query** (Data Fetching)
- **Stream Video & Chat SDK**

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Database)
- **JSON Web Tokens (JWT)** (Auth)
- **Cookie Parser**
- **Stream Chat SDK** (Server-side integration)

## 📋 Prerequisites

- Node.js installed
- MongoDB database (Local or Atlas)
- GetStream.io API keys

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd streamify
   ```

2. **Backend Setup**:
   ```bash
   cd BACKEND
   npm install
   ```
   Create a `.env` file in the `BACKEND` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   ```

3. **Frontend Setup**:
   ```bash
   cd ../FRONTEND
   npm install
   ```
   Create a `.env` file in the `FRONTEND` directory and add:
   ```env
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

## 🚀 Running the Application

### Full Application (from root)
```bash
npm run build && npm start
```

### Development Mode

**Start Backend**:
```bash
cd BACKEND
npm run start
```

**Start Frontend**:
```bash
cd FRONTEND
npm run dev
```

