import React from 'react';
import { ChevronRight, ArrowRight, Landmark, Building2, Map } from 'lucide-react';

const centralJobs = [
  'SSC CGL 2026',
  'SSC CHSL 2026',
  'RRB NTPC 2026',
  'Railway ALP',
  'India Post GDS',
  'SBI Clerk',
  'IBPS PO',
  'UPSC Recruitment'
];

const stateJobs = [
  'WBPSC Recruitment',
  'WB Police Constable',
  'WB Panchayat Jobs',
  'WB Health Recruitment',
  'WB School Service',
  'Kolkata Municipal Jobs',
  'ICDS Anganwadi',
  'District Level Jobs'
];

const admitCards = [
  'SSC CHSL Admit Card',
  'RRB NTPC Admit Card',
  'WB Police Admit Card',
  'WBPSC Admit Card',
  'Kolkata Police Admit Card',
  'Railway ALP Admit Card',
  'SBI Clerk Admit Card',
  'IBPS PO Admit Card'
];

const results = [
  'SSC CGL Result',
  'RRB NTPC Result',
  'WBPSC Result',
  'WB Police Result',
  'Kolkata Police Result',
  'SBI Clerk Result',
  'IBPS PO Result',
  'Railway ALP Result'
];

const syllabusList = [
  'SSC CGL Syllabus',
  'SSC CHSL Syllabus',
  'RRB NTPC Syllabus',
  'WB Police Syllabus',
  'WBPSC Syllabus',
  'Kolkata Police Syllabus',
  'Railway ALP Syllabus',
  'SBI Clerk Syllabus'
];

export default function GovtJobCategories({ 
  onViewCentralJobs, 
  onViewStateJobs, 
  onJobClick,
  onViewPostList
}: { 
  onViewCentralJobs?: () => void, 
  onViewStateJobs?: () => void, 
  onJobClick?: () => void,
  onViewPostList?: (title: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 animate-fadeIn">
      {/* Central Govt Jobs Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-3 pt-4 pb-4 relative overflow-hidden flex items-center justify-center min-h-[60px]">
          <h3 className="text-white font-black text-[11px] sm:text-[13px] leading-tight whitespace-nowrap z-10 flex items-center gap-1.5">
            <span className="text-sm">🏛️</span> কেন্দ্রীয় সরকারি চাকরি
          </h3>
        </div>

        {/* List */}
        <div className="p-3 flex-grow space-y-1">
          {centralJobs.map((job, idx) => (
            <div key={idx} onClick={onJobClick} className="flex flex-row items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400 flex items-center justify-center text-[9px] font-bold font-sans">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-1">
                  {job}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 p-1 mx-3 mb-3 mt-1 border border-blue-100 dark:border-blue-900/30 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer group">
          <button onClick={onViewCentralJobs} className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm py-2">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* State Govt Jobs Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-3 pt-4 pb-4 relative overflow-hidden flex items-center justify-center min-h-[60px]">
          <h3 className="text-white font-black text-[11px] sm:text-[13px] leading-tight whitespace-nowrap z-10 flex items-center gap-1.5">
            <span className="text-sm">🏢</span> পশ্চিমবঙ্গের চাকরি
          </h3>
        </div>

        {/* List */}
        <div className="p-3 flex-grow space-y-1">
          {stateJobs.map((job, idx) => (
            <div key={idx} onClick={onJobClick} className="flex flex-row items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-400 flex items-center justify-center text-[9px] font-bold font-sans">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">
                  {job}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-1 mx-3 mb-3 mt-1 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer group">
          <button onClick={onViewStateJobs} className="w-full flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm py-2">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Admit Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-3 pt-4 pb-4 relative overflow-hidden flex items-center justify-center min-h-[60px]">
          <h3 className="text-white font-black text-[11px] sm:text-[13px] leading-tight whitespace-nowrap z-10 flex items-center gap-1.5">
            <span className="text-sm">🎫</span> অ্যাডমিট কার্ড
          </h3>
        </div>
        <div className="p-3 flex-grow space-y-1">
          {admitCards.map((item, idx) => (
            <div key={idx} onClick={onJobClick} className="flex flex-row items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-900/40 dark:border-purple-800 dark:text-purple-400 flex items-center justify-center text-[9px] font-bold font-sans">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight line-clamp-1">
                  {item}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" />
            </div>
          ))}
        </div>
        <div 
          className="bg-purple-50/50 dark:bg-purple-950/20 p-1 mx-3 mb-3 mt-1 border border-purple-100 dark:border-purple-900/30 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer group"
          onClick={() => onViewPostList?.('অ্যাডমিট কার্ড')}
        >
          <button className="w-full flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-black text-sm py-2">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Result Updates */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-3 pt-4 pb-4 relative overflow-hidden flex items-center justify-center min-h-[60px]">
          <h3 className="text-white font-black text-[11px] sm:text-[13px] leading-tight whitespace-nowrap z-10 flex items-center gap-1.5">
            <span className="text-sm">📢</span> রেজাল্ট আপডেট
          </h3>
        </div>
        <div className="p-3 flex-grow space-y-1">
          {results.map((item, idx) => (
            <div key={idx} onClick={onJobClick} className="flex flex-row items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-900/40 dark:border-orange-800 dark:text-orange-400 flex items-center justify-center text-[9px] font-bold font-sans">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight line-clamp-1">
                  {item}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-orange-500 transition-colors" />
            </div>
          ))}
        </div>
        <div 
          className="bg-orange-50/50 dark:bg-orange-950/20 p-1 mx-3 mb-3 mt-1 border border-orange-100 dark:border-orange-900/30 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/40 transition-colors cursor-pointer group"
          onClick={() => onViewPostList?.('রেজাল্ট আপডেট')}
        >
          <button className="w-full flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 font-black text-sm py-2">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Syllabus */}
      <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 pt-4 pb-4 relative overflow-hidden flex items-center justify-center min-h-[60px]">
          <h3 className="text-white font-black text-[11px] sm:text-[13px] leading-tight whitespace-nowrap z-10 flex items-center gap-1.5">
            <span className="text-sm">📄</span> পরীক্ষার সিলেবাস
          </h3>
        </div>
        <div className="p-3 flex-grow space-y-1">
          {syllabusList.map((item, idx) => (
            <div key={idx} onClick={onJobClick} className="flex flex-row items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 dark:bg-cyan-900/40 dark:border-cyan-800 dark:text-cyan-400 flex items-center justify-center text-[9px] font-bold font-sans">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight line-clamp-1">
                  {item}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors" />
            </div>
          ))}
        </div>
        <div 
          className="bg-cyan-50/50 dark:bg-cyan-950/20 p-1 mx-3 mb-3 mt-1 border border-cyan-100 dark:border-cyan-900/30 rounded-2xl hover:bg-cyan-50 dark:hover:bg-cyan-900/40 transition-colors cursor-pointer group"
          onClick={() => onViewPostList?.('পরীক্ষার সিলেবাস')}
        >
          <button className="w-full flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400 font-black text-sm py-2">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
