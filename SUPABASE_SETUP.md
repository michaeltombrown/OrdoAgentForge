# Supabase Setup Guide

## ✅ Status: Configured and Ready!

Supabase has been fully integrated into your project with authentication, database operations, and real-time subscriptions!

## What's Been Set Up:

1. ✅ **Supabase Client** - `src/lib/supabase.ts`
2. ✅ **Helper Functions** - Auth, CRUD, Real-time
3. ✅ **Example Component** - `src/SupabaseExample.tsx`
4. ✅ **TypeScript Types** - Full type safety
5. ✅ **Environment Variables** - Configured

## Step-by-Step Setup:

### Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - **Name**: OrdoAgentForge
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is perfect to start
6. Click "Create new project"
7. Wait 2-3 minutes for setup

### Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** (⚙️ gear icon)
2. Click **API** in the sidebar
3. Find these values:

   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Add to Your Project

Create/update `.env.local` in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Copy the values from your Supabase dashboard
```

### Step 4: Restart Development Server

```bash
npm run dev
```

### Step 5: Test the Connection

```typescript
import { supabase } from './lib/supabase';

// Test connection
const { data, error } = await supabase.from('_test').select('*').limit(1);
console.log('Supabase connected:', !error);
```

## Features Available:

### 🔐 Authentication

```typescript
import { signUp, signIn, signOut, getCurrentUser } from '@/lib/supabase';

// Sign up
await signUp('user@example.com', 'password123');

// Sign in
await signIn('user@example.com', 'password123');

// Get current user
const user = await getCurrentUser();

// Sign out
await signOut();

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

### 📊 Database Operations

```typescript
import { fetchData, insertData, updateData, deleteData } from '@/lib/supabase';

// Fetch all records
const users = await fetchData('users');

// Fetch with filters
const activeUsers = await fetchData('users', {
  filter: { status: 'active' },
  limit: 10,
  orderBy: { column: 'created_at', ascending: false },
});

// Insert
await insertData('users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Update
await updateData('users', userId, { name: 'Jane Doe' });

// Delete
await deleteData('users', userId);
```

### 🔄 Real-time Subscriptions

```typescript
import { subscribeToTable } from '@/lib/supabase';

// Subscribe to changes
const subscription = subscribeToTable('users', (payload) => {
  console.log('Change received!', payload);
});

// Unsubscribe when done
subscription.unsubscribe();
```

### 📁 File Storage

```typescript
import { supabase } from '@/lib/supabase';

// Upload file
const file = document.querySelector('input[type="file"]').files[0];
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`public/${file.name}`, file);

// Download file
const { data: url } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar.png');

// Delete file
await supabase.storage.from('avatars').remove(['public/avatar.png']);
```

## Creating Your First Table:

### In Supabase Dashboard:

1. Go to **Table Editor**
2. Click "Create a new table"
3. Example "users" table:

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  status text default 'active',
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table users enable row level security;

-- Create policy (allow authenticated users to read their own data)
create policy "Users can read own data"
  on users for select
  using (auth.uid() = id);
```

## Row Level Security (RLS):

Supabase uses PostgreSQL's RLS for security:

```sql
-- Allow anyone to read
create policy "Public read access"
  on users for select
  using (true);

-- Allow authenticated users to insert
create policy "Authenticated insert"
  on users for insert
  with check (auth.role() = 'authenticated');

-- Allow users to update own records
create policy "Users update own records"
  on users for update
  using (auth.uid() = id);
```

## Using in React Components:

### Simple Example:

```typescript
import { useState, useEffect } from 'react';
import { fetchData } from '@/lib/supabase';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await fetchData('users');
      setUsers(data);
    }
    loadUsers();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### With Real-time Updates:

```typescript
import { useState, useEffect } from 'react';
import { fetchData, subscribeToTable } from '@/lib/supabase';

function LiveUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initial load
    fetchData('users').then(setUsers);

    // Subscribe to changes
    const subscription = subscribeToTable('users', () => {
      fetchData('users').then(setUsers);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <ul>{/* ... */}</ul>;
}
```

## Environment Variables for Vercel:

When deploying to Vercel, add these in your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your anon key
4. Select **Production**, **Preview**, and **Development**
5. Click "Save"

## Useful Supabase Features:

### 1. SQL Editor

- Write and run SQL queries
- Create tables, views, functions
- Access from Dashboard → SQL Editor

### 2. Database Backups

- Automatic daily backups (Pro plan)
- Point-in-time recovery
- Download backups

### 3. Edge Functions

- Serverless functions
- Run on Deno runtime
- Deploy with Supabase CLI

### 4. Auth Providers

- Email/Password (default)
- Google, GitHub, Discord, etc.
- Magic links
- Phone authentication

### 5. Database Webhooks

- Trigger external services on database changes
- Send to your own APIs
- Integrate with Zapier, n8n

## Example: Complete CRUD Component

```typescript
import { useState, useEffect } from 'react';
import {
  fetchData,
  insertData,
  updateData,
  deleteData,
} from '@/lib/supabase';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    const data = await fetchData<Todo>('todos');
    setTodos(data);
  }

  async function addTodo() {
    await insertData('todos', { title: newTodo, completed: false });
    setNewTodo('');
    loadTodos();
  }

  async function toggleTodo(id: string, completed: boolean) {
    await updateData('todos', id, { completed: !completed });
    loadTodos();
  }

  async function removeTodo(id: string) {
    await deleteData('todos', id);
    loadTodos();
  }

  return (
    <div>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            <span>{todo.title}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Troubleshooting:

### "Invalid API key"

- Check your `.env.local` file
- Make sure you're using the **anon** key, not the **service_role** key
- Restart dev server after adding env variables

### "relation does not exist"

- Table hasn't been created in Supabase
- Check table name spelling
- Create table in Supabase Dashboard

### "Row Level Security policy violation"

- Table has RLS enabled but no policies
- Add appropriate policies in SQL Editor
- Or disable RLS (not recommended for production)

### "Failed to fetch"

- Check Supabase project is running
- Verify project URL is correct
- Check network connectivity

## Next Steps:

1. ✅ Create Supabase project
2. ✅ Add credentials to `.env.local`
3. ✅ Restart dev server
4. ✅ Create your first table
5. ✅ Test with the example component
6. 🚀 Start building!

## Documentation:

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Auth Helpers**: https://supabase.com/docs/guides/auth
- **Database**: https://supabase.com/docs/guides/database

---

**Your Supabase integration is ready!** Create your project and add the credentials to get started! 🚀
