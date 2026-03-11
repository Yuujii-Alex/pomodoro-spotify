# Pomodoro + Spotify
A minimal Pomodoro web application with optional Spotify integration.
This project is just for learning purposes 

## Features
- Pomodoro timer with presets:
  - Focus session
  - Short break
  - Long break
- Spotify OAuth authentication
- Automatic pausing of Spotify playback at the end of a focus session
- Built with a modern web stack

## Project Background
This project was created as an experiment in combining a simple productivity tool with Spotify playback control. Shortly after development began, Spotify restricted playback control to Premium accounts only. Since I do not have a Premium subscription, development is currently paused.

The existing codebase remains a solid starting point for anyone who does have Premium and wants to extend the functionality.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Spotify Web API
- TailwindCSS

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Yuujii-Alex/pomodoro-spotify
cd pomodoro-spotify
```
### 2. Install dependencies
```bash
npm install
```

### 3. Create a .env.local file:
```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
```
### 4. Start the development server
```bash
npm run dev
```

## Current status
This project was built just as Spotify introduced major changes to their API access rules. As of March 9, Spotify has restricted Development Mode in several ways:
- A Spotify Premium account is now required for Development Mode.
- API access is restricted to a smaller set of endpoints.
- Playback control and other advanced features are no longer available without Premium.

Because I do not have a Spotify Premium subscription, I can no longer test or continue implementing the playback-related features of this project. Development is paused unless these restrictions change or I gain access to a Premium account.


## License
MIT License
