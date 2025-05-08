# Briefly - Voice & Text Reporting Assistant

Transform unstructured employee updates into structured weekly reports and tasks.

## About

Briefly is a voice- and text-first reporting assistant that helps employees create clear, actionable updates for their managers. It uses AI to structure information, extract tasks, and generate concise reports.

## Features

- Voice and text input options
- Smart prompt guidance
- Weekly report generation
- Multiple export formats (Markdown, email, Slack)
- Task suggestion and extraction
- Authentication with Clerk

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`
   - Fill in the required values, particularly the Clerk authentication keys

```bash
cp env.example .env.local
# Then edit .env.local with your values
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Authentication

This project uses [Clerk](https://clerk.com/) for authentication. To set up:

1. Create an account on [Clerk.com](https://clerk.com/)
2. Create a new application
3. Get your API keys from the Clerk dashboard
4. Add them to your `.env.local` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_clerk_key
CLERK_SECRET_KEY=your_private_clerk_key
```

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Clerk Authentication
- OpenAI APIs (for voice transcription and report generation)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
