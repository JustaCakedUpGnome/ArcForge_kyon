# Testing Guide

> Comprehensive manual testing procedures for ARCFORGE platform

**Tags:** #testing #qa #manual-testing #procedures

## 🎯 Testing Strategy

ARCFORGE uses manual testing procedures to ensure functionality across the full stack. This guide provides systematic test cases for all major features.

## 🧪 Test Environment Setup

### **Prerequisites**
- Local development environment running
- Fresh database with sample data
- Browser with developer tools open
- Test user accounts created

### **Test Data Setup**
```bash
# Create test users
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","email":"test1@example.com","password":"password123"}'

curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","email":"test2@example.com","password":"password123"}'

# Create test admin (manually set role in database)
psql -U arcforge -d arcforge_db -c "UPDATE users SET subscription_status='admin' WHERE email='test1@example.com';"
```

## 🔐 Authentication Testing

### **User Registration**

#### Test Case: Successful Registration
**Steps:**
1. Navigate to `localhost:8000`
2. Click login/register link
3. Fill registration form:
   - Username: `newtestuser`
   - Email: `new@example.com`
   - Password: `password123`
4. Submit form

**Expected Result:**
- ✅ User created successfully
- ✅ JWT token received
- ✅ Redirected to authenticated area
- ✅ User session active

#### Test Case: Duplicate Email Registration
**Steps:**
1. Attempt registration with existing email: `test1@example.com`

**Expected Result:**
- ❌ Registration fails
- ❌ Error message: "Email already exists"
- ❌ User not created

#### Test Case: Invalid Input Validation
**Steps:**
1. Test various invalid inputs:
   - Empty fields
   - Invalid email format
   - Password too short (< 6 chars)
   - Username with special characters

**Expected Result:**
- ❌ Validation errors displayed
- ❌ Form submission prevented
- ❌ Clear error messages

### **User Login**

#### Test Case: Valid Login
**Steps:**
1. Use credentials: `test1@example.com` / `password123`
2. Submit login form

**Expected Result:**
- ✅ Login successful
- ✅ JWT token stored
- ✅ User interface updates
- ✅ Protected areas accessible

#### Test Case: Invalid Credentials
**Steps:**
1. Use wrong password: `test1@example.com` / `wrongpassword`

**Expected Result:**
- ❌ Login fails
- ❌ Error: "Invalid email or password"
- ❌ No token stored

### **Password Reset**

#### Test Case: Password Reset Request
**Steps:**
1. Click "Forgot Password"
2. Enter email: `test1@example.com`
3. Submit request

**Expected Result:**
- ✅ Success message displayed
- ✅ Reset token generated in database
- ✅ Email would be sent (if configured)

## 🗂️ Forum Functionality Testing

### **Categories and Navigation**

#### Test Case: View Categories
**Steps:**
1. Navigate to forum section
2. Verify all categories display

**Expected Result:**
- ✅ All categories visible
- ✅ Post counts accurate
- ✅ Access levels respected (premium vs public)
- ✅ Categories sorted correctly

#### Test Case: Category Access Control
**Steps:**
1. Login as free user
2. Attempt to access premium category

**Expected Result:**
- ❌ Access denied for premium content
- ✅ Clear message about subscription requirement
- ✅ Public categories accessible

### **Post Creation and Management**

#### Test Case: Create Public Post
**Steps:**
1. Login as authenticated user
2. Navigate to public category
3. Create new post:
   - Title: "Test Post Title"
   - Content: "This is test content for the post"
4. Submit post

**Expected Result:**
- ✅ Post created successfully
- ✅ Post appears in category
- ✅ Author information correct
- ✅ Timestamps accurate

#### Test Case: Create Premium Post
**Steps:**
1. Login as free user
2. Attempt to create post in premium category

**Expected Result:**
- ❌ Creation blocked
- ❌ Premium subscription required message
- ❌ Post not created

#### Test Case: Post Content Validation
**Steps:**
1. Attempt to create post with:
   - Empty title
   - Empty content
   - Extremely long content

**Expected Result:**
- ❌ Validation prevents submission
- ❌ Clear error messages
- ❌ Form highlights issues

### **Replies and Threading**

#### Test Case: Create Reply
**Steps:**
1. Open existing post
2. Add reply: "This is a test reply"
3. Submit reply

**Expected Result:**
- ✅ Reply created
- ✅ Reply appears under post
- ✅ Reply count incremented
- ✅ Author information correct

#### Test Case: Nested Reply Display
**Steps:**
1. View post with multiple replies
2. Verify threading and order

**Expected Result:**
- ✅ Replies display in chronological order
- ✅ Author information visible
- ✅ Timestamps accurate
- ✅ Proper visual hierarchy

### **Voting System**

#### Test Case: Upvote Post
**Steps:**
1. Login as user
2. Click upvote on test post
3. Verify vote registered

**Expected Result:**
- ✅ Upvote count increments
- ✅ Vote button state changes
- ✅ User vote recorded in database
- ✅ Optimistic UI update

#### Test Case: Change Vote
**Steps:**
1. Upvote a post
2. Click downvote on same post

**Expected Result:**
- ✅ Vote changes from up to down
- ✅ Counts update correctly (up -1, down +1)
- ✅ Database reflects change
- ✅ UI updates properly

#### Test Case: Remove Vote
**Steps:**
1. Vote on post
2. Click same vote button again

**Expected Result:**
- ✅ Vote removed
- ✅ Count decrements
- ✅ Button returns to neutral state
- ✅ Database record deleted

#### Test Case: Vote on Reply
**Steps:**
1. Vote on reply (not post)
2. Verify reply vote counts

**Expected Result:**
- ✅ Reply vote count updates
- ✅ Post vote count unchanged
- ✅ Polymorphic system works correctly

## 🔍 Search Functionality Testing

### **Vim-Style Search**

#### Test Case: Page Search with "/"
**Steps:**
1. Navigate to any content page
2. Press `/` key
3. Type search term
4. Press Enter or navigate matches

**Expected Result:**
- ✅ Search interface appears
- ✅ Matches highlighted on page
- ✅ Can navigate between matches
- ✅ Case-insensitive search

#### Test Case: Search Navigation
**Steps:**
1. Search for term with multiple matches
2. Use `n` and `N` keys to navigate

**Expected Result:**
- ✅ `n` goes to next match
- ✅ `N` goes to previous match
- ✅ Visual highlighting updates
- ✅ Wraps around at end/beginning

### **Command Palette Search**

#### Test Case: Global Search with Ctrl+K
**Steps:**
1. Press `Ctrl+K` from any page
2. Type search query
3. Select result

**Expected Result:**
- ✅ Command palette opens
- ✅ Results filter as typing
- ✅ Can navigate with arrow keys
- ✅ Selecting result navigates to page

## 🎮 Terminal Interface Testing

### **Keyboard Navigation**

#### Test Case: Folder Navigation with j/k
**Steps:**
1. Navigate to main page
2. Use `j` key to expand folders
3. Use `k` key to collapse folders

**Expected Result:**
- ✅ `j` expands next collapsed folder
- ✅ `k` collapses all folders
- ✅ Smooth animations
- ✅ Proper focus management

#### Test Case: Input Field Focus
**Steps:**
1. Open login modal
2. Type in email field including letter "j"
3. Verify all characters register

**Expected Result:**
- ✅ All characters type correctly
- ✅ No keyboard shortcut interference
- ✅ Proper input field focus
- ✅ Can complete login flow

### **Mobile Responsiveness**

#### Test Case: Mobile Navigation
**Steps:**
1. Open site on mobile device or browser mobile mode
2. Test all navigation elements
3. Verify touch interactions

**Expected Result:**
- ✅ File tree navigation works on touch
- ✅ Forms usable on mobile
- ✅ Text readable without zoom
- ✅ No horizontal scrolling

## 👨‍💻 Admin Functionality Testing

### **Post Moderation**

#### Test Case: Delete Post (Admin)
**Steps:**
1. Login as admin user
2. Navigate to any post
3. Use admin delete function

**Expected Result:**
- ✅ Delete option visible for admin
- ✅ Post deleted successfully
- ✅ All replies also deleted
- ✅ Category post count updated

#### Test Case: Pin Post (Admin)
**Steps:**
1. Pin important post
2. Verify pinned status

**Expected Result:**
- ✅ Post shows pinned status
- ✅ Appears at top of category
- ✅ Visual indicator for pinned post

## 📊 Performance Testing

### **Page Load Times**

#### Test Case: Homepage Performance
**Steps:**
1. Clear browser cache
2. Load homepage
3. Measure load time in dev tools

**Expected Result:**
- ✅ Page loads under 2 seconds
- ✅ No console errors
- ✅ All assets load correctly

#### Test Case: Forum Page Performance
**Steps:**
1. Load forum with many posts
2. Measure render time

**Expected Result:**
- ✅ Posts render quickly
- ✅ Pagination works smoothly
- ✅ No memory leaks

### **API Response Times**

#### Test Case: API Performance
**Steps:**
1. Test critical API endpoints:
   - `GET /api/forum/categories`
   - `GET /api/forum/posts`
   - `POST /api/auth/login`

**Expected Result:**
- ✅ API responses under 200ms
- ✅ No timeout errors
- ✅ Consistent performance

## 🔧 Browser Compatibility Testing

### **Cross-Browser Testing**

#### Test Case: Multiple Browsers
**Steps:**
1. Test in Chrome, Firefox, Safari, Edge
2. Verify all functionality works

**Expected Result:**
- ✅ Consistent behavior across browsers
- ✅ No browser-specific errors
- ✅ Terminal aesthetics render correctly

## 📋 Testing Checklist

### **Pre-Release Testing**
- [ ] Authentication flow (register, login, logout)
- [ ] Forum functionality (create, reply, vote)
- [ ] Search systems (vim-style, command palette)
- [ ] Keyboard navigation (j/k, shortcuts)
- [ ] Mobile responsiveness
- [ ] Admin functions
- [ ] Error handling
- [ ] Performance benchmarks
- [ ] Cross-browser compatibility
- [ ] Security validation

### **Regression Testing**
- [ ] All previous bug fixes still work
- [ ] No new issues introduced
- [ ] Database integrity maintained
- [ ] API contracts unchanged

---

*This testing guide ensures production-ready quality through systematic manual verification of all platform features.*