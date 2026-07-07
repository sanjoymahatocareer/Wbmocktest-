import { db, auth } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { safeLocalStorage } from './storage';

export interface LeaderboardUser {
  uid: string;
  name: string;
  district: string;
  points: number;
  streakCount: number;
  avatarColor?: string;
}

export interface UserGamificationState {
  points: number;
  streakCount: number;
  lastActivityDate: string; // YYYY-MM-DD
  district: string;
  badges: string[];
  testsCompletedCount: number;
}

const DEFAULT_DISTRICTS = [
  'কলকাতা', 'নদীয়া', 'উত্তর ২৪ পরগনা', 'দক্ষিণ ২৪ পরগনা', 'হাওড়া', 
  'হুগলি', 'পূর্ব মেদিনীপুর', 'পশ্চিম মেদিনীপুর', 'মুর্শিদাবাদ', 
  'মালদা', 'বাঁকুড়া', 'বীরভূম', 'দার্জিলিং', 'জলপাইগুড়ি', 'পূর্ব বর্ধমান', 'পশ্চিম বর্ধমান'
];

/**
 * Checks if the given userId or current auth state is a guest/mock/unauthenticated user.
 * In sandboxed or mock sessions, we should bypass Firestore to avoid permission failures.
 */
function isGuestOrMock(userId: string | null): boolean {
  if (!userId) return true;
  if (userId === 'demo_guest_user_id_123' || userId === 'mock-user-123') return true;
  if (userId.startsWith('mock') || userId.startsWith('demo')) return true;
  
  // If the auth client has currentUser, match it. If not, it means we aren't authenticated with Firebase Auth
  if (!auth || !auth.currentUser || auth.currentUser.uid !== userId) {
    return true;
  }
  return false;
}

/**
 * Syncs user gamification stats with Firestore (if logged in) or acts locally.
 * Prevents any crashes by wrapping Firestore calls with try-catch and falling back to localStorage.
 */
export async function syncGamificationState(
  userId: string | null,
  localState: UserGamificationState,
  profileName: string
): Promise<UserGamificationState> {
  const defaultState: UserGamificationState = {
    points: 150,
    streakCount: 5,
    lastActivityDate: '',
    district: safeLocalStorage.getItem('userDistrict') || 'কলকাতা',
    badges: [],
    testsCompletedCount: 0,
    ...localState
  };

  if (isGuestOrMock(userId)) {
    // Save locally without calling firestore
    saveLocalGamification(defaultState);
    return defaultState;
  }

  try {
    const userDocRef = doc(db, 'users_gamification', userId!);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const dbData = docSnap.data() as Partial<UserGamificationState>;
      
      // Merge strategy: Choose the higher points and higher streak
      const mergedPoints = Math.max(dbData.points || 0, defaultState.points);
      const mergedStreak = Math.max(dbData.streakCount || 0, defaultState.streakCount);
      const mergedTests = Math.max(dbData.testsCompletedCount || 0, defaultState.testsCompletedCount);
      const mergedBadges = Array.from(new Set([...(dbData.badges || []), ...(defaultState.badges || [])]));
      
      const mergedState: UserGamificationState = {
        points: mergedPoints,
        streakCount: mergedStreak,
        lastActivityDate: dbData.lastActivityDate || defaultState.lastActivityDate || getTodayDateString(),
        district: dbData.district || defaultState.district,
        badges: mergedBadges,
        testsCompletedCount: mergedTests
      };

      // Save the merged data back to the database as a single source of truth
      await setDoc(userDocRef, mergedState, { merge: true });
      
      // Update leaderboard entry as well
      await updateLeaderboardEntry(userId!, profileName, mergedState.district, mergedPoints, mergedStreak);

      saveLocalGamification(mergedState);
      return mergedState;
    } else {
      // Create user doc if not exists
      await setDoc(userDocRef, defaultState, { merge: true });
      await updateLeaderboardEntry(userId!, profileName, defaultState.district, defaultState.points, defaultState.streakCount);
      saveLocalGamification(defaultState);
      return defaultState;
    }
  } catch (error) {
    console.warn('Silent fallback to local gamification state (Firestore access limited):', error);
    // Silent fail safely to local storage
    saveLocalGamification(defaultState);
    return defaultState;
  }
}

/**
 * Directly saves gamification state to Firestore & updates leaderboard.
 */
export async function saveGamificationState(
  userId: string | null,
  state: UserGamificationState,
  profileName: string
): Promise<void> {
  saveLocalGamification(state);

  if (isGuestOrMock(userId)) return;

  try {
    // Save to user sub-profile
    const userDocRef = doc(db, 'users_gamification', userId!);
    await setDoc(userDocRef, state, { merge: true });

    // Update state leaderboard
    await updateLeaderboardEntry(userId!, profileName, state.district, state.points, state.streakCount);
  } catch (error) {
    console.warn('Error saving gamification state silently bypassed:', error);
  }
}

/**
 * Updates or creates a leaderboard profile card in Firestore.
 */
async function updateLeaderboardEntry(
  userId: string,
  name: string,
  district: string,
  points: number,
  streakCount: number
): Promise<void> {
  if (isGuestOrMock(userId)) return;

  try {
    const entryRef = doc(db, 'leaderboard', userId);
    await setDoc(entryRef, {
      uid: userId,
      name,
      district,
      points,
      streakCount,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error updating leaderboard entry silently bypassed:', err);
  }
}

/**
 * Fetch top performing students from Firestore /leaderboard.
 * Merges with default pre-defined high-performance students if Firestore has too few scores.
 */
export async function fetchLiveLeaderboard(): Promise<LeaderboardUser[]> {
  const fallbackMocks: LeaderboardUser[] = [
    { uid: 'mock_1', name: 'সুদীপ সেনগুপ্ত', district: 'কলকাতা', points: 1850, streakCount: 8, avatarColor: 'from-amber-500 to-yellow-500' },
    { uid: 'mock_2', name: 'অনন্যা মুখার্জী', district: 'নদীয়া', points: 1540, streakCount: 6, avatarColor: 'from-slate-400 to-slate-500' },
    { uid: 'mock_3', name: 'প্রশান্ত পাত্র', district: 'পূর্ব মেদিনীপুর', points: 1390, streakCount: 12, avatarColor: 'from-amber-600 to-orange-700' },
    { uid: 'mock_4', name: 'সোমা ঘোষ', district: 'হাওড়া', points: 1120, streakCount: 4, avatarColor: 'from-indigo-400 to-purple-600' },
    { uid: 'mock_5', name: 'রাজেশ চক্রবর্তী', district: 'উত্তর ২৪ পরগনা', points: 950, streakCount: 5, avatarColor: 'from-teal-400 to-emerald-600' },
  ];

  const currentUid = auth?.currentUser?.uid;
  if (isGuestOrMock(currentUid)) {
    // Return mock leaderboard directly for guest/sandbox users
    return fallbackMocks;
  }

  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(leaderboardRef, orderBy('points', 'desc'), limit(15));
    const querySnapshot = await getDocs(q);
    
    const dbEntries: LeaderboardUser[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dbEntries.push({
        uid: doc.id,
        name: data.name || 'পশ্চিমবঙ্গ পরীক্ষার্থী',
        district: data.district || 'কলকাতা',
        points: Number(data.points) || 0,
        streakCount: Number(data.streakCount) || 1,
        avatarColor: 'from-blue-600 to-teal-500'
      });
    });

    if (dbEntries.length === 0) {
      return fallbackMocks;
    }

    // Merge real firestore entries with high-performing WB mock entries to populate a rich leaderboard
    const merged = [...dbEntries];
    
    // Add fallback mocks whose scores don't clash with real user UIDs
    fallbackMocks.forEach((mock) => {
      if (!merged.some(e => e.uid === mock.uid)) {
        merged.push(mock);
      }
    });

    // Re-sort to make it elegant
    return merged.sort((a, b) => b.points - a.points);
  } catch (error) {
    console.warn('Error fetching live leaderboard (bypassed with fallback):', error);
    return fallbackMocks;
  }
}

/**
 * Local storage persistence helpers
 */
function saveLocalGamification(state: UserGamificationState): void {
  safeLocalStorage.setItem('userPoints', state.points.toString());
  safeLocalStorage.setItem('streakCount', state.streakCount.toString());
  safeLocalStorage.setItem('lastActivityDate', state.lastActivityDate);
  safeLocalStorage.setItem('userDistrict', state.district);
  safeLocalStorage.setItem('userBadges', JSON.stringify(state.badges));
  safeLocalStorage.setItem('testsCompletedCount', state.testsCompletedCount.toString());
}

export function loadLocalGamification(): UserGamificationState {
  let badges: string[] = [];
  try {
    const savedBadges = safeLocalStorage.getItem('userBadges');
    if (savedBadges) {
      badges = JSON.parse(savedBadges);
      if (!Array.isArray(badges)) {
        badges = [];
      }
    }
  } catch (e) {
    badges = [];
  }

  return {
    points: parseInt(safeLocalStorage.getItem('userPoints') || '150', 10) || 150,
    streakCount: parseInt(safeLocalStorage.getItem('streakCount') || '5', 10) || 5,
    lastActivityDate: safeLocalStorage.getItem('lastActivityDate') || '',
    district: safeLocalStorage.getItem('userDistrict') || 'কলকাতা',
    badges,
    testsCompletedCount: parseInt(safeLocalStorage.getItem('testsCompletedCount') || '0', 10) || 0
  };
}

/**
 * Returns YYYY-MM-DD local date string stringently
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Determines and evaluates streak adjustments.
 * If logged in or daily test taken, increments.
 */
export function evaluateDailyStreak(
  lastDateStr: string,
  currentStreakCount: number
): { nextStreak: number; shouldShowBonusPrompt: boolean } {
  const today = getTodayDateString();
  if (!lastDateStr) {
    return { nextStreak: currentStreakCount || 1, shouldShowBonusPrompt: true };
  }

  if (lastDateStr === today) {
    // Already did activity today
    return { nextStreak: currentStreakCount, shouldShowBonusPrompt: false };
  }

  const lastDate = new Date(lastDateStr);
  const todayDate = new Date(today);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Yesterday was the last activity! Streak continues!
    return { nextStreak: currentStreakCount + 1, shouldShowBonusPrompt: true };
  } else {
    // Decayed activity streak. Set to 1
    return { nextStreak: 1, shouldShowBonusPrompt: true };
  }
}
