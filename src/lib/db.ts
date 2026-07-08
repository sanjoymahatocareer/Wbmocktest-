import { ExamCategory, PostName, MockTest, Question, TestResult, CustomTemplate } from '../types';
import { safeLocalStorage } from './storage';
import { mockTestsList as defaultMockTests } from '../data';

// Define target Categories
const defaultCategories: ExamCategory[] = [
  { id: 'panchayat', name: 'WB Panchayat', bengaliName: 'পঞ্চায়েত নিয়োগ', iconName: 'Building', subtitle: 'DEO, EA, Karmi, Nirman Sahayak', emoji: '🗳️', gradientClass: 'from-blue-500/10 via-blue-600/5 to-sky-600/10 border-blue-500/25 text-blue-600 dark:text-blue-400' },
  { id: 'police', name: 'WB Police', bengaliName: 'পশ্চিমবঙ্গ পুলিশ', iconName: 'ShieldAlert', subtitle: 'Constable, Lady Constable, SI, Sergeant', emoji: '👮', gradientClass: 'from-red-500/10 via-red-600/5 to-rose-600/10 border-red-500/25 text-red-500 dark:text-red-400' },
  { id: 'wbpsc', name: 'WBPSC', bengaliName: 'পিএসসি (WBPSC)', iconName: 'Award', subtitle: 'Clerkship, Food SI, Miscellaneous', emoji: '🏛️', gradientClass: 'from-purple-500/10 via-purple-600/5 to-fuchsia-600/10 border-purple-500/25 text-purple-500 dark:text-purple-400' },
  { id: 'ssc', name: 'SSC', bengaliName: 'এসএসসি (SSC)', iconName: 'FileText', subtitle: 'CGL, CHSL, MTS, GD', emoji: '🏢', gradientClass: 'from-indigo-500/10 via-indigo-600/5 to-violet-600/10 border-indigo-500/25 text-indigo-500 dark:text-indigo-400' },
  { id: 'railway', name: 'Railway', bengaliName: 'রেলওয়ে রিক্রুটমেন্ট', iconName: 'Train', subtitle: 'NTPC, Group D, ALP', emoji: '🚆', gradientClass: 'from-amber-500/10 via-amber-600/5 to-orange-600/10 border-amber-500/25 text-amber-500 dark:text-amber-400' },
  { id: 'bank', name: 'Banking', bengaliName: 'ব্যাংকিং জবস', iconName: 'Coins', subtitle: 'IBPS PO, Clerk, SBI', emoji: '💰', gradientClass: 'from-yellow-500/10 via-yellow-600/5 to-amber-600/10 border-yellow-500/25 text-yellow-500 dark:text-yellow-400' },
  { id: 'icds', name: 'ICDS', bengaliName: 'আইসিডিএস (ICDS)', iconName: 'Heart', subtitle: 'Anganwadi Supervisor, Helper', emoji: '👶', gradientClass: 'from-pink-500/10 via-pink-600/5 to-rose-600/10 border-pink-500/25 text-pink-500 dark:text-pink-400' },
  { id: 'tet', name: 'Primary TET', bengaliName: 'প্রাইমারি টেট (TET)', iconName: 'GraduationCap', subtitle: 'Primary & Upper Primary Teacher', emoji: '✏️', gradientClass: 'from-sky-500/10 via-sky-600/5 to-blue-600/10 border-sky-500/25 text-sky-500 dark:text-sky-400' },
  { id: 'groupd', name: 'Group D', bengaliName: 'গ্রুপ ডি (Group D)', iconName: 'Briefcase', subtitle: 'Office Support Staff, Peon', emoji: '💼', gradientClass: 'from-emerald-500/10 via-emerald-600/5 to-green-600/10 border-emerald-500/25 text-emerald-500 dark:text-emerald-400' }
];

// Define recruitment custom templates
const defaultTemplates: CustomTemplate[] = [
  {
    id: 'tpl-panchayat',
    name: 'Panchayat Recruitment Template',
    fields: [
      { name: 'vacancy', label: 'Vacancy / শূন্যপদ সংখ্যা', type: 'number', placeholder: 'যেমন: ১২০০' },
      { name: 'qualification', label: 'Qualification / শিক্ষাগত যোগ্যতা', type: 'text', placeholder: 'যেমন: Madhyamik / Higher Secondary' },
      { name: 'ageLimit', label: 'Age Limit / বয়সসীমা', type: 'text', placeholder: 'যেমন: ১৮ - ৪০ বছর' },
      { name: 'salary', label: 'Salary / বেতন', type: 'text', placeholder: 'যেমন: ২২,৭০০ - ৫৮,৫০০ টাকা' },
      { name: 'applicationFee', label: 'Application Fee / আবেদন ফি', type: 'text', placeholder: 'যেমন: ১৫০ টাকা (SC/ST ছাড়)' },
      { name: 'selectionProcess', label: 'Selection Process / নিয়োগ পদ্ধতি', type: 'textarea', placeholder: 'পরীক্ষা ও ইন্টারভিউ বিবরণ...' },
      { name: 'importantDates', label: 'Important Dates / গুরুত্বপূর্ণ তারিখ', type: 'textarea', placeholder: 'আবেদন শুরু, শেষ তারিখ...' },
      { name: 'syllabus', label: 'Syllabus / সিলেবাস', type: 'richtext', placeholder: 'পরীক্ষায় কী কী বিষয় থাকবে...' },
      { name: 'notificationPdf', label: 'Notification PDF URL / বিজ্ঞপ্তির লিঙ্ক', type: 'pdf', placeholder: 'https://example.com/notification.pdf' },
      { name: 'officialWebsite', label: 'Official Website / অফিসিয়াল ওয়েবসাইট', type: 'url', placeholder: 'https://wbssc.gov.in' }
    ]
  },
  {
    id: 'tpl-police',
    name: 'Police Recruitment Template',
    fields: [
      { name: 'vacancy', label: 'Vacancy / শূন্যপদ সংখ্যা', type: 'number', placeholder: 'যেমন: ১১৭৪৯' },
      { name: 'qualification', label: 'Qualification / শিক্ষাগত যোগ্যতা', type: 'text', placeholder: 'যেমন: Madhyamik passed' },
      { name: 'ageLimit', label: 'Age Limit / বয়সসীমা', type: 'text', placeholder: 'যেমন: ১৮ - ৩০ বছর' },
      { name: 'salary', label: 'Salary / বেতন', type: 'text', placeholder: 'যেমন: ২২,৭০০ - ৫৮,৫০০ টাকা' },
      { name: 'height', label: 'Height Required / উচ্চতা', type: 'text', placeholder: 'যেমন: ১৬৭ সেমি (পুরুষ), ১৬০ সেমি (মহিলা)' },
      { name: 'chest', label: 'Chest Measure / বুক (পুরুষ)', type: 'text', placeholder: 'যেমন: ৭৮ সেমি (৫ সেমি সম্প্রসারণ ক্ষমতা)' },
      { name: 'running', label: 'Running Test / দৌড় পরীক্ষা', type: 'text', placeholder: 'যেমন: ১৬০০ মিটার ৬ মিনিট ৩০ সেকেন্ডে' },
      { name: 'physicalTest', label: 'Physical Efficiency Test (PET/PMT) / শারীরিক মাপযোগ', type: 'textarea', placeholder: 'উচ্চতা ও ওজন সংক্রান্ত নিয়ম...' },
      { name: 'selectionProcess', label: 'Selection Process / নিয়োগ পদ্ধতি', type: 'textarea', placeholder: 'প্রিলিমিনারি, মাঠ পরীক্ষা, মেইনস ও ইন্টারভিউ...' },
      { name: 'examPattern', label: 'Exam Pattern / পরীক্ষার ধরন', type: 'richtext', placeholder: 'কত নম্বরের এমসিকিউ থাকবে, নেগেটিভ মার্কিং কত...' },
      { name: 'notificationPdf', label: 'Notification PDF URL / বিজ্ঞপ্তির লিঙ্ক', type: 'pdf', placeholder: 'https://prb.wb.gov.in/pdf' },
      { name: 'officialWebsite', label: 'Official Website / অফিসিয়াল ওয়েবসাইট', type: 'url', placeholder: 'https://prb.wb.gov.in' }
    ]
  },
  {
    id: 'tpl-ssc',
    name: 'SSC Recruitment Template',
    fields: [
      { name: 'vacancy', label: 'Vacancy / শূন্যপদ সংখ্যা', type: 'text', placeholder: 'যেমন: ২০০০০+' },
      { name: 'qualification', label: 'Qualification / শিক্ষাগত যোগ্যতা', type: 'text', placeholder: 'যেমন: Graduate / 10th / 12th' },
      { name: 'ageLimit', label: 'Age Limit / বয়সসীমা', type: 'text', placeholder: 'যেমন: ১৮ - ২৭ বছর' },
      { name: 'salary', label: 'Salary / বেতন', type: 'text', placeholder: 'যেমন: পে লেভেল ৪ অনুযায়ী' },
      { name: 'applicationFee', label: 'Application Fee / আবেদন ফি', type: 'text', placeholder: 'যেমন: ১০০ টাকা (নারী ও SC/ST বিনামূল্যে)' },
      { name: 'selectionProcess', label: 'Selection Process / নিয়োগ পদ্ধতি', type: 'textarea', placeholder: 'Tier-1 & Tier-2 Computer Based Exams...' },
      { name: 'examPattern', label: 'Exam Pattern / পরীক্ষার বিবরণ', type: 'richtext', placeholder: 'Tier 1 ও Tier 2 এর সিলেবাস ও নম্বর বণ্টন...' },
      { name: 'syllabus', label: 'Syllabus / সিলেবাস', type: 'richtext', placeholder: 'বিষয়ভিত্তিক বিস্তারিত সিলেবাস...' },
      { name: 'officialWebsite', label: 'Official Website / অফিসিয়াল ওয়েবসাইট', type: 'url', placeholder: 'https://ssc.gov.in' }
    ]
  },
  {
    id: 'tpl-railway',
    name: 'Railway Recruitment Template',
    fields: [
      { name: 'vacancy', label: 'Vacancy / শূন্যপদ সংখ্যা', type: 'number', placeholder: 'যেমন: ৯০০০' },
      { name: 'qualification', label: 'Qualification / শিক্ষাগত যোগ্যতা', type: 'text', placeholder: 'যেমন: ITI / Diploma / B.Sc' },
      { name: 'ageLimit', label: 'Age Limit / বয়সসীমা', type: 'text', placeholder: 'যেমন: ১৮ - ৩৬ বছর' },
      { name: 'salary', label: 'Salary / বেতন', type: 'text', placeholder: 'যেমন: ১৯,৯০০ টাকা (বেসিক)' },
      { name: 'selectionProcess', label: 'Selection Process / নিয়োগ পদ্ধতি', type: 'textarea', placeholder: 'CBT 1, CBT 2, Document Verification, Medical...' },
      { name: 'examPattern', label: 'Exam Pattern / পরীক্ষার প্যাটার্ন', type: 'richtext', placeholder: 'পরীক্ষায় কত নম্বর ও কি কি বিষয় থাকবে...' },
      { name: 'syllabus', label: 'Syllabus / সিলেবাস', type: 'richtext', placeholder: 'গণিত, জিআই, বিজ্ঞান ও সাধারণ জ্ঞান...' },
      { name: 'officialWebsite', label: 'Official Website / অফিসিয়াল ওয়েবসাইট', type: 'url', placeholder: 'https://rrbkolkata.gov.in' }
    ]
  }
];

// Define initial Post Names under categories
const defaultPosts: PostName[] = [];

// Helper to seed/retrieve from local storage
export function initializeDB() {
  if (!safeLocalStorage.getItem('wbm_categories_seeded')) {
    safeLocalStorage.setItem('wbm_categories', JSON.stringify(defaultCategories));
    safeLocalStorage.setItem('wbm_categories_seeded', 'true');
  }
  if (!safeLocalStorage.getItem('wbm_templates_seeded')) {
    safeLocalStorage.setItem('wbm_templates', JSON.stringify(defaultTemplates));
    safeLocalStorage.setItem('wbm_templates_seeded', 'true');
  }
  if (!safeLocalStorage.getItem('wbm_posts_seeded_v3')) {
    safeLocalStorage.setItem('wbm_posts', JSON.stringify(defaultPosts));
    safeLocalStorage.setItem('wbm_posts_seeded_v3', 'true');
  }
  if (!safeLocalStorage.getItem('wbm_tests_seeded')) {
    // Map initial mock tests to relevant posts
    const mappedTests = defaultMockTests.map(test => {
      let postId = 'police-constable';
      if (test.examType === 'panchayat') postId = 'panchayat-clerk';
      else if (test.examType === 'groupd') postId = 'groupd-staff';
      else if (test.examType === 'clerkship') postId = 'wbpsc-clerkship';
      else if (test.examType === 'railway') postId = 'railway-ntpc';
      else if (test.examType === 'bank') postId = 'bank-clerk';
      else if (test.examType === 'school') postId = 'tet-primary';
      else if (test.examType === 'foodsi') postId = 'wbpsc-foodsi';

      return {
        ...test,
        postId,
        passingMarks: Math.ceil(test.totalQuestions * 0.4) // default 40% passing
      };
    });
    safeLocalStorage.setItem('wbm_tests', JSON.stringify(mappedTests));
    safeLocalStorage.setItem('wbm_tests_seeded', 'true');
  }

  // Seed default admin and user mock records
  if (!safeLocalStorage.getItem('wbm_users')) {
    const initialUsers = [
      { id: 'admin-1', email: 'prokashmal799@gmail.com', role: 'admin', isPremium: true },
      { id: 'user-1', email: 'student@wbmocktest.com', role: 'user', isPremium: false },
      { id: 'user-2', email: 'bengali.stud@gmail.com', role: 'user', isPremium: true }
    ];
    safeLocalStorage.setItem('wbm_users', JSON.stringify(initialUsers));
  }

  if (!safeLocalStorage.getItem('wbm_attempts')) {
    safeLocalStorage.setItem('wbm_attempts', JSON.stringify([]));
  }
}

// Templates CRUD
export function getTemplates(): CustomTemplate[] {
  initializeDB();
  const raw = safeLocalStorage.getItem('wbm_templates');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse wbm_templates, resetting:", e);
    return defaultTemplates;
  }
}

export function saveTemplates(tpls: CustomTemplate[]) {
  safeLocalStorage.setItem('wbm_templates', JSON.stringify(tpls));
}

// Category CRUD
export function getCategories(): ExamCategory[] {
  initializeDB();
  const raw = safeLocalStorage.getItem('wbm_categories');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse wbm_categories, resetting:", e);
    return defaultCategories;
  }
}

export function saveCategories(cats: ExamCategory[]) {
  safeLocalStorage.setItem('wbm_categories', JSON.stringify(cats));
}

// Posts CRUD
export function getPosts(): PostName[] {
  initializeDB();
  const raw = safeLocalStorage.getItem('wbm_posts');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse wbm_posts, resetting:", e);
    return defaultPosts;
  }
}

export function savePosts(posts: PostName[]) {
  safeLocalStorage.setItem('wbm_posts', JSON.stringify(posts));
}

// Mock Tests CRUD
export function getMockTests(): MockTest[] {
  initializeDB();
  const raw = safeLocalStorage.getItem('wbm_tests');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let updated = [...parsed];
      let changed = false;
      defaultMockTests.forEach(test => {
        if (!updated.some(t => t.id === test.id)) {
          let postId = 'police-constable';
          if (test.examType === 'panchayat') postId = 'panchayat-clerk';
          else if (test.examType === 'groupd') postId = 'groupd-staff';
          else if (test.examType === 'clerkship') postId = 'wbpsc-clerkship';
          else if (test.examType === 'railway') postId = 'railway-ntpc';
          else if (test.examType === 'bank') postId = 'bank-clerk';
          else if (test.examType === 'school') postId = 'tet-primary';
          else if (test.examType === 'foodsi') postId = 'wbpsc-foodsi';

          updated.push({
            ...test,
            postId,
            passingMarks: Math.ceil(test.totalQuestions * 0.4)
          });
          changed = true;
        }
      });
      // Force all tests to not be premium so premium is removed and only free remains
      const allFree = updated.map(t => ({ ...t, isPremium: false }));
      if (changed) {
        safeLocalStorage.setItem('wbm_tests', JSON.stringify(allFree));
      }
      return allFree;
    }
    return [];
  } catch (e) {
    console.error("Failed to parse wbm_tests, resetting:", e);
    return [];
  }
}

export function saveMockTests(tests: MockTest[]) {
  safeLocalStorage.setItem('wbm_tests', JSON.stringify(tests));
}

// Attempts / Results CRUD
export function getAttempts(): TestResult[] {
  initializeDB();
  const raw = safeLocalStorage.getItem('wbm_attempts');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse wbm_attempts, resetting:", e);
    return [];
  }
}

export function saveAttempt(result: TestResult) {
  const attempts = getAttempts();
  attempts.unshift(result);
  safeLocalStorage.setItem('wbm_attempts', JSON.stringify(attempts));
}

export function clearAttempts() {
  safeLocalStorage.setItem('wbm_attempts', JSON.stringify([]));
}

// Users CRUD
export function getUsers() {
  initializeDB();
  const raw = safeLocalStorage.getItem('wbm_users');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse wbm_users, resetting:", e);
    return [];
  }
}

export function saveUsers(users: any[]) {
  safeLocalStorage.setItem('wbm_users', JSON.stringify(users));
}

// Dashboard statistics
export function getDashboardStats() {
  const cats = getCategories();
  const posts = getPosts();
  const tests = getMockTests();
  const users = getUsers();
  const attempts = getAttempts();

  let totalQuestions = 0;
  tests.forEach(t => {
    totalQuestions += t.questions?.length || 0;
  });

  return {
    totalCategories: cats.length,
    totalPosts: posts.length,
    totalMockTests: tests.length,
    totalQuestions,
    totalUsers: users.length,
    totalAttempts: attempts.length
  };
}
