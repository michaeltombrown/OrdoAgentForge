# MongoDB Setup Guide

## ✅ Extension Already Installed!

The **MongoDB for VS Code** extension is already installed and ready to use.

```vscode-extensions
mongodb.mongodb-vscode
```

## Features Available:

- 🔌 Connect to MongoDB and Atlas directly from VS Code
- 📊 Navigate databases and collections
- 🔍 Inspect schemas
- 🎮 Use playgrounds to prototype queries
- 💬 AI-powered chat for MongoDB queries
- 📝 Snippets for quick development

## How to Use:

### 1. Open MongoDB View

- Click the MongoDB icon in the Activity Bar (left sidebar)
- Or use Command Palette: `Cmd+Shift+P` → "MongoDB: Open Overview"

### 2. Connect to MongoDB

**Option A: Local MongoDB**

```
mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**

```
mongodb+srv://<username>:<password>@cluster.mongodb.net
```

**Option C: Connection String from Environment**
Use the connection string from your `.env.local`:

```bash
MONGODB_URI=mongodb://localhost:27017/ordoagentforge
```

### 3. Connection Steps:

1. Click "Add Connection" in MongoDB view
2. Choose connection method:
   - "Advanced Connection Settings" for custom strings
   - "Connect with Connection String" for quick setup
3. Enter your connection string
4. Name your connection (e.g., "OrdoAgentForge Local")
5. Click "Connect"

### 4. Using Playgrounds:

Create a new MongoDB Playground:

1. Click "Create MongoDB Playground"
2. Write your queries:

```javascript
// Switch to your database
use('ordoagentforge');

// Insert a document
db.users.insertOne({
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
});

// Find documents
db.users.find({ name: 'Test User' });

// Aggregate
db.users.aggregate([
  { $match: { createdAt: { $gte: new Date('2026-01-01') } } },
  { $group: { _id: '$status', count: { $sum: 1 } } },
]);
```

3. Run with the ▶️ play button or `Cmd+Enter`

## MongoDB with Mongoose:

Your project already has Mongoose installed. Here's a quick setup:

### Create Connection:

```typescript
// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ordoagentforge';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default mongoose;
```

### Create a Model:

```typescript
// src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
```

### Use in API:

```typescript
import { connectDB } from './lib/mongodb';
import { User } from './models/User';

await connectDB();

// Create
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
});

// Find
const users = await User.find({});

// Update
await User.updateOne({ _id: userId }, { name: 'Jane Doe' });

// Delete
await User.deleteOne({ _id: userId });
```

## MongoDB Atlas Setup (Recommended):

### 1. Create Free Cluster:

- Go to https://www.mongodb.com/cloud/atlas
- Sign up/Login
- Create a free M0 cluster
- Choose your region

### 2. Setup Database Access:

- Go to "Database Access"
- Add new database user
- Set username and password
- Grant "Read and write to any database"

### 3. Setup Network Access:

- Go to "Network Access"
- Add IP Address
- Allow access from anywhere: `0.0.0.0/0` (or restrict to your IPs)

### 4. Get Connection String:

- Go to "Database" → "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database user password

### 5. Add to Environment:

```bash
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ordoagentforge?retryWrites=true&w=majority
```

## VS Code MongoDB Features:

### AI Chat Assistant:

- Ask questions about MongoDB in natural language
- Get query suggestions
- Schema recommendations

### Snippets:

- Type `mdb` to see available snippets
- Quick inserts, finds, updates, deletes
- Aggregation pipeline helpers

### Schema Inspector:

- Right-click any collection
- Select "View Document Schema"
- See field types and distributions

### Export/Import:

- Export collections to JSON
- Import data from files
- Backup and restore easily

## Useful Commands:

Access via Command Palette (`Cmd+Shift+P`):

- `MongoDB: Connect` - Connect to database
- `MongoDB: Create Playground` - New playground
- `MongoDB: Run Selected Lines` - Execute selection
- `MongoDB: Disconnect` - Close connection
- `MongoDB: Launch MongoDB Shell` - Open shell

## Environment Variables:

Already configured in `.env.example`:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ordoagentforge

# Or MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ordoagentforge
```

## Troubleshooting:

### Connection Failed?

- Check MongoDB is running: `brew services list` (Mac)
- Verify connection string format
- Check firewall settings
- For Atlas: verify IP whitelist

### Authentication Error?

- Check username/password
- Verify user has correct permissions
- URL encode special characters in password

### Slow Queries?

- Create indexes on frequently queried fields
- Use explain() to analyze queries
- Check connection pooling settings

## Next Steps:

1. ✅ Extension installed
2. 📝 Add your MongoDB connection string to `.env.local`
3. 🔌 Connect using the MongoDB view
4. 🎮 Try a playground
5. 🚀 Start building!

---

**The MongoDB extension is ready to use!** 🍃
