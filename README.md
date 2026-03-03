# GeoFy 🌍 | Real-Time Geofencing & Field Tracker

GeoFy is a full-stack location-intelligence platform designed to automate the logging of field agent visits. Using MongoDB's Geospatial indexing and real-time GPS tracking, the system detects when an agent enters a **50-meter radius** of a property and manages check-in/check-out logs automatically.

---

## 🚀 Features

- **Automated Geofencing** — Uses MongoDB `2dsphere` indexing to detect entries/exits within a 50m radius.
- **Secure Authentication** — Admin dashboard protected by JWT stored in HttpOnly Cookies (XSS/CSRF resistant).
- **Real-Time Navigation** — Integrated Leaflet Routing Machine for turn-by-turn directions.
- **State Persistence** — LocalStorage synchronization ensures trip data survives page refreshes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Leaflet.js, Axios, CSS3 |
| **Backend** | Node.js, Express.js, Cookie-Parser |
| **Database** | MongoDB (Geospatial Queries) |
| **Security** | JSON Web Tokens (JWT), Bcrypt |

---

## 📁 Project Structure

```
GEOFY/
├── client/               # React Frontend
│   ├── public/
│   └── src/
├── server/               # Node/Express Backend
│   ├── config/
│   ├── schemas/
│   └── server.js
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/vijai-developer14/Geofy.git
cd Geofy
```

### 2. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm start
```

### 3. Client Setup
```bash
cd ../client
npm install
npm start
```

The app will run at `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory with the following keys:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📸 How It Works

1. Admin registers properties via the dashboard.
2. Agent opens the app — Selects the property which the agent want to go and GPS location is tracked in real time using the browser Geolocation API.
3. When the agent comes within **50 meters** of the selected property, MongoDB's `$near` query triggers an automatic **check-in**.
4. On exit, a **check-out** log is created with timestamp.
5. All visit logs are viewable from the admin panel.

---

## 👤 Author

**Vijai** — [GitHub](https://github.com/vijai-developer14)

---

## 📄 License

This project is licensed under the MIT License.