# ChatFlow

**Connect. Chat. Stay in sync.**

A production-quality, real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO — featuring a premium light-theme UI, instant messaging, typing indicators, read receipts, reactions, file/image sharing, and more.

---

## ✨ Features

- **Authentication** — Register/login with JWT, bcrypt password hashing, protected routes
- **Real-time messaging** — Instant delivery via Socket.IO, no page refresh needed
- **Typing indicators** — See when the other person is typing
- **Online/offline presence** — Live status with "last seen" timestamps
- **Delivery & read receipts** — ✓ sent, ✓✓ delivered, ✓✓ (blue) read
- **Unread counts** — Per-conversation badges that update in real time
- **User search** — Find people by name, username, or email (debounced)
- **Message reactions** — ❤️ 👍 😂 😮 😢 🔥
- **Message actions** — Copy, delete (soft delete), react
- **Attachments** — Image and file uploads with previews, thumbnails, and download
- **Emoji picker** — Insert emoji into any message
- **Profile management** — Edit name, username, bio; change password
- **Settings** — Privacy (online status, last seen, read receipts), notification preferences, appearance
- **Responsive design** — Desktop layout with sidebar + chat pane; mobile drawer + full-screen chat
- **Polished UX** — Skeleton loaders, empty states, toast notifications, confirm dialogs, smooth animations

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Axios, React Router DOM, Socket.IO Client, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs, Multer, dotenv, CORS

---

## 📁 Folder Structure

```
chatflow/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages (Login, Register, Chat, Profile, Settings)
│   │   ├── layouts/         # ProtectedRoute wrapper
│   │   ├── context/         # AuthContext, SocketContext, ChatContext, ToastContext
│   │   ├── services/        # Axios-based API service modules
│   │   ├── utils/           # Formatting helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                  # Express + Socket.IO backend
│   ├── config/               # MongoDB connection
│   ├── controllers/          # Route handlers (auth, users, conversations, messages, upload)
│   ├── middleware/           # auth (JWT), errorHandler, upload (multer)
│   ├── models/                # User, Conversation, Message (Mongoose schemas)
│   ├── routes/                # Express routers
│   ├── sockets/               # Socket.IO connection + event handlers
│   ├── utils/                  # seed.js, generateToken, ApiError, asyncHandler
│   ├── uploads/                 # Uploaded files (served statically)
│   ├── server.js
│   └── .env.example
│
├── package.json              # Root scripts (runs both apps together)
├── README.md
├── .gitignore
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas connection string

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs dependencies for both `server/` and `client/`.

### 2. Configure environment variables

Copy the example env file and fill in your own values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatflow
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> ⚠️ Never commit your real `.env` file. Use a strong, random `JWT_SECRET` in production.

### 3. Make sure MongoDB is running

```bash
# If using a local install:
mongod

# Or use a MongoDB Atlas connection string in MONGODB_URI instead.
```

### 4. (Optional) Seed demo data

Populates 5 demo users and sample conversations so you can test immediately:

```bash
npm run seed
```

Demo accounts (password: `password123`):
- ava@chatflow.demo / ava
- rahul@chatflow.demo / rahul
- maria@chatflow.demo / maria
- james@chatflow.demo / james
- sofia@chatflow.demo / sofia

### 5. Run the app

From the project root:

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

Open http://localhost:5173 in two different browsers (or one normal + one incognito window), log in as two different demo users, and start chatting in real time.

---

## 📡 API Documentation

All endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in with email/username + password |
| GET | `/auth/me` | Get the current authenticated user |
| POST | `/auth/logout` | Log out (marks user offline) |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/search?q=term` | Search users by name/username/email |
| GET | `/users/:id` | Get a user's public profile |
| PUT | `/users/profile` | Update your name, username, bio, settings |
| PUT | `/users/password` | Change your password |

### Conversations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/conversations` | List your conversations (sorted by latest activity) |
| POST | `/conversations` | Create or fetch a conversation with `{ userId }` |
| GET | `/conversations/:id` | Get a single conversation |

### Messages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/messages/:conversationId?page=1&limit=30` | Paginated message history |
| POST | `/messages` | Send a message |
| PUT | `/messages/:id/read` | Mark a message as read |
| DELETE | `/messages/:id` | Soft-delete your own message |
| PUT | `/messages/:id/reaction` | Toggle a reaction (`{ emoji }`) |

### Upload
| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload a file/image (`multipart/form-data`, field name `file`) |

---

## 🔌 Socket.IO Events

Connect with `auth: { token: <jwt> }`.

| Event | Direction | Payload |
|---|---|---|
| `user_online` | server → client | `{ userId }` |
| `user_offline` | server → client | `{ userId, lastSeen }` |
| `join_conversation` | client → server | `conversationId` |
| `leave_conversation` | client → server | `conversationId` |
| `send_message` | client → server | `{ conversationId, message }` |
| `receive_message` | server → client | `message` |
| `typing_start` | both | `{ conversationId, userId, name }` |
| `typing_stop` | both | `{ conversationId, userId }` |
| `message_delivered` | both | `{ conversationId, messageId }` |
| `message_read` | both | `{ conversationId, messageId }` |
| `message_deleted` | both | `{ conversationId, messageId }` |
| `message_reaction` | both | `{ conversationId, message }` |

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (10 salt rounds)
- JWT-based authentication with configurable expiry
- All conversation/message routes verify the requester is a participant
- Users can only delete their own messages
- CORS restricted to `CLIENT_URL`
- File uploads limited to 10MB with an allow-list of MIME types
- No secrets are hardcoded — all sensitive config comes from environment variables
- Notification permission is never requested automatically; only when explicitly enabled in Settings

---

## 📱 Responsive Behavior

- **Desktop (≥1024px):** Sidebar and chat window side by side
- **Mobile/Tablet (<1024px):** Sidebar becomes a slide-in drawer; selecting a conversation shows a full-screen chat with a back button; the composer stays fixed at the bottom

---

## 📸 Screenshots

_Add screenshots of the login page, chat dashboard, and mobile view here._

---

## 🔮 Future Improvements

- Group conversations
- Message threading/replies
- Push notifications (service worker)
- Voice/video calls
- Message forwarding
- Full-text message search backend (currently client-side within loaded messages)
- Dark theme toggle

---

## 🧪 Manual Test Checklist

- [ ] Register a new account
- [ ] Log in / log out
- [ ] Refresh the page while logged in — session persists
- [ ] Search for a user and start a conversation
- [ ] Send a text message — appears instantly for the other user
- [ ] See the typing indicator when the other user types
- [ ] Confirm online/offline status updates live
- [ ] Confirm delivered (✓✓) then read (blue ✓✓) receipts update
- [ ] Confirm unread badge increments and clears on open
- [ ] React to a message with an emoji
- [ ] Delete your own message
- [ ] Send an image and a file attachment
- [ ] Edit your profile and change your password
- [ ] Toggle settings (privacy/notifications)
- [ ] Resize the browser / open on mobile — layout adapts correctly

---

Built with ❤️ using React, Node.js, and Socket.IO.
