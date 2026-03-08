# Cricket Prediction Game 🏏

A modern web application for cricket match predictions with live score updates, built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Live Cricket Scores**: Real-time score updates for ongoing matches
- **Match Predictions**: Submit predictions for cricket matches
- **Leaderboard**: Track prediction accuracy and rankings
- **Responsive Design**: Works on desktop and mobile devices
- **Sound Effects**: Audio feedback for boundaries and wickets
- **Real-time Updates**: Automatic score polling every 10 seconds

## Current Match

**IND vs NZ T20 World Cup Final**
- Venue: Narendra Modi Stadium, Ahmedabad
- Date: March 8, 2026
- Status: Preview (Match starts at 13:30 GMT)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **API**: Cricket data from CricAPI
- **Deployment**: Ready for Vercel, Netlify, or Railway

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Rushabh16-9/prediction-game.git
cd prediction-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_RAPIDAPI_KEY=your_cricapi_key_here
MATCH_ID=139489
RAPIDAPI_KEY=your_cricapi_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Routes

- `GET /api/live-score` - Get current match live score
- `GET /api/leaderboard` - Get prediction leaderboard
- `POST /api/predictions` - Submit match predictions

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── live-score/route.ts
│   │   ├── leaderboard/route.ts
│   │   └── predictions/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── MatchBar.tsx
│   ├── Leaderboard.tsx
│   ├── PredictionForm.tsx
│   └── UserSelection.tsx
└── lib/
    ├── constants.ts
    ├── scoring.ts
    └── types.ts
```

## Deployment

The app is ready for deployment on:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repo
- **Railway**: `railway up`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your cricket prediction app!

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
