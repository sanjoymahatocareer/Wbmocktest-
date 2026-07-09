import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, Crown, BookOpen, AlertCircle, FileCheck, Award, 
  HelpCircle, Trophy, User, Check, X, ShieldAlert, BookOpenCheck, Zap, Star, LogIn, LogOut, Calendar, Sparkles, ArrowLeft,
  Shield, Settings, Moon, Sun, BarChart2, Home
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { safeLocalStorage, safeSessionStorage } from './lib/storage';
import { syncGamificationState, loadLocalGamification, evaluateDailyStreak, getTodayDateString, saveGamificationState, UserGamificationState } from './lib/gamification';
import { MockTest, ExamCategory, PostName, JobNotification, TestResult, ViewType, ActiveSubscription } from './types';
import { 
  examCategories, mockTestsList, jobNotifications, successStories, 
  syllabusData, questionBankData 
} from './data';
import { getCategories, getMockTests, getPosts } from './lib/db';

// Import components
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import QuickAccess from './components/QuickAccess';
import PopularPosts from './components/PopularPosts';
import TestCard from './components/TestCard';
import LiveStats from './components/LiveStats';
import KhoborSection from './components/KhoborSection';
import PremiumBanner from './components/PremiumBanner';
import PremiumPromoBanner from './components/PremiumPromoBanner';
import PremiumPopup from './components/PremiumPopup';
import CategoryScroll from './components/CategoryScroll';
import GovtJobCategories from './components/GovtJobCategories';
import JobNotifications from './components/JobNotifications';
import GovernmentJobsList from './components/GovernmentJobsList';
import StateJobsList from './components/StateJobsList';
import SystemPostList from './components/SystemPostList';
import JobDetails from './components/JobDetails';
import NewsDetails from './components/NewsDetails';
import Testimonials from './components/Testimonials';
import BottomNav from './components/BottomNav';
import MockTestInterface from './components/MockTestInterface';
import ResultDetails from './components/ResultDetails';
import MobileAdminDashboard from './components/MobileAdminDashboard';
import AdminLogin from './components/AdminLogin';
import SidebarDrawer from './components/SidebarDrawer';
import StudyPlanner from './components/StudyPlanner';
import GamificationDashboard from './components/GamificationDashboard';
import DailyQuiz from './components/DailyQuiz';
import UserDashboard from './components/UserDashboard';
import DailyCurrentAffairs from './components/DailyCurrentAffairs';
import InfoPages from './components/InfoPages';
import ExamSEOPage, { examSEODataList } from './components/ExamSEOPage';
import NotificationPrompt from './components/NotificationPrompt';
import NotificationToast from './components/NotificationToast';
import { getRandomNotification, sendBrowserNotification, requestNotificationPermission } from './lib/notificationService';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeToast, setActiveToast] = useState<{ title: string; body: string; id: number } | null>(null);

  const triggerPushNotification = (title: string, body: string) => {
    // 1. Try native browser notification
    sendBrowserNotification(title, body);
    
    // 2. Play a gentle double chime notification sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      
      setTimeout(() => {
        osc.stop();
        audioCtx.close();
      }, 450);
    } catch (e) {
      console.log('Audio chime not supported / user gesture required:', e);
    }

    // 3. Set visual toast
    setActiveToast({ title, body, id: Date.now() });
  };
  
  // Initialize view based on URL route (supports pathname starting with /admin, query parameter ?admin, or hash #admin)
  const [currentView, setView] = useState<ViewType>(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    if (path.startsWith('/admin') || search.includes('admin') || hash.startsWith('#admin')) {
      const isAdminLoggedIn = safeSessionStorage.getItem('admin_auth_token') === 'true';
      if ((path === '/admin/dashboard' || hash.includes('dashboard') || search.includes('dashboard')) && isAdminLoggedIn) {
        return 'admin';
      }
      return 'admin-login';
    }
    return 'home';
  });

  // Listen to browser URL/route changes to dynamically switch views without physical links on the main site
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      
      if (path.startsWith('/admin') || search.includes('admin') || hash.startsWith('#admin')) {
        const isAdminLoggedIn = safeSessionStorage.getItem('admin_auth_token') === 'true';
        if ((path === '/admin/dashboard' || hash.includes('dashboard') || search.includes('dashboard')) && isAdminLoggedIn) {
          setView('admin');
        } else {
          setView('admin-login');
        }
      } else if (path === '/' || path === '/home' || !path) {
        setView((prev) => {
          if (prev === 'admin' || prev === 'admin-login') {
            return 'home';
          }
          return prev;
        });
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);
  
  // Dynamic State holding lists
  const [mockTests, setMockTests] = useState<MockTest[]>(() => {
    return getMockTests();
  });

  const [categories, setCategories] = useState<ExamCategory[]>(() => {
    return getCategories();
  });

  const [posts, setPosts] = useState<PostName[]>(() => {
    return getPosts();
  });

  const [jobs, setJobs] = useState<JobNotification[]>(() => {
    const saved = safeLocalStorage.getItem('jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return jobNotifications;
  });

  const [showAllJobs, setShowAllJobs] = useState(false);

  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState<boolean>(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ orderId: string; planName: string } | null>(null);

  // Cashfree Series-level purchases states
  const [purchasedSeries, setPurchasedSeries] = useState<string[]>([]);
  const [selectedPurchaseSeries, setSelectedPurchaseSeries] = useState<any | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [verifyingSeriesPayment, setVerifyingSeriesPayment] = useState<boolean>(false);
  const [seriesPaymentSuccess, setSeriesPaymentSuccess] = useState<string | null>(null);
  const [seriesPaymentSuccessName, setSeriesPaymentSuccessName] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [postListTitle, setPostListTitle] = useState('অ্যাডমিট কার্ড');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [selectedExamSlug, setSelectedExamSlug] = useState<string>('wb-police');

  // Premium Popup Smart System State
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [jobPostViewCount, setJobPostViewCount] = useState(0);
  const [hasShown24hrPopup, setHasShown24hrPopup] = useState(false);

  useEffect(() => {
    const lastPopupTime = safeLocalStorage.getItem('lastPremiumPopupTime');
    if (lastPopupTime) {
      const parsedTime = parseInt(lastPopupTime, 10);
      if (!isNaN(parsedTime)) {
        const elapsed = Date.now() - parsedTime;
        if (elapsed < 24 * 60 * 60 * 1000) {
          setHasShown24hrPopup(true);
        }
      }
    }
  }, []);

  // Sync mock tests and categories dynamically when view transitions back to home or mock-tests
  useEffect(() => {
    if (currentView === 'home' || currentView === 'mock-tests') {
      setMockTests(getMockTests());
      setCategories(getCategories());
      setPosts(getPosts());
    }
  }, [currentView]);

  const triggerPremiumPopup = () => {
    return; // Premium popup removed
  };

  // Condition 1 & 3 & 4: Job details timer & view count, Mock tests click
  useEffect(() => {
    let timer: any;
    if (currentView === 'job-details') {
      setJobPostViewCount(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
          triggerPremiumPopup();
        }
        return newCount;
      });

      timer = setTimeout(() => {
        triggerPremiumPopup();
      }, 10000); // 10 seconds logic
    } else if (currentView === 'mock-tests') {
       // Mock Test section clicked
       triggerPremiumPopup();
    }
    return () => clearTimeout(timer);
  }, [currentView]);

  // Condition 2: Scroll 60% of homepage
  useEffect(() => {
    if (currentView !== 'home' || isPremiumUser || hasShown24hrPopup) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / totalHeight) * 100;
      
      if (scrollPercentage > 60) {
        triggerPremiumPopup();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView, isPremiumUser, hasShown24hrPopup]);

  const hasAccessToTest = (test: MockTest): boolean => {
    return true;
  };

  // Sync state to localStorage on modification
  useEffect(() => {
    safeLocalStorage.setItem('mockTests', JSON.stringify(mockTests));
  }, [mockTests]);

  useEffect(() => {
    safeLocalStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeLocalStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Automated browser notifications periodic loop ("bar bar notification debe" - works on native push and custom visual fallback toast)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Send a welcome-back notification on app mount after a short delay, to demonstrate persistence
    const lastSessionNotificationTime = sessionStorage.getItem('session_welcome_notification_sent');
    if (!lastSessionNotificationTime) {
      const welcomeTimer = setTimeout(() => {
        triggerPushNotification(
          "স্বাগতম WBMockTest.in-এ! 🔔",
          "আমরা আপনার ব্রাউজার নোটিফিকেশন সিস্টেম সফলভাবে সক্রিয় করেছি। নতুন সরকারি চাকরির খবর এবং স্পেশাল মক টেস্টের আপডেট পেতে আমাদের সাথে জুড়ে থাকুন।"
        );
        sessionStorage.setItem('session_welcome_notification_sent', 'true');
      }, 4000);
      return () => clearTimeout(welcomeTimer);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set up background interval (e.g., every 30 seconds so the user can actually experience "bar bar notifications" without waiting too long)
    const intervalTime = 30 * 1000; 

    const interval = setInterval(() => {
      const nextNotify = getRandomNotification();
      triggerPushNotification(nextNotify.title, nextNotify.body);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Active testing state
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [resultsLog, setResultsLog] = useState<TestResult[]>([]);

  // Modals state
  const [activeModal, setActiveModal] = useState<'syllabus' | 'current-affairs' | 'admit-card' | 'previous-papers' | 'premium-buy' | 'notifications' | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => 
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Profile data
  const [profileName, setProfileName] = useState('পশ্চিমবঙ্গ পরীক্ষার্থী');
  const [profilePhone, setProfilePhone] = useState('৯৮৭৬৫৪৩২১০');

  // Firebase User states
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Gamification stats & results selection tab state
  const [gamificationState, setGamificationState] = useState<UserGamificationState>(() => loadLocalGamification());
  const userPoints = gamificationState.points;
  const streakCount = gamificationState.streakCount;

  useEffect(() => {
    async function doSync() {
      if (firebaseUser) {
        const synced = await syncGamificationState(firebaseUser.uid, gamificationState, profileName);
        setGamificationState(synced);
      }
    }
    doSync();
  }, [firebaseUser]);

  const [resultsTab, setResultsTab] = useState<'history' | 'gamification'>('history');

  // Firebase Auth Observer & sync user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setProfileName(user.displayName || user.email?.split('@')[0] || 'পশ্চিমবঙ্গ পরীক্ষার্থী');
      } else {
        setFirebaseUser((current: any) => {
          if (current && current.uid === 'demo_guest_user_id_123') {
            return current;
          }
          const savedName = safeLocalStorage.getItem('profileName') || 'পশ্চিমবঙ্গ পরীক্ষার্থী';
          setProfileName(savedName);
          return null;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDemoLogin = () => {
    setIsLoggingIn(true);
    setAuthError(null);
    setTimeout(() => {
      const mockUser = {
        uid: 'demo_guest_user_id_123',
        email: 'candidate@wbmocktest.in',
        displayName: 'অতিথি পরীক্ষার্থী (Demo)',
        photoURL: null,
        emailVerified: true
      };
      setFirebaseUser(mockUser);
      setProfileName(mockUser.displayName);
      setIsLoggingIn(false);
      
      const mockSubscription = {
        userId: mockUser.uid,
        status: 'active',
        planId: 'premium',
        planName: 'PREMIUM Elite Unlimited Pass',
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year
        paidAmount: 99
      };
      setActiveSubscription(mockSubscription);
      setIsPremiumUser(true);
      safeLocalStorage.setItem('isPremium', 'true');
    }, 450);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google login failed:", error);
      if (error && error.code) {
        if (error.code === 'auth/unauthorized-domain') {
          setAuthError('autherror-unauthorized-domain');
        } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          // User closed popup or cancelled, do not show error
          setAuthError(null);
        } else {
          setAuthError(`লগইন ব্যর্থ হয়েছে: ${error.message} (${error.code})`);
        }
      } else {
        setAuthError('গুগল লগইন করার সময় কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Sign out failed:", error);
    }
  };

// Custom OperationType and Error Info conform to Firebase Skill requirements
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

  // Load state and authenticate callback / load subscriptions on state changes
  const triggerSubscriptionCheck = (user: FirebaseUser | null) => {
    setActiveSubscription({
      id: 'unlimited-free',
      userId: user?.uid || 'anonymous',
      planId: 'premium',
      planName: 'Premium Plan',
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
    setIsPremiumUser(true);
    safeLocalStorage.setItem('isPremium', 'true');
  };

  useEffect(() => {
    triggerSubscriptionCheck(firebaseUser);
  }, [firebaseUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    if (orderId) {
      // Clean query params so refresh doesn't trigger verification
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.warn("History replaceState is blocked or unavailable:", e);
      }
      
      setVerifyingPayment(true);
      fetch(`/api/verify-payment?order_id=${orderId}`)
        .then(res => {
          if (!res.ok) throw new Error("Verification network error");
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          } else {
            throw new Error(`Expected JSON but received ${contentType}`);
          }
        })
        .then(data => {
          if (data && data.status === 'success') {
            setPaymentSuccessData({ orderId, planName: data.planName });
            if (firebaseUser) {
              triggerSubscriptionCheck(firebaseUser);
            }
          } else {
            alert(`পেমেন্ট ভেরিফিকেশন করার কাজ অপেক্ষারত অথবা ব্যর্থ রয়েছে। আপনি আপনার ড্যাশবোর্ডে স্ট্যাটাস দেখতে পারেন।`);
          }
        })
        .catch(err => {
          console.warn("Payment verification failed:", err);
        })
        .finally(() => {
          setVerifyingPayment(false);
        });
    }
  }, [firebaseUser]);

  // Fetch Purchased Series for currently authenticated user
  const fetchPurchasedSeries = async (uId: string) => {
    try {
      const res = await fetch(`/api/payments/my-purchases?userId=${uId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPurchasedSeries(data.purchasedSeriesIds || []);
        }
      }
    } catch (e) {
      console.error("Failed to load purchased series:", e);
    }
  };

  useEffect(() => {
    if (firebaseUser && firebaseUser.uid && firebaseUser.uid !== 'anonymous') {
      fetchPurchasedSeries(firebaseUser.uid);
    } else {
      setPurchasedSeries([]);
    }
  }, [firebaseUser]);

  // Listen for Cashfree Series deep link verification redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifySeriesOrderId = params.get('verify_series_order_id');
    if (verifySeriesOrderId) {
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.warn("History replaceState is blocked or unavailable:", e);
      }

      setVerifyingSeriesPayment(true);
      fetch(`/api/verify-series-payment?order_id=${verifySeriesOrderId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success') {
            setSeriesPaymentSuccess(data.seriesId || 'true');
            setSeriesPaymentSuccessName(data.seriesName || 'মক টেস্ট সিরিজ');
            if (firebaseUser && firebaseUser.uid) {
              fetchPurchasedSeries(firebaseUser.uid);
            }
          } else {
            alert('আপনার মক টেস্ট সিরিজ পেমেন্ট ভেরিফিকেশন পেন্ডিং রয়েছে বা সম্পন্ন হয়নি।');
          }
        })
        .catch(err => {
          console.error("Verify series payment failed:", err);
        })
        .finally(() => {
          setVerifyingSeriesPayment(false);
        });
    }
  }, [firebaseUser]);

  // Load theme and logs from localStorage on mount
  useEffect(() => {
    const savedTheme = safeLocalStorage.getItem('theme');
    if (savedTheme === 'dark') setTheme('dark');

    const savedLogs = safeLocalStorage.getItem('resultsLog');
    if (savedLogs) {
      try {
        setResultsLog(JSON.parse(savedLogs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleToggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    safeLocalStorage.setItem('theme', newTheme);
  };

  const handleBuyPlan = async (planId: 'basic' | 'standard' | 'premium') => {
    if (!firebaseUser) {
      alert("পেমেন্ট করতে দয়া করে গুগল দিয়ে প্রবেশ করুন।");
      return;
    }

    try {
      const response = await fetch('/api/create-payment-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: firebaseUser.uid,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '9999999999',
          name: firebaseUser.displayName || 'পশ্চিমবঙ্গ পরীক্ষার্থী'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = { error: errorText, details: "" };
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // not json
        }
        console.error("Payment API Error:", errorText);
        alert(`পেমেন্ট শুরু করতে ব্যর্থ হয়েছে: ${errorData.details || errorData.error}`);
        return;
      }

      const data = await response.json();
      if (data.checkoutUrl) {
        // Safe check for iframe context to prevent Script Error / X-Frame-Options blocks
        const isIframe = typeof window !== 'undefined' && window.parent !== window;
        if (isIframe) {
          const newTab = window.open(data.checkoutUrl, '_blank');
          if (!newTab) {
            // If popups are blocked, fallback to direct navigation
            window.location.href = data.checkoutUrl;
          }
        } else {
          window.location.href = data.checkoutUrl;
        }
      } else {
        alert('ত্রুটি: ক্যাশফ্রি পেমেন্ট লিংক পাওয়া যায়নি।');
      }
    } catch (err: any) {
      console.error(err);
      alert(`সার্ভার কানেকশন এরর: ${err.message}`);
    }
  };

  const handleUpgradePremium = (planName: string) => {
    setIsPremiumUser(true);
    safeLocalStorage.setItem('isPremium', 'true');
    setActiveModal(null);
    alert(`শুভেচ্ছা! আপনার "${planName}" সফলভাবে সচল করা হয়েছে। সমস্ত প্রিমিয়াম ফিচার এখন আনলকড!`);
  };

  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setView('test-running');
  };

  const handleFinishTest = async (newResult: TestResult) => {
    const updated = [newResult, ...resultsLog];
    setResultsLog(updated);
    safeLocalStorage.setItem('resultsLog', JSON.stringify(updated));

    const pointsEarned = (newResult.correctAnswers || 0) * 10;
    
    // Evaluate if streak increases today
    const { nextStreak } = evaluateDailyStreak(gamificationState.lastActivityDate, gamificationState.streakCount);
    
    const newState: UserGamificationState = {
      ...gamificationState,
      points: gamificationState.points + pointsEarned,
      streakCount: nextStreak,
      lastActivityDate: getTodayDateString(),
      testsCompletedCount: gamificationState.testsCompletedCount + 1
    };

    setGamificationState(newState);
    await saveGamificationState(firebaseUser?.uid || null, newState, profileName);

    setCurrentResult(newResult);
    setView('test-result');
  };

  const handleEarnDailyQuizPoints = async (pointsEarned: number) => {
    const { nextStreak } = evaluateDailyStreak(gamificationState.lastActivityDate, gamificationState.streakCount);
    const newState: UserGamificationState = {
      ...gamificationState,
      points: gamificationState.points + pointsEarned,
      streakCount: nextStreak,
      lastActivityDate: getTodayDateString()
    };
    setGamificationState(newState);
    await saveGamificationState(firebaseUser?.uid || null, newState, profileName);
  };

  const filteredTests = mockTests.filter(test => {
    // 1. Category Filter
    if (selectedCategory && test.examType !== selectedCategory) {
      // Also check if the test belongs to a post in this category
      const associatedPost = posts?.find(p => p && p.id === test.postId);
      if (!associatedPost || associatedPost.categoryId !== selectedCategory) {
        return false;
      }
    }
    
    // 2. Sub-Category (Post Name) Filter
    if (selectedSubCategory) {
      // Direct exact match of postId
      if (test.postId && test.postId !== selectedSubCategory) {
        return false;
      }
      
      // Fallback for non-mapped/legacy tests
      if (!test.postId) {
        const subLower = selectedSubCategory.toLowerCase();
        const matchText = (test.title + ' ' + test.bengaliTitle + ' ' + (test.examTypeBengali || '')).toLowerCase();
        
        let triggerWords = [subLower];
        if (subLower === 'constable') {
          triggerWords.push('constable', 'কনস্টেবল');
        } else if (subLower === 'sub-inspector' || subLower === 'si') {
          triggerWords.push('si', 'sub-inspector', 'ইন্সপেক্টর');
        } else if (subLower === 'kolkata police') {
          triggerWords.push('kolkata', 'কলকাতা');
        } else if (subLower === 'excise') {
          triggerWords.push('excise', 'আবগারি');
        } else if (subLower === 'school') {
          triggerWords.push('school', 'স্কুল');
        } else if (subLower === 'railway' || subLower === 'group d') {
          triggerWords.push('railway', 'rail', 'রেল', 'group d', 'গ্রুপ ডি');
        } else if (subLower === 'clerkship') {
          triggerWords.push('clerk', 'clerkship', 'ক্লার্ক');
        } else if (subLower === 'ldc') {
          triggerWords.push('ldc', 'অ্যাসিস্ট্যান্ট');
        } else if (subLower === 'ntpc') {
          triggerWords.push('ntpc', 'এনটিপিসি');
        } else if (subLower === 'alp') {
          triggerWords.push('alp', 'technician', 'এএলপি');
        } else if (subLower === 'sbi') {
          triggerWords.push('sbi', 'এসবিআই');
        } else if (subLower === 'ibps') {
          triggerWords.push('ibps', 'আইবিপিএস');
        } else if (subLower === 'cooperative') {
          triggerWords.push('cooperative', 'co-op', 'সমবায়');
        } else if (subLower === 'tet') {
          triggerWords.push('tet', 'টেট');
        } else if (subLower === 'upper') {
          triggerWords.push('upper', 'আপার');
        } else if (subLower === 'slst') {
          triggerWords.push('slst', 'এসএলএসটি');
        } else if (subLower === 'nurse') {
          triggerWords.push('nurse', 'নার্স');
        } else if (subLower === 'anm') {
          triggerWords.push('anm', 'gnm', 'এএনএম', 'জিএনএম');
        } else if (subLower === 'lab') {
          triggerWords.push('lab', 'ল্যাব');
        } else if (subLower === 'supply') {
          triggerWords.push('supply', 'সাপ্লাই');
        } else if (subLower === 'misc') {
          triggerWords.push('misc', 'মিসলেনিয়াস');
        } else if (subLower === 'municipal') {
          triggerWords.push('municipal', 'মিউনিসিপ্যাল');
        } else if (subLower === 'prelims') {
          triggerWords.push('prelim', 'প্রিলি');
        } else if (subLower === 'mains') {
          triggerWords.push('main', 'মেনস');
        } else if (subLower === 'registrar') {
          triggerWords.push('registrar', 'রেজিস্ট্রার');
        } else if (subLower === 'electricity') {
          triggerWords.push('electricity', 'বিদ্যুৎ');
        } else if (subLower === 'court') {
          triggerWords.push('court', 'কোর্ট');
        } else if (subLower === 'army') {
          triggerWords.push('army', 'আর্মি');
        } else if (subLower === 'airforce') {
          triggerWords.push('air', 'বিমান');
        } else if (subLower === 'navy') {
          triggerWords.push('navy', 'নেভি');
        } else if (subLower === 'mts') {
          triggerWords.push('mts', 'এমটিএস');
        } else if (subLower === 'chsl') {
          triggerWords.push('chsl', 'সিএইচএসএল');
        } else if (subLower === 'cgl') {
          triggerWords.push('cgl', 'সিজিএল');
        }

        const matchesAny = triggerWords.some(word => matchText.includes(word));
        if (!matchesAny) {
          return false;
        }
      }
    }

    // 3. Search Query Filter
    if (categorySearchQuery) {
      const q = categorySearchQuery.toLowerCase();
      const matchText = (test.title + ' ' + test.bengaliTitle + ' ' + (test.examTypeBengali || '') + ' ' + test.examType).toLowerCase();
      if (!matchText.includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Render modal content
  const renderModal = () => {
    if (!activeModal) return null;

    const modalTitle = {
      'syllabus': 'পরীক্ষার সিলেবাস ও নম্বর বিভাজন',
      'current-affairs': 'আজকের গুরুত্বপূর্ণ সাম্প্রতিক ঘটনা (বাংলায়)',
      'admit-card': 'পরীক্ষার অ্যাডমিট কার্ড ও বিজ্ঞপ্তি',
      'previous-papers': 'বিগত বছরের প্রশ্নপত্র এবং সমাধান',
      'premium-buy': 'প্রিমিয়াম পাস অ্যাক্টিভেশন',
      'notifications': 'অফিসিয়াল নোটিফিকেশন বোর্ড'
    }[activeModal];

    const isPremiumModal = activeModal === 'premium-buy';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className={`bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl w-full max-h-[90vh] md:max-h-[95vh] overflow-y-auto p-5 shadow-2xl relative font-sans transition-all ${isPremiumModal ? 'max-w-5xl md:p-6' : 'max-w-sm'}`}>
          
          <button 
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4 pr-10 border-b border-slate-50 dark:border-slate-800 pb-3">
            <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
              <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
              {modalTitle}
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* SYLLABUS CONTENT */}
            {activeModal === 'syllabus' && (
              <div className="space-y-4">
                {syllabusData.map((data, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-2">{data.exam}</h4>
                    <div className="space-y-2.5">
                      {data.sections.map((sec, idx) => (
                        <div key={idx} className="border-t border-slate-150/50 dark:border-slate-800/50 pt-2 first:border-0 first:pt-0">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-800 dark:text-slate-200">{sec.subject}</span>
                            <span className="text-rose-500 font-sans">{sec.marks}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{sec.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CURRENT AFFAIRS */}
            {activeModal === 'current-affairs' && (
              <div className="space-y-3 font-sans">
                {[
                  { title: 'পশ্চিমবঙ্গ পঞ্চায়েত নির্বাচন ২০২৬', desc: 'নতুন গ্রামীণ শাসন বিধির মাধ্যমে ত্রিস্তর পঞ্চায়েত স্তরে প্রশাসনিক সীমানা পরিবর্তন সম্পন্ন হয়েছে।' },
                  { title: 'বিশ্ব জল দিবস ২০২৬ পদক', desc: 'পশ্চিমবঙ্গের জনস্বাস্থ্য কারিগরি পোর্টালে পরিবেশগত শুদ্ধতায় দেশের শীর্ষ স্থান লাভ করেছে।' },
                  { title: 'নতুন জাতীয় শিক্ষানীতি নির্দেশিকা', desc: 'রাজ্যের প্রাথমিক স্তরের পাঠ্যসূচিতে মাতৃভাষার পরিধি বাড়াতে নতুন টাস্কফোর্স গঠিত হয়েছে।' },
                  { title: 'ভারতের নতুন হাই-স্পিড রেল করিডোর', desc: 'হাওড়া থেকে জলপাইগুড়ি বন্দে ভারত রুটের উন্নয়নমূলক গবেষণা প্রস্তাব অনুমোদিত হয়েছে।' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase font-sans">NEWS {idx+1}</span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white mt-1.5">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ADMIT CARD RELEASE */}
            {activeModal === 'admit-card' && (
              <div className="space-y-3 font-sans">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 animate-ping" />
                  <div>
                    <span className="font-black text-emerald-600 block text-xs">WB Police SI Admit Card 2026</span>
                    <p className="text-[11px] text-slate-650 mt-1">সাব-ইন্সপেক্টর শারীরিক যোগ্যতা পরীক্ষার প্রবেশপত্র প্রকাশিত হয়েছে। সরকারি পোর্টালে ডাউনলোডের লিংক সচল।</p>
                    <button className="bg-emerald-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-md mt-2">ডাউনলোড এডমিট</button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100/80 dark:border-slate-850">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Panchayat Recruitment Admit release</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">পঞ্চায়েত সেক্রেটারী ও অন্যান্য পদের লিখিত মক পরীক্ষার রুটিন আগামী মাসে প্রকাশ করা হবে। নজর রাখুন আমাদের ওয়েবসাইটে।</p>
                </div>
              </div>
            )}

            {/* PREVIOUS YEAR PAPERS */}
            {activeModal === 'previous-papers' && (
              <div className="space-y-2.5 font-sans">
                {[
                  { name: 'WB Panchayat Secretary General (2022)', size: '2.4 MB' },
                  { name: 'WB Group D Main Exam Question (2021)', size: '1.8 MB' },
                  { name: 'WBPSC Clerkship Prelims Set-A (2019)', size: '3.1 MB' }
                ].map((paper, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150/70 dark:border-slate-800">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 block">{paper.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">File: PDF ({paper.size})</span>
                    </div>
                    <button 
                      onClick={() => alert(`${paper.name} - সমাধানপত্র ডাউনলোড সমাপ্ত হয়েছে!`)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      ডাউনলোড
                    </button>
                  </div>
                ))}
              </div>
            )}



            {/* SYSTEM NOTIFICATIONS */}
            {activeModal === 'notifications' && (
              <div className="space-y-4 font-sans">
                
                {/* Browser Notification Controls */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850/80 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-2.5">
                    <span className="text-sm">🔔</span>
                    <h4 className="text-xs font-black text-slate-850 dark:text-white">ব্রাউজার নোটিফিকেশন সেটিংস (Push Settings)</h4>
                  </div>

                  {typeof window === 'undefined' || !('Notification' in window) ? (
                    <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl text-[11px] font-bold">
                      ⚠️ দুঃখিত, আপনার ব্রাউজারটি Native নোটিফিকেশন সাপোর্ট করে না। অনুগ্রহ করে ক্রোম (Chrome) বা এজ (Edge) ব্রাউজার ব্যবহার করুন।
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifPermission === 'granted' ? (
                        <>
                          <div className="flex items-start gap-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                            <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✔</span>
                            <div className="space-y-0.5">
                              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block">নোটিফিকেশন সফলভাবে সক্রিয় রয়েছে!</span>
                              <span className="text-[10px] text-slate-450 dark:text-slate-500 block leading-tight font-semibold">
                                আমাদের স্বয়ংক্রিয় পুশ অ্যালার্ট সিস্টেম চালু আছে। আপনি সাইটটি ভিজিট করার পর থেকে প্রতি ৬০ সেকেন্ডে এবং যেকোনো নতুন আপডেট এলে স্বয়ংক্রিয় নোটিফিকেশন পাবেন।
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              const item = getRandomNotification();
                              triggerPushNotification(item.title, item.body);
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[11px] font-black transition-all shadow-md text-center cursor-pointer cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>🔔 পরীক্ষামূলক নোটিফিকেশন পাঠান (Send Test)</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                            <span className="text-rose-500 text-xs shrink-0 mt-0.5">✖</span>
                            <div className="space-y-0.5">
                              <span className="text-[11px] font-black text-rose-500 dark:text-rose-400 block">নোটিফিকেশন অনুমতি এখনো দেওয়া হয়নি</span>
                              <span className="text-[10px] text-slate-450 dark:text-slate-500 block leading-tight font-semibold">
                                নতুন লাইভ মক টেস্ট, গুরুত্বপূর্ণ জিকের প্রশ্নপত্র এবং অফিশিয়াল নিয়োগের অ্যাডমিট কার্ডের আপডেট মিস না করতে ব্রাউজার নোটিফিকেশন অনুমতি দিন।
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={async () => {
                              const permission = await requestNotificationPermission();
                              setNotifPermission(permission);
                              triggerPushNotification(
                                "WBMockTest.in 🔔", 
                                "অভিনন্দন! ব্রাউজার নোটিফিকেশন সফলভাবে সক্রিয় করা হয়েছে।"
                              );
                            }}
                            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl text-[11px] font-black transition-all shadow-md text-center cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>🔔 নোটিফিকেশন চালু করুন (Allow Notification)</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* HISTORIC OFFICIAL ALERTS */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">অফিশিয়াল নোটিফিকেশন বোর্ড</span>
                  {[
                    { title: 'নতুন ৫টি মক টেস্ট সিরিজ যুক্ত করা হয়েছে', time: '২ ঘণ্টা আগে' },
                    { title: 'WBCS পরীক্ষার স্পেশাল পেপার আপডেট সম্পূর্ণ', time: '১ দিন আগে' },
                    { title: 'WBMockTest.in মেম্বারশিপে ২০% বর্ষাকালীন ডিসকাউন্ট', time: '৩ দিন আগে' }
                  ].map((n, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 font-bold block">{n.time}</span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">{n.title}</h4>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
        theme === 'dark' ? 'dark bg-[#020617] text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Ambient Background Glows */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        </>
      )}

      {currentView === 'admin' ? (
        <div className="w-full min-h-screen relative z-10 bg-slate-100">
          <MobileAdminDashboard />
        </div>
      ) : currentView === 'admin-login' ? (
        <div className="w-full min-h-screen relative z-10">
          <AdminLogin 
            onLoginSuccess={() => {
              try {
                window.history.pushState({}, document.title, '/admin/dashboard');
              } catch (e) {
                console.warn("History pushState is blocked or unavailable:", e);
              }
              setView('admin');
            }}
          />
        </div>
      ) : (
        /* Responsive Layout Shell */
        <div className={`w-full min-h-screen transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-100'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen relative">
            
            {/* Desktop Left Sidebar Menu - Only visible on md and up */}
            <aside className="hidden md:flex flex-col w-72 border-r border-slate-150 dark:border-slate-800/80 bg-white dark:bg-[#070e27] p-6 space-y-6 shrink-0 h-screen sticky top-0 z-30 font-sans shadow-sm transition-colors duration-300">
              {/* Logo Brand Header */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <Shield className="w-9 h-9 text-[#FBBF24] fill-[#2563EB] stroke-[1.5]" />
                  <Crown className="w-5 h-5 text-[#FBBF24] absolute -top-3 drop-shadow-sm" />
                  <span className="absolute text-white font-black text-[11px] leading-none mt-1">WB</span>
                </div>
                <div className="flex flex-col pt-0.5">
                  <h1 className="text-[18px] font-black tracking-tight text-[#0A1B3D] dark:text-white leading-none">
                    <span className="text-[#2563EB]">WB</span>MockTest
                  </h1>
                  <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">
                    পশ্চিমবঙ্গ চাকরির সেরা প্রস্তুতি
                  </span>
                </div>
              </div>

              {/* Profile card/auth state inside Sidebar */}
              {firebaseUser ? (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-[20px] border border-slate-150 dark:border-slate-800 flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      {firebaseUser.photoURL ? (
                        <img src={firebaseUser.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        (firebaseUser.displayName || 'U').substring(0, 1)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[13px] font-black text-slate-800 dark:text-white block truncate leading-tight">
                        {profileName || firebaseUser.displayName || 'পরীক্ষার্থী'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate font-bold mt-0.5">
                        {firebaseUser.email}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shrink-0"
                    title="লগ আউট"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-[20px] border border-slate-150 dark:border-slate-800 text-center space-y-2">
                  <span className="text-[11px] text-slate-400 font-bold block">আপনার অ্যাকাউন্ট নেই?</span>
                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <User className="w-3.5 h-3.5" /> গুগল দিয়ে লগইন করুন
                  </button>
                </div>
              )}

              {/* Navigation Menu Links */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                {[
                  { id: 'home', label: 'হোম ড্যাশবোর্ড', icon: Home },
                  { id: 'my-tests', label: 'আমার টেস্ট সিরিজ', icon: BookOpen },
                  { id: 'mock-tests', label: 'সকল মক টেস্ট', icon: BookOpenCheck },
                  { id: 'results', label: 'GK & Current Affairs', icon: Zap },
                  { id: 'performance', label: 'পারফরম্যান্স ও স্কোর', icon: BarChart2 },
                  { id: 'question-bank', label: 'প্রশ্ন ব্যাংক ডিরেক্টরি', icon: HelpCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id || 
                    (item.id === 'my-tests' && (currentView === 'test-running' || currentView === 'test-result'));
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id as ViewType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/10 text-blue-600 dark:text-blue-400 border-l-[3.5px] border-blue-500 rounded-l-none' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Theme toggle and support information footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span>থিম পরিবর্তন করুন:</span>
                  <button
                    onClick={handleToggleTheme}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                  >
                    {theme === 'light' ? (
                      <Moon className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-tight">
                  <span>WB Mock Test © 2026</span>
                  <span className="block mt-0.5">সহায়তা: support@wbmocktest.com</span>
                </div>
              </div>
            </aside>

            {/* Main Application Container */}
            <div className="flex-1 flex flex-col min-h-screen bg-[#040a1f]/95 dark:bg-[#040a1f]/95 md:bg-transparent md:dark:bg-transparent">
              
              {/* App Header (Sticky, only shown on mobile/tablet) */}
              <div className="md:hidden">
                <Header 
                  theme={theme}
                  setTheme={handleToggleTheme}
                  currentView={currentView}
                  setView={setView}
                  isPremiumUser={isPremiumUser}
                  onOpenNotifications={() => {
                    setHasUnreadNotification(false);
                    setActiveModal('notifications');
                  }}
                  onOpenPremiumModal={() => setView('premium')}
                  hasUnreadNotification={hasUnreadNotification}
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  points={userPoints}
                  streakCount={streakCount}
                />
              </div>

              {/* Desktop Dashboard Header (Sticky topbar only on desktop md and up) */}
              <header className="hidden md:flex items-center justify-between h-20 px-8 bg-white dark:bg-[#070e27] border-b border-slate-150 dark:border-slate-800/80 sticky top-0 z-20 font-sans transition-colors duration-300">
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-white leading-tight">
                    {currentView === 'home' && 'ড্যাশবোর্ড ওভারভিউ (Dashboard Overview)'}
                    {currentView === 'my-tests' && 'আমার টেস্ট ডিরেক্টরি (My Test Directory)'}
                    {currentView === 'mock-tests' && 'চলতি লাইভ মক টেস্ট সমূহ (Live Mock Tests)'}
                    {currentView === 'question-bank' && 'প্রশ্ন ব্যাংক ডিরেক্টরি (Question Bank)'}
                    {currentView === 'results' && 'GK & Current Affairs'}
                    {currentView === 'performance' && 'আমার পারফরম্যান্স রিপোর্ট ও প্রগ্রেস'}
                    {currentView === 'profile' && 'প্রোফাইল সেটিংস ও বিবরণী (Profile)'}
                    {currentView === 'study-plan' && 'স্টাডি প্ল্যানার ও স্টাডি গাইড'}
                    {currentView === 'premium' && 'মেম্বারশিপ প্ল্যান ও লাইফটাইম পাস'}
                    {currentView === 'test-running' && 'চলতি পরীক্ষা (Active Exam)'}
                    {currentView === 'test-result' && 'পরীক্ষার বিস্তারিত ফলাফল (Test Report)'}
                    {currentView === 'job-list' && 'কেন্দ্রীয় সরকারি চাকরির বিজ্ঞপ্তি সমূহ'}
                    {currentView === 'state-job-list' && 'রাজ্য সরকারি চাকরির বিজ্ঞপ্তি সমূহ'}
                    {currentView === 'job-details' && 'চাকরির পদের বিস্তারিত তথ্য ও পরীক্ষার সিলেবাস'}
                  </h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 font-bold mt-1">
                    আজকের তারিখ: {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3.5">
                  {/* Desktop Notification Bell */}
                  <button
                    onClick={() => {
                      setHasUnreadNotification(false);
                      setActiveModal('notifications');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer relative"
                    title="বিজ্ঞপ্তি সমূহ"
                  >
                    <Bell className="w-5 h-5" />
                    {hasUnreadNotification && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-[#070e27] rounded-full" />
                    )}
                  </button>
                </div>
              </header>

              {/* Main Content Pane */}
              <div className="flex-1 max-w-full md:max-w-4xl lg:max-w-5xl mx-auto w-full">
                
                {verifyingPayment && (
                  <div className="mx-4 my-2 p-4 bg-blue-550/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 animate-pulse text-xs text-blue-500 font-extrabold font-sans">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>আপনার ক্যাশফ্রি পেমেন্ট যাচাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন... (Verifying payment...)</span>
                  </div>
                )}

                {paymentSuccessData && (
                  <div className="mx-4 my-3 p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[24px] text-white space-y-3 shadow-lg relative overflow-hidden animate-fadeIn font-sans">
                    <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2.5">
                      <div className="bg-white text-emerald-600 p-1.5 rounded-full shrink-0">
                        <Check className="w-5 h-5 stroke-[3.5]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white leading-none">পেমেন্ট সফল হয়েছে! (Payment Success)</h4>
                        <p className="text-[10px] text-emerald-100 mt-1 leading-none font-sans">আপনার প্রিমিয়াম পাস সফলভাবে সক্রিয় করা হয়েছে</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/20 rounded-2xl p-3 border border-white/10 space-y-2 text-[11px] font-sans">
                      <div className="flex justify-between">
                        <span className="text-emerald-100">অর্ডার আইডি (Order ID):</span>
                        <span className="font-extrabold text-white">{paymentSuccessData.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">সক্রিয় প্ল্যান (Plan Name):</span>
                        <span className="font-extrabold text-yellow-300">{paymentSuccessData.planName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">স্ট্যাটাস (Status):</span>
                        <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded-lg text-white">সক্রিয় (ACTIVE)</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setPaymentSuccessData(null)}
                      className="w-full py-2.5 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl text-xs font-black transition-all cursor-pointer text-center"
                    >
                      ধন্যবাদ, মক টেস্ট ডিরেক্টরি খুলুন ➔
                    </button>
                  </div>
                )}

                {/* Sidebar Drawer slide-over menu */}
                <SidebarDrawer 
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  currentView={currentView}
                  setView={setView}
                  theme={theme}
                  setTheme={handleToggleTheme}
                  isPremiumUser={isPremiumUser}
                  onOpenSyllabus={() => setActiveModal('syllabus')}
                  onOpenJobNews={() => {
                    setView('home');
                    setTimeout(() => {
                      const el = document.getElementById('latest-jobs-news');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 150);
                  }}
                  onOpenPremium={() => setView('premium')}
                  firebaseUser={firebaseUser}
                  isLoggingIn={isLoggingIn}
                  authError={authError}
                  onGoogleLogin={handleGoogleLogin}
                  onDemoLogin={handleDemoLogin}
                  onSignOut={handleSignOut}
                />

                {/* Dynamic Meta modal component */}
                {renderModal()}

                {/* Floating Browser Notification Prompt System */}
                <NotificationPrompt />

                {/* Custom Browser Notification Toast Fallback (so it's guaranteed to be seen everywhere, including iframes) */}
                <NotificationToast toast={activeToast} onClose={() => setActiveToast(null)} />

                {/* VIEW DETECTOR COORDINATOR */}
                <main className="p-4 space-y-5 animate-fadeIn">

                  {/* VIEW 1: HOMEPAGE VIEW */}
                  {currentView === 'home' && (
                    <div className="space-y-5">
                      {/* Slider */}
                      <HeroSlider 
                        onCtaClick={(dest) => setView(dest)} 
                        theme={theme}
                      />

                      {/* Quick interactive grid */}
                      <QuickAccess 
                        setView={setView} 
                        onOpenPremium={() => setView('premium')}
                        onOpenAdmitCard={() => setActiveModal('admit-card')}
                        onOpenCurrentAffairs={() => setActiveModal('current-affairs')}
                        onOpenPreviousQuestions={() => setActiveModal('previous-papers')}
                        onOpenSyllabus={() => setActiveModal('syllabus')}
                      />

                      {/* Job recruitments announcements board */}
                      <div id="latest-jobs-news" className="scroll-mt-4">
                        {showAllJobs ? (
                          <div className="space-y-4 animate-fadeIn">
                            <button 
                              onClick={() => setShowAllJobs(false)}
                              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4 ml-1" /> ফিরে যান
                            </button>
                            <JobNotifications jobs={jobs} />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <GovtJobCategories 
                              onViewCentralJobs={() => setView('job-list')} 
                              onViewStateJobs={() => setView('state-job-list')} 
                              onJobClick={() => setView('job-details')}
                              onViewPostList={(title) => {
                                setPostListTitle(title);
                                setView('post-list');
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Success testimonies slider */}
                      <Testimonials stories={successStories} />

                      {/* Live server metrics */}
                      <LiveStats />

                      {/* Footer with Info Links */}
                      <div className="text-center py-6 border-t border-slate-150/40 dark:border-slate-800 space-y-3 font-sans">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block">WBMockTest.in © 2026</span>
                        <p className="text-[9.5px] text-slate-400 dark:text-slate-500 max-w-[340px] mx-auto leading-relaxed font-semibold">
                          WBMockTest.in পশ্চিমবঙ্গের সরকারি চাকরির প্রস্তুতির সেরা সম্পূর্ণ ফ্রি অনলাইন প্ল্যাটফর্ম।
                        </p>
                        
                        {/* Info Links Grid */}
                        <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 pt-1">
                          <button onClick={() => setView('about')} className="text-[9.5px] font-black text-slate-500 hover:text-blue-650 dark:hover:text-blue-400 transition-colors cursor-pointer">আমাদের সম্পর্কে</button>
                          <span className="text-slate-300 dark:text-slate-800 text-[10px]">•</span>
                          <button onClick={() => setView('contact')} className="text-[9.5px] font-black text-slate-500 hover:text-blue-650 dark:hover:text-blue-400 transition-colors cursor-pointer">যোগাযোগ</button>
                          <span className="text-slate-300 dark:text-slate-800 text-[10px]">•</span>
                          <button onClick={() => setView('privacy')} className="text-[9.5px] font-black text-slate-500 hover:text-blue-650 dark:hover:text-blue-400 transition-colors cursor-pointer">গোপনীয়তা নীতি</button>
                          <span className="text-slate-300 dark:text-slate-800 text-[10px]">•</span>
                          <button onClick={() => setView('disclaimer')} className="text-[9.5px] font-black text-slate-500 hover:text-blue-650 dark:hover:text-blue-400 transition-colors cursor-pointer">দাবিত্যাগ</button>
                          <span className="text-slate-300 dark:text-slate-800 text-[10px]">•</span>
                          <button onClick={() => setView('terms')} className="text-[9.5px] font-black text-slate-500 hover:text-blue-650 dark:hover:text-blue-400 transition-colors cursor-pointer">শর্তাবলী</button>
                        </div>
                      </div>

                    </div>
                  )}

          {/* VIEW 2: MOCK TESTS EXPLORE SCREEN */}
          {currentView === 'mock-tests' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                <h2 className="text-base font-black text-slate-900 dark:text-white">উপলব্ধ সমস্ত মক টেস্ট সিরিজ</h2>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">পরীক্ষার প্রিপারেশনে কমনযোগ্য সাজেস্টিভ সেটসমূহ</p>
              </div>

              {/* Filter */}
              <CategoryScroll 
                categories={categories}
                posts={posts}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedSubCategory={selectedSubCategory}
                onSelectSubCategory={setSelectedSubCategory}
                searchQuery={categorySearchQuery}
                onSearchChange={setCategorySearchQuery}
                totalTestsCount={filteredTests.length}
              />

              <div id="mock-tests-list-anchor" className="scroll-mt-20"></div>

              {/* Unified All-Free mock tests list */}
              <div className="space-y-3.5">
                {filteredTests.map((test) => (
                  <TestCard 
                    key={test.id}
                    test={test}
                    onStartTest={handleStartTest}
                    isPremiumUser={isPremiumUser}
                    purchasedSeries={purchasedSeries}
                    onReqPremiumUpgrade={() => {
                      const matchingPost = posts?.find(p => p && p.id === test.postId);
                      if (matchingPost) {
                        setCouponCode('');
                        setCouponDiscount(0);
                        setCouponError('');
                        setCouponSuccess('');
                        setSelectedPurchaseSeries(matchingPost);
                      } else {
                        setActiveModal('premium-buy');
                      }
                    }}
                  />
                ))}
                {filteredTests.length === 0 && (
                  <div className="text-center p-6 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-[11px] text-slate-400 font-bold dark:text-slate-500">এই বিভাগে কোনো মক টেস্ট নেই।</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 5: UNIFIED USER DASHBOARD */}
          {(currentView === 'my-tests' || currentView === 'results' || currentView === 'performance' || currentView === 'profile') && (
            <div className="animate-fadeIn">
              <UserDashboard 
                firebaseUser={firebaseUser}
                profileName={profileName}
                profilePhone={profilePhone}
                resultsLog={resultsLog}
                onStartTest={handleStartTest}
                onSignOut={handleSignOut}
                isPremiumUser={isPremiumUser}
                setIsPremiumUser={setIsPremiumUser}
                setView={setView}
                onSelectResult={(res) => {
                  setCurrentResult(res);
                  setView('test-result');
                }}
                activeTab={
                  currentView === 'my-tests' ? 'my-tests' :
                  currentView === 'results' ? 'results' :
                  currentView === 'performance' ? 'performance' :
                  currentView === 'profile' ? 'profile' : 'home'
                }
              />
            </div>
          )}

          {/* VIEW 6: RUNNING MOCK TEST MATCH CONTROLS */}
          {currentView === 'test-running' && activeTest && (
            <div className="animate-fadeIn">
              <MockTestInterface 
                test={activeTest}
                onFinishTest={handleFinishTest}
                onCancel={() => {
                  setActiveTest(null);
                  setView('home');
                }}
              />
            </div>
          )}

          {/* VIEW 7: TEST RESULTS LANDING PAGE */}
          {currentView === 'test-result' && currentResult && (
            <div className="animate-fadeIn">
              <ResultDetails 
                result={currentResult}
                onRetake={() => {
                  const testToRetake = mockTests?.find(t => t && t.id === currentResult?.testId);
                  if (testToRetake) {
                    setActiveTest(testToRetake);
                    setView('test-running');
                  } else {
                    setView('mock-tests');
                  }
                }}
                onGoHome={() => setView('home')}
                onGoToStudyPlan={() => setView('study-plan')}
              />
            </div>
          )}

          {/* VIEW 8: PERSONALIZED STUDY PATH ROUTINES */}
          {currentView === 'study-plan' && (
            <div className="animate-fadeIn">
              <StudyPlanner 
                setView={setView}
                mockTests={mockTests}
                onStartMockTest={handleStartTest}
                isPremiumUser={isPremiumUser}
                onOpenPremium={() => setView('premium')}
              />
            </div>
          )}

          {/* VIEW 9: PREMIUM PASS DEDICATED VIEW TAB */}
          {currentView === 'premium' && (
            <div className="animate-fadeIn font-sans pb-16">
              <PremiumBanner 
                isPremiumUser={isPremiumUser}
                activeSubscription={activeSubscription}
                firebaseUser={firebaseUser}
                onBuyPlan={handleBuyPlan}
                onGoBack={() => setView('home')}
              />
            </div>
          )}

          {/* VIEW 10: GOVERNMENT JOBS LIST */}
          {currentView === 'job-list' && (
            <div className="animate-fadeIn font-sans pb-16">
              <GovernmentJobsList onGoBack={() => setView('home')} onJobClick={() => setView('job-details')} />
            </div>
          )}

          {/* VIEW 11: STATE JOBS LIST */}
          {currentView === 'state-job-list' && (
            <div className="animate-fadeIn font-sans pb-16">
              <StateJobsList onGoBack={() => setView('home')} onJobClick={() => setView('job-details')} />
            </div>
          )}

          {/* VIEW POST LIST */}
          {currentView === 'post-list' && (
            <div className="animate-fadeIn font-sans pb-16">
              <SystemPostList 
                categoryTitle={postListTitle} 
                onGoBack={() => setView('home')} 
                onPostClick={() => setView('job-details')} 
              />
            </div>
          )}

          {/* VIEW 12: JOB DETAILS */}
          {currentView === 'job-details' && (
            <div className="animate-fadeIn font-sans">
              <JobDetails 
                onGoBack={() => setView('home')} 
                onOpenStudyPlan={() => setView('study-plan')} 
                postId={selectedSubCategory || undefined}
                onStartTest={handleStartTest}
              />
            </div>
          )}

          {/* VIEW NEWS DETAILS */}
          {currentView === 'news-details' && (
            <div className="animate-fadeIn font-sans">
              <NewsDetails 
                newsId={selectedNewsId || ''} 
                onGoBack={() => setView('home')} 
                onStartTest={handleStartTest}
                onOpenStudyPlan={() => setView('study-plan')}
              />
            </div>
          )}

          {/* VIEW DAILY CURRENT AFFAIRS */}
          {currentView === 'daily-ca' && (
            <div className="animate-fadeIn font-sans pb-16">
              <DailyCurrentAffairs onEarnPoints={handleEarnDailyQuizPoints} />
            </div>
          )}

          {/* VIEW STATIC LEGAL & ABOUT PAGES */}
          {(currentView === 'about' || currentView === 'contact' || currentView === 'privacy' || currentView === 'disclaimer' || currentView === 'terms') && (
            <div className="animate-fadeIn font-sans pb-16">
              <InfoPages 
                initialTab={currentView} 
                onGoBack={() => setView('home')} 
                setView={setView} 
              />
            </div>
          )}

          {/* VIEW DYNAMIC SEO EXAM PAGES */}
          {currentView === 'exam-page' && (
            <div className="animate-fadeIn font-sans pb-16">
              <ExamSEOPage 
                examSlug={selectedExamSlug} 
                mockTests={mockTests} 
                onStartTest={handleStartTest} 
                onGoBack={() => setView('home')} 
                setView={setView}
              />
            </div>
          )}

        </main>

        {/* Coupon and Series Purchase Handlers */}
        {(() => {
          // Inner scope IIFE helper to define handlers inside JSX layout cleanly
          (window as any)._handleValidateCoupon = async () => {
            if (!couponCode.trim()) {
              setCouponError('দয়া করে একটি কুপন কোড লিখুন।');
              return;
            }
            setCouponError('');
            setCouponSuccess('');
            try {
              const res = await fetch('/api/payments/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  couponCode: couponCode.trim(),
                  seriesId: selectedPurchaseSeries?.id
                })
              });
              const data = await res.json();
              if (res.ok && data.success) {
                setCouponDiscount(data.discountValue);
                setCouponSuccess(`কুপন সফলভাবে প্রয়োগ করা হয়েছে! আপনি ${data.discountValue}% ছাড় পেয়েছেন।`);
              } else {
                setCouponError(data.error || 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড।');
              }
            } catch (e: any) {
              setCouponError('কুপন চেক করার সময় সার্ভারে ত্রুটি হয়েছে।');
            }
          };

          (window as any)._handleInitiateSeriesPurchase = async () => {
            if (!firebaseUser) {
              alert('দয়া করে প্রথমে লগইন করুন।');
              return;
            }
            
            setIsProcessingPurchase(true);
            try {
              const res = await fetch('/api/payments/create-series-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: firebaseUser.uid,
                  userName: profileName || firebaseUser.displayName,
                  userEmail: firebaseUser.email,
                  phone: profilePhone,
                  seriesId: selectedPurchaseSeries.id,
                  couponCode: couponCode.trim() || undefined
                })
              });
              const data = await res.json();
              if (res.ok && data.success && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
              } else {
                alert(data.error || 'অর্ডার তৈরি করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
              }
            } catch (e: any) {
              alert('সার্ভার কানেকশন এরর: ' + e.message);
            } finally {
              setIsProcessingPurchase(false);
            }
          };
          return null;
        })()}

        {/* Cashfree Series-level Purchase Bottom Sheet / Overlay */}
        {selectedPurchaseSeries && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-[32px] sm:rounded-[28px] border border-slate-150 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-slideUp font-sans">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-emerald-200">
                    👑 PREMIUM SERIES EXCLUSIVE
                  </span>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {selectedPurchaseSeries.bengaliName}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">মক টেস্ট সিরিজ আনলক প্যানেল</p>
                </div>
                <button 
                  onClick={() => setSelectedPurchaseSeries(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Benefits list */}
              <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/60 text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
                <div className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="font-semibold leading-tight">এই সিরিজের অধীনে থাকা সমস্ত প্রিমিয়াম মক টেস্টের অ্যাক্সেস (মেয়াদ: {selectedPurchaseSeries.validityDays || 365} দিন)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="font-semibold leading-tight">উত্তরপত্রের বিস্তারিত ব্যাখ্যা ও সঠিক সমাধান ট্র্যাকার</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="font-semibold leading-tight">সরাসরি অল ইন্ডিয়া লাইভ র‍্যাংক ও স্কোরকার্ড বিশ্লেষণ</span>
                </div>
              </div>

              {/* Price block */}
              <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-800/80 py-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">মেম্বারশিপ প্যাকেজ মূল্য:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ₹{selectedPurchaseSeries.salePrice || 49}
                    </span>
                    {selectedPurchaseSeries.regularPrice && (
                      <span className="text-xs text-slate-400 font-bold line-through">
                        ₹{selectedPurchaseSeries.regularPrice}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-150">
                      -{Math.round(((selectedPurchaseSeries.regularPrice - selectedPurchaseSeries.salePrice) / selectedPurchaseSeries.regularPrice) * 100) || 50}% ছাড়!
                    </span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400 font-bold">
                  <span>মেয়াদ: {selectedPurchaseSeries.validityDays || 365} দিন</span>
                  <span className="block text-[9.5px] text-indigo-500 font-extrabold">Cashfree পেমেন্ট গেটওয়ে</span>
                </div>
              </div>

              {/* Coupon inputs */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">ডিসকাউন্ট কুপন কোড (যদি থাকে):</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="যেমন: SPECIAL50"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold placeholder-slate-400 text-slate-800 dark:text-slate-100 uppercase focus:outline-none"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                  />
                  <button 
                    onClick={() => (window as any)._handleValidateCoupon()}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs px-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    প্রয়োগ করুন
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-rose-600 font-bold leading-tight animate-pulse">⚠️ {couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold leading-tight">🎉 {couponSuccess}</p>}
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5 pt-2">
                {!firebaseUser ? (
                  <div className="space-y-2 text-center bg-amber-50 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200">
                    <p className="text-[10.5px] text-amber-800 dark:text-amber-300 font-black">পেমেন্ট করার জন্য প্রথমে লগইন করা আবশ্যক।</p>
                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" /> গুগল একাউন্ট দিয়ে লগইন করুন
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => (window as any)._handleInitiateSeriesPurchase()}
                    disabled={isProcessingPurchase}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg hover:shadow-indigo-500/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{isProcessingPurchase ? 'প্রসেসিং হচ্ছে...' : 'এখনই কিনুন (Pay Now)'}</span>
                    <span className="text-[10.5px] bg-white/15 px-2 py-0.5 rounded-lg">
                      ₹{selectedPurchaseSeries.salePrice - (couponDiscount ? Math.round((selectedPurchaseSeries.salePrice * couponDiscount) / 100) : 0)}
                    </span>
                  </button>
                )}

                <button 
                  onClick={() => setSelectedPurchaseSeries(null)}
                  className="w-full text-center text-[10.5px] font-black text-slate-400 hover:text-slate-500 py-1"
                >
                  ফিরে যান
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cashfree Payment Verification Loader */}
        {verifyingSeriesPayment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn font-sans">
            <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-150 dark:border-slate-800">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">পেমেন্ট ভেরিফিকেশন হচ্ছে...</h3>
                <p className="text-[11px] text-slate-400 font-bold">ক্যাশফ্রি সুরক্ষিত গেটওয়ে থেকে আপনার পেমেন্ট কনফার্মেশন সংগ্রহ করা হচ্ছে। দয়া করে অপেক্ষা করুন।</p>
              </div>
            </div>
          </div>
        )}

        {/* Series Purchase Success confirmation modal */}
        {seriesPaymentSuccess && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn font-sans">
            <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-200 dark:border-emerald-950/50">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 text-2xl mx-auto shadow-inner border border-emerald-200">
                🎉
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">পেমেন্ট সফল হয়েছে!</h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-150">
                  আপনার নির্বাচিত <strong>{seriesPaymentSuccessName || 'মক টেস্ট সিরিজ'}</strong> সফলভাবে আনলক করা হয়েছে।
                </p>
                <p className="text-[10px] text-slate-400 font-bold font-sans">এখন আপনি এই সিরিজের সমস্ত মক টেস্ট কোনো বাধা ছাড়াই শুরু করতে পারেন। সেরা প্রস্তুতি নিন!</p>
              </div>
              <button 
                onClick={() => {
                  setSeriesPaymentSuccess(null);
                  setSeriesPaymentSuccessName(null);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md active:scale-95 transition-transform"
              >
                পড়াশোনা শুরু করুন
              </button>
            </div>
          </div>
        )}

        {/* Global Smart Premium Popup */}
        {showPremiumPopup && (
          <PremiumPopup 
            onClose={() => setShowPremiumPopup(false)} 
            onUpgrade={() => {
              setShowPremiumPopup(false);
              setView('premium');
            }} 
          />
        )}

        {/* Floating Bottom Sticky Navigation Tabs */}
        {currentView !== 'test-running' && (
          <div className="md:hidden">
            <BottomNav currentView={currentView} setView={setView} />
          </div>
        )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
