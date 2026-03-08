# Mini Jira — Project Management Tool

A full-stack project management application built with HTML, CSS, Bootstrap 5, JavaScript, and PHP.

## Tech Stack
- **Frontend:** HTML5, CSS3, Bootstrap 5.3, Vanilla JavaScript
- **Backend:** PHP 8+ (REST API)
- **Database:** MySQL 8+
- **Server:** Apache (XAMPP/WAMP)

## Setup Instructions

### 1. Install XAMPP
Download and install [XAMPP](https://www.apachefriends.org/) (includes Apache, MySQL, PHP).

### 2. Copy Project Files
Copy the `mini-jira` folder to your XAMPP htdocs directory:
```
/opt/lampp/htdocs/mini-jira/     (Linux)
C:\xampp\htdocs\mini-jira\       (Windows)
```

### 3. Create Database
Open phpMyAdmin (`http://localhost/phpmyadmin`) or use terminal:
```bash
mysql -u root -p < mini-jira/database/schema.sql
mysql -u root -p mini_jira_db < mini-jira/database/seed.sql
```

### 4. Configure Database
Edit `mini-jira/api/config.php` if your MySQL credentials differ:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'mini_jira_db');
define('DB_USER', 'root');
define('DB_PASS', '');  // Set your password
```

### 5. Update API URL
Edit `mini-jira/frontend/js/api.js` and set the correct BASE_URL:
```javascript
BASE_URL: 'http://localhost/mini-jira/api'
```

### 6. Start XAMPP
Start Apache and MySQL from the XAMPP control panel.

### 7. Open the App
Visit: `http://localhost/mini-jira/frontend/index.html`

## Default Login Credentials
| Email | Password |
|-------|----------|
| admin@minijira.com | password123 |
| john@minijira.com | password123 |
| jane@minijira.com | password123 |
| bob@minijira.com | password123 |

## Project Structure
```
mini-jira/
├── api/                    # PHP REST API
│   ├── config.php          # Database config & helpers
│   ├── auth.php            # Login & Registration
│   ├── projects.php        # Project CRUD
│   ├── tasks.php           # Task CRUD
│   ├── sprints.php         # Sprint CRUD
│   ├── comments.php        # Comment CRUD
│   ├── members.php         # Team member management
│   ├── activity.php        # Activity log
│   └── dashboard.php       # Dashboard stats
├── frontend/               # HTML/CSS/JS Frontend
│   ├── index.html          # Login page
│   ├── register.html       # Registration page
│   ├── dashboard.html      # Dashboard
│   ├── projects.html       # Project management
│   ├── tasks.html          # Task list & detail
│   ├── board.html          # Kanban board
│   ├── sprints.html        # Sprint management
│   ├── members.html        # Team members
│   ├── activity.html       # Activity log
│   ├── css/style.css       # Custom styles
│   └── js/                 # JavaScript modules
│       ├── api.js          # API helper & utilities
│       ├── auth.js         # Authentication handler
│       ├── dashboard.js    # Dashboard logic
│       ├── projects.js     # Project management
│       ├── tasks.js        # Task management
│       ├── board.js        # Kanban board logic
│       ├── sprints.js      # Sprint management
│       ├── members.js      # Member management
│       └── activity.js     # Activity log
└── database/               # SQL files
    ├── schema.sql          # Database schema
    └── seed.sql            # Sample data
```

## Features
- ✅ User Authentication (Register/Login/Logout)
- ✅ Project Management (Create/Edit/Delete)
- ✅ Task Management with filtering & search
- ✅ Kanban Board with drag & drop
- ✅ Sprint Management with progress tracking
- ✅ Team Member Management
- ✅ Comments on tasks
- ✅ Activity Log
- ✅ Dashboard with stats
- ✅ Responsive design (mobile-friendly)
- ✅ JWT-based authentication
