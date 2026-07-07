import React, { useState } from 'react';
import { LayoutGrid, Search, X, Check, ArrowRight, ChevronDown, ChevronUp, BookOpen, Filter } from 'lucide-react';
import { ExamCategory, PostName } from '../types';

interface CategoryScrollProps {
  categories: ExamCategory[];
  posts?: PostName[]; // Dynamic subcategories/posts from DB
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedSubCategory: string | null;
  onSelectSubCategory: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTestsCount?: number;
}

const subCategoriesMap: Record<string, { id: string; name: string; bengaliName: string; emoji: string }[]> = {
  police: [
    { id: 'constable', name: 'Constable', bengaliName: 'কনস্টেবল প্রিপারেশন', emoji: '👮' },
    { id: 'si', name: 'Sub-Inspector', bengaliName: 'সাব-ইন্সপেক্টর (SI)', emoji: '⭐' },
    { id: 'kolkata', name: 'Kolkata Police', bengaliName: 'কলকাতা পুলিশ', emoji: '🏙️' },
    { id: 'excise', name: 'Excise', bengaliName: 'আবগারি পুলিশ', emoji: '👮‍♀️' }
  ],
  groupd: [
    { id: 'school-d', name: 'School', bengaliName: 'স্কুল গ্রুপ ডি', emoji: '🏫' },
    { id: 'rail-d', name: 'Railway', bengaliName: 'রেল গ্রুপ ডি', emoji: '🚇' },
    { id: 'dept-d', name: 'Dept', bengaliName: 'বিভাগীয় গ্রুপ ডি', emoji: '🏢' }
  ],
  clerkship: [
    { id: 'psc-clerk', name: 'Clerkship', bengaliName: 'পিএসসি ক্লার্কশিপ', emoji: '✒️' },
    { id: 'ldc', name: 'LDC', bengaliName: 'এলডিসি ও অফিস অ্যাসিস্ট্যান্ট', emoji: '💻' }
  ],
  railway: [
    { id: 'rrb-d', name: 'Railway', bengaliName: 'রেলওয়ে গ্রুপ ডি', emoji: '🚆' },
    { id: 'ntpc', name: 'NTPC', bengaliName: 'রেলওয়ে এনটিপিসি (NTPC)', emoji: '🎟️' },
    { id: 'alp', name: 'ALP', bengaliName: 'এএলপি ও টেকনিশিয়ান', emoji: '🔧' }
  ],
  bank: [
    { id: 'sbi', name: 'SBI', bengaliName: 'এসবিআই ক্লার্ক ও পিও', emoji: '🏦' },
    { id: 'ibps', name: 'IBPS', bengaliName: 'আইবিপিএস পরীক্ষা', emoji: '💳' },
    { id: 'coop', name: 'Cooperative', bengaliName: 'সমবায় ব্যাংক', emoji: '👥' }
  ],
  school: [
    { id: 'primary-tet', name: 'TET', bengaliName: 'প্রাইমারী টেট (TET)', emoji: '✏️' },
    { id: 'upper-primary', name: 'Upper', bengaliName: 'আপার প্রাইমারী', emoji: '📚' },
    { id: 'slst', name: 'SLST', bengaliName: 'এসএলএসটি (SLST)', emoji: '📐' }
  ],
  health: [
    { id: 'nurse', name: 'Nurse', bengaliName: 'স্টাফ নার্স নিয়োগ', emoji: '👩‍⚕️' },
    { id: 'anm-gnm', name: 'ANM', bengaliName: 'এএনএম ও জিএনএম', emoji: '🩺' },
    { id: 'lab', name: 'Lab', bengaliName: 'ল্যাব টেকনিশিয়ান', emoji: '🔬' }
  ],
  foodsi: [
    { id: 'sub-inspector', name: 'SI', bengaliName: 'ফুড সাব-ইন্সপেক্টর', emoji: '🌾' },
    { id: 'supply', name: 'Supply', bengaliName: 'সাপ্লাই অ্যাসিস্ট্যান্ট', emoji: '📦' }
  ],
  miscellaneous: [
    { id: 'psc-misc', name: 'Misc', bengaliName: 'পিএসসি মিসলেনিয়াস', emoji: '🏺' },
    { id: 'municipal', name: 'Municipal', bengaliName: 'মিউনিসিপ্যাল সার্ভিস', emoji: '🏘️' }
  ],
  wbcs: [
    { id: 'prelims', name: 'Prelims', bengaliName: 'ডাব্লুবিসিএস প্রিলিমস', emoji: '📝' },
    { id: 'mains', name: 'Mains', bengaliName: 'ডাব্লুবিসিএস মেনস', emoji: '📖' }
  ],
  kmc: [
    { id: 'registrar', name: 'Registrar', bengaliName: 'কেএমসি সাব-রেজিস্ট্রার', emoji: '📜' },
    { id: 'clerk', name: 'Clerk', bengaliName: 'কেএমসি ক্লার্ক', emoji: '📁' }
  ],
  electricity: [
    { id: 'wbsedcl-clerk', name: 'Electricity', bengaliName: 'বিদ্যুৎ দপ্তর অ্যাসিস্ট্যান্ট', emoji: '⚡' },
    { id: 'tech-iii', name: 'Technical', bengaliName: 'টেকনিক্যাল গ্রেড ৩', emoji: '🔌' }
  ],
  court: [
    { id: 'clerk', name: 'Court', bengaliName: 'লোয়ার কোর্ট ক্লার্ক', emoji: '⚖️' },
    { id: 'group-d', name: 'Group D', bengaliName: 'কোর্ট গ্রুপ ডি', emoji: '🚪' }
  ],
  defense: [
    { id: 'army', name: 'Army', bengaliName: 'আর্মি জিডি (Army GD)', emoji: '🎖️' },
    { id: 'airforce', name: 'Airforce', bengaliName: 'বিমান বাহিনী (Air Force)', emoji: '✈️' },
    { id: 'navy', name: 'Navy', bengaliName: 'নৌবাহিনী (Navy)', emoji: '⚓' }
  ],
  central: [
    { id: 'mts', name: 'MTS', bengaliName: 'এসএসসি এমটিএস (MTS)', emoji: '📮' },
    { id: 'chsl', name: 'CHSL', bengaliName: 'এসএসসি সিএইচএসএল (CHSL)', emoji: '📨' },
    { id: 'cgl', name: 'CGL', bengaliName: 'এসএসসি সিজিএল (CGL)', emoji: '🏛️' }
  ]
};

export default function CategoryScroll({
  categories,
  posts,
  selectedCategory,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory,
  searchQuery,
  onSearchChange,
  totalTestsCount = 0
}: CategoryScrollProps) {
  const [isTrayExpanded, setIsTrayExpanded] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  // Filter categories based on search input or show all
  const filteredCategories = categories.filter(cat => {
    const query = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query) ||
      cat.bengaliName.toLowerCase().includes(query) ||
      (cat.subtitle && cat.subtitle.toLowerCase().includes(query))
    );
  });

  const showToggle = filteredCategories.length > 6 && !selectedCategory && !searchQuery.trim();
  const displayedCategories = showToggle && !isCategoriesExpanded 
    ? filteredCategories.slice(0, 6) 
    : filteredCategories;

  const activeSubCategories = selectedCategory
    ? (posts && posts.length > 0
        ? posts.filter(p => p.categoryId === selectedCategory).map(p => ({
            id: p.id,
            name: p.id, // Use post ID to match against mock test postId
            bengaliName: p.bengaliName,
            emoji: '💼'
          }))
        : subCategoriesMap[selectedCategory] || [])
    : [];

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // Toggle off
      onSelectCategory(null);
      onSelectSubCategory(null);
    } else {
      onSelectCategory(categoryId);
      onSelectSubCategory(null); // Reset sub-category on changing category
      setIsTrayExpanded(true);

      // Auto-scroll to the filtered mock tests list
      setTimeout(() => {
        const anchor = document.getElementById('mock-tests-list-anchor');
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    }
  };

  const handleClearFilters = () => {
    onSelectCategory(null);
    onSelectSubCategory(null);
    onSearchChange('');
  };

  return (
    <div className="w-full space-y-4" id="exam-categories-section">
      {/* 1. Elegant Title & Quick Reset Row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <LayoutGrid className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">
              পরীক্ষার বিভাগ সমূহ (Interactive Categories)
            </h3>
            <p className="text-[10px] text-slate-400 font-sans">
              আপনার পছন্দের ক্যাটাগরি বা সাব-ক্যাটাগরি সিলেক্ট করুন
            </p>
          </div>
        </div>
        
        {(selectedCategory || selectedSubCategory || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="text-[11px] font-black text-rose-500 hover:text-white hover:bg-rose-500 transition-all bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm border border-rose-200 dark:border-rose-900/50 active:scale-95"
            id="clear-all-category-filters"
          >
            <X className="w-3.5 h-3.5 stroke-[3]" />
            সব মুছুন
          </button>
        )}
      </div>

      {/* 2. Unified High Fidelity Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Search className="w-4.5 h-4.5 stroke-[2.5]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="নির্দিষ্ট মক টেস্ট বা পরীক্ষার নাম খুঁজুন... (যেমন: WBP, Clerkship, Food SI)"
          className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none shadow-sm dark:shadow-none transition-all duration-300"
          id="exam-category-search-bar"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="সার্চ মুছুন"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* 3. Category Grid - Scrollable & Touch Optimized */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pb-2">
        {displayedCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`group relative text-left p-3 rounded-2xl border transition-all duration-300 active:scale-98 focus:outline-none flex flex-col justify-between cursor-pointer min-h-[92px] overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500 text-white shadow-md shadow-blue-500/15 scale-[1.01]'
                  : 'bg-white dark:bg-slate-900 border-slate-150/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:scale-[1.01] hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
              id={`category-card-${cat.id}`}
            >
              {/* Dynamic subtle background decoration */}
              {!isSelected && cat.gradientClass && (
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradientClass.split(' border-')[0]} opacity-[0.8] -z-10`} />
              )}
              {isSelected && (
                <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/10 rounded-full blur-md"></div>
              )}

              {/* Emoji/Icon container */}
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110 select-none">
                  {cat.emoji || '💼'}
                </span>
                
                {isSelected ? (
                  <span className="bg-white text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none font-sans flex items-center gap-0.5 shadow-sm">
                    <Check className="w-2 h-2 stroke-[4]" /> ACTIVE
                  </span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                )}
              </div>

              {/* Title & Stats */}
              <div className="min-w-0">
                <h4 className={`text-xs md:text-[13px] font-extrabold truncate tracking-tight leading-snug ${
                  isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {cat.bengaliName}
                </h4>
                <p className={`text-[9px] md:text-[10px] font-medium truncate mt-0.5 ${
                  isSelected ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {cat.subtitle || cat.name}
                </p>
              </div>
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="col-span-full text-center p-6 bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-sans font-bold">কোনো ক্যাটাগরি পাওয়া যায়নি। সার্চ কী-ওয়ার্ড পরিবর্তন করুন।</p>
          </div>
        )}
      </div>

      {showToggle && (
        <div className="flex justify-center pt-1 pb-2">
          <button
            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            className="flex items-center gap-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-[11px] font-black text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-slate-850 transition-all shadow-sm cursor-pointer active:scale-95"
            id="toggle-categories-expansion"
          >
            <span>
              {isCategoriesExpanded 
                ? 'কম ক্যাটাগরি দেখুন (Collapse)' 
                : `সব ক্যাটাগরি দেখুন (${filteredCategories.length}টি)`}
            </span>
            {isCategoriesExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      {/* 4. Sub-Categories Tray (Revealed upon selecting a category) */}
      {selectedCategory && (
        <div 
          className="bg-blue-50/65 dark:bg-slate-900/50 border border-blue-100/70 dark:border-slate-800/70 rounded-2xl p-4 animate-slideDown shadow-inner"
          id={`subcategory-tray-${selectedCategory}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-100/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="text-base">📁</span>
              <h5 className="text-[12px] font-extrabold text-slate-800 dark:text-white">
                {categories.find(c => c.id === selectedCategory)?.bengaliName} বিভাগের সাব-ক্যাটাগরি সমূহ
              </h5>
            </div>
            
            <button
              onClick={() => setIsTrayExpanded(!isTrayExpanded)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-500"
            >
              {isTrayExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Subcategory Pills */}
          {isTrayExpanded && (
            <div className="space-y-4">
              {activeSubCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeSubCategories.map((sub) => {
                    const isSubSelected = selectedSubCategory === sub.name;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          const isSubSelected = selectedSubCategory === sub.name;
                          onSelectSubCategory(isSubSelected ? null : sub.name);

                          // Auto-scroll to the filtered mock tests list
                          setTimeout(() => {
                            const anchor = document.getElementById('mock-tests-list-anchor');
                            if (anchor) {
                              anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 120);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isSubSelected
                            ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/10'
                            : 'bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-150 dark:border-slate-800'
                        }`}
                        id={`subcategory-pill-${sub.id}`}
                      >
                        <span className="text-sm select-none">{sub.emoji}</span>
                        <span>{sub.bengaliName}</span>
                        {isSubSelected && <span className="text-[8px] bg-white text-blue-600 font-extrabold px-1 rounded-sm">✓</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-2 text-center text-slate-400 text-[11px] font-bold">
                  এই বিভাগের অধীনে কোনো পৃথক সাব-ক্যাটাগরি নেই। সরাসরি নিচের টেস্টগুলিতে ক্লিক করুন।
                </div>
              )}

              {/* Direct Access Mock Tests Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-150/60 dark:border-slate-800/60 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11.5px] font-bold text-slate-600 dark:text-slate-400">
                    ফিল্টারড মক টেস্ট সংখ্যা: <strong className="text-slate-800 dark:text-white font-black">{totalTestsCount}টি</strong>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedSubCategory && (
                    <button
                      onClick={() => onSelectSubCategory(null)}
                      className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      সাব-ক্যাটাগরি মুছুন
                    </button>
                  )}
                  
                  <a
                    href="#mock-tests-list-anchor"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span>সরাসরি টেস্ট দিন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
