This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication using Google OAuth2

### Overview

- API endpoint: api/auth.
- PAYLOAD: {google_token?: string, access_token?: string, refresh_token?: string}.
- **Tokens priority**: access_token - refresh_token - google_token.
- Our access_token and refresh_token contain user info from our DB.

### Common QA

**Client may have only refresh_token -> what to do?**

- Issue the new access_token using this valid refresh_token, or else move to google_token validation.

**Client may have only access_token -> what to do?**

- Allow using until expired -> NOTE: may need token rotation technique, by invalidating old refresh_token.
- If the access_token is expired and the client doesn't have an assigned refresh_token -> Client will be requested to sign in again.

### The Step-by-step implementation

1. Verify tokens according to **Tokens priority** above.
2. Check/create user -> theres a case where user is to be deactivated.
   1. User not exist: create user -> save to DB.
   2. User exist.
3. Get new access_token, refresh_token.
   1. By rotation if client refresh_token is valid -> generate new access_token.
   2. Refresh_token is invalid or not exist in the payload -> generate a new pair of {access_token, refresh_token}.

## SSE use cases

## Message Queue using RabbitMQ

### Background task-handling using worker threads to chunk and embed documents

1. About the broker
- broker type: point-to-point, distribute message by default - Round Robin (little control, utilize
  bindings or topics to control which messages to handle)
- 1 consumer handles 1 message at a time, each consumer runs as a separated process
   - **PROS**:
      - simple implementation with ack and retry
      - no race-condition handling since each consumer only handles 1 msg at a time.
   - **CONS**:
      - small number of consumers if running in a local machine - limited resources ->
  queue overloaded with awaiting messages because of a limited number of consumers
      - if our MQ system crashes, there's a small chance to lose our message (unfinished messages saving)

2. What it does
- When document is chunking, update the corresponding doc status in the DB
- The same goes with other statuses
- HOW?
  - the flow is in the background, so its nice to run it in a async manner -> use Message Queue