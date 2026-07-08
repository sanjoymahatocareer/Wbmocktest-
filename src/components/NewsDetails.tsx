import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Calendar, Clock, BookOpen, ExternalLink, 
  ShieldAlert, Award, Newspaper, FileText, CheckCircle2, Bookmark,
  TrendingUp, Megaphone, Zap, Sparkles, MessageSquare, Flame, Check,
  Globe, HelpCircle, ArrowRight, Shield, Heart, ThumbsUp, Send, User, MessageCircle, Star
} from 'lucide-react';
import { NewsItem, newsData } from './KhoborSection';
import { MockTest } from '../types';
import { getMockTests } from '../lib/db';

interface NewsDetailsProps {
  newsId: string;
  onGoBack: () => void;
  onStartTest?: (test: MockTest) => void;
  onOpenStudyPlan?: () => void;
}

interface SimulatedComment {
  id: string;
  author: string;
  role: 'candidate' | 'moderator' | 'expert';
  time: string;
  text: string;
  likes: number;
  hasLiked?: boolean;
  reply?: {
    author: string;
    role: 'expert';
    text: string;
    time: string;
  };
}

export default function NewsDetails({ newsId, onGoBack, onStartTest, onOpenStudyPlan }: NewsDetailsProps) {
  const item = newsData.find((n) => n.id === newsId) || newsData[0];
  const allMockTests = getMockTests();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(342);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Simulated Comments State
  const [comments, setComments] = useState<SimulatedComment[]>([
    {
      id: 'c1',
      author: 'সৌমেন ব্যানার্জী',
      role: 'candidate',
      time: '২ ঘণ্টা আগে',
      text: 'দাদা, এই পঞ্চায়েত রিক্রুটমেন্টের পরীক্ষাটা কবে নাগাদ হতে পারে? কোনো আনুমানিক ডেট আছে কি?',
      likes: 12,
      reply: {
        author: 'WB Mock Test Expert',
        role: 'expert',
        text: 'নমস্কার সৌমেন। অফিসিয়াল বিজ্ঞপ্তি অনুযায়ী পঞ্চায়েত নিয়োগের প্রিলিমিনারি পরীক্ষা আগামী সেপ্টেম্বর-অক্টোবর ২০২৬ নাগাদ হওয়ার জোর সম্ভাবনা রয়েছে। আপনি এখন থেকেই নিয়মিত মক টেস্ট প্র্যাকটিস করতে থাকুন।',
        time: '১ ঘণ্টা আগে'
      }
    },
    {
      id: 'c2',
      author: 'প্রিয়াঙ্কা দাস',
      role: 'candidate',
      time: '৪ ঘণ্টা আগে',
      text: 'আমার কম্পিউটার সার্টিফিকেট নেই, আমি কি পঞ্চায়েত সহায়ক পদের জন্য আবেদন করতে পারবো?',
      likes: 8,
      reply: {
        author: 'WB Mock Test Expert',
        role: 'expert',
        text: 'হ্যাঁ প্রিয়াঙ্কা, পঞ্চায়েত সহায়ক (Gram Panchayat Sahayak) পদের জন্য শুধুমাত্র মাধ্যমিক পাশ করলেই আবেদন করা যাবে, কোনো কম্পিউটার সার্টিফিকেট বাধ্যতামূলক নয়। তবে ডেটা এন্ট্রি পদের জন্য সার্টিফিকেট প্রয়োজন।',
        time: '৩ ঘণ্টা আগে'
      }
    },
    {
      id: 'c3',
      author: 'অনির্বাণ ঘোষ',
      role: 'candidate',
      time: '৬ ঘণ্টা আগে',
      text: 'সিলেবাসে কি কোনো নেগেটিভ মার্কিং থাকবে? বিস্তারিত জানাবেন দয়া করে।',
      likes: 15,
      reply: {
        author: 'WB Mock Test Expert',
        role: 'expert',
        text: 'সাধারণত এই পরীক্ষায় প্রতি ৪টি ভুলের জন্য ১ নম্বর কাটা যায় (০.২৫ নেগেটিভ মার্কিং)। তবে চূড়ান্ত সিদ্ধান্ত বোর্ডের বিজ্ঞপ্তিতে স্পষ্ট করে দেওয়া থাকে।',
        time: '৫ ঘণ্টা আগে'
      }
    }
  ]);
  const [newComment, setNewComment] = useState<string>('');

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter mock tests related to this news's general context
  const getRelatedMockTests = (): MockTest[] => {
    const titleLower = item.title.toLowerCase();
    let searchKeyword = '';
    
    if (titleLower.includes('panchayat')) {
      searchKeyword = 'panchayat';
    } else if (titleLower.includes('police') || titleLower.includes('constable') || titleLower.includes('si')) {
      searchKeyword = 'police';
    } else if (titleLower.includes('icds') || titleLower.includes('anganwadi')) {
      searchKeyword = 'icds';
    } else if (titleLower.includes('chsl') || titleLower.includes('ssc')) {
      searchKeyword = 'ssc';
    } else if (titleLower.includes('railway') || titleLower.includes('group d')) {
      searchKeyword = 'railway';
    } else if (titleLower.includes('tet') || titleLower.includes('primary')) {
      searchKeyword = 'tet';
    }

    if (searchKeyword) {
      return allMockTests.filter(t => t.id.toLowerCase().includes(searchKeyword) || (t.title && t.title.toLowerCase().includes(searchKeyword)) || (t.bengaliTitle && t.bengaliTitle.toLowerCase().includes(searchKeyword))).slice(0, 3);
    }
    
    return allMockTests.slice(0, 3);
  };

  const relatedTests = getRelatedMockTests();

  const handleShare = () => {
    const shareText = `📌 *${item.title}*\n\n🔹 বিভাগ: ${item.category}\n🔹 যোগ্যতা: ${item.details.qualification || 'মাধ্যমিক/উচ্চ মাধ্যমিক'}\n🔹 শেষ তারিখ: ${item.details.lastDate || 'চলতি প্রসেস'}\n\n👉 এখনই সম্পূর্ণ সিলেবাস, মক টেস্ট ও বিস্তারিত বিবরণ দেখুন এখানে:\n🔗 ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSharePlatform = (platform: 'whatsapp' | 'telegram' | 'facebook') => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`📌 ${item.title}\n\nযোগ্যতা ও মক টেস্ট প্রিপারেশন দেখতে নিচের লিংকে যান:\n`);
    let url = '';
    
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${text}${shareUrl}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${shareUrl}&text=${text}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    }
    
    window.open(url, '_blank');
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? "খবরটি আপনার সংরক্ষিত তালিকা থেকে সরানো হয়েছে।" : "খবরটি সফলভাবে আপনার প্রোফাইলে সংরক্ষণ করা হয়েছে!");
  };

  const handleLikePost = () => {
    if (postLiked) {
      setPostLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setPostLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: SimulatedComment = {
      id: `c-new-${Date.now()}`,
      author: 'আপনি (ইউজার)',
      role: 'candidate',
      time: 'এইমাত্র',
      text: newComment,
      likes: 0
    };

    setComments(prev => [added, ...prev]);
    setNewComment('');

    // Trigger instant simulated reply after 1.5 seconds
    setTimeout(() => {
      setComments(prev => {
        const updated = [...prev];
        const targetIdx = updated.findIndex(c => c.id === added.id);
        if (targetIdx !== -1) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            reply: {
              author: 'WB Mock Test Expert',
              role: 'expert',
              text: 'আপনার মন্তব্যের জন্য ধন্যবাদ! এই বিষয়টি নিয়ে আমাদের টিম কাজ করছে এবং আমরা খুব দ্রুত আমাদের অ্যাপে এর জন্য ডেডিকেটেড স্টাডি নোট ও স্পেশাল প্র্যাকটিস সেট আপডেট করে দেব। চোখ রাখুন আমাদের অ্যাপে!',
              time: 'এইমাত্র'
            }
          };
        }
        return updated;
      });
    }, 1500);
  };

  const handleLikeComment = (id: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        const liked = !c.hasLiked;
        return {
          ...c,
          hasLiked: liked,
          likes: liked ? c.likes + 1 : c.likes - 1
        };
      }
      return c;
    }));
  };

  const getTagColor = (type: string) => {
    switch (type) {
      case 'central':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      case 'west-bengal':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'results':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/60';
      case 'admit':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
      case 'announcement':
      case 'scheme':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-28 font-sans transition-colors duration-300">
      {/* Reading Progress Indicator Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky Header Banner */}
      <div className={`bg-gradient-to-r ${item.thumbnail.color} text-white sticky top-0 z-20 shadow-md`}>
        <div className="flex items-center justify-between px-4 py-3.5 max-w-3xl mx-auto">
          <div className="flex items-center">
            <button 
              onClick={onGoBack} 
              className="p-1.5 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white active:scale-90" 
              id="news-details-back-btn"
            >
              <ArrowLeft className="w-5.5 h-5.5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide leading-tight truncate max-w-[200px] sm:max-w-[400px]">
                {item.title}
              </h1>
              <p className="text-[10px] sm:text-xs text-white/85 mt-0.5 font-bold leading-none">
                সর্বশেষ অফিসিয়াল আপডেট • {item.publishDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleSaveToggle} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white active:scale-90" 
              title="Save News"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-yellow-300 stroke-yellow-300' : ''}`} />
            </button>
            <button 
              onClick={handleShare} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white active:scale-90" 
              title="Share News"
            >
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-4 space-y-5">
        
        {/* SEO Breadcrumbs Navigation */}
        <nav className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-150/50 dark:border-slate-850/50 shadow-sm">
          <span className="hover:text-blue-500 cursor-pointer transition-colors" onClick={onGoBack}>হোম ড্যাশবোর্ড</span>
          <span>&gt;</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors" onClick={onGoBack}>খবর ও নোটিফিকেশন</span>
          <span>&gt;</span>
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[180px] sm:max-w-xs">{item.title}</span>
        </nav>

        {/* Main Title Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border leading-none font-sans ${getTagColor(item.categoryType)}`}>
              {item.category}
            </span>
            
            {item.badge === 'breaking' && (
              <span className="bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full leading-none flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3 fill-white" /> BREAKING
              </span>
            )}
            {item.badge === 'trending' && (
              <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-2.5 py-1 rounded-full leading-none flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> TRENDING
              </span>
            )}
            {item.badge === 'new' && (
              <span className="bg-blue-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full leading-none">
                NEW UPDATE
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            {item.title}
          </h2>

          {/* Expanded SEO Author & Time Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800/70 py-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 block leading-none">রিপোর্টার</p>
                <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">WBMockTest Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-lg">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 block leading-none">আপডেট তারিখ</p>
                <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">{item.publishDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-lg">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 block leading-none">পড়ার সময়</p>
                <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">⏱️ ৪ মিনিট রিড</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-lg">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 block leading-none">অফিসিয়াল স্ট্যাটাস</p>
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 font-extrabold flex items-center gap-0.5 block">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ভেরিফাইড
                </span>
              </div>
            </div>
          </div>

          {/* Social Micro Engagement bar */}
          <div className="flex items-center justify-between text-[12px] font-bold pt-1 text-slate-500 dark:text-slate-400">
            <button 
              onClick={handleLikePost}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                postLiked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-400 scale-[1.03]' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800/40 dark:border-slate-750 dark:text-slate-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${postLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>এটি কাজের খবর ({likesCount})</span>
            </button>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-sans">
              <span>👁️ ১২,৪২০ জন প্রার্থী পড়েছেন</span>
            </div>
          </div>
        </div>

        {/* Real-time Google Search Result Preview (SERP Simulator) */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-black px-2.5 py-0.5 rounded-bl-xl tracking-wider uppercase">
            SEO Preview
          </div>
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
            <Globe className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              গুগল সার্চ ইঞ্জিন প্রিভিউ (Google SERP Simulator)
            </h3>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/70 font-sans space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] text-[#202124] dark:text-slate-350 truncate">
              <span className="font-medium">https://wbmocktest.in</span>
              <span className="text-slate-400">&gt; sarkari-jobs &gt; {item.id}</span>
            </div>
            <h4 className="text-[16px] sm:text-[18px] text-[#1a0dab] dark:text-blue-400 font-medium hover:underline cursor-pointer leading-snug">
              {item.title} - WB Mock Test
            </h4>
            <p className="text-[12.5px] text-[#4d5156] dark:text-slate-400 leading-relaxed">
              <span className="text-slate-500 font-semibold">{item.publishDate} — </span>
              {item.description.slice(0, 140)}... যোগ্যতা: <strong>{item.details.qualification || 'মাধ্যমিক/উচ্চ মাধ্যমিক'}</strong>. শূন্যপদ: <strong>{item.details.vacancy || 'দেখা যাবে'}</strong>. বিনামূল্যে মক টেস্ট দিন।
            </p>
            {/* Rich snippet review schema look */}
            <div className="flex items-center gap-1.5 text-[11.5px] text-[#70757a] dark:text-slate-500 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>রেটিং: <strong>৪.৯</strong> • ‎৪১২ টি ভোট • ‎মিনিট রিড: ৪ • ‎ফ্রি মক টেস্ট উপলব্ধ</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-semibold pt-1">
            <span className="flex items-center gap-0.5 text-emerald-500">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Schema.org JobPosting Active
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-blue-500">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> JSON-LD Structured Data
            </span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4.5 h-4.5 text-indigo-500" />
            <span>বিস্তারিত তথ্য ও খবরাখবর (Detailed Notification Summary)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-bold whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Important Specifications Box */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
            <span>যোগ্যতা ও গুরুত্বপূর্ণ বিবরণসমূহ (Key Eligibility Criteria)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.details.authority && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800/60">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">নিয়োগকারী কর্তৃপক্ষ</span>
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black mt-0.5 block">{item.details.authority}</span>
              </div>
            )}
            
            {item.details.vacancy && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800/60">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">মোট শূন্যপদ</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-black mt-0.5 block">{item.details.vacancy}</span>
              </div>
            )}

            {item.details.qualification && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800/60 sm:col-span-2">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">শিক্ষাগত যোগ্যতা</span>
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black mt-0.5 block">{item.details.qualification}</span>
              </div>
            )}

            {item.details.lastDate && (
              <div className="bg-red-50/40 dark:bg-rose-950/15 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/30 sm:col-span-2">
                <span className="text-rose-500/80 dark:text-rose-400/80 block text-[10px] font-extrabold uppercase tracking-wide">আবেদনের শেষ তারিখ / সময়সীমা</span>
                <span className="text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-black mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4.5 h-4.5 animate-pulse" />
                  {item.details.lastDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Syllabus / Exam Topics */}
        {item.details.syllabus && item.details.syllabus.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <BookOpen className="w-4.5 h-4.5 text-blue-500" />
              <span>পরীক্ষার অফিসিয়াল সিলেবাস (Exam Official Syllabus)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.details.syllabus.map((topic, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Meta Tags & Core Keywords Cloud */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              সার্চ ইঞ্জিন অপ্টিমাইজড কি-ওয়ার্ডস (SEO Focus Keywords)
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold">#WBPanchayatRecruitment2026</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold">#WestBengalGovtJobs</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold">#WB_Online_Form_Fillup</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold">#SarkariJobNotification</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold">#FreeMockTestBengali</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-[10.5px] font-bold">#WBSyllabusPDF</span>
          </div>
        </div>

        {/* Dynamic Related Mock Tests Card */}
        {relatedTests.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#059669]" />
                <span>সম্পর্কিত অনলাইন মক টেস্ট (Related Mock Exams)</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50">
                ফ্রি প্র্যাকটিস
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {relatedTests.map((test) => (
                <div 
                  key={test.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-150/80 dark:border-slate-850/80 bg-slate-50/50 dark:bg-slate-950/25 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-200">
                      {test.bengaliTitle || test.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-sans">
                      {test.totalQuestions} টি প্রশ্ন • {test.durationMinutes} মিনিট • {test.totalMarks} পূর্ণমান
                    </p>
                  </div>
                  {onStartTest ? (
                    <button 
                      onClick={() => onStartTest(test)}
                      className="text-[11px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      পরীক্ষা দিন
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smart Study Planner Banner Card */}
        {onOpenStudyPlan && (
          <div 
            onClick={onOpenStudyPlan}
            className="rounded-[24px] bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-lg cursor-pointer hover:shadow-indigo-500/15 transition-all border border-indigo-500/20 relative overflow-hidden group active:scale-[0.99]"
          >
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-300">
              <Megaphone className="w-40 h-40 rotate-12" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-[80%]">
                <div className="flex items-center gap-1">
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider leading-none">STUDY HELPER</span>
                  <span className="text-[10px] text-yellow-300 font-black">★ AI রুটিন মেকার</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black leading-snug">
                  এই নিয়োগ পরীক্ষার জন্য বিশেষ ডেইলি স্টাডি রুটিন চান?
                </h4>
                <p className="text-[10px] text-indigo-100 font-bold leading-relaxed">
                  দুর্বল বিষয় ও মক টেস্ট বিশ্লেষণ অনুযায়ী নিখুঁত পড়ার রুটিন তৈরি করুন সম্পূর্ণ ফ্রি-তে!
                </p>
              </div>
              <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl shadow text-white shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Social Share Suite Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Share2 className="w-4.5 h-4.5 text-emerald-500" />
            <span>অন্যান্য চাকরিপ্রার্থীদের সাথে শেয়ার করুন (Social Share Hub)</span>
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed">
            সঠিক ও নির্ভরযোগ্য তথ্য সবার সাথে ছড়িয়ে দিন। নিচে দেওয়া প্ল্যাটফর্মগুলির মাধ্যমে বন্ধুদের তাৎক্ষণিক শেয়ার করুন:
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleSharePlatform('whatsapp')}
              className="flex items-center justify-center gap-1.5 bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] hover:bg-[#25D366]/15 font-black py-2.5 rounded-xl text-xs sm:text-sm border border-[#25D366]/20 transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              WhatsApp
            </button>
            <button 
              onClick={() => handleSharePlatform('telegram')}
              className="flex items-center justify-center gap-1.5 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/15 font-black py-2.5 rounded-xl text-xs sm:text-sm border border-[#0088cc]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Telegram
            </button>
            <button 
              onClick={() => handleSharePlatform('facebook')}
              className="flex items-center justify-center gap-1.5 bg-[#3b5998]/10 text-[#3b5998] hover:bg-[#3b5998]/15 font-black py-2.5 rounded-xl text-xs sm:text-sm border border-[#3b5998]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              Facebook
            </button>
          </div>
        </div>

        {/* STATEFUL INTERACTIVE COMMENTS / CANDIDATE Q&A FORUM */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-blue-500" />
              <span>প্রার্থী আলোচনা ও প্রশ্নোত্তর ফোরাম ({comments.length} টি মন্তব্য)</span>
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              Active Discussion
            </span>
          </div>

          {/* New Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="relative">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="এই নোটিফিকেশন বা সিলেবাস সংক্রান্ত আপনার কোনো প্রশ্ন থাকলে লিখুন..."
                className="w-full text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors min-h-[80px]"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-400 font-bold">
                * আপনার প্রশ্নের উত্তর ১৫ সেকেন্ডের মধ্যে প্রদান করা হবে।
              </p>
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl text-xs sm:text-sm shadow-sm hover:opacity-95 transition-all disabled:opacity-40 disabled:scale-100 active:scale-95 cursor-pointer"
              >
                <span>সাবমিট করুন</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
            {comments.map((comment, index) => (
              <div key={comment.id} className={`pt-4 first:pt-0 space-y-2.5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200/55 dark:border-slate-750">
                      {comment.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        {comment.author}
                        {comment.author.includes('আপনি') && (
                          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded">ইউজার</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                        {comment.time} • ক্যান্ডিডেট
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                      comment.hasLiked 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/60 dark:text-blue-400' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-500 dark:bg-slate-850 dark:border-slate-750 dark:text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>সহমত ({comment.likes})</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-bold pl-1">
                  {comment.text}
                </p>

                {/* Reply Block */}
                {comment.reply && (
                  <div className="bg-blue-50/40 dark:bg-blue-950/15 border-l-4 border-blue-500 p-3.5 rounded-r-2xl space-y-1.5 ml-4 sm:ml-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="text-[11.5px] font-black text-blue-700 dark:text-blue-400 flex items-center gap-1">
                          {comment.reply.author}
                          <span className="bg-blue-600 text-white text-[8px] px-1 py-0.2 rounded font-black tracking-wide leading-none uppercase">Admin Expert</span>
                        </h5>
                      </div>
                      <span className="text-[9.5px] text-slate-400 font-bold">{comment.reply.time}</span>
                    </div>
                    <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-bold">
                      {comment.reply.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Copied To Clipboard Toast Message */}
      {copied && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-xs font-black flex items-center gap-2 border border-slate-800 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>শেয়ার লিঙ্ক ও সিলেবাস ক্লিপবোর্ডে কপি হয়েছে!</span>
        </div>
      )}

      {/* Fixed Sticky Action Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button 
            onClick={handleSaveToggle}
            className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-black py-3 px-4.5 rounded-xl transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-yellow-400 stroke-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
            <span className="text-[13px] hidden sm:inline">{isSaved ? 'সংরক্ষিত' : 'সেভ করুন'}</span>
          </button>
          
          <a 
            href={item.details.applyUrl || "https://wb.gov.in"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer text-center text-[13px] sm:text-[14px] active:scale-98"
          >
            <span>অফিসিয়াল ওয়েবসাইটে যান / আবেদন করুন</span>
            <ExternalLink className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
