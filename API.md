# 🧱 Lego API Playground - Learn APIs Like Building with Legos!

Welcome to the Lego API Playground! This app helps you understand APIs (Application Programming Interfaces) by using something familiar: Legos! 

## What is an API?

Think of an API like a Lego instruction manual. It tells you:
- What pieces you can use (data you can send)
- How to connect them (what requests you can make)
- What you'll build (what responses you'll get)

## The CRUD Operations (Like Basic Lego Actions)

Every API typically supports these four basic operations:

### 🔍 **READ** (GET) - "Show me what I have"
- Like looking at all your Lego bricks on the table
- **URL**: `GET /api/lego-bricks`
- **What it does**: Gets all your Lego bricks
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "brick123",
      "name": "Classic Red Brick",
      "color": "red",
      "size": "2x4",
      "shape": "rectangular",
      "quantity": 5
    }
  ],
  "message": "Here are your Lego bricks! 🧱"
}
```

### ➕ **CREATE** (POST) - "Add a new piece"
- Like getting a new Lego brick and adding it to your collection
- **URL**: `POST /api/lego-bricks`
- **What to send**:
```json
{
  "name": "Blue Square Brick",
  "color": "blue",
  "size": "2x2", 
  "shape": "square",
  "quantity": 3,
  "description": "Perfect for building walls"
}
```

### ✏️ **UPDATE** (PUT) - "Change something about a piece"
- Like painting a brick a different color or changing how many you have
- **URL**: `PUT /api/lego-bricks/brick123`
- **What to send**:
```json
{
  "quantity": 10,
  "description": "Updated quantity!"
}
```

### 🗑️ **DELETE** (DELETE) - "Remove a piece"
- Like taking a brick out of your collection
- **URL**: `DELETE /api/lego-bricks/brick123`
- **What happens**: The brick gets removed from your collection

## How to Use This App

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000

2. **Try Adding Bricks**: 
   - Fill out the form on the left
   - Click "Add Brick" 
   - Watch the API response appear!
   - See your new brick appear in the collection

3. **Explore the Code**:
   - **Frontend**: `app/page.tsx` - The React components you see
   - **API Routes**: `app/api/lego-bricks/` - The backend logic
   - **Database**: Uses PostgreSQL with Prisma ORM

## API Endpoints

### Lego Bricks
- `GET /api/lego-bricks` - Get all bricks
- `GET /api/lego-bricks?color=red` - Filter bricks by color
- `GET /api/lego-bricks?limit=5` - Limit to 5 bricks
- `POST /api/lego-bricks` - Add a new brick
- `GET /api/lego-bricks/[id]` - Get one specific brick
- `PUT /api/lego-bricks/[id]` - Update a specific brick
- `DELETE /api/lego-bricks/[id]` - Remove a specific brick

### Lego Sets
- `GET /api/lego-sets` - Get all sets
- `GET /api/lego-sets?theme=City` - Filter sets by theme
- `POST /api/lego-sets` - Add a new set
- `GET /api/lego-sets/[id]` - Get one specific set
- `PUT /api/lego-sets/[id]` - Update a specific set
- `DELETE /api/lego-sets/[id]` - Remove a specific set

## Try These API Calls in Your Browser!

Open your browser's Developer Tools (F12) and try these in the Console:

```javascript
// Get all bricks
fetch('/api/lego-bricks')
  .then(res => res.json())
  .then(data => console.log(data));

// Add a new brick
fetch('/api/lego-bricks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Console Brick',
    color: 'purple',
    size: '1x1',
    shape: 'square',
    quantity: 1,
    description: 'Created from browser console!'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Understanding API Responses

Every response includes:
- `success`: true/false - Did it work?
- `data`: The actual information you requested
- `message`: A friendly explanation of what happened
- `error`: If something went wrong, this explains why

## Database Setup

The app uses PostgreSQL with Prisma. To set up:

1. Make sure PostgreSQL is running on your machine
2. Update the `DATABASE_URL` in your `.env` file
3. Run the migrations:
   ```bash
   npx prisma db push
   ```

## What You're Learning

By playing with this app, you're learning:
- **HTTP Methods**: GET, POST, PUT, DELETE
- **REST APIs**: How web applications talk to each other
- **JSON**: The language APIs speak
- **Database Operations**: How data gets stored and retrieved
- **Frontend/Backend Communication**: How React talks to Next.js APIs

## Next Steps

Once you understand the basics, try:
- Adding new fields to the database schema
- Creating relationships between bricks and sets
- Adding authentication
- Building a mobile app that uses these APIs
- Adding search and filtering features

Remember: APIs are everywhere! Every app you use - Instagram, Twitter, your banking app - they all use APIs to get and send data. Now you know how they work! 🎉

---

## Legacy Endpoints (Still Available)

The app also includes the original simple endpoints for reference:

### Users
- `GET /api/users` - Get all users  
- `POST /api/users` - Create a user
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Posts  
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a post
- `GET /api/posts/[id]` - Get specific post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post