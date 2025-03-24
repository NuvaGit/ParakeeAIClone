# Interview Assistant

AI-powered interview preparation assistant built with React, Vite, Firebase, and OpenAI.

## Features

- Real-time audio transcription during interviews
- AI-generated response suggestions tailored to your profile and resume
- Floating UI for use alongside video conferencing apps
- User profiles with resume and job history storage
- Desktop app support with Zoom/Teams integration (coming soon)

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Speech Processing**: Web Speech API
- **AI Model**: OpenAI GPT-4 (for generating responses)
- **Desktop App Support**: Electron (planned for Phase 2)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interview-assistant.git
cd interview-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password and Google sign-in)
   - Enable Firestore
   - Enable Cloud Functions
   - Register your web app to get the config object

4. Create a `.env` file in the root directory with your Firebase and OpenAI credentials:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Set up Firebase Cloud Functions:
```bash
cd functions
npm install
cd ..
```

6. Add your OpenAI API key to Firebase Cloud Functions environment:
```bash
firebase functions:config:set openai.key=your-openai-api-key
```

7. Start the development server:
```bash
npm run dev
```

## Deployment

1. Build the app:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Phase 2: Desktop App Integration

To enable desktop app support with Zoom/Teams integration:

1. Install Electron:
```bash
npm install electron electron-builder --save-dev
```

2. Follow the instructions in `electron/README.md` to build and package the desktop app.

## License

This project is licensed under the MIT License - see the LICENSE file for details.