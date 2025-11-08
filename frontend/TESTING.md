# Testing Guide for CMS Features

## ✅ Admin Features to Test

### 1. **Authentication**
- [ ] Login at `/admin/login` with credentials
- [ ] Redirect to `/admin` after successful login
- [ ] Access denied when not authenticated
- [ ] Session persists across page refreshes
- [ ] Logout functionality

### 2. **Posts Management** (`/admin/posts`)
- [ ] View list of all posts
- [ ] See post status (draft/published)
- [ ] Click "New Post" button
- [ ] Create new post with title, slug, content
- [ ] Auto-generate slug from title
- [ ] Switch between Edit and Preview tabs
- [ ] Preview HTML content rendering
- [ ] Save post as draft
- [ ] Save post as published
- [ ] Edit existing post
- [ ] Delete post (with confirmation)
- [ ] Navigate back to posts list

### 3. **Pages Management** (`/admin/pages`)
- [ ] View list of all pages
- [ ] See page status (draft/published)
- [ ] Click "New Page" button
- [ ] Create new page with title, slug, content
- [ ] Auto-generate slug from title
- [ ] Switch between Edit and Preview tabs
- [ ] Preview HTML content rendering
- [ ] Save page as draft
- [ ] Save page as published
- [ ] Edit existing page
- [ ] Delete page (with confirmation)
- [ ] Navigate back to pages list

### 4. **Dashboard** (`/admin`)
- [ ] View all admin sections (Posts, Pages, Media, Settings)
- [ ] Click on each section card
- [ ] User name displayed in header
- [ ] Back button navigation

### 5. **Media Management** (`/admin/media`)
- [ ] Upload files
- [ ] View uploaded files
- [ ] Delete files
- [ ] Paginated media library

### 6. **Settings** (`/admin/settings`)
- [ ] Change site theme
- [ ] Update site settings
- [ ] Save settings successfully

## ✅ Frontend Features to Test

### 1. **Homepage** (`/`)
- [ ] Hero section displays
- [ ] Theme-specific hero loads
- [ ] Latest published posts shown
- [ ] Post cards clickable
- [ ] No draft posts visible
- [ ] Loading skeletons appear
- [ ] Navigation menu works
- [ ] Footer displays correctly

### 2. **Posts List** (`/posts`)
- [ ] All published posts shown
- [ ] Post excerpts display
- [ ] Click to view full post
- [ ] Pagination (if applicable)
- [ ] SEO meta tags present

### 3. **Single Post** (`/posts/[slug]`)
- [ ] Post title in hero
- [ ] Full content renders
- [ ] HTML formatting works
- [ ] Images display correctly
- [ ] Back button works
- [ ] SEO meta tags (title, description, Open Graph)
- [ ] 404 for unpublished/deleted posts

### 4. **Pages** (`/[slug]`)
- [ ] Page title in hero
- [ ] Full content renders
- [ ] HTML formatting works
- [ ] Dynamic page routes work
- [ ] About page accessible
- [ ] Contact page accessible
- [ ] SEO meta tags present
- [ ] 404 for unpublished/deleted pages

### 5. **Navigation**
- [ ] Home link works
- [ ] About link works
- [ ] Posts/News link works
- [ ] Contact link works
- [ ] Admin link works
- [ ] Mobile menu opens/closes
- [ ] All links navigate correctly

### 6. **Theme System**
- [ ] Classic theme loads
- [ ] Modern theme loads
- [ ] Vibrant theme loads
- [ ] Colorlib themes load
- [ ] Theme colors apply
- [ ] Theme fonts apply
- [ ] Theme switching works

### 7. **Error Handling**
- [ ] 404 page for missing routes
- [ ] 500 page for server errors
- [ ] Error boundary catches errors
- [ ] Graceful error messages
- [ ] Fallback content loads

### 8. **Performance**
- [ ] Pages load quickly
- [ ] Images optimized
- [ ] Code splitting works
- [ ] Caching reduces API calls
- [ ] No unnecessary re-renders
- [ ] Smooth navigation

### 9. **SEO & Accessibility**
- [ ] Meta tags on all pages
- [ ] Open Graph tags present
- [ ] Structured data (JSON-LD)
- [ ] robots.txt accessible
- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

### 10. **Responsive Design**
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Navigation responsive
- [ ] Content readable on all screens
- [ ] Touch targets appropriate

## 🧪 Test Scenarios

### Creating a New Page
1. Go to `/admin/login` and log in
2. Navigate to Dashboard (`/admin`)
3. Click on "Pages" card
4. Click "New Page" button
5. Enter title: "Our Team"
6. Slug auto-generates: "our-team"
7. Enter content with HTML:
```html
<h2>Meet Our Team</h2>
<p>We have an amazing team of educators...</p>
<ul>
  <li>Teacher 1</li>
  <li>Teacher 2</li>
</ul>
```
8. Click "Preview" tab to see rendering
9. Change status to "Published"
10. Click "Save Page"
11. Success message appears
12. Redirects to pages list
13. Visit `/our-team` on frontend
14. Page displays correctly

### Creating a New Post
1. Go to `/admin/posts`
2. Click "New Post"
3. Enter title: "Welcome to Our School"
4. Slug auto-generates: "welcome-to-our-school"
5. Add content with formatting
6. Preview content
7. Set status to "Published"
8. Save post
9. Visit `/posts/welcome-to-our-school`
10. Post displays on frontend
11. Also appears in homepage latest posts

### Editing Content
1. Go to posts or pages list
2. Click edit icon on any item
3. Modify title, content, or status
4. Preview changes
5. Save
6. Verify changes on frontend

### Deleting Content
1. Go to posts or pages list
2. Click delete icon
3. Confirm deletion
4. Item removed from list
5. 404 on frontend for deleted content

## 🐛 Known Issues to Check

- [ ] API caching might show stale data (5-min TTL)
- [ ] Theme loading flicker on initial load
- [ ] Session timeout handling
- [ ] Large image upload handling
- [ ] XSS prevention in HTML content
- [ ] Duplicate slug prevention

## 📊 Performance Metrics to Verify

- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Lighthouse Performance: > 90
- Lighthouse SEO: > 90
- Lighthouse Accessibility: > 90
- Bundle size: < 600KB

## 🔒 Security Checks

- [ ] Authentication required for admin routes
- [ ] CSRF protection on forms
- [ ] XSS protection in content rendering
- [ ] SQL injection prevention
- [ ] Proper error messages (no stack traces in prod)
- [ ] Secure session storage

## ✅ Checklist for Production

- [ ] All tests passing
- [ ] No console errors in production
- [ ] SEO tags on all pages
- [ ] Analytics configured
- [ ] Error tracking set up
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] SSL certificate installed
- [ ] Backup strategy in place
- [ ] Documentation complete
