# pscms-frontend

Production-ready K12 School CMS with Next.js frontend and Express backend.

## 🚀 Features

### Content Management
- ✅ **Posts Management** - Create, edit, delete blog posts with rich content
- ✅ **Pages Management** - Static pages (About, Contact, etc.) with full control
- ✅ **Live Preview** - Real-time preview of HTML content while editing
- ✅ **Auto Slug Generation** - Automatic URL-friendly slugs from titles
- ✅ **Draft/Published States** - Control content visibility
- ✅ **Media Library** - Upload and manage images and files

### Admin Interface
- ✅ **Modern UI** - Material-UI based responsive admin panel
- ✅ **Authentication** - JWT-based secure login system
- ✅ **Role-Based Access** - Capabilities-based permissions (RBAC)
- ✅ **Dashboard** - Quick access to all admin functions
- ✅ **Content Editor** - Split view with edit and preview tabs

### Frontend
- ✅ **Multiple Themes** - 6 pre-built themes (Classic, Modern, Vibrant, Colorlib variants)
- ✅ **SEO Optimized** - Meta tags, Open Graph, structured data (JSON-LD)
- ✅ **Performance** - Code splitting, caching, image optimization
- ✅ **Responsive** - Mobile-first design that works on all devices
- ✅ **Dynamic Routing** - Automatic routes for posts and pages
- ✅ **Error Handling** - Custom 404/500 pages, error boundaries

### Developer Experience
- ✅ **Custom Hooks** - useAuth, usePosts, useLocalStorage
- ✅ **API Caching** - 5-minute TTL with smart invalidation
- ✅ **Hot Reload** - Fast development with Next.js
- ✅ **TypeScript Ready** - jsconfig.json for better IDE support
- ✅ **Documentation** - Comprehensive guides and testing checklists

## 📦 Tech Stack

**Frontend:**
- Next.js 14 (React 18)
- Material-UI (MUI) v5
- Tailwind CSS
- Emotion (CSS-in-JS)

**Backend:**
- Express.js
- Knex.js (SQL query builder)
- SQLite (development)
- bcrypt (password hashing)
- JWT (authentication)

## 🏁 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd pscms-frontend
```

2. **Install backend dependencies:**

```bash
2. **Install backend dependencies:**
```bash
cd backend
yarn install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
yarn install
```

4. **Set up environment variables:**
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

5. **Create database and run migrations:**
```bash
cd ../backend
yarn migrate
yarn seed
```

6. **Start development servers:**

Terminal 1 (Backend):
```bash
cd backend
yarn dev
# Runs on http://localhost:3001
```

Terminal 2 (Frontend):
```bash
cd frontend
yarn dev
# Runs on http://localhost:3000
```

7. **Access the application:**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
- Default login: admin@school.test / admin123

## 📚 Documentation

- [OPTIMIZATION.md](frontend/OPTIMIZATION.md) - Performance optimizations
- [PERFORMANCE.md](frontend/PERFORMANCE.md) - Performance metrics
- [TESTING.md](frontend/TESTING.md) - Testing checklist

## 🎨 Admin Features

### Dashboard (`/admin`)
Central hub with access to:
- Posts management
- Pages management
- Media library
- Site settings

### Posts (`/admin/posts`)
- Create/edit/delete blog posts
- Live HTML preview
- Auto-generate slugs
- Draft/publish workflow
- Rich content support

### Pages (`/admin/pages`)
- Create/edit/delete static pages
- Live HTML preview
- Auto-generate slugs
- Draft/publish workflow
- Full HTML support

### Media (`/admin/media`)
- Upload images and files
- View media library
- Delete media
- Pagination support

### Settings (`/admin/settings`)
- Change site theme
- Configure site details
- Update settings

## 🌐 Frontend Routes

- `/` - Homepage with latest posts
- `/about` - About page
- `/contact` - Contact page
- `/posts` - All published posts
- `/posts/[slug]` - Individual post
- `/[slug]` - Dynamic pages (e.g., /about-us)
- `/admin` - Admin dashboard
- `/admin/login` - Login page

## 🎨 Themes

6 built-in themes available:
1. **Classic** - Traditional academic layout
2. **Modern** - Clean minimal design
3. **Vibrant** - Colorful and energetic
4. **Colorlib Fresh** - Green/blue gradient
5. **Colorlib Kids** - Orange/yellow fun theme
6. **Colorlib Education** - Blue/green bright theme

Change theme from `/admin/settings`

## 🚀 Production Build

```bash
# Backend
cd backend
yarn start

# Frontend
cd frontend
yarn build
yarn start
```

## 📦 Project Structure

```
pscms-frontend/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Auth, RBAC
│   │   ├── migrations/       # Database migrations
│   │   └── seeds/            # Seed data
│   └── package.json
│
├── frontend/
│   ├── pages/
│   │   ├── index.js          # Homepage
│   │   ├── [slug].js         # Dynamic pages
│   │   ├── admin/            # Admin section
│   │   └── posts/            # Blog posts
│   ├── components/           # React components
│   ├── lib/
│   │   ├── api.js            # API client
│   │   ├── hooks/            # Custom hooks
│   │   └── themes.js         # Theme config
│   ├── styles/               # Global styles
│   ├── themes/               # Theme components
│   └── package.json
│
└── docker/                   # Docker config
```

## 🔒 Security

- JWT authentication
- bcrypt password hashing
- Role-based access control (RBAC)
- XSS protection
- CSRF prevention
- SQL injection prevention
- Secure HTTP headers

## 🛠️ Development

### Adding a New Page
1. Go to `/admin/pages`
2. Click "New Page"
3. Enter title and content
4. Preview in real-time
5. Publish
6. Access at `/your-slug`

### Adding a New Post
1. Go to `/admin/posts`
2. Click "New Post"
3. Enter title and content
4. Preview in real-time
5. Publish
6. Appears at `/posts/your-slug`

### Customizing Themes
Edit theme files in `frontend/themes/[theme-name]/`

## 🧪 Testing

See [TESTING.md](frontend/TESTING.md) for comprehensive testing guide.

## 📝 API Endpoints

### Public
- `GET /api/posts` - List posts
- `GET /api/posts/:slug` - Get single post
- `GET /api/settings/:key` - Get setting

### Protected (requires auth)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/media/upload` - Upload media
- `GET /api/media` - List media

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙋‍♂️ Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `/docs`
- Review TESTING.md for troubleshooting

## 🎯 Roadmap

- [ ] Rich text editor (WYSIWYG)
- [ ] Image gallery component
- [ ] User management UI
- [ ] Comments system
- [ ] Newsletter integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced SEO tools

---

Built with ❤️ for Nigerian K12 Education
