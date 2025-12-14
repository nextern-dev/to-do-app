# ✨ Todo App

A modern, beautiful, and feature-rich todo application built with Next.js 16, Prisma, NextAuth.js, and shadcn/ui. Features dark mode, toast notifications, smooth animations, and a responsive design.

![Todo App Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Todo+App+Preview)

## 🚀 Features

- ✅ **Authentication**: Sign in with Google OAuth or credentials
- 📝 **Todo Management**: Create, read, update, and delete todos
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔔 **Toast Notifications**: Beautiful toast messages for user feedback
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Smooth Animations**: Slide-in animations and hover effects
- 🔒 **Secure**: JWT-based authentication with secure API routes
- 🗄️ **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL with Prisma
- **Icons**: Emoji and custom SVG icons
- **Notifications**: Sonner (toast library)

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials (for Google sign-in)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Update your .env file with database URL
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"

   # Run database migrations
   npx prisma migrate dev
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"

   # NextAuth
   AUTH_SECRET="your-secret-key-here-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (get from Google Cloud Console)
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Authentication

1. **Register**: Click "Don't have an account? Register" and create an account
2. **Sign In**: Use your email and password "password", or sign in with Google
3. **Theme Toggle**: Click the sun/moon icon to switch between light and dark modes

### Managing Todos

1. **Add Todo**: Use the form at the top to create new todos
2. **Mark Complete**: Click the "Done" button to toggle completion status
3. **Edit Todo**: Click the "Edit" button to modify title and description
4. **Delete Todo**: Click the "Delete" button to remove a todo

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication routes

### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## 🗂️ Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   └── register/
│   │   │   └── todos/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── Providers.tsx
│   └── lib/
│       ├── auth.ts
│       ├── prisma.ts
│       └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── package.json
└── README.md
```

## 🗄️ Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  todos         Todo[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🎨 Customization

### Themes

The app supports light and dark themes. Colors are defined in `src/app/globals.css` using CSS custom properties.

### Components

All UI components are built with shadcn/ui. You can customize them in `src/components/ui/`.

### Animations

Custom animations are defined in `src/app/globals.css`. Modify keyframes to change animation behavior.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS Amplify

Make sure to:
- Set all environment variables
- Configure your database
- Run `npm run build` for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Prisma](https://prisma.io/) - Database ORM
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ and lots of ☕
