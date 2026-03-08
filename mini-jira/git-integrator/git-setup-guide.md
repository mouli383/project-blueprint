# Mini Jira — Git Setup Guide
## Role: Git Integrator

### 1. Repository Setup
```bash
cd mini-jira
git init
git add .
git commit -m "Initial commit: Mini Jira project structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mini-jira.git
git push -u origin main
```

### 2. Branch Strategy
| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/frontend-*` | Frontend Developer features |
| `feature/backend-*` | Backend Developer features |
| `feature/api-*` | API Manager features |
| `feature/oauth-*` | OAuth Integrator features |
| `feature/db-*` | Database Designer changes |

### 3. Workflow
```bash
# Create feature branch
git checkout -b feature/frontend-login develop

# Work on feature, then commit
git add .
git commit -m "TASK-001: Design login page with Bootstrap"

# Push and create PR
git push origin feature/frontend-login
# Create Pull Request on GitHub → merge to develop
```

### 4. Commit Message Format
Use task IDs in commit messages to auto-link commits:
```
TASK-001: Add login page design
#002: Setup MySQL schema
```

### 5. GitHub Webhook Setup
1. Go to your repo → Settings → Webhooks → Add webhook
2. Payload URL: `http://YOUR_SERVER/api/git/webhook`
3. Content type: `application/json`
4. Secret: Set in `GITHUB_WEBHOOK_SECRET` env variable
5. Events: Select "Just the push event"

### 6. .gitignore
Already configured — see `.gitignore` file in project root.

### 7. Team Members
Each member should:
1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/mini-jira.git`
2. Create their feature branch from `develop`
3. Use the commit message format with task IDs
4. Create PRs for code review before merging
