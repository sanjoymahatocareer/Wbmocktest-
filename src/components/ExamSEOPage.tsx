import React from 'react';
import { Shield, BookOpen, Clock, HelpCircle, FileText, Award, ArrowLeft, CheckCircle2, ChevronRight, Scale, GraduationCap, Compass } from 'lucide-react';
import { MockTest, ExamCategory, ViewType } from '../types';

interface ExamSEOPageProps {
  examSlug: string; // 'wb-police' | 'wb-panchayat' | 'wbpsc' | 'kolkata-police' | 'clerkship' | 'railway' | 'group-c-d' | 'ssc'
  mockTests: MockTest[];
  onStartTest: (test: MockTest) => void;
  onGoBack: () => void;
  setView: (view: ViewType) => void;
}

export interface ExamSEOData {
  slug: string;
  title: string;
  englishTitle: string;
  description: string;
  metaDesc: string;
  categoryId: string;
  examPattern: {
    stages: string[];
    duration: string;
    totalMarks: string;
    negativeMarking: string;
    subjects: { name: string; marks: string }[];
  };
  syllabusBengali: string[];
  preparationTips: string[];
  faqs: { q: string; a: string }[];
}

export const examSEODataList: Record<string, ExamSEOData> = {
  'wb-police': {
    slug: 'wb-police',
    title: 'WB Police SI & Constable Mock Test 2026 – ফ্রি প্র্যাকটিস সেট',
    englishTitle: 'WB Police Mock Test 2026',
    description: 'পশ্চিমবঙ্গ পুলিশ কনস্টেবল এবং সাব-ইন্সপেক্টর পরীক্ষার জন্য সম্পূর্ণ সিলেবাস ভিত্তিক মক টেস্ট ও প্র্যাকটিস সেট।',
    metaDesc: 'WBMockTest.in-এ সম্পূর্ণ বিনামূল্যে WB Police SI এবং Constable পরীক্ষার মক টেস্ট দিন। উত্তর ব্যাখ্যা ও অল-ওয়েস্ট বেঙ্গল র‍্যাঙ্ক বিশ্লেষণসহ ১০০% ফ্রি প্র্যাকটিস সেট।',
    categoryId: 'police',
    examPattern: {
      stages: ['১. প্রিলিমিনারি পরীক্ষা (Preliminary Exam)', '২. শারীরিক পরিমাপ ও দক্ষতা পরীক্ষা (PMT & PET)', '৩. মেইন পরীক্ষা (Final Written Exam)', '৪. ইন্টারভিউ (Interview)'],
      duration: '১ ঘণ্টা (৬০ মিনিট)',
      totalMarks: '১০০ নম্বর',
      negativeMarking: '১/৪ (প্রতিটি ভুলের জন্য ০.২৫ কাটা যাবে)',
      subjects: [
        { name: 'জেনারেল অ্যাওয়ারনেস ও জিকে', marks: '৪০ নম্বর' },
        { name: 'এলিমেন্টারি ম্যাথমেটিক্স (মাধ্যমিক স্তর)', marks: '৩০ নম্বর' },
        { name: 'রিজনিং ও লজিক্যাল অ্যানালাইসিস', marks: '৩০ নম্বর' }
      ]
    },
    syllabusBengali: [
      'ইতিহাস ও ভূগোল (বিশেষত পশ্চিমবঙ্গ সম্পর্কিত)',
      'ভারতের সংবিধান ও অর্থনীতি',
      'সাধারণ বিজ্ঞান (পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান)',
      'পাটিগণিত (অনুপাত, শতকরা, লাভ-ক্ষতি, অংশীদারি কারবার, সময় ও কার্য)',
      'কারেন্ট অ্যাফেয়ার্স ও স্পোর্টস আপডেট',
      'কোডিং-ডিকোডিং, ব্লাড রিলেশন, ডিরেকশন টেস্ট, নম্বর সিরিজ'
    ],
    preparationTips: [
      'প্রতিদিন অন্তত ১টি করে সম্পূর্ণ ৯০ বা ১০০ নম্বরের মক টেস্ট দিন এবং ভুলের সমাধানগুলো নোট করুন।',
      'কারেন্ট অ্যাফেয়ার্সের জন্য আমাদের ডেইলি সিএ কুইজ সেকশনটি নিয়মিত ফলো করুন।',
      'পাটিগণিতের সূত্রগুলি এবং শর্টকাট মেথড ভালো করে প্র্যাকটিস করুন যাতে পরীক্ষার নির্ধারিত ৬০ মিনিটে সব প্রশ্ন কভার করা যায়।'
    ],
    faqs: [
      { q: 'WB Police কনস্টেবল পরীক্ষার মক টেস্টগুলো কি সম্পূর্ণ ফ্রি?', a: 'হ্যাঁ, WBMockTest.in-এ সমস্ত মক টেস্ট ১০০% ফ্রি। কোনো টাকা বা হিডেন চার্জ লাগবে না।' },
      { q: 'ভুল উত্তরের জন্য কি কোনো নেগেটিভ মার্কিং আছে?', a: 'হ্যাঁ, প্রতিটি ভুলের জন্য ০.২৫ নম্বর কাটা যাবে এবং সঠিক উত্তরের জন্য ১ নম্বর পাওয়া যাবে।' }
    ]
  },
  'wb-panchayat': {
    slug: 'wb-panchayat',
    title: 'WB Panchayat Recruitment Mock Test 2026 – ফ্রি প্র্যাকটিস সেট ও সিলেবাস',
    englishTitle: 'WB Panchayat Mock Test 2026',
    description: 'পশ্চিমবঙ্গ পঞ্চায়েত রিক্রুটমেন্ট (Panchayat Secretary, Clerk, Executive Assistant) পরীক্ষার সিলেবাস ভিত্তিক মক টেস্ট।',
    metaDesc: 'পশ্চিমবঙ্গ গ্রাম পঞ্চায়েত কর্মী ও সচিব পদের প্রস্তুতির জন্য ফ্রি অনলাইন মক টেস্ট সেট। সিলেবাস, পরীক্ষার ধরণ ও বিগত বছরের প্রশ্নোত্তরসহ প্র্যাকটিস করুন।',
    categoryId: 'groupd',
    examPattern: {
      stages: ['১. লিখিত পরীক্ষা (Written MCQ Test)', '২. কম্পিউটার টাইপিং টেস্ট (প্রযোজ্য ক্ষেত্রে)', '৩. ইন্টারভিউ (Interview)'],
      duration: '১ ঘণ্টা ৩০ মিনিট',
      totalMarks: '৮৫ নম্বর',
      negativeMarking: '০.২৫ নম্বর (১/৪ নম্বর)',
      subjects: [
        { name: 'বাংলা ভাষা ও সাহিত্য', marks: '১৫ নম্বর' },
        { name: 'ইংরেজি ভাষা ও গ্রামার', marks: '১৫ নম্বর' },
        { name: 'পাটিগণিত (Maths)', marks: '২৫ নম্বর' },
        { name: 'জেনারেল নলেজ ও কারেন্ট অ্যাফেয়ার্স', marks: '৩০ নম্বর' }
      ]
    },
    syllabusBengali: [
      'বাংলা ব্যাকরণ (সন্ধি, সমাস, কারক, এককথায় প্রকাশ, বাগধারা)',
      'English Grammar (Synonyms, Antonyms, Prepositions, Error Correction)',
      'পাটিগণিত ও প্রাথমিক বীজগণিত',
      'পশ্চিমবঙ্গ ও ভারতের ভূগোল, ইতিহাস এবং গ্রামীণ পঞ্চায়েত ব্যবস্থা ও প্রকল্পসমূহ'
    ],
    preparationTips: [
      'পঞ্চায়েত রাজ ব্যবস্থা এবং পশ্চিমবঙ্গের বিভিন্ন গ্রামীণ কল্যাণকারী প্রকল্পসমূহ (যেমন লক্ষ্মীর ভাণ্ডার, রূপশ্রী ইত্যাদি) খুব ভালো করে পড়ুন।',
      'বাংলা ও ইংরেজি ব্যাকরণ সেকশনে বেশি জোর দিন, কারণ এটি স্কোর বাড়াতে ব্যাপক সাহায্য করবে।'
    ],
    faqs: [
      { q: 'পঞ্চায়েত পরীক্ষায় কি ইংরেজি গ্রামার থেকে প্রশ্ন থাকে?', a: 'হ্যাঁ, পঞ্চায়েত সেক্রেটারি ও ক্লার্ক নিয়োগের পরীক্ষায় ইংরেজি গ্রামার থেকে ১৫ নম্বরের আবশ্যিক প্রশ্ন থাকে।' }
    ]
  },
  'wbpsc': {
    slug: 'wbpsc',
    title: 'WBPSC Miscellaneous, Food SI & WBCS Free Mock Test 2026',
    englishTitle: 'WBPSC Exams Mock Test 2026',
    description: 'পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন পরিচালিত Food SI, Miscellaneous, এবং WBCS প্রিলিমস পরীক্ষার কমনযোগ্য অনলাইন মক টেস্ট।',
    metaDesc: 'WBPSC Food SI, WBCS এবং Miscellaneous পরীক্ষার উন্নতমানের ফ্রি মক টেস্ট সিরিজ। প্রতিটি প্রশ্নের নির্ভুল ব্যাখ্যা ও ট্রিকসসহ ফ্রি প্রিপারেশন সেট।',
    categoryId: 'wbcs',
    examPattern: {
      stages: ['১. প্রিলিমিনারি পরীক্ষা (Screening Test)', '২. মেইনস লিখিত পরীক্ষা (Descriptive Written)', '৩. পার্সোনালিটি টেস্ট (Personality Test)'],
      duration: '১ ঘণ্টা ৩০ মিনিট (৯0 মিনিট)',
      totalMarks: '১০০ নম্বর',
      negativeMarking: '১/৩ (০.৩৩ নম্বর প্রতিটি ভুল উত্তরের জন্য)',
      subjects: [
        { name: 'জেনারেল স্টাডিজ (জিকে, ইতিহাস, বিজ্ঞান, ভারতের ভূগোল)', marks: '৫০ নম্বর' },
        { name: 'অ্যারিথমেটিক (পাটিগণিত)', marks: '৫০ নম্বর' }
      ]
    },
    syllabusBengali: [
      'ভারতের স্বাধীনতা সংগ্রাম ও ইতিহাস',
      'পশ্চিমবঙ্গ ও ভারতের ভূগোল ও সম্পদ',
      'দৈনন্দিন জীবনমুখী বিজ্ঞান ও প্রযুক্তি',
      'সরলীকরণ, গড়, অনুপাত, লসাগু-গসাগু, লাভ-ক্ষতি, সময় ও দূরত্ব, নল-চৌবাচ্চা',
      'জাতীয় ও আন্তর্জাতিক গুরুত্বপূর্ণ ঘটনাবলী (কারেন্ট অ্যাফেয়ার্স)'
    ],
    preparationTips: [
      'Food SI পরীক্ষায় অংকের ৫০ নম্বর খুবই গুরুত্বপূর্ণ। তাই প্রতিদিন পাটিগণিতের অধ্যায়ভিত্তিক শর্টকাট প্র্যাকটিস করুন।',
      'বিগত ৫ বছরের WBPSC পরীক্ষার কোশ্চেন ব্যাংক সলভ করা অত্যন্ত জরুরি।'
    ],
    faqs: [
      { q: 'WBCS পরীক্ষার জন্যও কি মক টেস্ট আছে?', a: 'হ্যাঁ, আমাদের প্ল্যাটফর্মে WBCS প্রিলিমস স্পেশাল জিকে এবং কারেন্ট অ্যাফেয়ার্স সেট রয়েছে।' }
    ]
  },
  'clerkship': {
    slug: 'clerkship',
    title: 'WBPSC Clerkship Mock Test 2026 – ফ্রি সম্পূর্ণ অনুশীলন সেট',
    englishTitle: 'WBPSC Clerkship Mock Test',
    description: 'পশ্চিমবঙ্গ ক্লার্কশিপ পরীক্ষার প্রিলিমস ও মেইন্স সিলেবাস অনুযায়ী তৈরি ফ্রি প্র্যাকটিস সেট।',
    metaDesc: 'WBPSC Clerkship প্রিলিমিনারি পরীক্ষার ফ্রি অনলাইন প্র্যাকটিস মক টেস্ট সিরিজ। ইংরেজি, অংক ও সাধারণ জ্ঞানের সিলেবাস ভিত্তিক প্রশ্ন ব্যাখ্যাসহ।',
    categoryId: 'clerkship',
    examPattern: {
      stages: ['১. পার্ট-১ প্রিলিমিনারি পরীক্ষা (MCQ)', '২. পার্ট-২ মেইনস পরীক্ষা (ডেসক্রিপটিভ বাংলা ও ইংরেজি)', '৩. কম্পিউটার টাইপিং ও বেসিক জ্ঞান'],
      duration: '১ ঘণ্টা ৩০ মিনিট',
      totalMarks: '১০০ নম্বর',
      negativeMarking: '০.২৫ নম্বর',
      subjects: [
        { name: 'ইংরেজি ভাষা (English)', marks: '৩০ নম্বর' },
        { name: 'জেনারেল স্টাডিজ (General Studies)', marks: '৪০ নম্বর' },
        { name: 'পাটিগণিত (Arithmetic)', marks: '৩০ নম্বর' }
      ]
    },
    syllabusBengali: [
      'ইংরেজি: Vocabulary, Grammar, Sentence Structure, Idioms & Phrases',
      'জেনারেল স্টাডিজ: বিজ্ঞান, ইতিহাস, ভারতের সংবিধান, কারেন্ট অ্যাফেয়ার্স ও খেলাধুলা',
      'পাটিগণিত: লসাগু-গসাগু, অংশীদারি কারবার, গড়, অনুপাত ও সমানুপাত, সরল সুদ, লাভ-ক্ষতি, সময় ও কার্য, সময় ও দূরত্ব'
    ],
    preparationTips: [
      'ক্লার্কশিপে ইংরেজিতে ৩০ নম্বর অন্যতম বড় বিষয়। ভালো স্কোরের জন্য প্রতিদিন ভোকাবুলারি ও এরর কারেকশন প্র্যাকটিস করুন।',
      'পার্ট-১ কোয়ালিফাই করলেই পার্ট-২ ডেসক্রিপটিভ লেখার সুযোগ পাবেন, তাই প্রথম থেকেই লেখার অভ্যাসও কিছুটা জারি রাখুন।'
    ],
    faqs: [
      { q: 'ক্লার্কশিপে কি কম্পিউটার টাইপিং জানা আবশ্যিক?', a: 'হ্যাঁ, পার্ট-১ ও পার্ট-২ পরীক্ষার পর আপনার কম্পিউটার টাইপিং টেস্ট নেওয়া হবে, যেখানে প্রতি মিনিটে ২০টি ইংরেজি শব্দ টাইপ করার দক্ষতা যাচাই করা হবে।' }
    ]
  },
  'railway': {
    slug: 'railway',
    title: 'Railway NTPC & Group D Free Mock Test 2026',
    englishTitle: 'Railway NTPC & Group D Mock Test',
    description: 'আরআরবি রেলওয়ে (NTPC, Group D, ALP) পরীক্ষার জন্য সম্পূর্ণ বাংলা ভাষায় প্রস্তুত করা বিশেষ মক টেস্ট সিরিজ।',
    metaDesc: 'রেলওয়ে গ্রুপ ডি ও এনটিপিসি পরীক্ষার সম্পূর্ণ বাংলায় অনলাইন মক টেস্ট দিন। জেনারেল সায়েন্স, ম্যাথস এবং রিজনিং সেকশনের নিখুঁত সলিউশনসহ।',
    categoryId: 'railway',
    examPattern: {
      stages: ['১. প্রথম স্তরের সিবিটি (CBT-1)', '২. দ্বিতীয় স্তরের সিবিটি (CBT-2 প্রযোজ্য ক্ষেত্রে)', '৩. শারীরিক পরিমাপ বা টাইপিং টেস্ট'],
      duration: '১ ঘণ্টা ৩০ মিনিট (৯০ মিনিট)',
      totalMarks: '১০০ নম্বর',
      negativeMarking: '১/৩ (প্রতিটি ভুল উত্তরের জন্য ০.৩৩ নম্বর কাটা যাবে)',
      subjects: [
        { name: 'জেনারেল সায়েন্স (পদার্থ, রসায়ন, জীবন বিজ্ঞান)', marks: '২৫ নম্বর' },
        { name: 'ম্যাথমেটিক্স (পাটিগণিত ও বীজগণিত)', marks: '২৫ নম্বর' },
        { name: 'জেনারেল ইন্টেলিজেন্স ও রিজনিং', marks: '৩০ নম্বর' },
        { name: 'জেনারেল অ্যাওয়ারনেস ও কারেন্ট অ্যাফেয়ার্স', marks: '২০ নম্বর' }
      ]
    },
    syllabusBengali: [
      'জীবন বিজ্ঞান, পদার্থবিজ্ঞান ও রসায়ন (সম্পূর্ণ Class 10 NCERT স্তর অনুযায়ী)',
      'পাটিগণিত, বীজগণিত, জ্যামিতি ও ত্রিকোণমিতি',
      'অ্যানালজি, সিললিজম, ভেন ডায়াগ্রাম, পাজল ও কোডিং',
      'কারেন্ট অ্যাফেয়ার্স, ভারতের সংস্কৃতি, বৈজ্ঞানিক গবেষণা ও ক্রীড়া ক্ষেত্রে ভারতের অবদান'
    ],
    preparationTips: [
      'রেলওয়ে পরীক্ষায় জেনারেল সায়েন্স সেকশনে প্রচুর প্রশ্ন আসে। তাই দশম শ্রেণীর বিজ্ঞানের বই খুঁটিয়ে পড়ুন।',
      'টাইম ম্যানেজমেন্ট খুবই গুরুত্বপূর্ণ, কারণ ৯০ মিনিটে ১০০টি প্রশ্নের উত্তর দিতে হবে।'
    ],
    faqs: [
      { q: 'রেলওয়ের পরীক্ষা কি বাংলা ভাষায় দেওয়া যায়?', a: 'হ্যাঁ, রেলওয়ের সমস্ত পরীক্ষা বাংলাসহ ১৫টি আঞ্চলিক ভাষায় দেওয়ার সুযোগ রয়েছে।' }
    ]
  }
};

export default function ExamSEOPage({ examSlug, mockTests, onStartTest, onGoBack, setView }: ExamSEOPageProps) {
  const data = examSEODataList[examSlug] || examSEODataList['wb-police'];
  
  // Filter mock tests for this specific category
  const filteredTests = mockTests.filter(t => t.categoryId === data.categoryId || t.examType === data.categoryId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 font-sans animate-fadeIn">
      {/* Back Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          হোমপেজে ফিরুন
        </button>
        <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-extrabold tracking-wider uppercase">
          Exam Preparation Hub
        </span>
      </div>

      {/* Hero Header Area */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-750 to-indigo-900 text-white rounded-[32px] p-6 md:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-white/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-[90%]">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-yellow-300">
            <Award className="w-4 h-4" />
            <span>১০০% ফ্রি অনলাইন প্রস্তুতি ২০২৬</span>
          </div>
          
          <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight md:leading-snug">
            {data.title}
          </h1>
          
          <p className="text-xs md:text-sm text-indigo-50 font-medium">
            {data.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] md:text-xs font-bold text-indigo-150 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{filteredTests.length} টি লাইভ মক টেস্ট</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>পূর্ণাঙ্গ সলিউশন ও ব্যাখ্যা</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>স্মার্ট স্পিড টাইমার</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Exam Information, Pattern, Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Syllabus & Pattern Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-850 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                পরীক্ষার ধরণ ও সিলেবাস (Exam Pattern & Syllabus)
              </h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                পশ্চিমবঙ্গ সরকারি সিলেবাস ভিত্তিক সঠিক প্রশ্নের মান ও প্যাটার্ন বিশ্লেষণ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">প্রশ্ন ও সময়সীমা</span>
                <p className="text-xs font-black text-slate-800 dark:text-white">মোট নম্বর: <span className="text-blue-600">{data.examPattern.totalMarks}</span></p>
                <p className="text-xs font-black text-slate-800 dark:text-white">সময়সীমা: <span className="text-blue-600">{data.examPattern.duration}</span></p>
                <p className="text-xs font-black text-slate-800 dark:text-white text-rose-500">নেগেটিভ মার্কিং: {data.examPattern.negativeMarking}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">নিয়োগের ধাপসমূহ</span>
                <ul className="space-y-1 text-xs font-bold text-slate-650 dark:text-slate-350">
                  {data.examPattern.stages.map((stage, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-500 text-xs">✔</span>
                      {stage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Subject Distribution */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">বিষয় ভিত্তিক নম্বর বিভাজন</h3>
              <div className="border border-slate-100 dark:border-slate-800/60 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-extrabold border-b border-slate-100 dark:border-slate-800">
                      <th className="p-3">বিষয় (Subjects)</th>
                      <th className="p-3 text-right">বরাদ্দ নম্বর (Marks)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.examPattern.subjects.map((sub, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800/40 font-bold text-slate-700 dark:text-slate-300">
                        <td className="p-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {sub.name}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-900 dark:text-white">{sub.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Bengali Syllabus */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">গুরুত্বপূর্ণ অধ্যায় ও সিলেবাস</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {data.syllabusBengali.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100/40 dark:border-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Preparation Tips Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              সেরা প্রস্তুতি টিপস (Preparation Tips)
            </h2>
            <div className="space-y-3">
              {data.preparationTips.map((tip, i) => (
                <div key={i} className="flex gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 shrink-0 flex items-center justify-center font-bold text-[11px]">
                    {i + 1}
                  </div>
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Frequently Asked Questions FAQ */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-500" />
              সাধারণ জিজ্ঞাসা (FAQ)
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <div key={i} className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/60 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-850 dark:text-white flex items-start gap-1.5">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Q:</span>
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-4">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: List of Mock Tests */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                ফ্রি মক টেস্ট লিস্ট
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                নিচের যেকোনো টেস্টে ক্লিক করে বিনামূল্যে পরীক্ষা শুরু করুন
              </p>
            </div>

            <div className="space-y-3">
              {filteredTests.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 border-dashed">
                  <span className="text-xs text-slate-400 font-bold">এই ক্যাটাগরিতে খুব শীঘ্রই মক টেস্ট যুক্ত করা হচ্ছে!</span>
                </div>
              ) : (
                filteredTests.map((test) => (
                  <div 
                    key={test.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full uppercase">
                        {test.examTypeBengali || 'Full Syllabus'}
                      </span>
                      <h3 className="text-xs font-black text-slate-850 dark:text-white group-hover:text-blue-600 transition-colors">
                        {test.bengaliTitle}
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 py-1 text-[10px] text-slate-450 dark:text-slate-400 font-bold border-y border-slate-100 dark:border-slate-800/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-medium">প্রশ্ন</span>
                        <span className="font-sans text-slate-700 dark:text-slate-200">{test.questions?.length || 0} টি</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-medium">পূর্ণমান</span>
                        <span className="font-sans text-slate-700 dark:text-slate-200">{test.questions?.length || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-medium">সময়</span>
                        <span className="font-sans text-slate-700 dark:text-slate-200">{test.durationMinutes} মি.</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartTest(test)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-95"
                    >
                      টেস্ট শুরু করুন (Start Test)
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
