# QUICK START - TESTING GUIDE

**Ready to test in 3 steps!**

---

## 🚀 STEP 1: START THE APPLICATION

```bash
cd /Users/Michael/OrdoAgentForge
./start-testing.sh
```

**OR manually:**

```bash
npm run dev
```

**Access**: http://localhost:3000

---

## 👥 STEP 2: CREATE TEST USERS IN CLERK

Go to: https://dashboard.clerk.com → Your App → Users

Create these 4 users:

| Email                      | Role            | Purpose             |
| -------------------------- | --------------- | ------------------- |
| `admin@ordoagentforge.com` | System Admin    | Full system access  |
| `owner@acmecorp.com`       | Org Owner       | Manage organization |
| `wsadmin@acmecorp.com`     | Workspace Admin | Manage workspace    |
| `member@acmecorp.com`      | Member          | Use tools           |

**Password**: Use any secure password (you'll use it to login)

---

## 🗄️ STEP 3: SETUP DATABASE

1. Get Clerk IDs from dashboard for each user
2. Open `setup-test-users.sql`
3. Replace the 4 Clerk ID placeholders at the top:
   ```sql
   \set clerk_id_admin 'user_XXXX...'  -- Replace with actual ID
   \set clerk_id_owner 'user_YYYY...'  -- Replace with actual ID
   \set clerk_id_wsadmin 'user_ZZZZ...' -- Replace with actual ID
   \set clerk_id_member 'user_WWWW...' -- Replace with actual ID
   ```
4. Run the entire script in Supabase SQL Editor

**Result**: ✅ Creates organization, workspace, tools, and assigns roles

---

## 🧪 TESTING

### Login as Different Users

#### 1. System Admin Test

- **Login**: `admin@ordoagentforge.com`
- **Test**: Access Admin Dashboard → Create Organizations → Create Tools
- **Expected**: See admin menu, cost data in analytics

#### 2. Org Owner Test

- **Login**: `owner@acmecorp.com`
- **Test**: Create Workspace → Invite Users → Assign Tools
- **Expected**: Can manage org, see detailed analytics (no costs)

#### 3. Workspace Admin Test

- **Login**: `wsadmin@acmecorp.com`
- **Test**: Manage workspace members → Use tools
- **Expected**: Can manage workspace, see workspace analytics

#### 4. Member Test

- **Login**: `member@acmecorp.com`
- **Test**: View tools → Execute tool → View analytics
- **Expected**: See only assigned tools, 3 simple metrics (no costs)

---

## 📊 WHAT YOU'LL SEE

### System Admin Dashboard

```
✅ Admin navigation menu
✅ Organizations management
✅ Tools management
✅ System analytics with costs
✅ Full access to everything
```

### Org Owner Dashboard

```
✅ Workspaces navigation
✅ Create/manage workspaces
✅ Invite users
✅ Assign tools
✅ Detailed analytics (no costs)
```

### Workspace Admin Dashboard

```
✅ Workspace management
✅ Member management
✅ Tool access
✅ Workspace analytics
```

### Member Dashboard

```
✅ Tools grid
✅ Execute tools
✅ Simple analytics (3 metrics)
✅ No admin features
```

---

## 🔧 TROUBLESHOOTING

### Problem: Can't login

- **Check**: User created in Clerk?
- **Check**: Webhook fired? (May take 1-2 minutes)
- **Fix**: Manually insert user in Supabase if webhook didn't fire

### Problem: No tools showing

- **Check**: Tools assigned to organization?
- **Fix**: Run tool assignment in SQL:
  ```sql
  INSERT INTO tool_access (tool_id, organization_id, granted_by)
  VALUES ('tool_writer_001', 'org_acme_001', '<admin_user_id>');
  ```

### Problem: Wrong role/permissions

- **Check**: User role in Supabase
- **Fix**: Update user role:
  ```sql
  UPDATE users SET role = 'ORG_OWNER', organization_id = 'org_acme_001'
  WHERE clerk_id = 'user_XXX...';
  ```

---

## 📖 FULL DOCUMENTATION

- **Complete Guide**: `TESTING_LOGIN_GUIDE.md`
- **SQL Setup**: `setup-test-users.sql`
- **Start Script**: `./start-testing.sh`

---

## ✅ READY TO TEST!

1. Run `./start-testing.sh`
2. Create 4 Clerk users
3. Run SQL setup script
4. Login and test!

**Have fun testing! 🎉**
