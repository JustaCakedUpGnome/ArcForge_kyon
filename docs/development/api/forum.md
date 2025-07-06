# Forum API

> Complete forum system with categories, posts, replies, and voting

**Tags:** #api #forum #posts #voting #community

## 🏛️ Forum System Overview

ARCFORGE's forum system provides a Reddit-style community platform with advanced features including polymorphic voting, access control, and real-time statistics.

```mermaid
graph TB
    subgraph "Forum Structure"
        C[Categories] --> P[Posts]
        P --> R[Replies]
        U[Users] --> P
        U --> R
        U --> V[Votes]
        V --> P
        V --> R
    end
    
    subgraph "Access Control"
        PUB[Public Categories] --> FREE[Free Users]
        PREM[Premium Categories] --> SUB[Subscribers]
        ADMIN[Admin Controls] --> MOD[Moderators]
    end
    
    subgraph "Vote System"
        V --> POLY[Polymorphic Design]
        POLY --> UP[Upvotes]
        POLY --> DOWN[Downvotes]
        POLY --> COUNT[Cached Counts]
    end
    
    style C fill:#4c51bf,stroke:#5a67d8,color:#e2e8f0
    style P fill:#2b6cb0,stroke:#3182ce,color:#e2e8f0
    style V fill:#38a169,stroke:#48bb78,color:#e2e8f0
    style ADMIN fill:#e53e3e,stroke:#f56565,color:#e2e8f0
```

## 📂 Categories API

### **Get All Categories**

#### `GET /api/forum/categories`

Retrieve all forum categories with post counts and access levels.

**Request:**
```http
GET /api/forum/categories
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "categories": [
    {
      "id": 1,
      "name": "Foundation",
      "description": "Beginner-friendly Heavy Duty discussions",
      "access_level": "public",
      "post_count": 42,
      "sort_order": 1,
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2, 
      "name": "Advanced Training",
      "description": "Premium techniques and analysis",
      "access_level": "premium",
      "post_count": 18,
      "sort_order": 2,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### **Get Category by ID**

#### `GET /api/forum/categories/:id`

Get detailed category information with recent posts.

**Request:**
```http
GET /api/forum/categories/1
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "category": {
    "id": 1,
    "name": "Foundation",
    "description": "Beginner-friendly Heavy Duty discussions",
    "access_level": "public",
    "post_count": 42,
    "recent_posts": [
      {
        "id": 15,
        "title": "Starting Heavy Duty - Form Check",
        "author": "heavy_duty_newbie",
        "created_at": "2025-01-02T14:30:00Z",
        "reply_count": 7,
        "upvotes": 12,
        "downvotes": 1
      }
    ]
  }
}
```

## 📝 Posts API

### **Get Posts by Category**

#### `GET /api/forum/categories/:categoryId/posts`

Retrieve paginated posts for a specific category.

**Request:**
```http
GET /api/forum/categories/1/posts?page=1&limit=20&sort=latest
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Posts per page (default: 20, max: 50)
- `sort` (string): Sort order (`latest`, `popular`, `oldest`)

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "posts": [
    {
      "id": 15,
      "title": "Starting Heavy Duty - Form Check",
      "content": "Hey everyone, just started Mike Mentzer's program...",
      "author": {
        "id": 5,
        "username": "heavy_duty_newbie",
        "subscription_status": "free"
      },
      "category_id": 1,
      "upvotes": 12,
      "downvotes": 1,
      "reply_count": 7,
      "last_activity": "2025-01-02T16:45:00Z",
      "is_pinned": false,
      "created_at": "2025-01-02T14:30:00Z",
      "updated_at": "2025-01-02T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

### **Create New Post**

#### `POST /api/forum/posts`

Create a new forum post (requires authentication).

**Request:**
```http
POST /api/forum/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Heavy Duty Split Progression Question",
  "content": "I've been following the program for 6 weeks and wondering about progression...",
  "category_id": 2
}
```

**Response (Success):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Post created successfully",
  "post": {
    "id": 43,
    "title": "Heavy Duty Split Progression Question",
    "content": "I've been following the program for 6 weeks...",
    "author": {
      "id": 8,
      "username": "iron_seeker",
      "subscription_status": "premium"
    },
    "category_id": 2,
    "upvotes": 1,
    "downvotes": 0,
    "reply_count": 0,
    "is_pinned": false,
    "created_at": "2025-01-02T18:30:00Z"
  }
}
```

**Response (Error - Access Denied):**
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Premium subscription required for this category"
}
```

### **Get Single Post**

#### `GET /api/forum/posts/:id`

Get detailed post with replies.

**Request:**
```http
GET /api/forum/posts/15
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "post": {
    "id": 15,
    "title": "Starting Heavy Duty - Form Check",
    "content": "Hey everyone, just started Mike Mentzer's program...",
    "author": {
      "id": 5,
      "username": "heavy_duty_newbie",
      "subscription_status": "free",
      "join_date": "2024-12-15T00:00:00Z"
    },
    "category": {
      "id": 1,
      "name": "Foundation"
    },
    "upvotes": 12,
    "downvotes": 1,
    "reply_count": 7,
    "created_at": "2025-01-02T14:30:00Z",
    "replies": [
      {
        "id": 28,
        "content": "Welcome! Form is crucial - focus on slow negatives...",
        "author": {
          "id": 3,
          "username": "mentzer_disciple",
          "subscription_status": "premium"
        },
        "upvotes": 8,
        "downvotes": 0,
        "created_at": "2025-01-02T15:15:00Z"
      }
    ]
  }
}
```

## 💬 Replies API

### **Create Reply**

#### `POST /api/forum/posts/:postId/replies`

Add a reply to an existing post (requires authentication).

**Request:**
```http
POST /api/forum/posts/15/replies
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "Great question! I had similar issues when starting..."
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Reply created successfully",
  "reply": {
    "id": 29,
    "content": "Great question! I had similar issues when starting...",
    "author": {
      "id": 8,
      "username": "iron_seeker",
      "subscription_status": "premium"
    },
    "post_id": 15,
    "upvotes": 0,
    "downvotes": 0,
    "created_at": "2025-01-02T18:45:00Z"
  }
}
```

## ⬆️ Voting System API

### **Vote on Post or Reply**

#### `POST /api/forum/vote`

Cast or change vote on post or reply (requires authentication).

**Request:**
```http
POST /api/forum/vote
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "votable_type": "post",
  "votable_id": 15,
  "vote_type": "upvote"
}
```

**Parameters:**
- `votable_type`: `"post"` or `"reply"`
- `votable_id`: ID of the post or reply
- `vote_type`: `"upvote"` or `"downvote"`

**Response (New Vote):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Vote cast successfully",
  "vote": {
    "votable_type": "post",
    "votable_id": 15,
    "vote_type": "upvote",
    "user_id": 8
  },
  "updated_counts": {
    "upvotes": 13,
    "downvotes": 1
  }
}
```

**Response (Vote Changed):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Vote updated successfully",
  "vote": {
    "votable_type": "post", 
    "votable_id": 15,
    "vote_type": "downvote",
    "user_id": 8
  },
  "updated_counts": {
    "upvotes": 11,
    "downvotes": 2
  }
}
```

### **Remove Vote**

#### `DELETE /api/forum/vote`

Remove user's vote from post or reply.

**Request:**
```http
DELETE /api/forum/vote
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "votable_type": "post",
  "votable_id": 15
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Vote removed successfully",
  "updated_counts": {
    "upvotes": 11,
    "downvotes": 1
  }
}
```

## 📊 Forum Statistics API

### **Get Forum Stats**

#### `GET /api/forum/stats`

Retrieve overall forum statistics.

**Request:**
```http
GET /api/forum/stats
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "stats": {
    "totalPosts": 127,
    "totalReplies": 234,
    "totalMembers": 89,
    "recentActivity": [
      {
        "type": "post",
        "title": "New training split ideas",
        "author": "strength_seeker",
        "timestamp": "2025-01-02T19:00:00Z"
      },
      {
        "type": "reply", 
        "post_title": "Form check please",
        "author": "mentzer_fan",
        "timestamp": "2025-01-02T18:55:00Z"
      }
    ]
  }
}
```

## 🛡️ Admin/Moderation API

### **Delete Post (Admin)**

#### `DELETE /api/forum/posts/:id`

Delete a post and all replies (admin only).

**Request:**
```http
DELETE /api/forum/posts/15
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Post deleted successfully",
  "deleted": {
    "post_id": 15,
    "replies_deleted": 7
  }
}
```

### **Pin/Unpin Post (Admin)**

#### `PATCH /api/forum/posts/:id/pin`

Toggle post pinned status.

**Request:**
```http
PATCH /api/forum/posts/15/pin
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "is_pinned": true
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Post pinned successfully",
  "post": {
    "id": 15,
    "is_pinned": true
  }
}
```

## 🔧 Advanced Features

### **Polymorphic Voting Architecture**

The voting system uses a polymorphic design to handle votes on both posts and replies with a single table:

```sql
-- Votes table structure
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    votable_type VARCHAR(10) NOT NULL CHECK (votable_type IN ('post', 'reply')),
    votable_id INTEGER NOT NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, votable_type, votable_id)
);
```

**Benefits:**
- Single table for all votes
- Consistent API for voting on any content
- Efficient queries with compound indexes
- Easy to extend to new votable types

### **Database Triggers**

Automatic vote count updates using PostgreSQL triggers:

```sql
-- Trigger function for vote count updates
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically update upvotes/downvotes on posts/replies
    -- when votes are inserted, updated, or deleted
END;
$$ LANGUAGE plpgsql;
```

### **Access Control Matrix**

| Action | Free User | Premium User | Admin |
|--------|-----------|--------------|-------|
| View public posts | ✅ | ✅ | ✅ |
| View premium posts | ❌ | ✅ | ✅ |
| Create posts | ✅ | ✅ | ✅ |
| Create premium posts | ❌ | ✅ | ✅ |
| Vote | ✅ | ✅ | ✅ |
| Delete own posts | ✅ | ✅ | ✅ |
| Delete any post | ❌ | ❌ | ✅ |
| Pin posts | ❌ | ❌ | ✅ |

---

*This forum API demonstrates enterprise-level community platform features with production-ready scalability and security.*