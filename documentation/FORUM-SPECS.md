# ARCFORGE FORUM SPECIFICATIONS

## 🎯 **Vision**
Community-driven Heavy Duty training forum with premium features, integrated with existing authentication and subscription system.

## 📋 **Core Features**

### **Phase 1: Foundation (MVP)**
- ✅ **Categories**: Foundation, Methodology, Advanced, Progress Logs, Q&A
- ✅ **Basic Threading**: Create posts, reply to posts
- ✅ **User Integration**: Use existing auth system, show subscription status
- ✅ **Simple Voting**: Upvote/downvote posts and replies
- ✅ **Basic Search**: Search within forum posts
- ✅ **Responsive Design**: Terminal-themed UI matching site aesthetic

### **Phase 2: Enhanced Features**
- 🔄 **Rich Content**: Markdown support, image uploads for progress photos
- 🔄 **Real-time Updates**: Live post/reply notifications
- 🔄 **Enhanced Profiles**: User post history, join date, rep score
- 🔄 **Moderation Tools**: Report system, admin panel
- 🔄 **Pinned Posts**: Sticky important topics per category

### **Phase 3: Premium Integration**
- 🔄 **Premium Sections**: Advanced training discussions for subscribers only
- 🔄 **Direct Messaging**: Private communication between users
- 🔄 **Enhanced Profiles**: Badges, detailed stats, custom avatars
- 🔄 **Priority Support**: Highlighted posts for premium members

## 🗄️ **Database Schema**

### **Categories Table**
```sql
categories:
- id (PRIMARY KEY)
- name (VARCHAR) - "Foundation", "Methodology", etc.
- description (TEXT)
- access_level (ENUM) - "public", "premium"
- sort_order (INT)
- created_at (TIMESTAMP)
```

### **Posts Table**
```sql
posts:
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- category_id (FOREIGN KEY → categories.id)
- title (VARCHAR)
- content (TEXT)
- upvotes (INT DEFAULT 0)
- downvotes (INT DEFAULT 0)
- reply_count (INT DEFAULT 0)
- last_activity (TIMESTAMP)
- is_pinned (BOOLEAN DEFAULT false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Replies Table**
```sql
replies:
- id (PRIMARY KEY)
- post_id (FOREIGN KEY → posts.id)
- user_id (FOREIGN KEY → users.id)
- content (TEXT)
- upvotes (INT DEFAULT 0)
- downvotes (INT DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Votes Table**
```sql
votes:
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- votable_type (ENUM) - "post", "reply"
- votable_id (INT) - post_id or reply_id
- vote_type (ENUM) - "upvote", "downvote"
- created_at (TIMESTAMP)
UNIQUE(user_id, votable_type, votable_id)
```

## 🎨 **UI/UX Design**

### **Forum Layout**
```
/forum.html - Main forum page
├── Category list with post counts
├── Recent activity feed
├── Search bar
└── Create new post button (auth required)

/forum/category/{id} - Category view
├── Post list with vote counts, reply counts
├── Pagination
├── Sort options (newest, most voted, most replies)
└── Create post in category

/forum/post/{id} - Individual post view
├── Original post with voting
├── Reply thread
├── Reply form (auth required)
└── Share/report options
```

### **Visual Elements**
- **Terminal Theme**: Consistent with existing site design
- **Subscription Badges**: Visual indicators for premium members
- **Vote Buttons**: Clean up/down arrows with counts
- **User Avatars**: Simple letter-based avatars initially
- **Activity Indicators**: "New" badges, last activity timestamps

## 🚀 **Implementation Plan**

### **Backend API Endpoints**
```
GET  /api/forum/categories - List all categories
GET  /api/forum/category/{id}/posts - Get posts in category
POST /api/forum/posts - Create new post (auth required)
GET  /api/forum/post/{id} - Get post with replies
POST /api/forum/post/{id}/replies - Add reply (auth required)
POST /api/forum/vote - Cast vote (auth required)
GET  /api/forum/search?q={query} - Search posts/replies
```

### **Frontend Structure**
```
forum/
├── forum.html - Main forum page
├── category.html - Category view
├── post.html - Individual post view
└── js/
    ├── forum.js - Main forum functionality
    ├── forum-api.js - API communication
    └── forum-voting.js - Voting system
```

## 🔐 **Access Control**

### **Public Access (No Auth)**
- View public categories
- Read posts and replies
- Search functionality

### **Authenticated Users (Free)**
- All public access features
- Create posts in public categories
- Reply to posts
- Vote on posts/replies
- Basic user profile

### **Premium Users**
- All free user features
- Access to premium categories ("Advanced Training", "Exclusive Q&A")
- Enhanced profile features
- Priority support indicators

## 📊 **Heavy Duty Specific Features**

### **Category Structure**
1. **Foundation** - Basic principles, getting started
2. **Methodology** - Training splits, progression methods
3. **Advanced** - Premium: CNS management, advanced techniques
4. **Progress Logs** - User workout journals and photos
5. **Q&A** - General questions and community help
6. **Equipment** - Gear reviews and recommendations

### **Content Types**
- **Training Logs**: Structured workout posts with exercises/weights
- **Form Checks**: Video/photo posts for technique feedback
- **Progress Photos**: Before/after transformations
- **Recovery Discussions**: CNS fatigue, rest periods, sleep
- **Routine Sharing**: Custom workout variations

## 🎯 **Success Metrics**
- **User Engagement**: Posts per day, replies per post
- **Community Growth**: New users joining forum discussions
- **Premium Conversion**: Forum activity driving subscription upgrades
- **Content Quality**: Upvote ratios, helpful reply rates

## 🔧 **Technical Notes**
- **Use existing authentication system** - seamless integration
- **Leverage current database** - extend user table if needed
- **Terminal styling consistency** - maintain site aesthetic
- **Mobile responsive** - ensure forum works on all devices
- **SEO friendly** - forum content should be searchable

---

## 🚦 **Current Status: Planning Phase**
**Next Steps**: Create database schema, build basic frontend structure, implement core posting functionality.