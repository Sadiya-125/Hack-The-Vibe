# Collab-Sphere - Hack the Vibe 2025

Collab-Sphere is a collaborative project management and code analysis tool designed to enhance team collaboration and productivity. It integrates GitHub repositories with AI-powered features such as meeting processing, Q&A, and source code embeddings.

## Team Tech Champions - Hack the Vibe 2025

## Key Features

- 🤖 AI-Powered Collaboration

  - Intelligent meeting processing to extract key issues and summaries
  - Smart Q&A system with context-aware responses
  - Source code analysis and embeddings for better understanding
  - Interactive AI Companions with voice capabilities
  - Real-time voice conversations with customizable personalities

- 🔄 GitHub Integration

  - Seamless repository connection and tracking
  - Real-time commit monitoring and history
  - Team collaboration features

- 💳 Credit System

  - Fair usage management through credit-based system
  - Stripe integration for easy credit purchases
  - Usage tracking and analytics

- 👥 Team Management
  - User authentication with Clerk
  - Team member management
  - Project archiving capabilities

## Tech Stack

### Frontend

- Next.js 15.2.3 (React framework)
- TypeScript 5.8.3
- Tailwind CSS 4.0.15
- Radix UI Components
- Framer Motion for animations

### Backend

- tRPC for type-safe API routing
- Prisma ORM with PostgreSQL
- Next.js API routes

### AI & Voice Integration

- Vapi AI for voice conversations
- Google Generative AI (Gemini)
- Langchain for AI processing
- AssemblyAI for speech processing
- 11Labs for voice synthesis

### Authentication & Services

- Clerk for authentication
- Stripe for payments
- GitHub API integration

### Development Tools

- ESLint & Prettier for code quality
- TypeScript for type safety
- Prisma Studio for database management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- GitHub account and token (for private repos)
- Stripe account (for payments)
- Vapi AI API key
- Google AI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Sadiya-125/Hack-The-Vibe.git
cd Hack-The-Vibe
```

2. Install dependencies:

```bash
npm install
```

3. Initialize the database:

```bash
npm run db:migrate
npm run db:generate
```

4. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Project Structure

```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable UI components
├── lib/          # Utility functions and configurations
├── server/       # Backend logic and API routes
├── styles/       # Global styles and Tailwind config
├── trpc/         # tRPC router and procedures
└── validators/   # Zod schemas for validation
```

## AI Companion Features

- Voice-based interactions with customizable AI companions
- Real-time speech-to-text and text-to-speech capabilities
- Customizable teaching styles and personalities
- Subject-specific knowledge and expertise
- Interactive learning sessions with progress tracking
- Session history and analytics

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## Contact

For questions or support, please contact the project owner at:
https://sadiya-maheen-siddiqui.vercel.app/

---

Built with ❤️ by Team Tech Champions for Hack the Vibe 2025
