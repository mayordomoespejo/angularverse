// Copy this file to environment.ts and fill in your values
// cp src/environments/environment.example.ts src/environments/environment.ts
export const environment = {
  production: false,
  groqApiKey: 'YOUR_GROQ_API_KEY',
  supabaseUrl: 'YOUR_SUPABASE_PROJECT_URL',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  openRouterBaseUrl: 'https://openrouter.ai/api/v1/chat/completions',
  openRouterApiKey: 'YOUR_OPENROUTER_API_KEY',
  appUrl: 'http://localhost:4200',
  // Firebase — required for Auth (AV-003)
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_FIREBASE_APP_ID',
  },
};
