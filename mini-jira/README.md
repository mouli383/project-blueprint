# 🚀 Mini Jira / Trello — Full Stack Project

## 📋 Project Overview
A full-stack project management tool inspired by Jira/Trello, built as an academic project.

**Database Name:** `mini_jira_db` (Create in phpMyAdmin)

## 🗂 Folder Structure (By Team Roles)

```
mini-jira/
├── database-designer/       ← Phase 1: DB Schema & Config
│   ├── schema.sql           ← MySQL tables (run in phpMyAdmin)
│   ├── seed.sql             ← Sample data
│   └── mongodb-config.js    ← MongoDB setup for activity
│
├── frontend-developer/      ← Phase 2: UI Pages
│   ├── index.html           ← Login page
│   ├── register.html        ← Registration page
│   ├── dashboard.html       ← Main dashboard
│   ├── board.html           ← Kanban board (drag & drop)
│   ├── tasks.html           ← Tasks list view
│   ├── sprints.html         ← Sprint management
│   ├── members.html         ← Team members
│   ├── activity.html        ← Activity log
│   ├── settings.html        ← Project & profile settings
│   ├── css/style.css        ← Custom styles
│   └── js/
│       ├── api.js           ← API helper (fetch wrapper)
│       ├── auth.js          ← Auth logic
│       ├── dashboard.js     ← Dashboard logic
│       ├── board.js         ← Kanban board + drag & drop
│       ├── tasks.js         ← Tasks list logic
│       ├── sprints.js       ← Sprint logic
│       ├── members.js       ← Members logic
│       ├── activity.js      ← Activity log logic
│       └── settings.js      ← Settings logic
│
├── backend-developer/       ← Phase 3: Server & PHP APIs
│   ├── server.js            ← Express server (Node.js)
│   ├── package.json         ← Node.js dependencies
│   ├── config/db.php        ← MySQL connection (PHP)
│   └── php/
│       ├── auth.php         ← Login/Register API
│       ├── projects.php     ← Projects CRUD API
│       ├── tasks.php        ← Tasks CRUD API
│       ├── sprints.php      ← Sprints CRUD API
│       └── comments.php     ← Comments API
│
├── api-manager/             ← Phase 4: Express Routes & Controllers
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── sprint.routes.js
│   │   ├── comment.routes.js
│   │   └── activity.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── controllers/
│       ├── auth.controller.js
│       ├── project.controller.js
│       ├── task.controller.js
│       ├── sprint.controller.js
│       └── comment.controller.js
│
├── oauth-integrator/        ← Phase 5: OAuth Login
│   ├── google-login.php
│   ├── google-callback.php
│   ├── github-login.php
│   ├── github-callback.php
│   └── oauth-token-handler.js
│
└── git-integrator/          ← Phase 6: Git & Webhooks
    ├── .gitignore
    ├── webhook-handler.js
    └── git-setup-guide.md
```

## ⚡ Execution Order

### Phase 1 — Database Designer
1. Open **phpMyAdmin**
2. Run `database-designer/schema.sql` (creates `mini_jira_db` + 8 tables)
3. Run `database-designer/seed.sql` (adds sample data)
4. Install MongoDB and run `node database-designer/mongodb-config.js` to verify

### Phase 2 — Frontend Developer
1. Open `frontend-developer/index.html` in browser
2. All pages work with **mock data** (no backend needed)
3. Navigate: Login → Dashboard → Board → Tasks → Sprints → Members → Settings

### Phase 3 — Backend Developer
1. Place PHP files in your XAMPP/WAMP `htdocs/mini-jira/backend-developer/` folder
2. Run `cd backend-developer && npm install && npm start` for Node.js server
3. Server starts on `http://localhost:3000`

### Phase 4 — API Manager
1. Express routes auto-load via `server.js`
2. Test endpoints using Postman or the frontend
3. All API endpoints are RESTful with JWT auth

### Phase 5 — OAuth Integrator
1. Register app on [Google Cloud Console](https://console.cloud.google.com)
2. Register app on [GitHub Developer Settings](https://github.com/settings/developers)
3. Update client IDs/secrets in the PHP files
4. Add `oauth-token-handler.js` to frontend pages
5. Update frontend `auth.js` OAuth functions

### Phase 6 — Git Integrator
1. Follow `git-setup-guide.md` for repo setup
2. Setup GitHub webhook for commit linking
3. Use `TASK-xxx` in commit messages to auto-link

## 🛠 Tech Stack
| Role | Technologies |
|------|-------------|
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| Backend | PHP (APIs), Node.js + Express (server) |
| Database | MySQL (phpMyAdmin), MongoDB (activity) |
| Auth | OAuth 2.0 (Google, GitHub) |
| Version Control | Git + GitHub Webhooks |

## 👥 Team (6 Members)
1. **Frontend Developer** — HTML/CSS/JS/Bootstrap pages
2. **Backend Developer** — PHP APIs + Node.js server
3. **Database Designer** — MySQL schema + MongoDB config
4. **API Manager** — Express routes, controllers, middleware
5. **OAuth Integrator** — Google & GitHub OAuth flow
6. **Git Integrator** — Git workflow, webhooks, commit linking
