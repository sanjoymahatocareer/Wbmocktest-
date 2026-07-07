import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, ChevronRight, Bell } from 'lucide-react';

interface JobItem {
  id: string;
  title: string;
  org: string;
  vacancy: string;
  qual: string;
  date: string;
  status: string;
  logoInitial: string;
  logoColor: string;
}

const JOBS_DATA: JobItem[] = [
  {
    id: '01',
    title: 'SSC CGL 2026',
    org: 'Staff Selection Commission',
    vacancy: '14582',
    qual: 'Graduate',
    date: '30 July 2026',
    status: 'Upcoming',
    logoInitial: 'SSC',
    logoColor: 'from-[#dc2626] to-[#b91c1c]'
  },
  {
    id: '02',
    title: 'SSC CHSL 2026',
    org: 'Staff Selection Commission',
    vacancy: '3712',
    qual: '12th Pass',
    date: '26 June 2026',
    status: 'Upcoming',
    logoInitial: 'SSC',
    logoColor: 'from-[#dc2626] to-[#b91c1c]'
  },
  {
    id: '03',
    title: 'RRB NTPC 2026',
    org: 'Railway Recruitment Board',
    vacancy: '11558',
    qual: '12th Pass',
    date: '20 July 2026',
    status: 'Upcoming',
    logoInitial: 'RRB',
    logoColor: 'from-[#b91c1c] to-[#991b1b]'
  },
  {
    id: '04',
    title: 'Railway ALP 2026',
    org: 'Railway Recruitment Board',
    vacancy: '9970',
    qual: '10th Pass',
    date: '15 July 2026',
    status: 'Upcoming',
    logoInitial: 'RRB',
    logoColor: 'from-[#0A46D1] to-[#1e3a8a]'
  },
  {
    id: '05',
    title: 'India Post GDS 2026',
    org: 'India Post',
    vacancy: '44228',
    qual: '10th Pass',
    date: '10 July 2026',
    status: 'Upcoming',
    logoInitial: 'IP',
    logoColor: 'from-[#ea580c] to-[#c2410c]'
  },
  {
    id: '06',
    title: 'SBI Clerk 2026',
    org: 'State Bank of India',
    vacancy: '6589',
    qual: 'Graduate',
    date: '02 July 2026',
    status: 'Upcoming',
    logoInitial: 'SBI',
    logoColor: 'from-[#0ea5e9] to-[#0284c7]'
  },
  {
    id: '07',
    title: 'IBPS PO 2026',
    org: 'Institute of Banking Personnel Selection',
    vacancy: '4455',
    qual: 'Graduate',
    date: '28 June 2026',
    status: 'Upcoming',
    logoInitial: 'IBPS',
    logoColor: 'from-[#0284c7] to-[#0369a1]'
  },
  {
    id: '08',
    title: 'UPSC Recruitment 2026',
    org: 'Union Public Service Commission',
    vacancy: '1234+',
    qual: 'Graduate',
    date: '15 Aug 2026',
    status: 'Upcoming',
    logoInitial: 'UPSC',
    logoColor: 'from-[#475569] to-[#334155]'
  }
];

interface GovernmentJobsListProps {
  onGoBack: () => void;
  onJobClick?: () => void;
}

export default function GovernmentJobsList({ onGoBack, onJobClick }: GovernmentJobsListProps) {
  const [activeFilter, setActiveFilter] = useState('সব পোস্ট');
  const filters = ['সব পোস্ট', 'Upcoming', 'Apply Ongoing', 'New'];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2163] to-[#0A46D1] text-white sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <div className="flex items-center">
            <button onClick={onGoBack} className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide leading-tight">কেন্দ্রীয় সরকারি চাকরি</h1>
              <p className="text-[12px] md:text-sm text-blue-100 mt-0.5 font-medium leading-tight">মোট ১৬টি পোস্ট</p>
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
          <div className="bg-[#EEF5FF] rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-blue-50">
            <div className="pr-4">
              <h2 className="text-[#0A46D1] font-bold text-[16px] md:text-lg leading-snug">আপনার লক্ষ্য চাকরি, <br/>আমাদের লক্ষ্য সফলতা</h2>
              <p className="text-slate-500 text-[11px] md:text-xs mt-1.5 font-medium">বাছাই করুন আপনার পছন্দের পোস্ট এবং শুরু করুন প্রস্তুতি</p>
            </div>
            <div className="shrink-0">
               {/* Target Icon SVG */}
               <svg className="w-16 h-16 md:w-20 md:h-20 text-[#0A46D1]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#EEF5FF" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="#EEF5FF" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="currentColor"/>
                  <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 3L17 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 3L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
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
                    ? 'bg-[#0A46D1] text-white border-[#0A46D1] shadow-sm'
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

        {/* Job Cards List */}
        <div className="px-4 mt-3 space-y-3 pb-4">
          {JOBS_DATA.map((job) => (
            <div key={job.id} onClick={onJobClick} className="bg-white rounded-[16px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 relative cursor-pointer active:scale-[0.99] transition-transform">
              
              {/* Number Badge */}
              <div className="absolute top-4 left-10 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EEF5FF] border border-[#d2e3fc] flex items-center justify-center z-10 hidden sm:flex">
                <span className="text-[#0A46D1] text-[10px] font-black">{job.id}</span>
              </div>

              {/* Logo Box */}
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${job.logoColor} shrink-0 flex items-center justify-center shadow-md relative z-0`}>
                 <span className="text-white font-black text-sm">{job.logoInitial}</span>
                 <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EEF5FF] border border-[#d2e3fc] flex sm:hidden items-center justify-center">
                    <span className="text-[#0A46D1] text-[9px] font-black leading-none">{job.id}</span>
                 </div>
              </div>

              {/* Details Content */}
              <div className="flex-grow min-w-0 pr-2">
                <div className="flex items-start justify-between">
                   <h3 className="font-bold text-slate-900 text-[15px] truncate">{job.title}</h3>
                   <div className="bg-[#eefcf3] text-[#22C55E] px-2 py-0.5 rounded-[4px] text-[10px] font-bold shrink-0 shadow-sm ml-2 whitespace-nowrap border border-[#bbf7d0]">
                     {job.status}
                   </div>
                </div>
                
                <p className="text-slate-500 text-[11px] font-medium mt-0.5 truncate">{job.org}</p>
                
                <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-slate-400">👥</span> পদ সংখ্যা: {job.vacancy}
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-slate-400">🎓</span> যোগ্যতা: {job.qual}
                  </span>
                </div>
              </div>

              {/* Right Side Date & Arrow */}
              <div className="shrink-0 flex flex-col items-end justify-center ml-1 border-l border-slate-100 pl-3">
                 <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap mb-0.5">শেষ তারিখ</p>
                 <p className="text-[11px] font-bold text-[#0A46D1] whitespace-nowrap mb-2">{job.date}</p>
                 <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>

            </div>
          ))}
        </div>

        {/* Subscription Bottom Banner */}
        <div className="px-4 pb-6">
          <div className="bg-[#EEF5FF] rounded-[16px] p-4 flex items-center justify-between border border-blue-100 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0A46D1]">
                  <Bell className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-[#0A46D1] font-bold text-[13px]">নতুন চাকরির আপডেট পেতে</h4>
                  <p className="text-slate-500 text-[10px] font-medium mt-0.5">সাবস্ক্রাইব করুন এবং সবার আগে জানুন</p>
                </div>
             </div>
             
             <button className="bg-[#0A46D1] hover:bg-blue-800 text-white text-[12px] font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-md shrink-0">
               <Bell className="w-3.5 h-3.5" />
               সাবস্ক্রাইব করুন
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
