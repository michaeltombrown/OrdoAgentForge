# 🚀 START THE APPLICATION

## YOU NEED TO RUN THIS MANUALLY IN YOUR TERMINAL

The application is ready to start. Open your terminal and run:

```bash
cd /Users/Michael/OrdoAgentForge
npm run dev
```

**OR** use the startup script:

```bash
cd /Users/Michael/OrdoAgentForge
./start-testing.sh
```

---

## WHAT WILL HAPPEN:

The command will start **TWO** processes concurrently:

1. **Backend Server** - Running on http://localhost:3001
   - API endpoints at http://localhost:3001/api
2. **Frontend App** - Running on http://localhost:3000
   - Main application interface

---

## YOU'LL SEE OUTPUT LIKE:

```
╔════════════════════════════════════════════════════════════╗
║     OrdoAgentForge - Multi-Tenant AI Dashboard           ║
║                 Quick Start Script                        ║
╚════════════════════════════════════════════════════════════╝

✅ Environment file found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 STARTING APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Starting backend server and frontend...
   Backend will run on: http://localhost:3001
   Frontend will run on: http://localhost:3000

[server] Server listening on port 3001
[client] VITE v7.3.1 ready in 234 ms
[client] Local: http://localhost:3000/
```

---

## THEN:

1. ✅ **Open browser**: http://localhost:3000

2. ✅ **Create Clerk users**:
   - Go to https://dashboard.clerk.com
   - Create the 4 test users:
     - admin@ordoagentforge.com
     - owner@acmecorp.com
     - wsadmin@acmecorp.com
     - member@acmecorp.com

3. ✅ **Setup database**:
   - Get Clerk IDs from dashboard
   - Edit `setup-test-users.sql`
   - Run in Supabase SQL Editor

4. ✅ **Start testing**:
   - Login with any of the 4 users
   - Test the different role features

---

## TO STOP THE APPLICATION:

Press **Ctrl+C** in the terminal where it's running

---

## TROUBLESHOOTING:

### Port already in use?

```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Dependencies not installed?

```bash
npm install
```

### Environment variables missing?

Check `.env` file exists and has all required variables

---

**READY TO GO!** 🎉

Just run the command in your terminal and open http://localhost:3000
