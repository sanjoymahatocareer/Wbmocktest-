import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Users, GraduationCap, Calendar, Info, FileText, 
  ArrowRight, Bookmark, Shield, Briefcase, MapPin, DollarSign, Clock, 
  Activity, FileCheck, Stethoscope, Sparkles, ExternalLink, HelpCircle, 
  ChevronDown, ChevronUp, Lock, CheckCircle, Trophy, Send, MessageCircle, Star, Heart, ThumbsUp, Globe, User,
  TrendingUp, MessageSquare
} from 'lucide-react';
import { getPosts, getCategories, getMockTests, getTemplates } from '../lib/db';
import { PostName, ExamCategory, MockTest } from '../types';

interface JobDetailsProps {
  onGoBack: () => void;
  onOpenStudyPlan?: () => void;
  postId?: string;
  onStartTest?: (test: MockTest) => void;
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

export default function JobDetails({ onGoBack, onOpenStudyPlan, postId, onStartTest }: JobDetailsProps) {
  const allPosts = getPosts();
  const allCategories = getCategories();
  const allTemplates = getTemplates();
  const allMockTests = getMockTests();

  // Find active post
  const activePost = allPosts.find(p => p.id === postId) || allPosts.find(p => p.id === 'police-constable') || allPosts[0];
  
  // Find associated category
  const activeCategory = allCategories.find(c => c.id === activePost?.categoryId);
  
  // Find template if any
  const activeTemplate = activePost?.templateId ? allTemplates.find(t => t.id === activePost.templateId) : null;

  // Filter mock tests for this post
  const postMockTests = allMockTests.filter(t => t.postId === activePost?.id);

  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Additional SEO & Interaction State
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(248);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  
  // Comments state
  const [comments, setComments] = useState<SimulatedComment[]>([
    {
      id: 'jc1',
      author: 'অভিজিৎ সরকার',
      role: 'candidate',
      time: '৩ ঘণ্টা আগে',
      text: 'এই পদের জন্য কি পশ্চিমবঙ্গের যেকোনো জেলার প্রার্থীরা আবেদন করতে পারবেন? নাকি নির্দিষ্ট কোনো বাধ্যবাধকতা আছে?',
      likes: 18,
      reply: {
        author: 'Job Board Expert',
        role: 'expert',
        text: 'হ্যাঁ অভিজিৎ, পশ্চিমবঙ্গের যেকোনো জেলার স্থায়ী বাসিন্দা হলে এবং প্রয়োজনীয় শিক্ষাগত যোগ্যতা থাকলে আপনি এই পদের জন্য যোগ্য বলে বিবেচিত হবেন। অনলাইন আবেদনের সময় নিজস্ব ডিস্ট্রিক্ট চয়েস করতে পারবেন।',
        time: '২ ঘণ্টা আগে'
      }
    },
    {
      id: 'jc2',
      author: 'সুস্মিতা সেন',
      role: 'candidate',
      time: '৫ ঘণ্টা আগে',
      text: 'পরীক্ষা কি পুরোপুরি বাংলা ভাষায় হবে? আর প্রশ্নপত্র কোন প্যাটার্নে হয়?',
      likes: 9,
      reply: {
        author: 'Job Board Expert',
        role: 'expert',
        text: 'নমস্কার সুস্মিতা। হ্যাঁ, পশ্চিমবঙ্গ সরকারের অধীনে এই নিয়োগ পরীক্ষাটি সম্পূর্ণ বাংলা ও নেপালী ভাষায় অনুষ্ঠিত হবে (ইংরেজি বিষয়ের প্রশ্ন ছাড়া)। সিলেবাস অনুযায়ী MCQ প্যাটার্নে প্রশ্নপত্র প্রস্তুত করা হয়। আপনি আমাদের মক টেস্টগুলো দিলে পরীক্ষার সঠিক প্যাটার্ন বুঝতে পারবেন।',
        time: '৪ ঘণ্টা আগে'
      }
    },
    {
      id: 'jc3',
      author: 'রাহুল রয়',
      role: 'candidate',
      time: '৭ ঘণ্টা আগে',
      text: 'আবেদনের বয়সসীমা কত? ক্যাটাগরি অনুযায়ী কি বয়সের ছাড় পাওয়া যাবে?',
      likes: 14,
      reply: {
        author: 'Job Board Expert',
        role: 'expert',
        text: 'সাধারণত জেনারেল প্রার্থীদের জন্য বয়সসীমা ১৮ থেকে ৩০ বছর পর্যন্ত। তবে ওবিসি (OBC) প্রার্থীরা ৩ বছর এবং এসসি/এসটি (SC/ST) প্রার্থীরা সরকারি নিয়ম অনুযায়ী ৫ বছরের ছাড় পাবেন।',
        time: '৬ ঘণ্টা আগে'
      }
    }
  ]);
  const [newComment, setNewComment] = useState<string>('');

  // Handle Scroll Progress
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

  if (!activePost) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 max-w-xl mx-auto mt-10">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800">কোনো তথ্য পাওয়া যায়নি</h2>
        <button onClick={onGoBack} className="mt-4 px-4 py-2 bg-[#059669] text-white rounded-xl text-sm font-semibold">
          ফিরে যান
        </button>
      </div>
    );
  }

  // Extract variables for layout
  const isDynamic = !!activePost.templateId;
  const fields = activePost.fields || {};
  const faqs = activePost.faqs || [];
  
  const vacancyValue = fields.vacancy || '11749+';
  const qualificationValue = fields.qualification || 'Madhyamik / Secondary';
  const lastDateValue = fields.lastDate || '25 July 2026';

  const handleShare = () => {
    const postName = activePost.bengaliName || activePost.name;
    const shareText = `📢 *${postName} নিয়োগ পরীক্ষার গুরুত্বপূর্ণ বিজ্ঞপ্তি*\n\n🔹 বিভাগ: ${activeCategory?.bengaliName || "পশ্চিমবঙ্গ রিক্রুটমেন্ট"}\n🔹 মোট শূন্যপদ: ${vacancyValue}\n🔹 শিক্ষাগত যোগ্যতা: ${qualificationValue}\n🔹 আবেদনের শেষ তারিখ: ${lastDateValue}\n\n👉 সম্পূর্ণ সিলেবাস দেখতে ও ফ্রি অনলাইন মক টেস্ট প্র্যাকটিস করতে নিচে ক্লিক করুন:\n🔗 ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: postName,
        text: `WB Mock Test - ${postName} নিয়োগের বিস্তারিত তথ্য ও মক টেস্ট প্রিপারেশন।`,
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
    const postName = encodeURIComponent(activePost.bengaliName || activePost.name);
    const text = encodeURIComponent(`📢 ${postName} নিয়োগ পরীক্ষার বিবরণ ও অনলাইন মক টেস্ট প্র্যাকটিস লিংক:\n`);
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
    alert(isSaved ? "চাকরিটি আপনার সংরক্ষিত তালিকা থেকে সরানো হয়েছে।" : "চাকরিটি সফলভাবে আপনার প্রোফাইলে সংরক্ষণ করা হয়েছে!");
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
      id: `jc-new-${Date.now()}`,
      author: 'আপনি (ইউজার)',
      role: 'candidate',
      time: 'এইমাত্র',
      text: newComment,
      likes: 0
    };

    setComments(prev => [added, ...prev]);
    setNewComment('');

    // Trigger expert reply after 1.5s
    setTimeout(() => {
      setComments(prev => {
        const updated = [...prev];
        const targetIdx = updated.findIndex(c => c.id === added.id);
        if (targetIdx !== -1) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            reply: {
              author: 'Job Board Expert',
              role: 'expert',
              text: 'ধন্যবাদ ক্যান্ডিডেট! আপনার সুন্দর প্রশ্নের জন্য। আমরা শীঘ্রই এই সিলেবাসের সমস্ত গুরুত্বপূর্ণ বিষয়ভিত্তিক অধ্যায় অনুযায়ী স্টাডি নোটস এবং বিশেষ সাজেস্টিভ কুইজ সেট অ্যাপে যুক্ত করছি। আমাদের সাথে যুক্ত থাকুন!',
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

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-28 font-sans transition-colors duration-300">
      {/* Reading Progress Indicator Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] text-white sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between px-4 py-3.5 max-w-3xl mx-auto">
          <div className="flex items-center">
            <button onClick={onGoBack} className="p-1.5 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white active:scale-90" id="job-details-back-btn">
              <ArrowLeft className="w-5.5 h-5.5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide leading-tight truncate max-w-[200px] sm:max-w-[400px]">
                {activePost.bengaliName || activePost.name}
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-100 mt-0.5 font-bold leading-none">
                {activeCategory?.bengaliName || "পশ্চিমবঙ্গের চাকরি"} • অফিসিয়াল বিবরণ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleSaveToggle} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white active:scale-90" title="Save Job">
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-yellow-300 stroke-yellow-300' : ''}`} />
            </button>
            <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white active:scale-90" id="job-details-share-btn">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-4 space-y-5">
        
        {/* SEO Breadcrumbs Navigation */}
        <nav className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-150/50 dark:border-slate-850/50 shadow-sm">
          <span className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={onGoBack}>হোম ড্যাশবোর্ড</span>
          <span>&gt;</span>
          <span className="hover:text-emerald-500 cursor-pointer transition-colors" onClick={onGoBack}>সরকারি চাকরি ও নিয়োগ</span>
          <span>&gt;</span>
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[180px] sm:max-w-xs">{activePost.bengaliName || activePost.name}</span>
        </nav>

        {/* Top Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/70">
            {/* Logo */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] shrink-0 flex items-center justify-center shadow-md border border-white/10">
              <Shield className="w-7 h-7 text-yellow-300" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                {activePost.bengaliName || activePost.name}
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                {activeCategory?.name || "West Bengal Government Recruitment"}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#eefcf3] text-[#059669] border border-[#bbf7d0] dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60 leading-none">
                  Online Application
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60 leading-none">
                  Verified Job
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 divide-x divide-slate-100 dark:divide-slate-800 pt-1">
            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1 text-slate-450 dark:text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">পদের সংখ্যা</span>
              </div>
              <p className="text-[12px] sm:text-sm font-black text-slate-850 dark:text-slate-200">{vacancyValue}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1 text-slate-455 mb-1 dark:text-slate-500">
                <GraduationCap className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">যোগ্যতা</span>
              </div>
              <p className="text-[12px] sm:text-sm font-black text-slate-850 dark:text-slate-200 truncate max-w-full">{qualificationValue}</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1 text-slate-455 mb-1 dark:text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">শেষ তারিখ</span>
              </div>
              <p className="text-[12px] sm:text-sm font-black text-rose-600 dark:text-rose-400">{lastDateValue}</p>
            </div>
          </div>

          {/* Social Micro Engagement bar */}
          <div className="flex items-center justify-between text-[11px] font-bold border-t border-slate-100 dark:border-slate-800/70 pt-4">
            <button 
              onClick={handleLikePost}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                postLiked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-400 scale-[1.03]' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800/40 dark:border-slate-750 dark:text-slate-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${postLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>সহায়ক নোটিফিকেশন ({likesCount})</span>
            </button>
            <div className="text-slate-400 dark:text-slate-500 font-sans">
              ⏱️ ৩ মিনিট রিড • ১২,৫০০+ ভিউস
            </div>
          </div>
        </div>

        {/* Real-time Google Search Result Preview (SERP Simulator) */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5 sm:p-6 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-black px-2.5 py-0.5 rounded-bl-xl tracking-wider uppercase">
            Google Index Look
          </div>
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
            <Globe className="w-4 h-4 text-[#059669]" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              গুগল সার্চ ইঞ্জিন প্রিভিউ (Google Search Snippet Simulator)
            </h3>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/70 font-sans space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] text-[#202124] dark:text-slate-350 truncate">
              <span className="font-medium">https://wbmocktest.in</span>
              <span className="text-slate-400">&gt; jobs &gt; {activePost.id}</span>
            </div>
            <h4 className="text-[16px] sm:text-[18px] text-[#1a0dab] dark:text-blue-400 font-medium hover:underline cursor-pointer leading-snug">
              {activePost.bengaliName || activePost.name} নিয়োগ ২০২৬ - সিলেবাস ও মক টেস্ট
            </h4>
            <p className="text-[12.5px] text-[#4d5156] dark:text-slate-400 leading-relaxed">
              <span className="text-slate-500 font-semibold">আজকের আপডেট — </span>
              {activePost.bengaliName || activePost.name} এর আবেদনের বিবরণ। শিক্ষাগত যোগ্যতা: <strong>{qualificationValue}</strong>, মোট শূন্যপদ: <strong>{vacancyValue}</strong>. সিলেবাস ও বিষয়ভিত্তিক ফ্রি প্র্যাকটিস মক টেস্ট দিতে ক্লিক করুন।
            </p>
            {/* Rich snippet Review and Structured Job Posting Schema */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#70757a] dark:text-slate-500 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>রেটিং: <strong>৪.৮</strong> • ‎৩১০ টি ভোট • ‎বেতন: Level-6 ₹২২,৭০০ - ₹৫৮,৫০০</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-semibold pt-1">
            <span className="flex items-center gap-0.5 text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" /> JobPosting Schema Valid
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-blue-500">
              <CheckCircle className="w-3.5 h-3.5" /> Mobile Friendly Layout
            </span>
          </div>
        </div>

        {/* Dynamic Fields & Fallback Content */}
        {isDynamic && activeTemplate ? (
          <div>
            {/* Dynamic Custom Fields Loop */}
            {activeTemplate.fields.map((field) => {
              const value = fields[field.name];
              if (!value) return null;

              if (field.type === 'faq' || field.type === 'table') return null;

              return (
                <div key={field.name} className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/85 p-5 mb-5 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#eefcf3] dark:bg-emerald-950/40 text-[#059669] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-[15px] font-black text-slate-900 dark:text-white">{field.label}</h3>
                  </div>

                  {field.type === 'pdf' ? (
                    <a 
                      href={value} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl text-[13px] transition-colors border border-red-200"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>অফিসিয়াল বিজ্ঞপ্তি ডাউনলোড করুন (PDF)</span>
                    </a>
                  ) : field.type === 'url' ? (
                    <a 
                      href={value} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#eefcf3] hover:bg-emerald-100 text-[#059669] font-bold px-4 py-2.5 rounded-xl text-[13px] transition-colors border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>অফিসিয়াল ওয়েবসাইটে যান</span>
                    </a>
                  ) : (
                    <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-bold whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Backward Compatible static layout fallback */
          <>
            {/* Section 1: Dates */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white">গুরুত্বপূর্ণ তারিখ (Important Dates)</h3>
               </div>

               <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 grid grid-cols-2 gap-y-4 gap-x-4 border border-slate-100 dark:border-slate-850">
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold mb-0.5">বিজ্ঞপ্তি প্রকাশ</p>
                    <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">01 May 2026</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold mb-0.5">আবেদনের শেষ তারিখ</p>
                    <p className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-450">25 July 2026</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold mb-0.5">আবেদন শুরু</p>
                    <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">05 May 2026</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold mb-0.5">পরীক্ষার তারিখ</p>
                    <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">To be notified</p>
                  </div>
               </div>
            </div>

            {/* Section 2: Details */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#059669]">
                    <FileText className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white">পদের বিবরণ (Vacancy Matrix)</h3>
               </div>

               <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl px-4 py-2">
                 <table className="w-full text-xs sm:text-sm">
                   <tbody>
                     <tr className="border-b border-slate-200/50 dark:border-slate-800 last:border-0">
                       <td className="py-3 text-slate-450 dark:text-slate-500 font-bold flex items-center gap-1.5 w-[110px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> পদের নাম
                       </td>
                       <td className="py-3 font-black text-slate-800 dark:text-slate-200 before:content-[':'] before:mr-3 before:text-slate-300 dark:before:text-slate-700">{activePost.name}</td>
                     </tr>
                     <tr className="border-b border-slate-200/50 dark:border-slate-800 last:border-0">
                       <td className="py-3 text-slate-450 dark:text-slate-500 font-bold flex items-center gap-1.5 w-[110px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> বিভাগ
                       </td>
                       <td className="py-3 font-black text-slate-800 dark:text-slate-200 before:content-[':'] before:mr-3 before:text-slate-300 dark:before:text-slate-700">{activeCategory?.bengaliName || 'পশ্চিমবঙ্গ রিক্রুটমেন্ট'}</td>
                     </tr>
                     <tr className="border-b border-slate-200/50 dark:border-slate-800 last:border-0">
                       <td className="py-3 text-slate-450 dark:text-slate-500 font-bold flex items-center gap-1.5 w-[110px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> পদের ধরন
                       </td>
                       <td className="py-3 font-black text-slate-800 dark:text-slate-200 before:content-[':'] before:mr-3 before:text-slate-300 dark:before:text-slate-700">রাজ্য সরকারি চাকরি</td>
                     </tr>
                     <tr className="border-b border-slate-200/50 dark:border-slate-800 last:border-0">
                       <td className="py-3 text-slate-450 dark:text-slate-500 font-bold flex items-center gap-1.5 w-[110px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> বেতন স্কেল
                       </td>
                       <td className="py-3 font-black text-slate-800 dark:text-slate-200 before:content-[':'] before:mr-3 before:text-slate-300 dark:before:text-slate-700">₹22,700 - ₹58,500 (Level-6)</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}

        {/* Dynamic FAQ Repeater Accordion */}
        {faqs && faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-[#059669]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-black text-slate-900 dark:text-white">সাধারণ জিজ্ঞাসা (FAQ)</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="border border-slate-100 dark:border-slate-850 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left px-4 py-3.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/70 dark:hover:bg-slate-900 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEO Focus Meta Keywords Cloud */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              সার্চ কিওয়ার্ড ও অপ্টিমাইজেশন ট্যাগস (Focus Keywords)
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-750 text-slate-650 dark:text-slate-350 rounded-xl text-[10.5px] font-bold">#WestBengalRecruitment2026</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-750 text-slate-650 dark:text-slate-350 rounded-xl text-[10.5px] font-bold">#SarkariChakriNotification</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-750 text-slate-650 dark:text-slate-350 rounded-xl text-[10.5px] font-bold">#Syllabus_And_Exam_Pattern</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-750 text-slate-650 dark:text-slate-350 rounded-xl text-[10.5px] font-bold">#FreeMockTestOnline</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-750 text-slate-650 dark:text-slate-350 rounded-xl text-[10.5px] font-bold">#Official_Website_Apply</span>
          </div>
        </div>

        {/* Dedicated Mock Tests section for this Post */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/50 dark:border-slate-800/80 p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <div className="text-yellow-500">
                <Trophy className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-[15px] font-black text-slate-900 dark:text-white">মক টেস্ট প্রিপারেশন (Practice Mock Exams)</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/40 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/60 leading-none">
              {postMockTests.length}টি পরীক্ষা উপলব্ধ
            </span>
          </div>

          {postMockTests.length > 0 ? (
            <div className="space-y-3">
              {postMockTests.map((test) => (
                <div 
                  key={test.id} 
                  className="bg-slate-50 hover:bg-emerald-50/20 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 hover:border-emerald-100/60 dark:hover:border-emerald-900/50 rounded-2xl p-4 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {test.bengaliTitle || test.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-450 font-bold pt-1">
                        <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                          {test.totalQuestions}টি প্রশ্ন
                        </span>
                        <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                          {test.durationMinutes} মিনিট
                        </span>
                        <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                          {test.totalMarks} পূর্ণমান
                        </span>
                        {test.isPremium && (
                          <span className="bg-yellow-100 text-yellow-850 px-2 py-0.5 rounded flex items-center gap-0.5 dark:bg-yellow-950/40 dark:text-yellow-450">
                            <Lock className="w-2.5 h-2.5" /> Premium
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onStartTest && onStartTest(test)}
                      className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-[11px] font-black shadow-sm hover:shadow transition-all shrink-0 cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>শুরু করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 dark:text-slate-550 font-medium text-[12.5px] space-y-2">
              <p>এই পদের জন্য কাস্টম মক টেস্ট শীঘ্রই যোগ করা হচ্ছে!</p>
              <button 
                onClick={() => onOpenStudyPlan && onOpenStudyPlan()}
                className="text-xs font-black text-[#059669] underline hover:text-emerald-700"
              >
                পড়ার রুটিন তৈরি করুন ➔
              </button>
            </div>
          )}
        </div>

        {/* Study routine promo banner */}
        <div>
          <div 
            onClick={() => onOpenStudyPlan && onOpenStudyPlan()}
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white p-5 rounded-[24px] border border-emerald-400/20 shadow-xl relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer group hover:shadow-2xl hover:scale-[1.01]"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-400 text-emerald-900 text-[9px] font-black tracking-wider uppercase rounded-full leading-none">
                  <Sparkles className="w-3 h-3 fill-emerald-900" />
                  <span>পরীক্ষার নতুন ফিচার</span>
                </div>
                <h3 className="text-sm font-black tracking-tight pt-1 leading-tight">
                  আপনার লক্ষ্য পরীক্ষার কাস্টম স্টাডি প্ল্যানার
                </h3>
                <p className="text-[10px] text-emerald-100 font-sans leading-normal">
                  দুর্বল বিষয়, পড়ার সময়সীমা ও মক টেস্ট অনুযায়ী নিখুঁত দৈনিক পড়ার রুটিন তৈরি করুন সম্পূর্ণ ফ্রি-তে!
                </p>
              </div>
              <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl text-white shrink-0 shadow">
                <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-yellow-300">
              <span>আপনার স্টাডি কোরিডর সচল করুন</span>
              <span className="flex items-center gap-0.5 bg-white/15 hover:bg-white/20 px-2.5 py-1 rounded-xl text-white transition-colors">
                রুটিন তৈরি করুন ➔
              </span>
            </div>
          </div>
        </div>

        {/* Social Share Suite Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/40 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <Share2 className="w-4.5 h-4.5 text-emerald-600" />
            <span>অন্যান্য চাকরিপ্রার্থীদের সাথে শেয়ার করুন (Social Share Hub)</span>
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed">
            বন্ধুদের সাথে এই নির্ভরযোগ্য নিয়োগের নোটিফিকেশন শেয়ার করুন। নিচে দেওয়া লিঙ্কগুলির সাহায্যে তাৎক্ষণিক শেয়ার করতে পারেন:
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
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-emerald-100/40 dark:border-slate-800/80 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-[#059669]" />
              <span>প্রার্থী আলোচনা ও প্রশ্নোত্তর ফোরাম ({comments.length} টি মন্তব্য)</span>
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              Active Discussion
            </span>
          </div>

          {/* New Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="relative">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="নিয়োগ বা মক টেস্ট সংক্রান্ত কোনো জিজ্ঞাসা বা মতামত থাকলে লিখুন..."
                className="w-full text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:border-[#059669] dark:focus:border-emerald-600 transition-colors min-h-[80px]"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                * আপনার প্রশ্নের উত্তর ১৫ সেকেন্ডের মধ্যে প্রদান করা হবে।
              </p>
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-black rounded-xl text-xs sm:text-sm shadow-sm transition-all disabled:opacity-40 disabled:scale-100 active:scale-95 cursor-pointer"
              >
                <span>সাবমিট করুন</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-4 first:pt-0 space-y-2.5">
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
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
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
                  <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border-l-4 border-emerald-500 p-3.5 rounded-r-2xl space-y-1.5 ml-4 sm:ml-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5.5 h-5.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="text-[11.5px] font-black text-[#059669] dark:text-emerald-400 flex items-center gap-1">
                          {comment.reply.author}
                          <span className="bg-[#059669] text-white text-[8px] px-1.5 py-0.2 rounded font-black tracking-wide leading-none uppercase">Verified Expert</span>
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
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>শেয়ার লিঙ্ক ও বিজ্ঞপ্তি বিবরণ ক্লিপবোর্ডে কপি হয়েছে!</span>
        </div>
      )}

      {/* Fixed Sticky Action Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button 
            onClick={handleSaveToggle}
            className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-black py-3 px-4.5 rounded-xl transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-yellow-400 stroke-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
            <span className="text-[13px] hidden sm:inline">{isSaved ? 'সংরক্ষিত' : 'সেভ করুন'}</span>
          </button>
          
          <a 
            href={fields.officialWebsite || "https://prb.wb.gov.in"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer text-center text-[13px] sm:text-[14px] active:scale-98"
          >
            <span>অফিসিয়াল ওয়েবসাইটে যান / আবেদন করুন</span>
            <ExternalLink className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
