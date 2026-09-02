# Phillips Academy Task Manager

<div align="center">
  <img src="public/assets/logo-circle-crop.png" alt="Phillips Academy Logo" width="200"/>
</div>

## About

Phillips Academy Task Manager is a specialized task management application designed for homeschool children. It provides an intuitive interface for managing daily and weekly tasks, with separate views for both parents and children.

## Features

- Progressive Web App (PWA) support for mobile installation
- Separate parent and child interfaces
- Daily and weekly task views
- Task completion tracking with points and streaks
- Skills tracking with progress counters
- Sorting functionality for tasks and skills
- Modern farmhouse-themed interface with Tailwind CSS

## Usage

### Login codes

| Code | Mode |
|------|------|
| `0000` | Parent |
| `2160` | Child |

### For Parents

1. Access the parent view to manage and oversee tasks
2. Create and assign tasks for your children
3. Monitor task completion and progress
4. View both list and weekly calendar views
5. Manage skills and track child progress

### For Children

1. Access your personal dashboard
2. View assigned tasks for the day or week
3. Mark tasks as complete
4. Track skills progress

## Developer Setup

### Prerequisites

- Node.js 22+ (matches CI)
- A Firebase project with Firestore and Anonymous Auth enabled

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dannyphillips/phillips-academy.git
cd phillips-academy
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Configure Firebase — copy the sample env file and fill in your project credentials:

```bash
cp .env.sample .env
```

Required variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

6. Preview production build:

```bash
npm run preview
```

### Deploying Firestore rules and indexes

After changing `firestore.rules` or `firestore.indexes.json`:

```bash
firebase deploy --only firestore
```

### Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Firebase (Auth + Firestore)
- PWA via vite-plugin-pwa

## License

MIT
