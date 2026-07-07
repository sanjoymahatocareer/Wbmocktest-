import React, { useState } from 'react';
import { Briefcase, Calendar, Star, ChevronDown, ChevronUp, Link, BookOpen } from 'lucide-react';
import { JobNotification } from '../types';

interface JobNotificationsProps {
  jobs: JobNotification[];
}

export default function JobNotifications({ jobs }: JobNotificationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm md:text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 font-sans">
          <Briefcase className="w-4.5 h-4.5 text-rose-500 fill-rose-505" />
          <span>নতুন সরকারি চাকরির খবরাখবর</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400 font-sans">নিয়মিত আপডেট</span>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          const isExpanded = expandedId === job.id;
          return (
            <div 
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-3 justify-between">
                <div className="flex gap-3">
                  {/* Decorative Initials for OrgLogo */}
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${job.logoColor} text-white flex items-center justify-center font-black text-xs shadow-sm`}>
                    {job.organization.match(/[A-Z]/g)?.join('') || 'WB'}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {job.organization}
                      </span>
                      {job.isNew && (
                        <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug mt-1">
                      {job.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Meta Date Row */}
              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 pt-3 mt-3">
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 font-sans">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>আবেদনের শেষ তারিখ: {job.lastDate}</span>
                </div>

                <button
                  onClick={() => toggleExpand(job.id)}
                  className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:opacity-80"
                >
                  <span>{isExpanded ? 'তথ্য বন্ধ করুন' : 'বিস্তারিত দেখুন'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded details section */}
              {isExpanded && (
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 mt-3.5 space-y-3.5 animate-fadeIn">
                  {job.syllabus && (
                    <div>
                      <h5 className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span>পরীক্ষার নির্ধারিত সিলেবাস:</span>
                      </h5>
                      <ul className="grid grid-cols-2 gap-2">
                        {job.syllabus.map((s, idx) => (
                          <li key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-2 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                            ✓ {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-extrabold py-2 px-3 rounded-xl shadow-md cursor-pointer hover:opacity-90 active:scale-98 transition-all"
                      >
                        <Link className="w-3.5 h-3.5" />
                        <span>অফিসিয়াল পোর্টালে যান</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
