import React from 'react';
import * as Icons from 'lucide-react';

interface PopularPostCategory {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  posts: string[];
  gradientClass: string;
  borderClass: string;
  accentTextClass: string;
  badgeClass: string;
}

const popularPostsData: PopularPostCategory[] = [
  {
    id: 'panchayat',
    name: 'পঞ্চায়েত নিয়োগ',
    emoji: '🏛️',
    subtitle: 'Panchayat Jobs',
    posts: ['Executive Assistant', 'Nirman Sahayak', 'Clerk', 'Data Entry Operator'],
    gradientClass: 'from-blue-600/10 via-indigo-600/5 to-blue-500/5',
    borderClass: 'border-blue-500/20 dark:border-blue-500/15 hover:border-blue-500 dark:hover:border-blue-400 shadow-blue-500/5',
    accentTextClass: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/25',
  },
  {
    id: 'police',
    name: 'WB Police',
    emoji: '🚔',
    subtitle: 'Police Jobs',
    posts: ['Constable', 'Lady Constable', 'SI', 'ASI'],
    gradientClass: 'from-red-600/10 via-orange-600/5 to-rose-500/5',
    borderClass: 'border-red-500/20 dark:border-red-500/15 hover:border-red-500 dark:hover:border-red-400 shadow-red-500/5',
    accentTextClass: 'text-red-600 dark:text-red-400',
    badgeClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/25',
  },
  {
    id: 'clerkship',
    name: 'Clerkship',
    emoji: '📝',
    subtitle: 'Clerkship Jobs',
    posts: ['LDC', 'UDC', 'Office Assistant'],
    gradientClass: 'from-purple-600/10 via-fuchsia-600/5 to-violet-500/5',
    borderClass: 'border-purple-500/20 dark:border-purple-500/15 hover:border-purple-500 dark:hover:border-purple-400 shadow-purple-500/5',
    accentTextClass: 'text-purple-600 dark:text-purple-400',
    badgeClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25',
  },
  {
    id: 'railway',
    name: 'Railway',
    emoji: '🚆',
    subtitle: 'Railway Jobs',
    posts: ['Group D', 'NTPC', 'Technician', 'ALP'],
    gradientClass: 'from-amber-600/10 via-orange-600/5 to-yellow-500/5',
    borderClass: 'border-amber-500/20 dark:border-amber-500/15 hover:border-amber-500 dark:hover:border-amber-400 shadow-amber-500/5',
    accentTextClass: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/25',
  },
  {
    id: 'bank',
    name: 'Banking',
    emoji: '🏦',
    subtitle: 'Bank Jobs',
    posts: ['SBI Clerk', 'PO', 'IBPS Clerk', 'RBI Assistant'],
    gradientClass: 'from-yellow-600/10 via-amber-600/5 to-yellow-500/5',
    borderClass: 'border-yellow-500/20 dark:border-yellow-500/15 hover:border-yellow-500 dark:hover:border-yellow-400 shadow-yellow-500/5',
    accentTextClass: 'text-yellow-600 dark:text-yellow-450',
    badgeClass: 'bg-yellow-100 dark:bg-yellow-904/30 text-yellow-600 dark:text-yellow-405 border border-yellow-250 dark:border-yellow-500/25',
  },
  {
    id: 'school',
    name: 'School Jobs',
    emoji: '🎓',
    subtitle: 'Primary & Secondary',
    posts: ['Primary Teacher', 'Upper Primary', 'Group C', 'Group D'],
    gradientClass: 'from-sky-600/10 via-blue-600/5 to-cyan-500/5',
    borderClass: 'border-sky-500/20 dark:border-sky-500/15 hover:border-sky-500 dark:hover:border-sky-400 shadow-sky-500/5',
    accentTextClass: 'text-sky-600 dark:text-sky-400',
    badgeClass: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-405 border border-sky-200 dark:border-sky-500/25',
  },
  {
    id: 'health',
    name: 'Health Department',
    emoji: '🏥',
    subtitle: 'Medical Recruitments',
    posts: ['ANM', 'GNM', 'Staff Nurse', 'Lab Technician'],
    gradientClass: 'from-emerald-600/10 via-teal-600/5 to-green-500/5',
    borderClass: 'border-emerald-500/20 dark:border-emerald-500/15 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-emerald-500/5',
    accentTextClass: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-500/25',
  },
  {
    id: 'foodsi',
    name: 'Food SI',
    emoji: '🍚',
    subtitle: 'Food Sub Inspector',
    posts: ['Food Sub Inspector'],
    gradientClass: 'from-cyan-600/10 via-blue-600/5 to-indigo-500/5',
    borderClass: 'border-cyan-500/20 dark:border-cyan-500/15 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-cyan-500/5',
    accentTextClass: 'text-cyan-600 dark:text-cyan-400',
    badgeClass: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/25',
  },
  {
    id: 'wbcs',
    name: 'WBCS',
    emoji: '👑',
    subtitle: 'Civil Service',
    posts: ['Executive', 'Revenue Officer', 'BDO', 'DSP'],
    gradientClass: 'from-orange-600/10 via-amber-600/5 to-yellow-500/5',
    borderClass: 'border-orange-500/20 dark:border-orange-500/15 hover:border-orange-500 dark:hover:border-orange-400 shadow-orange-500/5',
    accentTextClass: 'text-orange-600 dark:text-orange-400',
    badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/25',
  },
  {
    id: 'court',
    name: 'Court Jobs',
    emoji: '⚖️',
    subtitle: 'Judicial Exams',
    posts: ['Stenographer', 'Clerk', 'Process Server', 'Group D'],
    gradientClass: 'from-indigo-600/10 via-purple-600/5 to-violet-500/5',
    borderClass: 'border-indigo-500/20 dark:border-indigo-500/15 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-indigo-500/5',
    accentTextClass: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25 border-indigo-200 dark:border-indigo-500/25',
  }
];

interface PopularPostsProps {
  onSelectCategory: (id: string | null) => void;
  selectedCategory: string | null;
}

export default function PopularPosts({ onSelectCategory, selectedCategory }: PopularPostsProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white flex items-center gap-2 font-sans">
          <span className="text-base select-none">🔥</span>
          <span>জনপ্রিয় চাকরির বিভাগ (Target Post Lists)</span>
        </h3>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[10px] font-black text-rose-500 hover:text-rose-650 transition-all bg-rose-50 dark:bg-rose-950/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 active:scale-95"
          >
            সব দেখুন ✕
          </button>
        )}
      </div>

      {/* Grid of Gorgeous Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {popularPostsData.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group relative flex flex-col justify-between p-4.5 rounded-[22px] border-2 transition-all duration-300 hover:scale-[1.015] active:scale-98 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500 shadow-xl shadow-indigo-500/5'
                  : `bg-gradient-to-br ${cat.gradientClass} bg-white dark:bg-slate-900 border-slate-150/80 dark:border-slate-800/80 hover:shadow-lg dark:hover:shadow-none`
              } ${cat.borderClass}`}
            >
              {/* Top Row: Icon/Emoji and Title */}
              <div>
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-300">
                      {cat.emoji}
                    </span>
                    <div>
                      <h4 className={`text-[13px] font-black tracking-tight ${
                        isSelected ? 'text-indigo-400' : 'text-slate-900 dark:text-slate-150'
                      }`}>
                        {cat.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 dark:text-slate-450 font-bold uppercase font-mono tracking-tight">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle active state badge */}
                  {isSelected && (
                    <span className="bg-indigo-500/20 text-indigo-450 border border-indigo-500/25 text-[8.5px] font-black px-2.5 py-0.5 rounded-full leading-none shrink-0 font-sans uppercase">
                      Selected
                    </span>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/50 my-2.5" />

                {/* Bullets: Job Posts list under Category */}
                <ul className="space-y-1 text-[11px] font-bold text-slate-655 dark:text-slate-350 pl-0.5">
                  {cat.posts.map((post, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 leading-snug">
                      <span className={`text-[8px] ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}>•</span>
                      <span className="truncate">{post}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button at Bottom of card */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(isSelected ? null : cat.id);
                  }}
                  className={`w-full text-[10.5px] font-black py-2 px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-500 hover:bg-indigo-450 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-550 group-hover:text-white group-hover:shadow'
                  }`}
                >
                  <span>মক টেস্ট দেখুন</span>
                  <Icons.ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
