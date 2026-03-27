# AI Career Advisor - Deployment Guide

## 🚀 Vercel Deployment

This AI Career Advisor application is ready for deployment on Vercel with the following features:
- Resume analysis with Grok AI integration
- Job recommendations from Indian cities
- Career path suggestions
- Market intelligence insights

## 📋 Pre-Deployment Setup

### 1. Environment Variables
You'll need to set up the following environment variables in your Vercel dashboard:

```bash
# Required: Google Gemini AI API Key
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# Optional: Grok AI API Key (for enhanced analysis)
GROK_API_KEY=your-grok-api-key-here

# Database (for production, use a cloud database)
DATABASE_URL=your-production-database-url

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-for-production
```

### 2. API Keys Setup

#### Google Gemini AI (Required):
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it as `VITE_GEMINI_API_KEY` in Vercel environment variables

#### Grok AI (Optional - for enhanced analysis):
1. Visit [X.AI Console](https://console.x.ai/)
2. Create an account and get API key
3. Add it as `GROK_API_KEY` in Vercel environment variables

## 🔧 Deployment Steps

### Option 1: Direct Vercel Deployment
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🌟 Features Included

- **Resume Analysis**: AI-powered resume feedback with Grok AI integration
- **Job Scraping**: Real job opportunities from Indian cities (Bangalore, Hyderabad, etc.)
- **Career Recommendations**: Personalized career path suggestions
- **Market Intelligence**: Industry trends and growth analysis
- **Persistent Data**: Resume analysis persists across sessions
- **Responsive Design**: Works on all devices

## 🔒 Security Notes

- API keys are properly configured for client/server separation
- Sensitive data is stored securely
- Clean logout process clears user data
- Production-ready authentication system

## 📱 Post-Deployment

After deployment, your AI Career Advisor will be available at your Vercel URL with:
- Professional resume analysis
- Indian job market integration
- Career guidance and recommendations
- Market intelligence insights

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui
- **AI**: Google Gemini + Grok AI
- **Database**: Prisma (SQLite for dev, PostgreSQL for production)
- **Authentication**: JWT-based auth system
- **Deployment**: Vercel-optimized
