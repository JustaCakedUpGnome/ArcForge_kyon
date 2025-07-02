# Known Bugs and Issues

## 🐛 Current Bugs

### Authentication Modal - "J" Key Not Working
**Status:** Open  
**Priority:** High  
**Description:** When typing in the email/password fields in the auth modal, the "j" key doesn't register as a character input. Instead, it seems to be interpreted as a keyboard shortcut (possibly for opening folders or navigation).

**Steps to Reproduce:**
1. Open arcforge.tech
2. Click "login" button
3. Try typing an email containing the letter "j"
4. The "j" character doesn't appear in the input field

**Impact:** Users cannot enter emails or passwords containing the letter "j"

**Possible Cause:** Keyboard event handler conflict in the auth modal or global keyboard shortcuts interfering with input fields.

**TODO:** 
- [ ] Check for global keyboard event listeners
- [ ] Ensure input fields have proper focus and event handling
- [ ] Test other keys for similar issues

---

## 🐛 Fixed Bugs

### Nodemailer Method Name Error
**Status:** Fixed  
**Priority:** High  
**Fixed:** 2025-07-02  
**Description:** Backend was using `nodemailer.createTransporter()` instead of `nodemailer.createTransport()`, causing server crashes on startup.

**Solution:** Changed method name from `createTransporter` to `createTransport` in `/backend/routes/auth.js`

---

## 🧪 Testing Notes

- Always test authentication flow after backend changes
- Test on both localhost and production environment
- Check PM2 logs for backend errors: `pm2 logs arcforge`