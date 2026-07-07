import React, { useState } from 'react';
import { 
  ArrowLeft, Share2, Calendar, Clock, BookOpen, ExternalLink, 
  ShieldAlert, Award, Newspaper, FileText, CheckCircle2, Bookmark,
  TrendingUp, Megaphone, Zap, Sparkles, MessageSquare, Flame, Check
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

export default function NewsDetails({ newsId, onGoBack, onStartTest, onOpenStudyPlan }: NewsDetailsProps) {
  const item = newsData.find((n) => n.id === newsId) || newsData[0];
  const allMockTests = getMockTests();
  const [isSaved, setIsSaved] = useState<boolean>(false);

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
    
    // Return default first 3 if none match specifically
    return allMockTests.slice(0, 3);
  };

  const relatedTests = getRelatedMockTests();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${item.title}\n\n${item.description}\n\nঅফিসিয়াল আপডেট: ${window.location.href}`);
      alert("সংবাদের লিঙ্কটি সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে!");
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? "খবরটি আপনার সংরক্ষিত তালিকা থেকে সরানো হয়েছে।" : "খবরটি সফলভাবে আপনার প্রোফাইলে সংরক্ষণ করা হয়েছে!");
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

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-28 font-sans">
      {/* Sticky Header Banner */}
      <div className={`bg-gradient-to-r ${item.thumbnail.color} text-white sticky top-0 z-20 shadow-md`}>
        <div className="flex items-center justify-between px-4 py-4 max-w-3xl mx-auto">
          <div className="flex items-center">
            <button 
              onClick={onGoBack} 
              className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white" 
              id="news-details-back-btn"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide leading-tight truncate max-w-[200px] sm:max-w-[400px]">
                {item.title}
              </h1>
              <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 font-bold leading-none">
                সর্বশেষ অফিসিয়াল আপডেট • {item.publishDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleSaveToggle} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" 
              title="Save News"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-yellow-300 stroke-yellow-300' : ''}`} />
            </button>
            <button 
              onClick={handleShare} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" 
              title="Share News"
            >
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        
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

          <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
            {item.title}
          </h2>

          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-sans border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>প্রকাশের তারিখ: {item.publishDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>চলতি আপডেট</span>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4.5 h-4.5 text-indigo-500" />
            <span>বিস্তারিত তথ্য ও খবরাখবর</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-bold whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Important Specifications Box */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
            <span>গুরুত্বপূর্ণ বিবরণসমূহ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.details.authority && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">নিয়োগকারী কর্তৃপক্ষ</span>
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black mt-0.5 block">{item.details.authority}</span>
              </div>
            )}
            
            {item.details.vacancy && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">মোট শূন্যপদ</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-black mt-0.5 block">{item.details.vacancy}</span>
              </div>
            )}

            {item.details.qualification && (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 sm:col-span-2">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-extrabold uppercase tracking-wide">শিক্ষাগত যোগ্যতা</span>
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black mt-0.5 block">{item.details.qualification}</span>
              </div>
            )}

            {item.details.lastDate && (
              <div className="bg-red-50/40 dark:bg-rose-950/15 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/30 sm:col-span-2">
                <span className="text-rose-500/80 dark:text-rose-400/80 block text-[10px] font-extrabold uppercase tracking-wide">আবেদনের শেষ তারিখ / সময়সীমা</span>
                <span className="text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-black mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4.5 h-4.5" />
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
              <span>পরীক্ষার নির্ধারিত সিলেবাস</span>
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

        {/* Related Mock Tests Card */}
        {relatedTests.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-150/80 dark:border-slate-800/80 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#059669]" />
                <span>সম্পর্কিত অনলাইন মক টেস্ট</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                ফ্রি প্র্যাকটিস
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {relatedTests.map((test) => (
                <div 
                  key={test.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-200">
                      {test.bengaliTitle || test.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {test.totalQuestions} টি প্রশ্ন • {test.durationMinutes} মিনিট • {test.totalMarks} পূর্ণমান
                    </p>
                  </div>
                  {onStartTest ? (
                    <button 
                      onClick={() => onStartTest(test)}
                      className="text-[11px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
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
            className="rounded-[24px] bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-lg cursor-pointer hover:shadow-indigo-500/10 transition-all border border-indigo-500/20 relative overflow-hidden group"
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

      </div>

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
