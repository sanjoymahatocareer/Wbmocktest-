import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, Crown, BookOpen, AlertCircle, FileCheck, Award, 
  HelpCircle, Trophy, User, Check, X, ShieldAlert, BookOpenCheck, Zap, Star, LogIn, LogOut, Calendar, Sparkles, ArrowLeft
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

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize view based on URL route
  const [currentView, setView] = useState<ViewType>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      const isAdminLoggedIn = safeSessionStorage.getItem('admin_auth_token') === 'true';
      if (path === '/admin/dashboard' && isAdminLoggedIn) {
        return 'admin';
      }
      return 'admin-login';
    }
    return 'home';
  });
  
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [postListTitle, setPostListTitle] = useState('অ্যাডমিট কার্ড');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

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
    if (isPremiumUser || hasShown24hrPopup) return;
    setShowPremiumPopup(true);
    setHasShown24hrPopup(true);
    safeLocalStorage.setItem('lastPremiumPopupTime', Date.now().toString());
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

  // Active testing state
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [resultsLog, setResultsLog] = useState<TestResult[]>([]);

  // Modals state
  const [activeModal, setActiveModal] = useState<'syllabus' | 'current-affairs' | 'admit-card' | 'previous-papers' | 'premium-buy' | 'notifications' | null>(null);
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
      const associatedPost = posts.find(p => p.id === test.postId);
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
              <div className="space-y-3 font-sans">
                {[
                  { title: 'নতুন ৫টি মক টেস্ট সিরিজ যুক্ত করা হয়েছে', time: '২ ঘণ্টা আগে' },
                  { title: 'WBCS পরীক্ষার স্পেশাল পেপার আপডেট সম্পূর্ণ', time: '১ দিন আগে' },
                  { title: 'WBMockTest.in মেম্বারশিপে ২০% বর্ষাকালীন ডিসকাউন্ট', time: '৩ দিন আগে' }
                ].map((n, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 font-bold block">{n.time}</span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white mt-1">{n.title}</h4>
                  </div>
                ))}
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
        /* Simulation Mobile Container to make it extremely responsive and cute */
        <div className={`max-w-md mx-auto min-h-screen shadow-2xl relative pb-28 border-x transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-[#040a1f]/95 border-slate-900/60 shadow-purple-500/5' 
            : 'bg-slate-50/95 border-slate-200/50'
        }`}>
          
          {/* Sticky App Header */}
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
                      className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
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

              {/* Latest news & government announcements (Khobor Section) */}
              <KhoborSection 
                onNewsClick={(item) => {
                  setSelectedNewsId(item.id);
                  setView('news-details');
                }}
              />

              {/* Footer */}
              <div className="text-center py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block">WBMockTest.in © 2026</span>
                <p className="text-[9px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                  পশ্চিমবঙ্গে সরকারি চাকরির প্রস্তুতির সেরা অনলাইন প্ল্যাটফর্ম।
                </p>
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
                    onReqPremiumUpgrade={() => {}}
                  />
                ))}
                {filteredTests.length === 0 && (
                  <div className="text-center p-6 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-[11px] text-slate-400 font-bold dark:text-slate-500">এই বিভাগে কোনো মক টেস্ট নেই।</p>
                  </div>
                )}
              </div>
                          {resultsTab === 'gamification' ? (
                <div className="animate-fadeIn">
                  <GamificationDashboard 
                    points={userPoints}
                    streakCount={streakCount}
                    resultsLog={resultsLog}
                    profileName={profileName}
                  />
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm text-center animate-fadeIn">
                    <h2 className="text-base font-black text-slate-855 dark:text-white">আপনার আগের পরীক্ষার রিপোর্টসমূহ</h2>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">মেধাতালিকা বিশ্লেষণের ঐতিহাসিক রেকর্ড লগ ও মেন্টরিং</p>
                  </div>

                  {resultsLog.length === 0 ? (
                    <div className="text-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 animate-fadeIn">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-855 dark:text-slate-205">কোনো হিস্ট্রি লগ পাওয়া যায়নি</h3>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">প্রথমে একটি মক টেস্ট পূরণ করুন। আপনার সকল পারফরম্যান্স চার্ট ও স্কোর এখানে ট্র্যাক করা সম্ভব হবে।</p>
                      </div>
                      <button 
                        onClick={() => setView('mock-tests')}
                        className="bg-blue-600 text-white text-xs font-bold py-1.5 px-4 rounded-xl shadow-md cursor-pointer"
                      >
                        শুরু করতে টেস্ট দিন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-fadeIn">
                      {resultsLog.map((log) => (
                        <div 
                          key={log.id}
                          onClick={() => {
                            setCurrentResult(log);
                            setView('test-result');
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-4 shadow-sm hover:border-blue-200 cursor-pointer transition-all flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[9px] text-slate-400 block">{log.date}</span>
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug mt-0.5">{log.testTitle}</h4>
                            <span className="text-[10px] text-emerald-600 font-bold block mt-1">স্কোর: {log.score} / {log.totalMarks} ({log.accuracy}% সঠিকতা)</span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs font-black text-indigo-650 dark:text-blue-400 block">র‍্যাঙ্ক #{log.rank}</span>
                            <span className="text-[9px] text-slate-400 font-bold block mt-1">বিশদ সমাধান ও এআই উপদেশ ➔</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 5: USER PROFILE VIEW */}
          {currentView === 'profile' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow">
                  {firebaseUser?.photoURL ? (
                    <img 
                      src={firebaseUser.photoURL} 
                      alt={profileName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    profileName.substring(0, 1)
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
                    <span>{profileName}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">মোবাইল: +৯১ {profilePhone}</p>
                </div>
              </div>

              {/* Google Connection Status / Login */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-snug">গুগল অ্যাকাউন্ট লিঙ্ক</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${firebaseUser ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-450'}`}>
                    {firebaseUser ? 'সংযুক্ত আছে' : 'সংযুক্ত নেই'}
                  </span>
                </div>

                {firebaseUser ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[9px] text-slate-400 block font-bold">লগইন ইমেল</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350 truncate block font-sans">{firebaseUser.email}</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black whitespace-nowrap">✓ Verified</span>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full py-2.5 border border-rose-200 hover:bg-rose-50/50 dark:border-rose-950/50 dark:hover:bg-rose-950/20 text-rose-600 text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>গুগল অ্যাকাউন্ট সাইন-আউট</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-400 leading-normal">
                      আপনার পরীক্ষার অগ্রগতি, মক টেস্ট স্কোর ও লিডারবোর্ডের এক্সপি (XP) পয়েন্ট চিরতরে সুরক্ষিত ও সংরক্ষিত রাখতে গুগল সাইন-ইন সম্পন্ন করুন।
                    </p>
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoggingIn}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-650 disabled:opacity-50 text-white text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <LogIn className="w-4 h-4" />
                      )}
                      <span>গুগল দিয়ে প্রবেশ করুন</span>
                    </button>

                    {authError && (
                      <div className="text-[11px] bg-red-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl border border-red-150/50 dark:border-rose-900/40 font-sans leading-relaxed shadow-sm">
                        {authError === 'autherror-unauthorized-domain' ? (
                          <div className="space-y-2">
                            <span className="font-extrabold block text-rose-700 dark:text-rose-300">❌ ডোমেইন অনুমোদিত নয় (Unauthorized Domain)</span>
                            <span className="block text-[10px]">আপনার custom domain-এ গুগল সাইন-ইন কাজ করানোর জন্য নিচের নির্দেশাবলী অনুসরণ করুন:</span>
                            <ol className="list-decimal list-inside text-[9.5px] space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                              <li>আপনার <strong>Firebase Console</strong>-এ প্রবেশ করুন।</li>
                              <li><strong>Authentication</strong> সেকশনে গিয়ে <strong>Settings ➔ Authorized Domains</strong> ট্যাবে যান।</li>
                              <li><strong>Add domain</strong> বোতামে ক্লিক করে নিচের দুটি ডোমেন এক এক করে যুক্ত করুন:</li>
                            </ol>
                            <div className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-850 font-mono text-[9px] mt-1.5 space-y-0.5 select-all font-semibold text-slate-800 dark:text-slate-350 shadow-inner">
                              <div>wbmocktest.in</div>
                              <div>www.wbmocktest.in</div>
                            </div>
                          </div>
                        ) : (
                          <span>{authError}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Simple editable details card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-snug">প্রোফাইল সেটিংস সম্পাদনা</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">নাম পরিবর্তন (বাংলায়)</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 p-2.5 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">মোবাইল নম্বর (১০ ডিজিট)</label>
                    <input 
                      type="text" 
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 p-2.5 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Total performance summarized */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-3xl p-4 border border-indigo-950 shadow">
                <h4 className="text-xs font-black uppercase tracking-wider mb-3">সংক্ষিপ্ত পরিসংখ্যান লকার</h4>
                
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <span className="text-[10px] text-slate-400 block mb-0.5">সম্পন্ন মক টেস্ট</span>
                    <span className="text-base font-black text-amber-400">{resultsLog.length} টি</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <span className="text-[10px] text-slate-400 block mb-0.5">গড় সঠিকতা (Accuracy)</span>
                    <span className="text-base font-black text-emerald-400">
                      {resultsLog.length > 0 
                        ? Math.round(resultsLog.reduce((a, b) => a + b.accuracy, 0) / resultsLog.length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
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
                  const testToRetake = mockTests.find(t => t.id === currentResult.testId);
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

        </main>

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
          <BottomNav currentView={currentView} setView={setView} />
        )}

      </div>
    )}
    </div>
  );
}
