import React from 'react';
import { BookOpen, FileCheck, HelpCircle, GraduationCap, Trophy, Award, Globe, Zap } from 'lucide-react';
import { ViewType } from '../types';

interface QuickAccessProps {
  setView: (view: ViewType) => void;
  onOpenPremium: () => void;
  onOpenAdmitCard: () => void;
  onOpenCurrentAffairs: () => void;
  onOpenPreviousQuestions: () => void;
  onOpenSyllabus: () => void;
}

export default function QuickAccess({
  setView,
  onOpenPremium,
  onOpenAdmitCard,
  onOpenCurrentAffairs,
  onOpenPreviousQuestions,
  onOpenSyllabus
}: QuickAccessProps) {

  const items = [
    {
      label: 'মক টেস্ট',
      icon: BookOpen,
      color: 'bg-rose-500 text-white shadow-rose-500/10',
      action: () => setView('mock-tests')
    },
    {
      label: 'প্রশ্ন ব্যাংক',
      icon: HelpCircle,
      color: 'bg-blue-500 text-white shadow-blue-500/10',
      action: () => setView('question-bank')
    },
    {
      label: 'বিগত বছরের প্রশ্ন',
      icon: FileCheck,
      color: 'bg-emerald-500 text-white shadow-emerald-500/10',
      action: onOpenPreviousQuestions
    },
    {
      label: 'সিলেবাস',
      icon: GraduationCap,
      color: 'bg-purple-500 text-white shadow-purple-500/10',
      action: onOpenSyllabus
    },
    {
      label: 'GK & Current Affairs',
      icon: Zap,
      color: 'bg-orange-500 text-white shadow-orange-500/10',
      action: () => setView('results')
    },
    {
      label: 'অ্যাডমিট কার্ড',
      icon: Award,
      color: 'bg-indigo-500 text-white shadow-indigo-500/10',
      action: onOpenAdmitCard
    },
    {
      label: 'কারেন্ট অ্যাফেয়ার্স',
      icon: Globe,
      color: 'bg-teal-500 text-white shadow-teal-500/10',
      action: onOpenCurrentAffairs
    },
    {
      label: 'স্টাডি প্ল্যান',
      icon: Trophy,
      color: 'bg-amber-500 text-white shadow-amber-500/15 ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900',
      action: () => setView('study-plan')
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={item.action}
            className="flex flex-col items-center justify-center p-2 rounded-2xl active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center focus:outline-none"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 shadow-lg transition-transform ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight leading-snug line-clamp-2 min-h-[30px] flex items-center justify-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
