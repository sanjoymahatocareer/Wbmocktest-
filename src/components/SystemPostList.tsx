import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, ChevronRight, Bell, FileText } from 'lucide-react';

interface MockData {
  id: string;
  title: string;
  org: string;
  date: string;
  status: string;
  logoInitial: string;
  logoColor: string;
}

const generateMockData = (category: string): MockData[] => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: (i + 1).toString().padStart(2, '0'),
    title: `${['SSC CGL', 'RRB NTPC', 'WB Police', 'WBPSC', 'Kolkata Police', 'Railway ALP', 'SBI Clerk', 'IBPS PO'][i]} ${category.split(' ')[0]}`,
    org: ['Staff Selection Commission', 'Railway Recruitment Board', 'West Bengal Police', 'WBPSC', 'Kolkata Police', 'RRB', 'State Bank of India', 'IBPS'][i],
    date: `${Math.floor(Math.random() * 28) + 1} Aug 2026`,
    status: ['New', 'Updated', 'Upcoming'][Math.floor(Math.random() * 3)],
    logoInitial: ['SSC', 'RRB', 'WBP', 'WBP', 'KP', 'RRB', 'SBI', 'IBP'][i],
    logoColor: ['from-purple-600 to-purple-800', 'from-orange-500 to-orange-700', 'from-cyan-500 to-cyan-700'][Math.floor(Math.random() * 3)]
  }));
};

interface SystemPostListProps {
  onGoBack: () => void;
  onPostClick?: () => void;
  categoryTitle: string;
}

export default function SystemPostList({ onGoBack, onPostClick, categoryTitle }: SystemPostListProps) {
  const [activeFilter, setActiveFilter] = useState('সব পোস্ট');
  const filters = ['সব পোস্ট', 'New', 'Updated', 'Upcoming'];
  
  const POSTS_DATA = React.useMemo(() => generateMockData(categoryTitle), [categoryTitle]);

  const getGradient = (title: string) => {
    if (title.includes('অ্যাডমিট')) return 'from-purple-600 to-purple-800';
    if (title.includes('রেজাল্ট')) return 'from-orange-500 to-orange-700';
    if (title.includes('সিলেবাস')) return 'from-cyan-500 to-cyan-700';
    return 'from-[#0b2163] to-[#0A46D1]';
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-6 font-sans">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGradient(categoryTitle)} text-white sticky top-0 z-20 shadow-md`}>
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <div className="flex items-center">
            <button onClick={onGoBack} className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide leading-tight">{categoryTitle}</h1>
              <p className="text-[12px] md:text-sm text-white/80 mt-0.5 font-medium leading-tight">মোট {POSTS_DATA.length}টি পোস্ট</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Banner Section */}
        <div className="p-4 pt-5 pb-3">
          <div className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-slate-100">
            <div className="pr-4">
              <h2 className="text-slate-800 font-bold text-[16px] md:text-lg leading-snug">সর্বশেষ আপডেট, <br/>সবার আগে</h2>
              <p className="text-slate-500 text-[11px] md:text-xs mt-1.5 font-medium">নিচের তালিকা থেকে আপনার প্রয়োজনীয় পোস্টটি বেছে নিন</p>
            </div>
            <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 border border-slate-100">
               <FileText className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-2 flex-grow min-w-max">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border shrink-0 ${
                  activeFilter === filter
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[13px] font-bold shrink-0 shadow-sm ml-2">
            <Filter className="w-3.5 h-3.5" />
            ফিল্টার
          </button>
        </div>

        {/* Post Cards List */}
        <div className="px-4 mt-3 space-y-3 pb-4">
          {POSTS_DATA.map((post) => (
            <div key={post.id} onClick={onPostClick} className="bg-white rounded-[16px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 relative cursor-pointer active:scale-[0.99] transition-transform">
              
              {/* Number Badge */}
              <div className="absolute top-4 left-10 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center z-10 hidden sm:flex">
                <span className="text-slate-600 text-[10px] font-black">{post.id}</span>
              </div>

              {/* Logo Box */}
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${post.logoColor} shrink-0 flex items-center justify-center shadow-md relative z-0`}>
                 <span className="text-white font-black text-sm">{post.logoInitial}</span>
                 <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex sm:hidden items-center justify-center">
                    <span className="text-slate-700 text-[9px] font-black leading-none">{post.id}</span>
                 </div>
              </div>

              {/* Details Content */}
              <div className="flex-grow min-w-0 pr-2">
                <div className="flex items-start justify-between">
                   <h3 className="font-bold text-slate-900 text-[15px] truncate">{post.title}</h3>
                   <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-[4px] text-[10px] font-bold shrink-0 shadow-sm ml-2 whitespace-nowrap border border-emerald-100">
                     {post.status}
                   </div>
                </div>
                
                <p className="text-slate-500 text-[11px] font-medium mt-0.5 truncate">{post.org}</p>
                
                <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-slate-400">📅</span> প্রকাশ: {post.date}
                  </span>
                </div>
              </div>

              {/* Right Side Arrow */}
              <div className="shrink-0 flex flex-col items-end justify-center ml-1 border-l border-slate-100 pl-3">
                 <button className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:text-slate-600 hover:bg-slate-100 transition-colors">
                   <ChevronRight className="w-5 h-5" />
                 </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
