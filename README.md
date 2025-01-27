# AI Chatbot Built with Next.js, Clerk, and Stripe

![image](https://github.com/user-attachments/assets/a15b3686-9de7-476d-9294-51f59fd246c0)

🚀 A modern AI chatbot platform built from scratch using state-of-the-art technologies! This project delivers a seamless user experience with robust features and an intuitive interface.

## Features
🛠️ Complete AI Chatbot Platform <br />

🔒 User Authentication with Clerk <br />

💳 Free & Pro Plans Powered by Stripe  <br />

💬 Persistent Chat History Saved in MongoDB  <br />

🔄 Real-Time Streaming API Responses  <br />

🎨 Responsive UI Built with shadcn/ui  <br />

⚡ Optimistic UI Updates for Better UX  <br />

📚 Infinite Message Loading  <br />

🔤 100% Written in TypeScript  <br />

## Getting Started
Follow these steps to set up the project:

1. Clone the Repository

2. Install Dependencies
```
cd your-repo-name
npm install
```
4. Configure Environment Variables

   Fill out the variables in `.env`:
```
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
CLERK_API_KEY=your_clerk_api_key

# Stripe Keys
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# MongoDB Connection
DATABASE_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
4. Set Up the Database
```
npx prisma generate
npx prisma db push
```
5. Run the Development Server
```
npm run dev
```
The app will be live at `http://localhost:3000`.

## Project Highlights

**Real-Time AI Chat:** Interactive, responsive, and optimized for user experience. <br />

**Free & Pro Plans:** Flexible subscription options powered by Stripe. <br />

**Elegant and Responsive Design:** Built with shadcn/ui for a modern, clean look.
