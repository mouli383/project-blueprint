import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div style={{ fontFamily: 'system-ui', maxWidth: 700, margin: '80px auto', padding: 20, textAlign: 'center' }}>
      <h1>🗂️ Mini Jira</h1>
      <p style={{ color: '#666', fontSize: 18 }}>This project runs on <strong>PHP + MySQL (XAMPP)</strong>.</p>
      <p>Clone this repo and follow the setup instructions in <code>mini-jira/README-SETUP.md</code></p>
      <div style={{ background: '#f4f5f7', borderRadius: 12, padding: 24, marginTop: 24, textAlign: 'left' }}>
        <h3>Quick Setup</h3>
        <ol style={{ lineHeight: 2 }}>
          <li>Copy <code>mini-jira/</code> folder to XAMPP <code>htdocs/</code></li>
          <li>Import database: <code>mysql -u root &lt; mini-jira/database/schema.sql</code></li>
          <li>Seed data: <code>mysql -u root mini_jira_db &lt; mini-jira/database/seed.sql</code></li>
          <li>Start Apache + MySQL in XAMPP</li>
          <li>Open <code>http://localhost/mini-jira/frontend/index.html</code></li>
          <li>Login: <strong>admin@minijira.com</strong> / <strong>password123</strong></li>
        </ol>
      </div>
    </div>
  </React.StrictMode>
);
