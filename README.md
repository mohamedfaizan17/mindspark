# AI Career Advisor 🚀

A comprehensive AI-powered career guidance platform that helps users analyze their resumes, assess their skills, and receive personalized career recommendations tailored to the global and Indian job markets.

## 🌟 Features

### 📄 Resume Analysis
- **AI-Powered Analysis**: Upload PDF/Word documents or paste resume text for comprehensive analysis
- **Skills Extraction**: Automatically identifies and categorizes technical and soft skills
- **Experience Assessment**: Evaluates professional experience level and career trajectory
- **Contact Integration**: Extracts and displays professional contact information

### 🎯 Career Recommendations
- **Personalized Suggestions**: AI-generated career paths based on resume analysis
- **Market Intelligence**: Real-time job market trends and salary insights
- **Global & Indian Markets**: Comprehensive coverage of opportunities in major tech hubs
- **Growth Analysis**: Identifies fastest-growing and declining industries

### 🔐 User Management
- **Secure Authentication**: Email/password authentication with JWT tokens
- **Data Persistence**: Resume analysis and career data saved across sessions
- **Profile Management**: Comprehensive user profile with skills tracking

### 🤖 AI Integration
- **Gemini AI**: Google's Gemini AI for advanced resume analysis
- **Grok AI**: Optional X.AI Grok integration for enhanced insights
- **Fallback System**: Robust analysis even when AI services are unavailable

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn-ui components with Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based secure authentication
- **AI Services**: Google Gemini AI, X.AI Grok (optional)
- **State Management**: React Query for server state
- **Routing**: React Router v6

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd GenAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Secret (Change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Google Gemini AI Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY="your-gemini-api-key-here"

# Grok AI Configuration (Optional)
# Get your API key from: https://console.x.ai/
GROK_API_KEY="your-grok-api-key-here"
```

### 4. Database Setup
Initialize and set up the database:
```bash
npm run db:generate
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio for database management

## 🔑 API Keys Setup

### Google Gemini AI (Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### Grok AI (Optional)
1. Visit [X.AI Console](https://console.x.ai/)
2. Create an account and generate an API key
3. Add it to your `.env` file as `GROK_API_KEY`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── ResumeAnalyzer/ # Resume analysis components
│   └── Navigation/     # Navigation components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
│   ├── auth.ts        # Authentication utilities
│   ├── gemini.ts      # Gemini AI integration
│   ├── grok.ts        # Grok AI integration
│   └── db.ts          # Database utilities
├── pages/              # Page components
└── assets/             # Static assets
```

## 🎨 Key Features Walkthrough

1. **User Registration/Login**: Secure authentication system
2. **Resume Upload**: Drag-and-drop or text paste functionality
3. **AI Analysis**: Comprehensive resume analysis with skills extraction
4. **Career Recommendations**: Personalized career paths and market insights
5. **Data Persistence**: All analysis data saved for future reference

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Ensure all environment variables are properly set:
- Update `JWT_SECRET` with a secure random string
- Configure production database URL
- Set up AI API keys

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- Secure API key management
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions:
- Check the documentation in the `/docs` folder
- Review the setup guides: `GEMINI_SETUP.md`, `GROK_API_SETUP.md`
- Open an issue in the repository

---

**Built with ❤️ using React, TypeScript, and AI technologies**
