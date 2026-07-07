import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, ArrowRight, ArrowLeft, TrendingUp, Sparkles, 
  ChevronRight, ChevronLeft, Megaphone, Calendar, Zap, 
  Bell, Award, CheckCircle2, Share2, ExternalLink, ShieldAlert,
  MapPin, Clock, BookOpen, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  categoryType: 'central' | 'west-bengal' | 'results' | 'admit' | 'announcement' | 'scholarship' | 'scheme';
  publishDate: string;
  badge?: 'breaking' | 'trending' | 'new' | null;
  description: string;
  thumbnail: {
    title: string;
    subtitle: string;
    color: string;
    icon: React.ReactNode;
  };
  details: {
    authority: string;
    vacancy?: string;
    qualification?: string;
    lastDate?: string;
    syllabus?: string[];
    applyUrl?: string;
  };
}

export const newsData: NewsItem[] = [
  {
    id: 'n1',
    title: 'WB Panchayat Recruitment 2026 বিজ্ঞপ্তি প্রকাশ',
    category: 'পশ্চিমবঙ্গ চাকরি',
    categoryType: 'west-bengal',
    publishDate: '২৪ জুন, ২০২৬',
    badge: 'breaking',
    description: 'পশ্চিমবঙ্গ পঞ্চায়েত ও গ্রামোন্নয়ন দপ্তরের অধীনে ৬৬৫২টি শূন্যপদে গ্রাম পঞ্চায়েত কর্মী, সহায়ক ও ডেটা এন্ট্রি অপারেটর নিয়োগের বিজ্ঞপ্তি প্রকাশিত হয়েছে। যেকোনো স্বীকৃত বোর্ড থেকে মাধ্যমিক/উচ্চ মাধ্যমিক পাশ প্রার্থীরা আবেদন করতে পারবেন।',
    thumbnail: {
      title: 'PANCHAYAT',
      subtitle: 'RECRUITMENT 2026',
      color: 'from-emerald-500 to-teal-600',
      icon: <Award className="w-5 h-5 text-emerald-100" />
    },
    details: {
      authority: 'West Bengal Panchayat & Rural Dev Department',
      vacancy: '৬,৬৫২ টি পদ',
      qualification: '৮ম শ্রেণী/মাধ্যমিক/উচ্চ মাধ্যমিক/কম্পিউটার জ্ঞান',
      lastDate: '২৫ জুলাই, ২০২৬',
      syllabus: ['পাটিগণিত ও সাধারণ গণিত', 'বাংলা ভাষা ও ব্যাকরণ', 'ইংরেজি ভাষা', 'জেনারেল নলেজ'],
      applyUrl: 'https://wbprd.gov.in'
    }
  },
    {
      id: 'n2',
      title: 'WB Police Constable Recruitment Update',
      category: 'পশ্চিমবঙ্গ চাকরি',
      categoryType: 'west-bengal',
      publishDate: '২৩ জুন, ২০২৬',
      badge: 'trending',
      description: 'পশ্চিমবঙ্গ পুলিশ রিক্রুটমেন্ট বোর্ড (WBPRB) দ্বারা কনস্টেবল পদের জন্য বিরাট আপডেট। পিইটি ও পিএমটি পরীক্ষার সময়সূচী পরিবর্তন সংক্রান্ত জরুরী বিজ্ঞপ্তি। প্রার্থীরা নিচে দেওয়া অফিসিয়াল লিংকে গিয়ে বিস্তারিত নোটিশ ডাউনলোড করতে পারবেন।',
      thumbnail: {
        title: 'WB POLICE',
        subtitle: 'CONSTABLE 2026',
        color: 'from-blue-600 to-indigo-800',
        icon: <Bell className="w-5 h-5 text-blue-100" />
      },
      details: {
        authority: 'West Bengal Police Recruitment Board (WBPRB)',
        vacancy: '১১,৭৪৯ টি পদ',
        qualification: 'মাধ্যমিক পাশ (Physical Standards applicable)',
        lastDate: '৩০ জুন, ২০২৬ (চলতি প্রসেস)',
        syllabus: ['জেনারেল অ্যাওয়ারনেস', 'প্রাথমিক গণিত', 'রিজনিং ও জিআই', 'ইংরেজি (১০ নম্বর)'],
        applyUrl: 'https://prb.wb.gov.in'
      }
    },
    {
      id: 'n3',
      title: 'ICDS Anganwadi Recruitment 2026',
      category: 'পশ্চিমবঙ্গ চাকরি',
      categoryType: 'west-bengal',
      publishDate: '২৩ জুন, ২০২৬',
      badge: 'new',
      description: 'পশ্চিমবঙ্গের বিভিন্ন জেলায় সমাজকল্যাণ দপ্তরের উদ্যোগে আইসিডিএস অঙ্গনওয়াড়ি কর্মী ও সহায়িকা পদে নতুন নিয়োগের আবেদন প্রক্রিয়া শুরু হয়েছে। শুধুমাত্র মহিলা প্রার্থীরা আবেদন করতে পারবেন।',
      thumbnail: {
        title: 'ICDS',
        subtitle: 'ANGANWADI 2026',
        color: 'from-pink-500 to-rose-600',
        icon: <Sparkles className="w-5 h-5 text-pink-100" />
      },
      details: {
        authority: 'Department of Women & Child Development, WB',
        vacancy: 'জেলা ভিত্তিক (আলাদা)',
        qualification: 'উচ্চ মাধ্যমিক পাশ (কর্মী) / মাধ্যমিক পাশ (সহায়িকা)',
        lastDate: '১৮ জুলাই, ২০২৬',
        syllabus: ['মাতৃভাষা রচনা', 'পাটিগণিত (৮ম শ্রেণী মান)', 'পুষ্টি ও জনস্বাস্থ্য', 'ইংরেজি ও সাধারণ জ্ঞান'],
        applyUrl: 'https://wbcdwdse.gov.in'
      }
    },
    {
      id: 'n4',
      title: 'SSC CHSL Notification Released',
      category: 'কেন্দ্রীয় চাকরি',
      categoryType: 'central',
      publishDate: '২২ জুন, ২০২৬',
      badge: 'new',
      description: 'স্টাফ সিলেকশন কমিশন (SSC) কর্তৃক কম্বাইন্ড হায়ার সেকেন্ডারি লেভেল (CHSL) ২০২৬ এর অফিসিয়াল বিজ্ঞপ্তি জারি করা হয়েছে। LDC, JSA এবং ডেটা এন্ট্রি অপারেটর পদে ৩৭১২টি শূন্যপদে আবেদন নেওয়া হচ্ছে।',
      thumbnail: {
        title: 'SSC CHSL',
        subtitle: 'EXAM 2026',
        color: 'from-sky-500 to-blue-700',
        icon: <Zap className="w-5 h-5 text-sky-100" />
      },
      details: {
        authority: 'Staff Selection Commission (SSC Central)',
        vacancy: '৩,৭১২ টি পদ',
        qualification: '১২তম শ্রেণী পাশ (উচ্চ মাধ্যমিক)',
        lastDate: '২৪ জুলাই, ২০২৬',
        syllabus: ['English Language', 'Quantitative Aptitude', 'General Intelligence', 'General Awareness'],
        applyUrl: 'https://ssc.gov.in'
      }
    },
    {
      id: 'n5',
      title: 'Railway Group D New Vacancy',
      category: 'কেন্দ্রীয় চাকরি',
      categoryType: 'central',
      publishDate: '২২ জুন, ২০২৬',
      badge: null,
      description: 'রেলওয়ে রিক্রুটমেন্ট বোর্ড (RRB) দ্বারা ভারতীয় রেলের বিভিন্ন জোনে লেভেল ১ (Group D) পদের জন্য বিশাল নিয়োগের ঘোষণা। ট্র্যাক মেইনটেনার, অ্যাসিস্ট্যান্ট পয়েন্টস-ম্যান এবং অন্যান্য টেকনিক্যাল পদে ১ লক্ষাধিক পদে আবেদন প্রক্রিয়া শুরু হতে চলেছে।',
      thumbnail: {
        title: 'RAILWAY',
        subtitle: 'GROUP D 2026',
        color: 'from-red-600 to-orange-700',
        icon: <TrendingUp className="w-5 h-5 text-red-100" />
      },
      details: {
        authority: 'Railway Recruitment Boards (RRB)',
        vacancy: '১,০৩,৭৬৯ টি আনুমানিক পদ',
        qualification: '১০ম শ্রেণী পাশ অথবা ITI সার্টিফিকেট',
        lastDate: '৩০ আগস্ট, ২০২৬ (সম্ভাব্য)',
        syllabus: ['General Science (পদার্থ, রসায়ন, জীব)', 'Mathematics', 'General Intelligence and Reasoning', 'Current Affairs & GK'],
        applyUrl: 'https://indianrailways.gov.in'
      }
    },
    {
      id: 'n6',
      title: 'DA বৃদ্ধি নিয়ে রাজ্য সরকারের ঘোষণা',
      category: 'সরকারি ঘোষণা',
      categoryType: 'announcement',
      publishDate: '২১ জুন, ২০২৬',
      badge: 'trending',
      description: 'রাজ্য সরকারি কর্মীদের জন্য সুখবর। রাজ্য বাজেটে নতুন মহার্ঘ ভাতা (DA) ৪% বৃদ্ধির ঘোষণা করলেন মুখ্যমন্ত্রী। ১ জুলাই ২০২৬ থেকে এই বর্ধিত ডিএ কার্যকর হবে বলে অর্থ দপ্তরের নির্দেশিকায় জানানো হয়েছে।',
      thumbnail: {
        title: 'GOVT',
        subtitle: 'ANNOUNCEMENT',
        color: 'from-purple-600 to-violet-800',
        icon: <Megaphone className="w-5 h-5 text-purple-100" />
      },
      details: {
        authority: 'পশ্চিমবঙ্গ সরকার অর্থ দপ্তর',
        qualification: 'সকল কর্মরত ও অবসরপ্রাপ্ত রাজ্য সরকারি কর্মচারী',
        lastDate: 'কার্যকরী তারিখ: ১ জুলাই, ২০২৬'
      }
    },
    {
      id: 'n7',
      title: 'লক্ষ্মীর ভান্ডার নতুন আপডেট',
      category: 'প্রকল্প আপডেট',
      categoryType: 'scheme',
      publishDate: '২০ জুন, ২০২৬',
      badge: null,
      description: 'পশ্চিমবঙ্গ সরকারের "লক্ষ্মীর ভান্ডার" প্রকল্প নিয়ে এল নতুন সুখবর। এখন থেকে ২৫ বছর বয়স হলেই মহিলারা সরাসরি আবেদন করতে পারবেন এবং ব্যাংক অ্যাকাউন্টে আধার লিঙ্কিং বাধ্যতামূলক করার পাশাপাশি আবেদন প্রক্রিয়া আরও সহজ করা হয়েছে।',
      thumbnail: {
        title: 'LAKSHMIR',
        subtitle: 'BHANDAR 2026',
        color: 'from-amber-500 to-orange-600',
        icon: <CheckCircle2 className="w-5 h-5 text-amber-100" />
      },
      details: {
        authority: 'নারী ও শিশু কল্যাণ এবং সমাজকল্যাণ দপ্তর, পশ্চিমবঙ্গ',
        qualification: 'পশ্চিমবঙ্গের স্থায়ী বাসিন্দা ২৫-৬০ বছর বয়সী মহিলারা',
        lastDate: 'উন্মুক্ত (দুয়ারে সরকার ক্যাম্প বা অনলাইন)'
      }
    },
    {
      id: 'n8',
      title: 'কৃষক বন্ধু প্রকল্প আপডেট',
      category: 'প্রকল্প আপডেট',
      categoryType: 'scheme',
      publishDate: '১৯ জুন, ২০২৬',
      badge: null,
      description: 'কৃষক বন্ধু (নতুন) প্রকল্পের অধীনে রবি মরশুমের অনুদানের টাকা সরাসরি ব্যাংক অ্যাকাউন্টে ট্রান্সফার শুরু হয়েছে। রাজ্যের প্রায় ১ কোটি কৃষক এই সুবিধা পেতে চলেছেন। তালিকায় নাম আছে কিনা তা ঘরে বসেই মোবাইলের মাধ্যমে পরীক্ষা করুন।',
      thumbnail: {
        title: 'KRISHAK',
        subtitle: 'BANDHU 2026',
        color: 'from-emerald-600 to-green-700',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-100" />
      },
      details: {
        authority: 'পশ্চিমবঙ্গ কৃষি বিভাগ',
        qualification: 'কৃষিজমি থাকা নথিভুক্ত পশ্চিমবঙ্গের কৃষক',
        lastDate: 'স্ট্যাটাস চেক লিংক সচল'
      }
    },
    {
      id: 'n9',
      title: 'Primary TET Result 2026 ঘোষিত',
      category: 'রেজাল্ট',
      categoryType: 'results',
      publishDate: '১৮ জুন, ২০২৬',
      badge: 'breaking',
      description: 'পশ্চিমবঙ্গ প্রাথমিক শিক্ষা পর্ষদ (WBBPE) দ্বারা আয়োজিত প্রাইমারি টেট (TET) পরীক্ষার চূড়ান্ত ফলাফল প্রকাশিত হয়েছে। প্রার্থীরা রোল নম্বর এবং রেজিস্ট্রেশন নম্বর দিয়ে পর্ষদের ওয়েবসাইট থেকে স্কোরকার্ড ডাউনলোড করতে পারবেন।',
      thumbnail: {
        title: 'PRIMARY',
        subtitle: 'TET RESULT',
        color: 'from-rose-600 to-red-800',
        icon: <Award className="w-5 h-5 text-rose-100" />
      },
      details: {
        authority: 'West Bengal Board of Primary Education (WBBPE)',
        lastDate: 'স্কোরকার্ড ডাউনলোডের শেষ তারিখ নেই',
        applyUrl: 'https://wbbpe.org'
      }
    },
    {
      id: 'n10',
      title: 'WB Police SI Admit Card 2026 ডাউনলোডের তারিখ',
      category: 'অ্যাডমিট কার্ড',
      categoryType: 'admit',
      publishDate: '১৭ জুন, ২০২৬',
      badge: 'new',
      description: 'পশ্চিমবঙ্গ পুলিশের সাব-ইন্সপেক্টর (SI) পদের প্রিলিমিনারি পরীক্ষার অ্যাডমিট কার্ড ডাউনলোডের বিজ্ঞপ্তি প্রকাশিত হয়েছে। প্রার্থীরা আগামী ২০ জুন থেকে নিজেদের অ্যাপ্লিকেশন আইডি এবং জন্মতারিখ দিয়ে অ্যাডমিট ডাউনলোড করতে পারবেন।',
      thumbnail: {
        title: 'ADMIT',
        subtitle: 'POLICE SI',
        color: 'from-orange-500 to-amber-650',
        icon: <Newspaper className="w-5 h-5 text-orange-100" />
      },
      details: {
        authority: 'West Bengal Police Recruitment Board (WBPRB)',
        lastDate: 'পরীক্ষার তারিখ: ৫ জুলাই, ২০২৬',
        applyUrl: 'https://prb.wb.gov.in'
      }
    }
  ];

export default function KhoborSection({ onNewsClick }: { onNewsClick?: (item: NewsItem) => void } = {}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showAllModal, setShowAllModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 'all', label: 'সব খবর', color: 'bg-slate-100 text-slate-750' },
    { id: 'job-news', label: 'চাকরির খবর', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' },
    { id: 'announcement', label: 'সরকারি ঘোষণা', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
    { id: 'exam-update', label: 'পরীক্ষা আপডেট', color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400' },
    { id: 'admit', label: 'অ্যাডমিট কার্ড', color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' },
    { id: 'results', label: 'রেজাল্ট', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' },
    { id: 'scholarship', label: 'স্কলারশিপ', color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400' },
    { id: 'scheme', label: 'প্রকল্প আপডেট', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' }
  ];

  // Map category tab ID to types filter
  const getFilteredNews = (catId: string, search: string = '') => {
    let filtered = newsData;
    
    // Category filter
    if (catId === 'job-news') {
      filtered = newsData.filter(item => item.categoryType === 'central' || item.categoryType === 'west-bengal');
    } else if (catId === 'announcement') {
      filtered = newsData.filter(item => item.categoryType === 'announcement');
    } else if (catId === 'exam-update') {
      filtered = newsData.filter(item => item.id === 'n4' || item.id === 'n2'); // manual fit for mock
    } else if (catId === 'admit') {
      filtered = newsData.filter(item => item.categoryType === 'admit');
    } else if (catId === 'results') {
      filtered = newsData.filter(item => item.categoryType === 'results');
    } else if (catId === 'scholarship') {
      filtered = newsData.filter(item => item.categoryType === 'scholarship');
    } else if (catId === 'scheme') {
      filtered = newsData.filter(item => item.categoryType === 'scheme');
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const filteredNews = getFilteredNews(activeCategory);
  const totalSlides = filteredNews.length;

  // Auto Scroll logic
  useEffect(() => {
    if (isAutoPlaying && totalSlides > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, totalSlides, activeCategory]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (totalSlides > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    if (totalSlides > 0) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const selectCategoryHandler = (catId: string) => {
    setActiveCategory(catId);
    setCurrentIndex(0);
    setIsAutoPlaying(true);
  };

  const getTagColor = (type: string) => {
    switch (type) {
      case 'central':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'west-bengal':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'results':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      case 'admit':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
      case 'announcement':
      case 'scheme':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/50';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const renderWideThumbnail = (item: NewsItem) => {
    switch (item.id) {
      case 'n1': // Panchayat
        return (
          <div className="w-[110px] h-14 shrink-0 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/50 p-2 flex items-center gap-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 leading-tight text-left">
              <div className="text-[7.5px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tighter truncate">WB PANCHAYAT</div>
              <div className="text-[6.5px] font-black text-emerald-600/85 dark:text-emerald-500 uppercase tracking-tighter truncate leading-none">RECRUITMENT</div>
              <div className="text-[7.5px] font-bold text-emerald-500 font-mono">2026</div>
            </div>
          </div>
        );
      case 'n2': // WB Police
        return (
          <div className="w-[110px] h-14 shrink-0 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white border border-blue-900/40 p-2 flex items-center gap-1.5 shadow-sm">
            <div className="min-w-0 flex-1 leading-tight text-left">
              <div className="text-[7.5px] font-black text-blue-100 uppercase tracking-tighter truncate">WB POLICE</div>
              <div className="text-[6.5px] font-black text-blue-300 uppercase tracking-tighter truncate leading-none">CONSTABLE</div>
              <div className="text-[7.5px] font-bold text-amber-400 font-mono">2026</div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-4 h-4 fill-slate-900" />
            </div>
          </div>
        );
      case 'n3': // ICDS
        return (
          <div className="w-[110px] h-14 shrink-0 rounded-xl bg-gradient-to-r from-pink-700 to-rose-900 text-white border border-pink-900/40 p-2 flex items-center gap-1.5 shadow-sm">
            <div className="min-w-0 flex-1 leading-tight text-left">
              <div className="text-[7.5px] font-black text-pink-100 uppercase tracking-tighter truncate">ICDS</div>
              <div className="text-[6.5px] font-black text-pink-300 uppercase tracking-tighter truncate leading-none">ANGANWADI</div>
              <div className="text-[7.5px] font-bold text-rose-300 font-mono">2026</div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-pink-400/20 text-pink-200 flex items-center justify-center shrink-0 border border-pink-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        );
      case 'n4': // SSC CHSL
        return (
          <div className="w-[110px] h-14 shrink-0 rounded-xl bg-gradient-to-r from-sky-900 to-blue-950 text-white border border-sky-900/40 p-2 flex items-center gap-1.5 shadow-sm">
            <div className="min-w-0 flex-1 leading-tight text-left">
              <div className="text-[7.5px] font-black text-sky-100 uppercase tracking-tighter truncate">SSC CHSL</div>
              <div className="text-[6.5px] font-black text-sky-300 uppercase tracking-tighter truncate leading-none">EXAM</div>
              <div className="text-[7.5px] font-bold text-sky-300 font-mono">2026</div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
        );
      case 'n5': // Railway
        return (
          <div className="w-[110px] h-14 shrink-0 rounded-xl bg-gradient-to-r from-red-800 to-orange-950 text-white border border-red-900/40 p-2 flex items-center gap-1.5 shadow-sm">
            <div className="min-w-0 flex-1 leading-tight text-left">
              <div className="text-[7.5px] font-black text-red-100 uppercase tracking-tighter truncate">RAILWAY</div>
              <div className="text-[6.5px] font-black text-orange-300 uppercase tracking-tighter truncate leading-none">GROUP D</div>
              <div className="text-[7.5px] font-bold text-amber-400 font-mono">2026</div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        );
      default:
        return (
          <div className={`w-[110px] h-14 shrink-0 rounded-xl bg-gradient-to-r ${item.thumbnail.color} text-white p-2 flex items-center gap-1.5 shadow-sm`}>
            <div className="min-w-0 flex-1 leading-tight text-left">
              <div className="text-[7.5px] font-black uppercase tracking-tighter truncate">{item.thumbnail.title}</div>
              <div className="text-[6.5px] font-black uppercase tracking-tighter opacity-85 truncate leading-none">{item.thumbnail.subtitle}</div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
              {item.thumbnail.icon}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-800/80 rounded-[24px] p-5 shadow-sm space-y-4 font-sans relative overflow-hidden transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-sm">
            <Newspaper className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            সর্বশেষ খবর ও সরকারি ঘোষণা
          </h3>
        </div>

        <button 
          onClick={() => {
            setSearchTerm('');
            setShowAllModal(true);
          }}
          className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-all group cursor-pointer"
        >
          <span>সব দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* HORIZONTAL CATEGORY SCROLL BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1 touch-pan-x">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategoryHandler(cat.id)}
              className={`text-[11px] font-black px-3.5 py-1.5 rounded-full shrink-0 transition-all cursor-pointer border ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* VERTICAL LIST OF NEWS ITEMS */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredNews.slice(0, 5).map((item) => (
          <div 
            key={item.id}
            onClick={() => {
              if (onNewsClick) {
                onNewsClick(item);
              } else {
                setSelectedNews(item);
              }
            }}
            className="flex items-center justify-between gap-3 sm:gap-4 py-3 first:pt-1 last:pb-1 group hover:bg-slate-50/50 dark:hover:bg-slate-850/20 cursor-pointer transition-colors"
          >
            {/* Left Thumbnail (Wide, matching screenshot) */}
            {renderWideThumbnail(item)}

            {/* Content Center */}
            <div className="flex-grow min-w-0 space-y-1 pl-1">
              <h4 className="text-[12px] sm:text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full border leading-none font-sans ${getTagColor(item.categoryType)}`}>
                  {item.category}
                </span>
                {item.badge === 'breaking' && (
                  <span className="bg-rose-500 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5 animate-pulse">
                    <Zap className="w-2.5 h-2.5 fill-white" /> BREAKING
                  </span>
                )}
                {item.badge === 'trending' && (
                  <span className="bg-amber-500 text-slate-900 text-[7.5px] font-black px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" /> TRENDING
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: Date */}
            <div className="shrink-0 text-right pl-2">
              <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 font-sans whitespace-nowrap">
                {item.publishDate}
              </span>
            </div>
          </div>
        ))}
        {filteredNews.length === 0 && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 font-bold text-xs">
            বর্তমানে কোনো খবর উপলব্ধ নেই।
          </div>
        )}
      </div>

      {/* FULL ARTICLE DETAIL OVERLAY MODAL */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 font-sans"
            >
              {/* Header Image Header */}
              <div className={`p-6 text-white bg-gradient-to-br ${selectedNews.thumbnail.color} relative overflow-hidden flex flex-col justify-between min-h-[120px]`}>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedNews(null)}
                    className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-sm font-bold backdrop-blur-sm cursor-pointer border border-white/10 active:scale-95"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 border border-white/25 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full font-sans leading-none">
                      {selectedNews.category}
                    </span>
                    {selectedNews.badge && (
                      <span className="bg-amber-400 text-slate-950 text-[8.5px] font-extrabold px-2 py-0.5 rounded-full font-sans uppercase leading-none tracking-wider">
                        {selectedNews.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-black leading-tight">
                    {selectedNews.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80 font-sans mt-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>প্রকাশের তারিখ: {selectedNews.publishDate}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>বিস্তারিত তথ্য ও খবরাখবর</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedNews.description}
                  </p>
                </div>

                {/* Technical Recruitment Specifications Box */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <h5 className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>গুরুত্বপূর্ণ বিবরণসমূহ</span>
                  </h5>

                  <div className="grid grid-cols-2 gap-3 text-[11px] font-bold">
                    {selectedNews.details.authority && (
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-slate-400 block text-[9.5px]">নিয়োগকারী কর্তৃপক্ষ</span>
                        <span className="text-slate-700 dark:text-slate-200">{selectedNews.details.authority}</span>
                      </div>
                    )}
                    {selectedNews.details.vacancy && (
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[9.5px]">মোট শূন্যপদ</span>
                        <span className="text-slate-700 dark:text-slate-200">{selectedNews.details.vacancy}</span>
                      </div>
                    )}
                    {selectedNews.details.qualification && (
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[9.5px]">যোগ্যতা</span>
                        <span className="text-slate-700 dark:text-slate-200">{selectedNews.details.qualification}</span>
                      </div>
                    )}
                    {selectedNews.details.lastDate && (
                      <div className="space-y-0.5 col-span-2 border-t border-slate-200/50 dark:border-slate-800/40 pt-2">
                        <span className="text-slate-400 block text-[9.5px]">আবেদনের শেষ তারিখ / সময়সীমা</span>
                        <span className="text-rose-500 dark:text-rose-455 font-extrabold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {selectedNews.details.lastDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exam Syllabus Details */}
                {selectedNews.details.syllabus && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>পরীক্ষার নির্ধারিত সিলেবাস</span>
                    </h5>
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedNews.details.syllabus.map((s, idx) => (
                        <li key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2 rounded-xl text-[10.5px] text-slate-700 dark:text-slate-300 font-bold">
                          ✓ {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex gap-2.5 pt-2">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedNews.title,
                          text: selectedNews.description,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(`${selectedNews.title} - ${selectedNews.description}`);
                        alert('খবর সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে!');
                      }
                    }}
                    className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-650 dark:text-slate-300 border border-slate-150 dark:border-slate-800 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    title="Share News"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {selectedNews.details.applyUrl ? (
                    <a
                      href={selectedNews.details.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-550 hover:to-indigo-550 text-white text-[11.5px] font-black rounded-xl shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>অফিসিয়াল লিংকে যান / আবেদন করুন</span>
                    </a>
                  ) : (
                    <button 
                      onClick={() => setSelectedNews(null)}
                      className="flex-1 h-11 bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-[11.5px] font-black rounded-xl flex items-center justify-center border border-slate-150 dark:border-slate-800 active:scale-98 transition-all cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW ALL NEWS OVERLAY MODAL */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      সর্বশেষ খবর ও সরকারি ঘোষণা সমূহ
                    </h3>
                    <p className="text-[9.5px] text-slate-400">মোট {newsData.length} টি খবর উপলব্ধ</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowAllModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-400 dark:text-slate-350 flex items-center justify-center text-xs font-bold active:scale-95"
                >
                  ✕
                </button>
              </div>

              {/* SEARCH BAR & QUICK FILTERS */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
                {/* Search Box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-[50%] translate-y-[-50%] text-slate-400" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="খবর বা চাকরির নাম লিখে খুঁজুন..." 
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold text-slate-700 dark:text-slate-250 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Subcategory selection inside all */}
                <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none touch-pan-x">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => selectCategoryHandler(cat.id)}
                      className={`text-[10px] font-black px-3 py-1 rounded-full shrink-0 border ${
                        activeCategory === cat.id 
                          ? 'bg-indigo-600 text-white border-transparent'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-450 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEWS LIST SCROLLER */}
              <div className="flex-1 overflow-y-auto p-4.5 space-y-3.5">
                {getFilteredNews(activeCategory, searchTerm).length > 0 ? (
                  getFilteredNews(activeCategory, searchTerm).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        if (onNewsClick) {
                          setShowAllModal(false);
                          onNewsClick(item);
                        } else {
                          setSelectedNews(item);
                        }
                      }}
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-850/30 transition-all duration-300 cursor-pointer shadow-sm"
                    >
                      {/* Left Thumbnail */}
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-gradient-to-br p-0.5 flex flex-col justify-between overflow-hidden relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.thumbnail.color} opacity-90`} />
                        <div className="z-10 p-1 flex flex-col justify-between h-full text-white font-sans text-center">
                          <div className="flex justify-center items-center h-4">
                            {item.thumbnail.icon}
                          </div>
                          <div>
                            <div className="text-[6.5px] font-black uppercase tracking-tighter leading-none">
                              {item.thumbnail.title}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Center */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border leading-none font-sans ${getTagColor(item.categoryType)}`}>
                            {item.category}
                          </span>
                          {item.badge && (
                            <span className="bg-rose-500 text-white text-[7.5px] font-black px-1 py-0.5 rounded leading-none">
                              {item.badge.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <h4 className="text-[12px] font-black text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[8.5px] font-bold text-slate-400 font-sans">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{item.publishDate}</span>
                        </div>
                      </div>

                      {/* Chevron Right */}
                      <div className="shrink-0 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold">খোঁজা হয়েছে কিন্তু কোনো খবর পাওয়া যায়নি।</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-center">
                <button
                  onClick={() => setShowAllModal(false)}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-250 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-[11px] font-black rounded-xl active:scale-95 transition-all cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
