import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Firebase client config is intentionally public — security via database rules
const firebaseConfig = {
  apiKey: "AIzaSyDqNsw0PX1Q_dQqu7m9qbT8fLDzSzmZwK0",
  authDomain: "protocol-or-platform.firebaseapp.com",
  databaseURL: "https://protocol-or-platform-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "protocol-or-platform",
  storageBucket: "protocol-or-platform.firebasestorage.app",
  messagingSenderId: "1073026339236",
  appId: "1:1073026339236:web:b66d32eae2d8c65b22b131"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
