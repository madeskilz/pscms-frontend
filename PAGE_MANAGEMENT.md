# Page Management Guide

## Overview

This CMS now uses a **database-driven content management system** for all major pages. Content is stored in the `posts` table and rendered dynamically, making it easy to manage and update without editing code.

## Page Structure

### Database-Driven Pages (Modern List Views)

All these pages query content from the database and display it in modern, Material Design layouts:

1. **Admissions** (`#/admissions`)
2. **Calendar** (`#/calendar`)
3. **PTA** (`#/pta`)
4. **Parents** (`#/parents`)
5. **Resources** (`#/resources`)
6. **FAQs** (`#/faqs`)

### Fixed Content Pages

These pages still use settings-based rendering:

- **About** (`#/about`) - Uses `about_page` setting
- **Contact** (`#/contact`) - Uses `contact_page` setting
- **Home** (`#/`) - Uses homepage settings

---

## How Pages Work

### 1. Admissions Page

**Route:** `#/admissions`

**Content Query:**
```sql
SELECT * FROM posts 
WHERE status = 'published' 
  AND (type = 'page' OR slug LIKE '%admission%' OR title LIKE '%Admission%')
ORDER BY created_at DESC
```

**Displays:**
- 4 gradient info cards (Application, Timeline, Fees, Requirements)
- Dynamic list of admission-related posts
- 4-step admissions process
- CTA section with contact button

**To Add Content:**
```sql
INSERT INTO posts (type, status, title, slug, content, author_id) 
VALUES ('page', 'published', 'Your Title', 'your-slug', '<p>Content...</p>', 1);
```

---

### 2. Calendar Page

**Route:** `#/calendar`

**Content Query:**
```sql
SELECT * FROM posts 
WHERE status = 'published' 
ORDER BY created_at DESC 
LIMIT 50
```

**Displays:**
- Current month banner with pulse animation
- Posts grouped by month with sticky headers
- Timeline view with vertical gradient connector
- Date badges and "Today" indicators
- Event cards with read more links

**To Add Events:**
```sql
INSERT INTO posts (type, status, title, slug, content, author_id, created_at) 
VALUES ('post', 'published', 'Event Name', 'event-slug', '<p>Details...</p>', 1, '2024-11-15');
```

---

### 3. PTA Page

**Route:** `#/pta`

**Content Query:**
```sql
SELECT * FROM posts 
WHERE status = 'published' 
  AND (type = 'page' OR slug LIKE '%pta%' OR title LIKE '%PTA%' OR content LIKE '%Parent-Teacher%')
ORDER BY created_at DESC
```

**Displays:**
- 4 gradient info cards (Community, Events, Initiatives, Impact)
- PTA news and updates
- 4-step membership benefits
- CTA section with involvement buttons

**To Add PTA Content:**
```sql
INSERT INTO posts (type, status, title, slug, content, author_id) 
VALUES ('post', 'published', 'PTA Meeting Notice', 'pta-meeting-nov', '<p>Details...</p>', 1);
```

---

### 4. Parents Page

**Route:** `#/parents`

**Content Query:**
```sql
SELECT * FROM posts 
WHERE status = 'published' 
  AND (slug LIKE '%parent%' OR title LIKE '%Parent%')
ORDER BY created_at DESC 
LIMIT 10
```

**Displays:**
- 4 gradient cards linking to Resources, FAQs, PTA, Contact
- Parent updates and news
- Essential parent information (4 cards)
- CTA section for support

**To Add Parent Content:**
```sql
INSERT INTO posts (type, status, title, slug, content, author_id) 
VALUES ('post', 'published', 'Parent Newsletter', 'parent-newsletter-nov', '<p>Content...</p>', 1);
```

---

### 5. Resources Page

**Route:** `#/resources`

**Content Query:**
```sql
SELECT * FROM posts 
WHERE status = 'published' 
  AND (slug LIKE '%resource%' OR title LIKE '%Resource%' OR content LIKE '%handbook%')
ORDER BY created_at DESC
```

**Displays:**
- 4 gradient category cards (Handbooks, Forms, Reports, Templates)
- List of available resources
- Commonly requested documents
- CTA for document requests

**To Add Resources:**
```sql
INSERT INTO posts (type, status, title, slug, content, author_id) 
VALUES ('page', 'published', 'Student Handbook 2024', 'student-handbook-2024', '<h2>Handbook</h2><p>Content...</p>', 1);
```

---

### 6. FAQs Page

**Route:** `#/faqs`

**Content Query:**
```sql
SELECT * FROM posts 
WHERE status = 'published' 
  AND (slug LIKE '%faq%' OR title LIKE '%FAQ%' OR content LIKE '%question%')
ORDER BY created_at DESC
```

**Displays:**
- 4 gradient category cards (Admissions, Academics, Fees, School Life)
- FAQ posts with numbered list
- 4 common hardcoded FAQs
- CTA section for more questions

**To Add FAQs:**
```sql
INSERT INTO posts (type, status, title, slug, content, author_id) 
VALUES ('page', 'published', 'How do I apply for admission?', 'faq-how-to-apply', '<h2>Answer</h2><p>Steps...</p>', 1);
```

---

## Content Management Workflow

### Adding New Content

1. **Connect to database:**
   ```bash
   sqlite3 data/cms.sqlite
   ```

2. **Insert post:**
   ```sql
   INSERT INTO posts (type, status, title, slug, content, author_id, created_at) 
   VALUES (
     'post',                    -- or 'page' for static pages
     'published',               -- or 'draft'
     'Your Title',
     'your-slug',
     '<h2>Content</h2><p>HTML content here</p>',
     1,                         -- admin user ID
     datetime('now')
   );
   ```

3. **Rebuild static site:**
   ```bash
   ./start-dev.sh
   ```

### Updating Existing Content

```sql
UPDATE posts 
SET content = '<h2>Updated Content</h2>', 
    updated_at = datetime('now')
WHERE slug = 'your-slug';
```

### Deleting Content

```sql
-- Soft delete (recommended)
UPDATE posts SET status = 'draft' WHERE slug = 'your-slug';

-- Hard delete
DELETE FROM posts WHERE slug = 'your-slug';
```

### Viewing All Posts

```sql
SELECT id, type, status, title, slug, created_at 
FROM posts 
ORDER BY created_at DESC;
```

---

## Post Types

- **`post`** - Blog posts, news, events (appear in calendar and listings)
- **`page`** - Static pages, resources, FAQs (appear in specific page listings)

## Post Status

- **`published`** - Visible on site
- **`draft`** - Hidden from public view

---

## Design System

All pages use consistent Material Design components:

### Info Cards
- **Gradient Blue** - Primary info
- **Gradient Purple** - Secondary info
- **Gradient Green** - Success/positive info
- **Gradient Orange** - Highlighted info

### Modern List Items
- Icon + Content layout
- Hover animations
- Left gradient accent bar
- Read more links

### Process Steps
- Numbered cards (1-4)
- Gradient circular numbers
- Step-by-step flow

### CTA Sections
- Gradient background
- Centered content
- Primary + secondary buttons

### FAQ Items
- Large numbered badges
- Question + answer format
- Read more links

---

## Navigation Links

Update navigation in database:

```sql
UPDATE settings 
SET value = '[
  {"label": "Home", "href": "/"},
  {"label": "About", "href": "/about"},
  {"label": "Admissions", "href": "/admissions"},
  {"label": "Calendar", "href": "/calendar"},
  {"label": "Parents", "href": "/parents"},
  {"label": "PTA", "href": "/pta"},
  {"label": "Resources", "href": "/resources"},
  {"label": "FAQs", "href": "/faqs"},
  {"label": "Contact", "href": "/contact"}
]'
WHERE key = 'primary_menu';
```

---

## Sample Content Included

The database includes sample content for:

### Resources (4 pages)
- Student Handbook 2024-2025
- Parent Handbook and Guide
- Enrollment Application Form
- Academic Calendar 2024-2025

### FAQs (4 pages)
- What documents are needed for admission?
- What is the fee structure and payment schedule?
- Do you offer scholarships or financial aid?
- What extracurricular activities are available?

### PTA (3 posts)
- PTA General Meeting - November 2024
- PTA Fundraiser Success - Thank You!
- Volunteer Opportunities for Parents

### Parents (2 posts)
- Parent Portal Now Live - Access Your Dashboard
- Tips for Supporting Your Child at Home

### Calendar (8 events)
- Various events in November 2024

---

## Adding a New Page Type

1. **Add route in `ui.js`:**
   ```javascript
   if (slug === 'newpage') return this.renderNewPage();
   ```

2. **Create render method:**
   ```javascript
   renderNewPage() {
     const posts = db.queryAll(
       'SELECT * FROM posts WHERE status = ? AND slug LIKE ?',
       ['published', '%newpage%']
     );
     return `<div class="page-container">...</div>`;
   }
   ```

3. **Add CSS styles in `style.css`**

4. **Add sample content to database**

---

## Best Practices

1. **Use semantic slugs:** `student-handbook-2024` not `page1`
2. **Include keywords in titles:** Helps with search queries
3. **Add HTML structure:** Use `<h2>`, `<h3>`, `<ul>`, `<p>` tags
4. **Set proper dates:** Use `datetime('now')` or specific dates for events
5. **Test after adding:** Rebuild and view on localhost:8080
6. **Backup database:** Copy `data/cms.sqlite` before major changes

---

## Troubleshooting

**Page shows "No content available":**
- Check post status is `published`
- Verify slug/title matches query pattern
- Check created_at date is valid

**Content doesn't appear after adding:**
- Rebuild static site: `./start-dev.sh`
- Check browser cache (hard refresh: Cmd+Shift+R)
- Verify database was updated: `sqlite3 data/cms.sqlite "SELECT * FROM posts WHERE slug='your-slug'"`

**Styling looks wrong:**
- Ensure HTML tags are properly closed
- Check CSS classes match existing components
- Rebuild to update dist/css/style.css

---

## Quick Reference

### Common Queries

**List all published posts:**
```sql
SELECT id, title, slug, type, created_at FROM posts WHERE status = 'published' ORDER BY created_at DESC;
```

**Find posts by keyword:**
```sql
SELECT * FROM posts WHERE (title LIKE '%keyword%' OR content LIKE '%keyword%') AND status = 'published';
```

**Count posts by type:**
```sql
SELECT type, COUNT(*) as count FROM posts GROUP BY type;
```

**Recent posts (last 10):**
```sql
SELECT title, created_at FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT 10;
```

---

## Deployment

When deploying to production:

1. Ensure `data/cms.sqlite` has all content
2. Run `./build-static.sh`
3. Upload `/dist` folder to static host
4. Ensure `dist/db/cms.sqlite` is included
5. Test all pages on production URL

---

## Support

For help with content management:
- Check existing sample posts for format examples
- Review `public/js/ui.js` for render methods
- Consult `public/css/style.css` for styling classes
- Test queries in SQLite before adding to database

Happy content managing! 🎓
