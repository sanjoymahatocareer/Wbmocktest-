export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  explanation?: string;
}

export interface CustomTemplateField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'richtext' | 'pdf' | 'image' | 'url' | 'faq' | 'table';
  placeholder?: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  fields: CustomTemplateField[];
}

export interface PostName {
  id: string;
  categoryId: string;
  name: string;
  bengaliName: string;
  subtitle?: string;
  templateId?: string;
  fields?: Record<string, any>;
  faqs?: { question: string; answer: string }[];
  tables?: { title: string; headers: string[]; rows: string[][] }[];
  // Mock Test Series Pricing and Validity properties
  regularPrice?: number;
  salePrice?: number;
  currency?: string;
  validityDays?: number;
  isPremiumSeries?: boolean;
  status?: 'draft' | 'published';
}

export interface MockTest {
  id: string;
  postId?: string; // References PostName (new hierarchy)
  categoryId?: string; // References ExamCategory (new hierarchy)
  title: string;
  bengaliTitle: string;
  examType: string; // kept for backward compatibility
  examTypeBengali: string; // kept for backward compatibility
  testNumber?: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks?: number; // Passing marks
  durationMinutes: number;
  difficulty: 'সহজ' | 'মাঝারি' | 'কঠিন' | 'Easy' | 'Medium' | 'Hard';
  isPremium: boolean;
  isPublished?: boolean;
  negativeMarking?: string; // 'none' | '0.25' | '0.33' | '0.50'
  subjectsDistribution?: { subject: string; questionCount: number; marksCount: number }[];
  questions: Question[];
}

export interface ExamCategory {
  id: string;
  name: string;
  bengaliName: string;
  iconName: string; // Lucide icon mapping
  subtitle?: string;
  emoji?: string;
  gradientClass?: string;
  slug?: string;
  description?: string;
}

export interface JobNotification {
  id: string;
  organization: string;
  title: string;
  lastDate: string;
  logoColor: string;
  isNew: boolean;
  applyUrl?: string;
  syllabus?: string[];
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  accuracy: number; // percentage
  timeTakenMinutes: number;
  rank: number;
  totalParticipants: number;
  subjectWise: {
    subject: string;
    correct: number;
    total: number;
  }[];
  date: string;
  userEmail?: string;
  passed?: boolean;
}

export interface SuccessStory {
  id: string;
  name: string;
  bengaliName: string;
  examCleared: string;
  quote: string;
  avatarUrl: string;
}

export type ViewType = 'home' | 'mock-tests' | 'question-bank' | 'results' | 'profile' | 'test-running' | 'test-result' | 'admin' | 'study-plan' | 'premium' | 'job-list' | 'state-job-list' | 'job-details' | 'admin-login' | 'post-list' | 'news-details' | 'my-tests' | 'performance';

export interface ActiveSubscription {
  userId: string;
  planName: 'Basic Plan' | 'Standard Plan' | 'Premium Plan';
  price: number;
  maxTests: number;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'inactive';
  orderId: string;
}

export interface PaymentTransaction {
  id: string; // same as orderId
  userId: string;
  userEmail?: string;
  userName?: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  planName: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  purchaseDate: string;
  expiryDate: string;
  createdAt: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone?: string;
  seriesId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  couponCode?: string;
  discountAmount?: number;
  cashfreeOrderId?: string;
  paymentSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseEntitlement {
  id: string; // PUR_userId_seriesId
  userId: string;
  seriesId: string;
  orderId: string;
  purchaseStatus: 'active' | 'expired' | 'cancelled';
  accessStartDate: string;
  accessEndDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponCode {
  id: string; // Coupon code itself uppercase
  code: string;
  discountValue: number;
  discountType: 'percentage' | 'flat';
  minOrderAmount?: number;
  expiryDate?: string;
  active: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: 'grant_access' | 'cancel_access' | 'edit_settings';
  adminId: string;
  targetUserId: string;
  targetSeriesId?: string;
  details: string;
  timestamp: string;
}

