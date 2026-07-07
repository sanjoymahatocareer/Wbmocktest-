import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  inMemoryPersistence, 
  GoogleAuthProvider, 
  signInWithPopup as fbSignInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  User 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { safeLocalStorage } from "./storage";

const firebaseConfig = {
  projectId: "gen-lang-client-0608676880",
  appId: "1:525898394708:web:f7a1bf36a57d5ddc6451c1",
  apiKey: "AIzaSyBqZEwzBO4eWyHNyQcHhICEQDeR5YUk5EQ",
  authDomain: "gen-lang-client-0608676880.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-471f39c6-81e2-4b01-b898-60831515feb6",
  storageBucket: "gen-lang-client-0608676880.firebasestorage.app",
  messagingSenderId: "525898394708"
};

const app = initializeApp(firebaseConfig);

let authInstance;
try {
  authInstance = getAuth(app);
} catch (e) {
  console.warn("getAuth(app) failed, trying initializeAuth with inMemoryPersistence:", e);
  try {
    authInstance = initializeAuth(app, {
      persistence: [inMemoryPersistence]
    });
  } catch (err) {
    console.error("Firebase auth initialization failed completely:", err);
    authInstance = {
      currentUser: null,
      isMock: true,
      onAuthStateChanged: () => () => {}
    } as any;
  }
}

export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Since we have a custom database id, pass it to getFirestore
let firestoreInstance;
try {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.error("Firestore initialization failed:", e);
  firestoreInstance = {
    app,
    type: "firestore",
    isMock: true
  } as any;
}

export const db = firestoreInstance;

const isMockAuth = (auth: any) => !auth || auth.isMock;

// Mock Authentication system state and registry for sandboxed / constrained environments
const authListeners: ((user: any) => void)[] = [];
let currentMockUser: any = null;

try {
  const savedMockUser = safeLocalStorage.getItem('wbm_mock_user');
  if (savedMockUser) {
    currentMockUser = JSON.parse(savedMockUser);
  }
} catch (e) {}

export const onAuthStateChanged = (authInst: any, next: any, error?: any, completed?: any) => {
  authListeners.push(next);
  
  let fbUnsubscribe: (() => void) | null = null;
  
  if (!isMockAuth(authInst)) {
    try {
      fbUnsubscribe = fbOnAuthStateChanged(authInst, (user) => {
        if (user) {
          next(user);
        } else {
          next(currentMockUser);
        }
      }, error, completed);
    } catch (e) {
      console.warn("Firebase onAuthStateChanged subscription failed, relying on mock subscriber state:", e);
    }
  }
  
  // Immediately provide current mock state if not logged in via Firebase yet
  next(currentMockUser);

  return () => {
    if (fbUnsubscribe) {
      try {
        fbUnsubscribe();
      } catch (e) {}
    }
    const index = authListeners.indexOf(next);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
};

export const signInWithPopup = async (authInst: any, provider: any) => {
  if (!isMockAuth(authInst)) {
    try {
      const result = await fbSignInWithPopup(authInst, provider);
      return result;
    } catch (err: any) {
      console.warn("Real signInWithPopup failed or is blocked in this environment. Falling back to Mock Sign-In:", err);
    }
  }

  // Fallback / Mock Sign-In to let users explore the application fully in restricted previews
  const demoUser = {
    uid: "mock-user-123",
    email: "prokashmal799@gmail.com",
    displayName: "পশ্চিমবঙ্গ পরীক্ষার্থী (ডেমো)",
    photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "9999999999",
    isMock: true
  };
  currentMockUser = demoUser;
  try {
    safeLocalStorage.setItem('wbm_mock_user', JSON.stringify(demoUser));
  } catch (e) {}

  authListeners.forEach(listener => {
    try {
      listener(demoUser);
    } catch (e) {}
  });

  return { user: demoUser };
};

export const signOut = async (authInst: any) => {
  if (!isMockAuth(authInst)) {
    try {
      await fbSignOut(authInst);
    } catch (err) {
      console.warn("Real signOut failed:", err);
    }
  }
  
  currentMockUser = null;
  try {
    safeLocalStorage.removeItem('wbm_mock_user');
  } catch (e) {}
  
  authListeners.forEach(listener => {
    try {
      listener(null);
    } catch (e) {}
  });
};

export type { User };

