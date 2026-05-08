# Interview Simulator — Setup

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

1. Push to GitHub, import the repo in Vercel
2. In Vercel project settings → Environment Variables, add:
   - `ANTHROPIC_API_KEY` = your key (mark as **Server-side only**, NOT browser-exposed)
3. Deploy

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── onboarding/page.tsx      # Profile setup
│   ├── practice/page.tsx        # Question + answer
│   ├── results/page.tsx         # Streaming feedback
│   └── api/                     # Server-side API routes
├── components/                  # All UI components
├── context/SessionContext.tsx   # Practice session state
├── hooks/                       # useProfile, useSession, useStreamingFeedback
└── lib/                         # types, anthropic client, prompts, utils
```
