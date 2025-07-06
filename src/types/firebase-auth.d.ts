// src/types/firebase-auth.d.ts
import '@react-native-async-storage/async-storage';

declare module 'firebase/auth' {
  interface Persistence {
    type: 'SESSION' | 'LOCAL' | 'NONE';
  }
}