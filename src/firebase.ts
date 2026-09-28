import { initializeApp } from 'firebase/app';
// Firebase exposes this native export at runtime; its common type entry omits it.
// @ts-expect-error Native-only Firebase Auth export.
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const config = { apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID, appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID };
export const configured = Object.values(config).every(Boolean);
const app = configured ? initializeApp(config) : null;
export const auth = app ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) }) : null;
export const db = app ? getFirestore(app) : null;
export {friendly} from './firebaseErrors';
