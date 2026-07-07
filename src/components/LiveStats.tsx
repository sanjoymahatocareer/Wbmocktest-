import React from 'react';
import { Users, FileCheck, CheckCircle2, Award } from 'lucide-react';

export default function LiveStats() {
  const stats = [
    {
      label: 'মোট পরীক্ষার্থী',
      value: '৩.৫ লক্ষ+',
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      label: 'টেস্ট কমপ্লিট',
      value: '১২.৭ লক্ষ+',
      icon: FileCheck,
      color: 'text-purple-500 bg-purple-500/10'
    },
    {
      label: 'বর্তমান প্রশ্নাবলি',
      value: '১.৮ লক্ষ+',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      label: 'সাফল্যের হার',
      value: '৯৮.৬%',
      icon: CheckCircle2,
      color: 'text-amber-500 bg-amber-500/10'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 border border-slate-800/80 shadow-lg">
      <div className="text-center mb-3">
        <h3 className="text-xs font-black text-blue-400 tracking-wider uppercase font-sans">
          লাইভ প্ল্যাটফর্ম পরিসংখ্যান
        </h3>
        <p className="text-[9.5px] text-slate-300 font-sans mt-0.5 opacity-90">
          পশ্চিমবঙ্গের হাজারো পরীক্ষার্থীর নির্ভরযোগ্য গন্তব্যস্থল
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${stat.color}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] text-slate-400 font-medium leading-none">
                {stat.label}
              </span>
              <span className="text-[12px] font-black text-white mt-1 font-sans leading-none">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
