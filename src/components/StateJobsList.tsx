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
    title: 'WBPSC Recruitment',
    org: 'West Bengal Public Service Commission',
    vacancy: '1200+',
    qual: 'Graduate',
    date: '30 July 2026',
    status: 'Apply Now',
    logoInitial: 'WBPSC',
    logoColor: 'from-[#059669] to-[#047857]'
  },
  {
    id: '02',
    title: 'WB Police Constable',
    org: 'West Bengal Police',
    vacancy: '11749+',
    qual: 'Madhyamik',
    date: '25 July 2026',
    status: 'Apply Now',
    logoInitial: 'WBP',
    logoColor: 'from-[#1d4ed8] to-[#1e40af]'
  },
  {
    id: '03',
    title: 'WB Panchayat Recruitment',
    org: 'Panchayat & Rural Development',
    vacancy: '6652+',
    qual: 'Madhyamik / HS',
    date: '20 July 2026',
    status: 'Apply Now',
    logoInitial: 'P&RD',
    logoColor: 'from-[#0ea5e9] to-[#0369a1]'
  },
  {
    id: '04',
    title: 'WBSSC Group C',
    org: 'WBSSC',
    vacancy: '2500+',
    qual: 'Higher Secondary',
    date: '10 Aug 2026',
    status: 'Upcoming',
    logoInitial: 'WBSSC',
    logoColor: 'from-[#e11d48] to-[#be123c]'
  },
  {
    id: '05',
    title: 'WBSSC Group D',
    org: 'WBSSC',
    vacancy: '8000+',
    qual: 'Madhyamik',
    date: '15 Aug 2026',
    status: 'Upcoming',
    logoInitial: 'WBSSC',
    logoColor: 'from-[#ea580c] to-[#c2410c]'
  },
  {
    id: '06',
    title: 'Kolkata Police Recruitment',
    org: 'Kolkata Police',
    vacancy: '3000+',
    qual: 'Madhyamik',
    date: '18 July 2026',
    status: 'Apply Now',
    logoInitial: 'KP',
    logoColor: 'from-[#4f46e5] to-[#4338ca]'
  },
  {
    id: '07',
    title: 'WB Health Recruitment',
    org: 'Health Department',
    vacancy: '4500+',
    qual: 'Graduate',
    date: '22 July 2026',
    status: 'Apply Now',
    logoInitial: 'WBH',
    logoColor: 'from-[#10b981] to-[#059669]'
  },
  {
    id: '08',
    title: 'ICDS Anganwadi',
    org: 'Women & Child Development',
    vacancy: '10000+',
    qual: 'Madhyamik',
    date: '30 July 2026',
    status: 'Apply Now',
    logoInitial: 'ICDS',
    logoColor: 'from-[#d97706] to-[#b45309]'
  }
];

interface StateJobsListProps {
  onGoBack: () => void;
  onJobClick?: () => void;
}

export default function StateJobsList({ onGoBack, onJobClick }: StateJobsListProps) {
  const [activeFilter, setActiveFilter] = useState('সব পোস্ট');
  const filters = ['সব পোস্ট', 'নতুন', 'আবেদন চলছে', 'আসন্ন', 'প্রবেশপত্র', 'ফলাফল'];

  return (
    <div className="bg-[#f0fdf4] min-h-screen pb-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#008F5A] to-[#00A86B] text-white sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <div className="flex items-center">
            <button onClick={onGoBack} className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide leading-tight">পশ্চিমবঙ্গের চাকরি</h1>
              <p className="text-[12px] md:text-sm text-green-100 mt-0.5 font-medium leading-tight">মোট ১০০+ চাকরি</p>
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
          <div className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-emerald-100 relative overflow-hidden">
            <div className="relative z-10 pr-4">
              <h2 className="text-[#008F5A] font-bold text-[16px] md:text-lg leading-snug">আপনার লক্ষ্য চাকরি, <br/>আমাদের লক্ষ্য সফলতা</h2>
              <p className="text-slate-500 text-[11px] md:text-xs mt-1.5 font-medium">পছন্দের চাকরির পোস্ট খুঁজুন এবং শুরু করুন প্রস্তুতি</p>
            </div>
            <div className="shrink-0 relative z-10 opacity-80">
               {/* Howrah Bridge Abstract Icon SVG */}
               <svg className="w-16 h-16 md:w-20 md:h-20 text-[#00A86B]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 80L90 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M20 80L30 30L40 80" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M60 80L70 30L80 80" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M30 30L70 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M25 55L35 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M65 55L75 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M30 40L70 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M35 50L65 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M40 60L60 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M45 70L55 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               </svg>
            </div>
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 z-0"></div>
          </div>
        </div>

        {/* Search & Filter Top Bar */}
        <div className="px-4 py-1 pb-3 flex gap-2 w-full">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-emerald-600" />
              </div>
              <input 
                type="text" 
                placeholder="চাকরির নাম লিখুন..." 
                className="w-full bg-white border border-emerald-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm font-medium placeholder-slate-400"
              />
            </div>
            <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3.5 rounded-xl flex items-center justify-center transition-colors border border-emerald-200 shadow-sm shrink-0">
               <Filter className="w-4 h-4" />
            </button>
        </div>

        {/* Filter Chips Section */}
        <div className="px-4 py-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border shrink-0 ${
                  activeFilter === filter
                    ? 'bg-[#008F5A] text-white border-[#008F5A] shadow-sm'
                    : 'bg-white text-slate-600 border-emerald-100 hover:bg-emerald-50'
                }`}
              >
                {filter}
              </button>
            ))}
        </div>

        {/* Job Cards List */}
        <div className="px-4 mt-2 space-y-3 pb-4">
          {JOBS_DATA.map((job) => (
            <div key={job.id} onClick={onJobClick} className="bg-white rounded-[18px] p-4 flex items-center gap-4 shadow-sm border border-emerald-50 relative cursor-pointer active:scale-[0.99] transition-transform">
              
              {/* Logo Box */}
              <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${job.logoColor} shrink-0 flex items-center justify-center shadow-md relative z-0 border border-white/20`}>
                 <span className="text-white font-black text-[13px] text-center px-1 leading-tight">{job.logoInitial}</span>
              </div>

              {/* Details Content */}
              <div className="flex-grow min-w-0 pr-2">
                <div className="flex items-start justify-between">
                   <h3 className="font-bold text-slate-900 text-[15px] truncate">{job.title}</h3>
                   <div className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold shrink-0 shadow-sm ml-2 whitespace-nowrap border ${job.status === 'Apply Now' ? 'bg-[#eefcf3] text-[#00A86B] border-[#bbf7d0]' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                     {job.status}
                   </div>
                </div>
                
                <p className="text-slate-500 text-[11px] font-medium mt-0.5 truncate">{job.org}</p>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-emerald-500">👥</span> পদ সংখ্যা: {job.vacancy}
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-emerald-500">🎓</span> যোগ্যতা: {job.qual}
                  </span>
                </div>
              </div>

              {/* Right Side Date & Arrow */}
              <div className="shrink-0 flex flex-col items-end justify-center ml-1 border-l border-emerald-50 pl-3">
                 <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap mb-0.5">শেষ তারিখ</p>
                 <p className="text-[11px] font-bold text-[#008F5A] whitespace-nowrap mb-2">{job.date}</p>
                 <div className="bg-emerald-50 p-1 rounded-full">
                   <ChevronRight className="w-4 h-4 text-[#008F5A]" />
                 </div>
              </div>

            </div>
          ))}
        </div>

        {/* Subscription Bottom Banner */}
        <div className="px-4 pb-6 mt-2">
          <div className="bg-white rounded-[18px] p-4 flex items-center justify-between border border-[#00A86B]/20 shadow-md">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#008F5A]/10 rounded-full flex items-center justify-center shadow-sm text-[#008F5A]">
                  <Bell className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-[#008F5A] font-bold text-[13px] leading-tight">নতুন চাকরির আপডেট পেতে<br/>সাবস্ক্রাইব করুন</h4>
                </div>
             </div>
             
             <button className="bg-gradient-to-r from-[#008F5A] to-[#00A86B] hover:opacity-90 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0 active:scale-95">
               <Bell className="w-3.5 h-3.5" />
               সাবস্ক্রাইব করুন
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
