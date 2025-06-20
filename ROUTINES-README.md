# 🏋️ ARCFORGE ROUTINES SYSTEM 🏋️

## 📁 Adding New Workout Routines

### Simple HTML Conversion Method
1. Create your workout in markdown format
2. Convert to HTML page with ARCFORGE cyber theme
3. Add a card to `docs/routines.html` in the protocol-grid section
4. Link to your new HTML page

### Example: Adding "My Routine"
1. Create `my-routine.md` in `routines/` folder (for reference)
2. Copy `docs/goto-split.html` as template for `docs/my-routine.html`
3. Replace content with your routine
4. Add this card to `docs/routines.html`:
```html
<div class="protocol-card">
    <div class="card-header">
        <h3>💀 MY ROUTINE 💀</h3>
    </div>
    <div class="card-content">
        <p><strong>Description of your routine</strong></p>
        <p>Brief explanation of what makes it special.</p>
        <a href="my-routine.html" class="routine-link">
            <div class="emphasis">VIEW ROUTINE</div>
        </a>
    </div>
</div>
```

## 📋 Markdown Format

Your workout files should use standard markdown. The system automatically styles:

- **Headers** (`# ## ###`) - Become styled workout section titles
- **Tables** - Perfect for workout schedules and tracking
- **Lists** - Great for exercise lists and notes
- **Checkboxes** - For progress tracking (future enhancement)
- **Blockquotes** (`>`) - Styled as highlighted tips/quotes
- **Bold text** (`**bold**`) - Emphasized content

## 🎯 Example Structure

```markdown
# Workout Name

| Day | Workout |
|-----|---------|
| Mon | Back    |
| Tue | Rest    |

---

**Workout A – Back**
Date: ___________

- Deadlifts – [ ] reps x [ ] weight
- Pull-ups – [ ] reps x [ ] weight

Notes:

---

> "Train Hard. Recover Harder." – Mike Mentzer
```

## 🚀 Features

- ✅ **Auto-styled** with cyber theme
- ✅ **Mobile responsive** 
- ✅ **Easy navigation** between routines
- ✅ **Breadcrumb navigation**
- ✅ **Markdown support** for formatting
- ⏳ **Progress tracking** (coming soon)
- ⏳ **Printable versions** (coming soon)

## 🎨 Styling

The system automatically applies ARCFORGE's cyber theme:
- Purple/teal color scheme
- Retro 90s aesthetic  
- Neon effects and glitch styling
- Courier New monospace font
- Responsive design

Just focus on writing great workout content - the styling is handled automatically!

---

*Built for maximum intensity. Train hard or go home.* 💀