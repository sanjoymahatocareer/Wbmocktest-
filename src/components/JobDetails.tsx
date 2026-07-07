import React, { useState } from 'react';
import { 
  ArrowLeft, Share2, Users, GraduationCap, Calendar, Info, FileText, 
  ArrowRight, Bookmark, Shield, Briefcase, MapPin, DollarSign, Clock, 
  Activity, FileCheck, Stethoscope, Sparkles, ExternalLink, HelpCircle, 
  ChevronDown, ChevronUp, Lock, CheckCircle, Trophy
} from 'lucide-react';
import { getPosts, getCategories, getMockTests, getTemplates } from '../lib/db';
import { PostName, ExamCategory, MockTest } from '../types';

interface JobDetailsProps {
  onGoBack: () => void;
  onOpenStudyPlan?: () => void;
  postId?: string;
  onStartTest?: (test: MockTest) => void;
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

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activePost?.bengaliName || activePost?.name,
        text: `WB Mock Test - ${activePost?.bengaliName || activePost?.name} নিয়োগের বিস্তারিত তথ্য ও মক টেস্ট প্রিপারেশন।`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("বিজ্ঞপ্তির লিঙ্কটি কপি করা হয়েছে!");
    }
  };

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
  
  // Quick summary cards
  const vacancyValue = fields.vacancy || '11749+';
  const qualificationValue = fields.qualification || 'Madhyamik / Secondary';
  const lastDateValue = fields.lastDate || '25 July 2026';

  // Gradient classes based on category
  const gradientClass = activeCategory?.gradientClass || "from-[#059669] to-[#047857]";
  
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] text-white sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <div className="flex items-center">
            <button onClick={onGoBack} className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white" id="job-details-back-btn">
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide leading-tight">{activePost.bengaliName || activePost.name}</h1>
              <p className="text-[12px] md:text-sm text-emerald-100 mt-0.5 font-medium leading-tight">
                {activeCategory?.bengaliName || "পশ্চিমবঙ্গের চাকরি"}
              </p>
            </div>
          </div>
          <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" id="job-details-share-btn">
            <Share2 className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Top Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-5">
          <div className="flex items-start gap-4 mb-5 border-b border-slate-100 pb-5">
            {/* Logo */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] shrink-0 flex items-center justify-center shadow-md relative z-0 border border-white/20">
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{activePost.bengaliName || activePost.name}</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5 mb-2.5">{activeCategory?.name || "West Bengal Government"}</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#eefcf3] text-[#059669] border border-[#bbf7d0]">Upcoming</span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#eefcf3] text-[#059669] border border-[#bbf7d0]">Apply Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 divide-x divide-slate-100">
            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-medium">পদের সংখ্যা</span>
              </div>
              <p className="text-[13px] font-bold text-slate-900">{vacancyValue}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-[11px] font-medium">যোগ্যতা</span>
              </div>
              <p className="text-[13px] font-bold text-slate-900 truncate max-w-full">{qualificationValue}</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[11px] font-medium">শেষ তারিখ</span>
              </div>
              <p className="text-[13px] font-bold text-slate-900">{lastDateValue}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Fields & Fallback Content */}
        {isDynamic && activeTemplate ? (
          <div>
            {/* Dynamic Custom Fields Loop */}
            {activeTemplate.fields.map((field) => {
              const value = fields[field.name];
              if (!value) return null;

              // Top details rendering based on field types
              if (field.type === 'faq' || field.type === 'table') return null;

              return (
                <div key={field.name} className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-5 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#eefcf3] text-[#059669] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-900">{field.label}</h3>
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
                      className="inline-flex items-center gap-2 bg-[#eefcf3] hover:bg-emerald-100 text-[#059669] font-bold px-4 py-2.5 rounded-xl text-[13px] transition-colors border border-emerald-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>অফিসিয়াল ওয়েবসাইটে যান</span>
                    </a>
                  ) : (
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Backward Compatible static layout fallback for other posts */
          <>
            {/* Section 1: Dates */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-5 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900">গুরুত্বপূর্ণ তারিখ</h3>
               </div>

               <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-4 gap-x-4 border border-slate-100">
                  <div>
                    <p className="text-[12px] text-slate-500 font-medium mb-0.5">বিজ্ঞপ্তি প্রকাশ</p>
                    <p className="text-[13.5px] font-bold text-slate-800">01 May 2026</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500 font-medium mb-0.5">আবেদনের শেষ তারিখ</p>
                    <p className="text-[13.5px] font-bold text-red-600">25 July 2026</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500 font-medium mb-0.5">আবেদন শুরু</p>
                    <p className="text-[13.5px] font-bold text-slate-800">05 May 2026</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-500 font-medium mb-0.5">পরীক্ষার তারিখ</p>
                    <p className="text-[13.5px] font-bold text-slate-800">To be notified</p>
                  </div>
               </div>
            </div>

            {/* Section 2: Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-5">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#059669]">
                    <FileText className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900">পদের বিবরণ</h3>
               </div>

               <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                 <table className="w-full text-[13px]">
                   <tbody>
                     <tr className="border-b border-slate-200/50 mix-blend-multiply border-dashed last:border-0">
                       <td className="py-3 text-slate-500 font-medium flex items-center gap-1.5 w-[110px]">
                          <div className="w-1 h-1 rounded-full bg-emerald-300"></div> পদের নাম
                       </td>
                       <td className="py-3 font-bold text-slate-800 before:content-[':'] before:mr-3 before:text-slate-300">{activePost.name}</td>
                     </tr>
                     <tr className="border-b border-slate-200/50 mix-blend-multiply border-dashed last:border-0">
                       <td className="py-3 text-slate-500 font-medium flex items-center gap-1.5 w-[110px]">
                          <div className="w-1 h-1 rounded-full bg-emerald-300"></div> বিভাগ
                       </td>
                       <td className="py-3 font-bold text-slate-800 before:content-[':'] before:mr-3 before:text-slate-300">{activeCategory?.bengaliName || 'পশ্চিমবঙ্গ রিক্রুটমেন্ট'}</td>
                     </tr>
                     <tr className="border-b border-slate-200/50 mix-blend-multiply border-dashed last:border-0">
                       <td className="py-3 text-slate-500 font-medium flex items-center gap-1.5 w-[110px]">
                          <div className="w-1 h-1 rounded-full bg-emerald-300"></div> পদের ধরন
                       </td>
                       <td className="py-3 font-bold text-slate-800 before:content-[':'] before:mr-3 before:text-slate-300">রাজ্য সরকারি চাকরি</td>
                     </tr>
                     <tr className="border-b border-slate-200/50 mix-blend-multiply border-dashed last:border-0">
                       <td className="py-3 text-slate-500 font-medium flex items-center gap-1.5 w-[110px]">
                          <div className="w-1 h-1 rounded-full bg-emerald-300"></div> বেতন স্কেল
                       </td>
                       <td className="py-3 font-bold text-slate-800 before:content-[':'] before:mr-3 before:text-slate-300">₹22,700 - ₹58,500 (Level-6)</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}

        {/* Dynamic FAQ Repeater Accordion */}
        {faqs && faqs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-[#059669]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900">সাধারণ জিজ্ঞাসা (FAQ)</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
                    >
                      <span className="text-[13px] font-bold text-slate-800">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-white border-t border-slate-100 text-[12.5px] font-medium text-slate-600 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dedicated Mock Tests section for this Post */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="text-yellow-500">
                <Trophy className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-[15px] font-black text-slate-900">মক টেস্ট প্রিপারেশন</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {postMockTests.length}টি পরীক্ষা উপলব্ধ
            </span>
          </div>

          {postMockTests.length > 0 ? (
            <div className="space-y-3">
              {postMockTests.map((test) => (
                <div 
                  key={test.id} 
                  className="bg-slate-50 hover:bg-emerald-50/20 border border-slate-100 hover:border-emerald-100 rounded-xl p-4 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-slate-800 leading-tight">
                        {test.bengaliTitle || test.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-semibold pt-1">
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {test.totalQuestions}টি প্রশ্ন
                        </span>
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {test.durationMinutes} মিনিট
                        </span>
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {test.totalMarks} পূর্ণমান
                        </span>
                        {test.isPremium && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Premium
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onStartTest && onStartTest(test)}
                      className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-[11px] font-bold shadow-sm hover:shadow transition-all shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <span>শুরু করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 font-medium text-[12.5px] space-y-2">
              <p>এই পদের জন্য কাস্টম মক টেস্ট শীঘ্রই যোগ করা হচ্ছে!</p>
              <button 
                onClick={() => onOpenStudyPlan && onOpenStudyPlan()}
                className="text-xs font-bold text-[#059669] underline hover:text-emerald-700"
              >
                পড়ার রুটিন তৈরি করুন ➔
              </button>
            </div>
          )}
        </div>

        {/* Study routine promo banner */}
        <div className="mb-6">
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

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => alert("চাকরিটি আপনার প্রোফাইলে সেভ করা হয়েছে!")}
            className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-3.5 px-6 rounded-xl transition-colors shrink-0"
          >
            <Bookmark className="w-5 h-5 text-slate-400" />
            <span className="text-[14px]">সেভ করুন</span>
          </button>
          
          <a 
            href={fields.officialWebsite || "https://prb.wb.gov.in"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <span className="text-[15px]">আবেদন করুন</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
