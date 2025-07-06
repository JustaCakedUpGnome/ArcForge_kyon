# Known Issues and Bug Tracking

> Current bugs, known issues, and troubleshooting for ARCFORGE platform

**Tags:** #bugs #issues #troubleshooting #fixes

## 🐛 Current Active Issues

### **Critical Issues**

#### **🚨 Authentication Modal "J" Key Not Working**
**Status:** Open  
**Priority:** Critical  
**Reported:** 2024-07-03  
**Impact:** High - Users cannot enter emails/passwords containing "j"

**Description:**
When typing in email/password fields in the authentication modal, the "j" key doesn't register as character input. Instead, it's interpreted as the keyboard shortcut for expanding folders.

**Steps to Reproduce:**
1. Open arcforge.tech
2. Click "login" button to open auth modal
3. Try typing an email containing the letter "j" (e.g., "john@example.com")
4. The "j" character doesn't appear in the input field
5. Other letters work normally

**Technical Analysis:**
- Global keyboard event listeners interfering with input field focus
- Modal input fields not properly capturing keyboard events
- Possible event propagation issue

**Workaround:**
- Copy and paste emails containing "j"
- Use different email addresses without "j"

**Fix Plan:**
- [ ] Audit global keyboard event handlers
- [ ] Implement proper event.stopPropagation() for modal inputs
- [ ] Add focus state checking before applying shortcuts
- [ ] Test all letter keys for similar issues

---

#### **🔄 Logout Redirect Failure**
**Status:** Open  
**Priority:** High  
**Reported:** 2024-07-02  
**Impact:** Medium - User experience confusion

**Description:**
Top-right logout button successfully logs out the user but fails to redirect to the homepage, leaving users on the current page with logged-out state.

**Steps to Reproduce:**
1. Log in to ARCFORGE
2. Navigate to any page
3. Click logout button in top-right corner
4. User is logged out but remains on current page
5. Manual navigation required to reach homepage

**Expected Behavior:**
- User should be redirected to homepage after logout
- Clear visual indication of logout completion

**Fix Plan:**
- [ ] Add redirect logic to logout function
- [ ] Implement logout success notification
- [ ] Test across all pages and user states

---

#### **🔍 Search System Conflicts**
**Status:** Open  
**Priority:** Medium  
**Reported:** 2024-07-01  
**Impact:** Medium - Search functionality degraded

**Description:**
Conflicts between global search (Ctrl+K) and forum search implementations causing inconsistent behavior and broken text highlighting.

**Issues:**
- Search highlighting not working on all pages
- Forum search vs global search interface inconsistencies
- Search state not properly cleared between searches

**Fix Plan:**
- [ ] Unify search system architecture
- [ ] Fix text highlighting across all page types
- [ ] Implement consistent search state management
- [ ] Add search result persistence

---

### **Minor Issues**

#### **📱 Mobile Keyboard Shortcuts**
**Status:** Open  
**Priority:** Low  
**Impact:** Mobile users miss keyboard functionality

**Description:**
Keyboard shortcuts (j/k, /, Ctrl+K) are not accessible on mobile devices, requiring alternative input methods.

**Solution in Progress:**
- Touch gesture alternatives
- Mobile-specific UI controls
- Context menus for common actions

#### **🖥️ Mac Compatibility**
**Status:** Investigating  
**Priority:** Medium  
**Impact:** Mac users experience reduced functionality

**Description:**
Some keyboard shortcuts may not work properly on macOS due to different key modifier expectations.

**Investigation Plan:**
- [ ] Test all shortcuts on macOS
- [ ] Implement Cmd key alternatives where needed
- [ ] Add browser compatibility detection

## 🔧 Recently Fixed Issues

### **✅ Nodemailer Method Name Error**
**Status:** Fixed  
**Priority:** High  
**Fixed:** 2024-07-02  
**Reporter:** System monitoring

**Description:**
Backend server was using incorrect `nodemailer.createTransporter()` method instead of `nodemailer.createTransport()`, causing startup crashes.

**Solution:**
- Changed method name in `/backend/routes/auth.js`
- Added proper error handling for email configuration
- Implemented email service testing

**Code Fix:**
```javascript
// Before (broken)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: email, pass: password }
});

// After (fixed)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: email, pass: password }
});
```

---

### **✅ nginx 404 Handling**
**Status:** Fixed  
**Priority:** Medium  
**Fixed:** 2024-06-28  

**Description:**
nginx was serving default 404 page instead of custom ARCFORGE 404.html, breaking site aesthetics and navigation.

**Solution:**
- Added custom `error_page 404 /404.html;` directive to nginx config
- Verified 404.html is accessible and properly styled
- Tested 404 behavior across all missing pages

---

### **✅ CSS Path Migration Issues**
**Status:** Fixed  
**Priority:** High  
**Fixed:** 2024-06-25  

**Description:**
Moving HTML files to new directory structure broke relative CSS paths, causing styling failures.

**Solution:**
- Converted all CSS paths to root-relative format (`/css/` instead of `../css/`)
- Updated all affected HTML files systematically
- Implemented CSS-first migration strategy

## 🛠️ Troubleshooting Guide

### **Authentication Issues**

#### **Login Problems**
**Symptoms:**
- Cannot log in with correct credentials
- "Invalid email or password" errors
- Session not persisting

**Solutions:**
1. **Clear Browser Cache:**
   ```bash
   # Browser dev tools
   Application > Storage > Clear Storage
   ```

2. **Check Password:**
   - Verify caps lock status
   - Try password reset if uncertain

3. **Browser Compatibility:**
   - Try different browser
   - Disable browser extensions
   - Check JavaScript is enabled

#### **Session Issues**
**Symptoms:**
- Frequent automatic logouts
- Session not persisting across tabs
- Login state inconsistencies

**Solutions:**
1. **Local Storage Check:**
   ```javascript
   // Browser console
   console.log(localStorage.getItem('arcforge_token'));
   ```

2. **Cookie Settings:**
   - Enable cookies for arcforge.tech
   - Check third-party cookie settings
   - Try incognito/private mode

### **Forum Functionality Issues**

#### **Voting Not Working**
**Symptoms:**
- Vote buttons don't respond
- Vote counts not updating
- Error messages on voting

**Solutions:**
1. **Authentication Check:**
   - Ensure you're logged in
   - Verify session is active
   - Try logging out and back in

2. **Browser Issues:**
   - Refresh page
   - Clear browser cache
   - Check network connectivity

#### **Search Problems**
**Symptoms:**
- Search not finding results
- Highlighting not working
- Search shortcuts not responding

**Solutions:**
1. **Keyboard Focus:**
   - Click outside input fields
   - Press Esc to clear any active modals
   - Try alternative search methods

2. **Page Refresh:**
   - Reload page to reset search state
   - Clear browser cache if persistent

### **Performance Issues**

#### **Slow Page Loading**
**Symptoms:**
- Pages take >5 seconds to load
- Images not loading
- JavaScript errors

**Solutions:**
1. **Network Check:**
   - Test internet connection speed
   - Try different network/WiFi
   - Check for ISP issues

2. **Browser Optimization:**
   - Close unnecessary tabs
   - Disable heavy browser extensions
   - Update browser to latest version

#### **Mobile Performance**
**Symptoms:**
- App sluggish on mobile
- Touch interactions delayed
- Layout breaking on mobile

**Solutions:**
1. **Mobile Browser:**
   - Try different mobile browser
   - Clear mobile browser cache
   - Update mobile browser

2. **Device Resources:**
   - Close other mobile apps
   - Restart device if severe
   - Check available storage space

## 📊 Issue Tracking Metrics

### **Issue Statistics**
- **Total Open Issues:** 4
- **Critical Issues:** 1
- **High Priority:** 1
- **Medium Priority:** 2
- **Low Priority:** 1

### **Resolution Timeline**
- **Critical Issues:** 24-48 hours
- **High Priority:** 1 week
- **Medium Priority:** 2-4 weeks
- **Low Priority:** 1-3 months

### **Common Issue Categories**
1. **Authentication (35%)**: Login, session, password issues
2. **User Interface (25%)**: Keyboard shortcuts, mobile UI
3. **Search (20%)**: Search functionality, highlighting
4. **Performance (15%)**: Loading times, responsiveness
5. **Browser Compatibility (5%)**: Cross-browser issues

## 🔄 Reporting New Issues

### **Bug Report Template**
```markdown
**Issue Title:** Brief description

**Priority:** Critical/High/Medium/Low

**Description:**
Clear description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome/Firefox/Safari/Edge
- OS: Windows/Mac/Linux/Mobile
- Device: Desktop/Mobile/Tablet

**Screenshots:**
Attach any relevant screenshots
```

### **Reporting Channels**
- **GitHub Issues**: Technical bugs and feature requests
- **Email**: support@arcforge.tech for urgent issues
- **Forum**: Community discussion of issues
- **Discord**: Real-time bug reports (if applicable)

---

*This issue tracking document helps maintain ARCFORGE quality through systematic bug identification, resolution, and prevention.*