import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Trash2, Edit3, Plus, X, Check, Save, 
  BookOpen, Briefcase, Shield, Trophy, Users, Award, 
  GraduationCap, Clock, Layers, Globe, HelpCircle, Activity, Star
} from 'lucide-react';
import { ExamCategory } from '../types';

interface CategoryManagerProps {
  categories: ExamCategory[];
  onSaveCategories: (updatedCats: ExamCategory[]) => void;
  onBack: () => void;
}

// Preset lucide icons that admins can choose from
const ICON_PRESETS = [
  { name: 'BookOpen', icon: BookOpen, label: 'বই (BookOpen)' },
  { name: 'Briefcase', icon: Briefcase, label: 'চাকরি (Briefcase)' },
  { name: 'Shield', icon: Shield, label: 'পুলিশ/নিরাপত্তা (Shield)' },
  { name: 'Trophy', icon: Trophy, label: 'সাফল্য (Trophy)' },
  { name: 'Users', icon: Users, label: 'পরীক্ষার্থী (Users)' },
  { name: 'Award', icon: Award, label: 'মেডেল (Award)' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'শিক্ষা (GraduationCap)' },
  { name: 'Clock', icon: Clock, label: 'সময় (Clock)' },
  { name: 'Layers', icon: Layers, label: 'সিলেবাস (Layers)' },
  { name: 'Globe', icon: Globe, label: 'ওয়েবসাইট (Globe)' },
  { name: 'Activity', icon: Activity, label: 'গতিবিধি (Activity)' },
  { name: 'Star', icon: Star, label: 'স্টার (Star)' }
];

// Emoji presets for quick select
const EMOJI_PRESETS = [
  '👮', '🏫', '🚇', '🏢', '🚆', '🎟️', '🔧', '🏦', '💳', '👥', 
  '✏️', '📐', '🩺', '🔬', '🌾', '📦', '🏺', '📝', '📖', '⚡', 
  '⚖️', '🎖️', '✈️', '⚓', '📮', '📨', '🏛️', '📚', '🌟', '🎯'
];

export default function CategoryManager({
  categories,
  onSaveCategories,
  onBack
}: CategoryManagerProps) {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formBengaliName, setFormBengaliName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIconName, setFormIconName] = useState('BookOpen');
  const [formEmoji, setFormEmoji] = useState('📚');
  const [formGradientClass, setFormGradientClass] = useState('from-indigo-500 to-blue-600');

  // Error and Success Toast States (Internal simple alert)
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper to trigger status messages
  const showStatus = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Auto-generate slug when Name is modified (only when not editing an existing slug manually)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormName(val);
    if (!formId) {
      // Auto slug conversion: lowercase, space to hyphen, remove special characters
      const autoSlug = val
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setFormSlug(autoSlug);
    }
  };

  // Open form for a new category
  const handleOpenNew = () => {
    setFormId('');
    setFormName('');
    setFormBengaliName('');
    setFormSlug('');
    setFormDescription('');
    setFormIconName('BookOpen');
    setFormEmoji('📚');
    setFormGradientClass('from-indigo-500 to-blue-600');
    setIsEditing(true);
    setErrorMsg('');
  };

  // Open form for editing an existing category
  const handleOpenEdit = (cat: ExamCategory) => {
    setFormId(cat.id);
    setFormName(cat.name || '');
    setFormBengaliName(cat.bengaliName || '');
    setFormSlug(cat.slug || cat.id || '');
    setFormDescription(cat.description || cat.subtitle || '');
    setFormIconName(cat.iconName || 'BookOpen');
    setFormEmoji(cat.emoji || '📚');
    setFormGradientClass(cat.gradientClass || 'from-indigo-500 to-blue-600');
    setIsEditing(true);
    setErrorMsg('');
  };

  // Delete category handler
  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি ডিলিট করতে চান?')) {
      const updated = categories.filter(c => c.id !== id);
      onSaveCategories(updated);
      showStatus('ক্যাটাগরি সফলভাবে ডিলিট করা হয়েছে।');
    }
  };

  // Submit form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formName.trim()) {
      showStatus('ইংরেজি নাম প্রয়োজন।', true);
      return;
    }
    if (!formBengaliName.trim()) {
      showStatus('বাংলা নাম প্রয়োজন।', true);
      return;
    }
    if (!formSlug.trim()) {
      showStatus('স্লাগ (Slug) প্রয়োজন।', true);
      return;
    }

    // Format slug
    const cleanedSlug = formSlug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Check slug uniqueness amongst OTHER categories
    const isSlugDuplicate = categories.some(
      c => c.slug?.toLowerCase() === cleanedSlug && c.id !== formId
    );
    if (isSlugDuplicate) {
      showStatus(`"${cleanedSlug}" স্লাগটি ইতিমধ্যে অন্য কোনো ক্যাটাগরিতে ব্যবহার করা হয়েছে। অন্য স্লাগ নির্বাচন করুন।`, true);
      return;
    }

    const finalCat: ExamCategory = {
      id: formId || 'cat-' + Date.now(),
      name: formName.trim(),
      bengaliName: formBengaliName.trim(),
      slug: cleanedSlug,
      description: formDescription.trim(),
      subtitle: formDescription.trim(), // Keep sync for backward compatibility
      iconName: formIconName,
      emoji: formEmoji,
      gradientClass: formGradientClass
    };

    let updatedList = [...categories];
    if (formId) {
      updatedList = updatedList.map(c => c.id === formId ? finalCat : c);
      showStatus('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!');
    } else {
      updatedList.push(finalCat);
      showStatus('নতুন ক্যাটাগরি সফলভাবে যুক্ত করা হয়েছে!');
    }

    onSaveCategories(updatedList);
    setIsEditing(false);
  };

  // Dynamic Icon Renderer inside preset selector or view
  const renderIconComponent = (iconName: string, className = "w-4 h-4") => {
    const matched = ICON_PRESETS.find(p => p.name === iconName);
    if (matched) {
      const IconComponent = matched.icon;
      return <IconComponent className={className} />;
    }
    return <BookOpen className={className} />;
  };

  // Filter current categories list based on search
  const filteredCategories = categories.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.bengaliName.toLowerCase().includes(q) ||
      (c.slug && c.slug.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800">ক্যাটাগরি কন্ট্রোল সেন্টার</h2>
            <p className="text-[10px] text-slate-400 font-bold">পরীক্ষার ক্যাটাগরি তৈরি, এডিট এবং ডিলেট পরিচালনা করুন</p>
          </div>
        </div>

        {!isEditing && (
          <button 
            onClick={handleOpenNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl active:scale-95 transition-all shadow-md flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> নতুন বিভাগ
          </button>
        )}
      </div>

      {/* Toast Alert Feedback Banner */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold animate-fadeIn">
          🎉 {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold animate-fadeIn">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ================= FORM MODE ================= */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-slate-150 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wide">
              {formId ? '📁 ক্যাটাগরি এডিট করুন' : '⚡ নতুন ক্যাটাগরি যুক্ত করুন'}
            </span>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5 text-xs font-bold text-slate-600">
            {/* Row 1: English Name and Bengali Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold block">বিভাগের নাম (English) <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  placeholder="যেমন: WB Police"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-all text-xs"
                  value={formName}
                  onChange={handleNameChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold block">বিভাগের নাম (Bengali) <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  placeholder="যেমন: পুলিশ প্রিপারেশন"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-all text-xs"
                  value={formBengaliName}
                  onChange={e => setFormBengaliName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Row 2: Slug and Description */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-extrabold block">ইউআরএল স্লাগ (Slug) <span className="text-rose-500">*</span></label>
              <input 
                type="text"
                placeholder="যেমন: wb-police"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 focus:bg-white focus:outline-none focus:border-indigo-400 transition-all text-xs"
                value={formSlug}
                onChange={e => setFormSlug(e.target.value)}
                required
              />
              <span className="text-[9px] text-slate-400 font-medium block">স্লাগটি ব্রাউজার ইউআরএল এবং সার্চ ফিল্টারে ব্যবহৃত হবে (শুধুমাত্র ছোট হাতের ইংরেজি ও হাইফেন)</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-extrabold block">ছোট বিবরণ বা সাবটাইটেল (Description)</label>
              <textarea 
                rows={2}
                placeholder="যেমন: পশ্চিমবঙ্গ পুলিশ কন্সটেবল ও সাব-ইন্সপেক্টর পরীক্ষার পূর্ণাঙ্গ সিলেবাস ভিত্তিক মক টেস্ট"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-indigo-400 transition-all text-xs leading-relaxed"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
            </div>

            {/* Row 3: Lucide Icon Preset Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-extrabold block">লুসিড আইকন নির্বাচন করুন (Lucide Icon Preset)</label>
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                {ICON_PRESETS.map(p => {
                  const IconComp = p.icon;
                  const isSelected = formIconName === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setFormIconName(p.name)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-md scale-105' 
                          : 'bg-white text-slate-600 border border-slate-150 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="text-[7.5px] truncate max-w-full font-bold">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 4: Emoji Quick Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-extrabold block">ইমোজি লোগো নির্বাচন করুন (Emoji Icon)</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="text"
                  maxLength={4}
                  className="w-12 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg focus:bg-white focus:outline-none focus:border-indigo-400"
                  value={formEmoji}
                  onChange={e => setFormEmoji(e.target.value)}
                />
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl flex-1">
                  {EMOJI_PRESETS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormEmoji(emoji)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm hover:bg-slate-200 transition-all ${
                        formEmoji === emoji ? 'bg-indigo-100 border border-indigo-300 scale-110' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 5: Gradient Background Class */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-extrabold block">গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড ক্লাস (Tailwind Gradient Class)</label>
              <select 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                value={formGradientClass}
                onChange={e => setFormGradientClass(e.target.value)}
              >
                <option value="from-indigo-500 to-blue-600">Indigo/Blue (ডিফল্ট)</option>
                <option value="from-emerald-500 to-teal-600">Emerald/Teal</option>
                <option value="from-rose-500 to-orange-600">Rose/Orange</option>
                <option value="from-purple-500 to-pink-600">Purple/Pink</option>
                <option value="from-sky-400 to-indigo-600">Sky/Indigo</option>
                <option value="from-amber-400 to-red-600">Amber/Red</option>
                <option value="from-slate-700 to-slate-900">Dark Charcoal</option>
              </select>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-extrabold transition-all"
            >
              বাতিল
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> সংরক্ষণ করুন
            </button>
          </div>
        </form>
      ) : (
        /* ================= LIST & SEARCH MODE ================= */
        <div className="space-y-3">
          {/* Search Box */}
          <div className="relative">
            <input 
              type="text"
              placeholder="ক্যাটাগরির নাম, স্লাগ বা বিবরণ দিয়ে খুঁজুন..."
              className="w-full px-3 py-2.5 pl-9 bg-white border border-slate-200 rounded-2xl text-xs font-bold shadow-sm focus:outline-none focus:border-indigo-400 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Grid List */}
          {filteredCategories.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-150 text-center shadow-sm">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-700">কোনো ম্যাচিং ক্যাটাগরি পাওয়া যায়নি!</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">অনুগ্রহ করে অনুসন্ধান শব্দ পরিবর্তন করুন বা নতুন তৈরি করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredCategories.map(c => (
                <div 
                  key={c.id} 
                  className="bg-white p-3.5 rounded-2xl border border-slate-150 flex items-start justify-between shadow-sm hover:border-slate-300 transition-all gap-2"
                >
                  <div className="flex gap-3 items-start flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradientClass || 'from-indigo-500 to-blue-600'} text-white flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden`}>
                      <span className="text-sm z-10">{c.emoji || '📚'}</span>
                      <div className="absolute right-[-4px] bottom-[-4px] opacity-20 text-white pointer-events-none">
                        {renderIconComponent(c.iconName || 'BookOpen', 'w-6 h-6 stroke-[3]')}
                      </div>
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-800 truncate">{c.bengaliName}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold font-mono">
                          /{c.slug || c.id}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-450 font-semibold truncate">
                        {c.name}
                      </p>
                      
                      {c.description && (
                        <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-tight">
                          {c.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-1 shrink-0 self-center">
                    <button 
                      onClick={() => handleOpenEdit(c)}
                      title="সম্পাদনা করুন"
                      className="p-2 bg-slate-50 border border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 rounded-xl active:scale-95 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      title="ডিলিট করুন"
                      className="p-2 bg-slate-50 border border-slate-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 rounded-xl active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
