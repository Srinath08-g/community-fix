# 🏘️ CommunityFix

A full-stack **mobile application** for apartments and gated communities to report and track community issues in real-time.

---

## ✨ Features

- 🔐 **Firebase Authentication** — Email/Password login with role-based access
- 👥 **Two Roles** — Resident (raises tickets) & Official (manages tickets)
- 🎫 **Ticket System** — Create, view, and track issues with categories, urgency levels, and statuses
- 📸 **Photo Upload** — Attach images to tickets via Firebase Storage
- 💬 **Real-time Comments** — Live comment threads on every ticket
- 📊 **Admin Dashboard** — Stats overview for officials with status management
- 🔴🟡🟢 **Urgency Badges** — Visual priority indicators
- ⚡ **Real-time Updates** — Firestore `onSnapshot` for live ticket feeds

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native (Expo) |
| Backend/API | Node.js + Express |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication (Email/Password) |
| File Storage | Firebase Storage |
| Real-time | Firebase Firestore `onSnapshot` |

---

## 🗂️ Project Structure

```
community-fix/
├── backend/
│   ├── src/
│   │   ├── config/firebase.js
│   │   ├── middleware/auth.js, roleCheck.js
│   │   ├── routes/auth.js, tickets.js, communities.js, admin.js
│   │   ├── controllers/authController.js, ticketController.js, communityController.js, adminController.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── config/firebase.js
│   │   ├── context/AuthContext.js
│   │   ├── navigation/AppNavigator.js, ResidentNavigator.js, OfficialNavigator.js
│   │   ├── screens/auth/, resident/, official/
│   │   ├── components/UrgencyBadge.js, StatusBadge.js, TicketCard.js, CategoryIcon.js, CommentItem.js
│   │   ├── services/ticketService.js, authService.js, uploadService.js
│   │   └── utils/colors.js, constants.js
│   ├── App.js
│   ├── app.json
│   └── package.json
│
├── .vscode/settings.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://expo.dev/) — `npm install -g expo-cli`
- [Firebase Project](https://console.firebase.google.com/) with:
  - Authentication (Email/Password enabled)
  - Firestore Database
  - Storage

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** → Sign-in method → Email/Password
3. Create **Firestore Database** (start in test mode for development)
4. Enable **Storage**
5. Go to Project Settings → Service Accounts → Generate new private key (for backend)
6. Go to Project Settings → General → Your apps → Add web app (for mobile)

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your Firebase credentials in .env
npm start
```

The API will be available at `http://localhost:5000`.

### Environment Variables (`backend/.env`)

```
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## 📱 Mobile Setup

```bash
cd mobile
npm install
# Update mobile/app.json with your Firebase client config
npx expo start
```

Update `mobile/app.json` extra fields with your Firebase web app credentials.

---

## 🌱 Seed Sample Data

```bash
cd backend
node src/seed.js
```

This creates sample communities, users, and tickets.

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Sunrise Official | official1@sunrise.com | Official@123 |
| Sunrise Resident | resident1@sunrise.com | Resident@123 |
| Sunrise Resident 2 | resident2@sunrise.com | Resident@123 |
| Green Valley Official | official1@greenvalley.com | Official@123 |
| Green Valley Resident | resident1@greenvalley.com | Resident@123 |
| Green Valley Resident 2 | resident2@greenvalley.com | Resident@123 |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | Health check |
| POST | `/api/auth/register` | — | Register new user |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| GET | `/api/tickets` | ✅ | Get community tickets |
| POST | `/api/tickets` | ✅ | Create ticket |
| GET | `/api/tickets/:id` | ✅ | Get ticket by ID |
| POST | `/api/tickets/:id/comments` | ✅ | Add comment |
| GET | `/api/communities` | — | List communities |
| POST | `/api/communities` | ✅ Official | Create community |
| GET | `/api/admin/tickets` | ✅ Official | All tickets with filters |
| PATCH | `/api/admin/tickets/:id/status` | ✅ Official | Update ticket status |
| GET | `/api/admin/stats` | ✅ Official | Get statistics |

---

## 🗃️ Firestore Collections

```
/communities/{communityId}   — name, address, city, createdAt
/users/{uid}                 — name, email, role, communityId, flatNumber, phone, createdAt
/tickets/{ticketId}          — title, description, category, urgency, status, communityId,
                               raisedBy, imageUrl, createdAt, updatedAt
  /comments/{commentId}      — text, authorName, authorUid, createdAt
```

---

## 🧩 VS Code Recommended Extensions

- `esbenp.prettier-vscode` — Prettier formatter
- `dbaeumer.vscode-eslint` — ESLint
- `msjsdiag.vscode-react-native` — React Native tools
- `eamodio.gitlens` — Git supercharged

---

## 📸 Screenshots

_Add screenshots of the app here after setup_

---

## 📄 License

MIT