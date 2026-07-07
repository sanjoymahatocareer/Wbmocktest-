import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Edit3, Trash2, Save, X, Layers, Settings, CreditCard, 
  Bell, HelpCircle, ChevronRight, Sliders, Globe, Star, Mail, Shield, 
  Trash, ChevronUp, ChevronDown, CheckCircle, Smartphone, Award, Terminal
} from 'lucide-react';
import { ExamCategory, CustomTemplate, CustomTemplateField, PostName, MockTest } from '../types';

interface AdminMoreViewsProps {
  viewType: 'categories' | 'templates' | 'fields' | 'premium' | 'notifications' | 'settings' | 'more';
  categories: ExamCategory[];
  templates: CustomTemplate[];
  posts: PostName[];
  mockTests: MockTest[];
  onSaveCategory: (cat: Partial<ExamCategory>) => void;
  onDeleteCategory: (id: string) => void;
  onSaveTemplate: (tpl: Partial<CustomTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onGoToView: (view: any) => void;
  onGoBack: () => void;
}

export default function AdminMoreViews({
  viewType,
  categories,
  templates,
  posts,
  mockTests,
  onSaveCategory,
  onDeleteCategory,
  onSaveTemplate,
  onDeleteTemplate,
  onGoToView,
  onGoBack
}: AdminMoreViewsProps) {
  
  // 1. Categories Page State
  const [editingCategory, setEditingCategory] = useState<Partial<ExamCategory> | null>(null);

  // 2. Custom Template Builder State
  const [editingTemplate, setEditingTemplate] = useState<Partial<CustomTemplate> | null>(null);
  const [subjectList, setSubjectList] = useState<{ subject: string; count: number; marks: number }[]>([
    { subject: 'Bengali', count: 25, marks: 25 },
    { subject: 'English', count: 25, marks: 25 },
    { subject: 'Mathematics', count: 25, marks: 25 },
    { subject: 'GK', count: 25, marks: 25 }
  ]);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCount, setNewSubCount] = useState(25);

  // 3. Dynamic Fields State
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [customFields, setCustomFields] = useState<CustomTemplateField[]>([
    { name: 'vacancy', label: 'Vacancy / শূন্যপদ সংখ্যা', type: 'number', placeholder: 'যেমন: ১২০০' },
    { name: 'qualification', label: 'Qualification / শিক্ষাগত যোগ্যতা', type: 'text', placeholder: 'যেমন: Graduate' }
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'number' | 'date'>('text');

  // 4. Premium Plans State
  const [premiumPlans, setPremiumPlans] = useState([
    { id: 'free', name: 'Free Plan', price: '৳ ০', features: 'সীমিত টেস্ট, অ্যাড সমর্থিত', active: true },
    { id: 'monthly', name: 'Monthly Premium', price: '৳ ৯৯', features: 'আনলিমিটেড মক টেস্ট, নো-অ্যাডস, পিডিএফ ডাউনলোড', active: true },
    { id: 'yearly', name: 'Yearly Premium', price: '৳ ৯৯৯', features: 'আনলিমিটেড মক টেস্ট, ২৪/৭ সাপোর্ট, স্পেশাল গাইড', active: true }
  ]);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPlanPrice, setEditPlanPrice] = useState('');

  // 5. Notifications State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifAudience, setNotifAudience] = useState('all');
  const [notifChannel, setNotifChannel] = useState<'web' | 'push' | 'email'>('web');

  // 6. Settings Category Tab
  const [settingsTab, setSettingsTab] = useState<'general' | 'exam' | 'seo' | 'ads' | 'social'>('general');

  // Helpers
  const handleSaveCategoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.bengaliName) {
      alert('অনুগ্রহ করে নাম পূরণ করুন!');
      return;
    }
    onSaveCategory(editingCategory);
    setEditingCategory(null);
  };

  const handleSaveTemplateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate?.name) {
      alert('অনুগ্রহ করে টেমপ্লেট নাম পূরণ করুন!');
      return;
    }
    onSaveTemplate({
      ...editingTemplate,
      fields: customFields
    });
    setEditingTemplate(null);
    alert('টেমপ্লেট প্যাটার্ন সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // Subject distribution reorders
  const moveSubject = (index: number, direction: 'up' | 'down') => {
    const list = [...subjectList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setSubjectList(list);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      
      {/* --------------------------- */}
      {/* 1. EXAM CATEGORY MANAGEMENT */}
      {/* --------------------------- */}
      {viewType === 'categories' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">ক্যাটাগরি ম্যানেজার</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">চাকরি ও পরীক্ষা ক্যাটাগরি সমূহ</p>
              </div>
            </div>
            <button 
              onClick={() => setEditingCategory({ name: '', bengaliName: '', iconName: 'BookOpen', subtitle: '' })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> ক্যাটাগরি
            </button>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            {editingCategory && (
              <form onSubmit={handleSaveCategoryForm} className="bg-white p-4 rounded-3xl border border-indigo-150 space-y-4 shadow-sm">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">ক্যাটাগরি ফর্ম</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">ক্যাটাগরি নাম (English)</label>
                    <input 
                      type="text"
                      value={editingCategory.name || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="যেমন: WB Police"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">ক্যাটাগরি নাম (বাংলায়)</label>
                    <input 
                      type="text"
                      value={editingCategory.bengaliName || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, bengaliName: e.target.value })}
                      placeholder="যেমন: পশ্চিমবঙ্গ পুলিশ"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">সাবটাইটেল / বর্ণনা</label>
                    <input 
                      type="text"
                      value={editingCategory.subtitle || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                      placeholder="যেমন: Constable, Lady Constable, SI"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Category Cards List */}
            <div className="space-y-3">
              {categories.map(cat => {
                const countPosts = posts.filter(p => p.categoryId === cat.id).length;
                const countTests = mockTests.filter(t => t.examType === cat.id).length;
                
                return (
                  <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                        <span className="text-sm">{cat.emoji || '🎓'}</span> {cat.bengaliName}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">{cat.name} • {cat.subtitle}</p>
                      <div className="flex gap-2 text-[9px] font-bold text-slate-400 mt-1">
                        <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">পোস্ট: {countPosts}টি</span>
                        <span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">মক টেস্ট: {countTests}টি</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button 
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- */}
      {/* 2. CUSTOM TEMPLATE BUILDER */}
      {/* --------------------------- */}
      {viewType === 'templates' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">রিক্রুটমেন্ট টেমপ্লেট বিল্ডার</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">পরীক্ষার প্যাটার্ন ও সাবজেক্ট ডিস্ট্রিবিউশন</p>
              </div>
            </div>
            <button 
              onClick={() => setEditingTemplate({ name: '', fields: [] })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> টেমপ্লেট
            </button>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            {editingTemplate && (
              <form onSubmit={handleSaveTemplateForm} className="bg-white p-4 rounded-3xl border border-indigo-150 space-y-4 shadow-sm">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">নতুন টেমপ্লেট</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">টেমপ্লেট এর নাম</label>
                    <input 
                      type="text"
                      value={editingTemplate.name || ''}
                      onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      placeholder="যেমন: Panchayat Pattern Template 2026"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  {/* Subject distribution editor inside template */}
                  <div className="p-3 bg-slate-50 rounded-2xl border space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">সাবজেক্ট ডিস্ট্রিবিউশন (Subject Distribution)</span>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newSubName} 
                        onChange={e => setNewSubName(e.target.value)}
                        placeholder="যেমন: History" 
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                      />
                      <input 
                        type="number" 
                        value={newSubCount} 
                        onChange={e => setNewSubCount(parseInt(e.target.value))}
                        placeholder="25" 
                        className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none text-center"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!newSubName) return;
                          setSubjectList([...subjectList, { subject: newSubName, count: newSubCount, marks: newSubCount }]);
                          setNewSubName('');
                        }}
                        className="px-3 bg-indigo-600 text-white text-xs font-black rounded-lg cursor-pointer"
                      >
                        + যোগ
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {subjectList.map((sub, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between text-[11px]">
                          <div className="font-bold text-slate-700">
                            {sub.subject} — <span className="text-indigo-600">{sub.count}টি প্রশ্ন</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => moveSubject(idx, 'up')} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded"><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => moveSubject(idx, 'down')} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded"><ChevronDown className="w-3.5 h-3.5" /></button>
                            <button 
                              type="button" 
                              onClick={() => setSubjectList(subjectList.filter((_, i) => i !== idx))}
                              className="p-1 hover:bg-slate-50 text-rose-500 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setEditingTemplate(null)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm"
                  >
                    টেম্পলেট সংরক্ষণ ➔
                  </button>
                </div>
              </form>
            )}

            {/* Template Cards list */}
            <div className="space-y-3">
              {templates.map(tpl => (
                <div key={tpl.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-xs">
                  <div>
                    <h3 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-500" /> {tpl.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">কাস্টম ফিল্ড সংখ্যা: {tpl.fields?.length || 10}টি</p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      onClick={() => onDeleteTemplate(tpl.id)}
                      className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------- */}
      {/* 3. DYNAMIC POST & FORM FIELD MANAGER */}
      {/* ------------------------------------- */}
      {viewType === 'fields' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">ডাইনামিক ফিল্ড ম্যানেজার</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">নিয়োগ ফরমের ইনপুট ফিল্ডস কন্ট্রোলার</p>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            {/* Category Select header */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">ক্যাটাগরি নির্বাচন করুন:</label>
              <select 
                value={selectedCatId}
                onChange={e => setSelectedCatId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.bengaliName}</option>
                ))}
              </select>
            </div>

            {/* Field creation form inside */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">নতুন ফিল্ড তৈরি করুন</span>
              
              <div className="space-y-2.5 pt-1.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ফিল্ড এর নাম (ইংরেজি - যেমন: salary)</label>
                  <input 
                    type="text"
                    value={newFieldName}
                    onChange={e => setNewFieldName(e.target.value)}
                    placeholder="যেমন: ageLimit"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">লেবেল (বাংলা ও ইংরেজি)</label>
                  <input 
                    type="text"
                    value={newFieldLabel}
                    onChange={e => setNewFieldLabel(e.target.value)}
                    placeholder="যেমন: Age Limit / বয়সসীমা"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">টাইপ</label>
                  <select
                    value={newFieldType}
                    onChange={e => setNewFieldType(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white outline-none"
                  >
                    <option value="text">Text (লেখা)</option>
                    <option value="textarea">Textarea (দীর্ঘ লেখা)</option>
                    <option value="number">Number (সংখ্যা)</option>
                    <option value="date">Date (তারিখ)</option>
                  </select>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    if (!newFieldName || !newFieldLabel) return;
                    setCustomFields([...customFields, { name: newFieldName, label: newFieldLabel, type: newFieldType }]);
                    setNewFieldName('');
                    setNewFieldLabel('');
                    alert('সফলভাবে ডাইনামিক ফিল্ড যুক্ত হয়েছে!');
                  }}
                  className="w-full py-2 bg-indigo-600 text-white text-[11px] font-black rounded-xl cursor-pointer shadow-sm"
                >
                  + ফিল্ড যুক্ত করুন
                </button>
              </div>
            </div>

            {/* Fields list */}
            <div className="space-y-2">
              {customFields.map((field, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between text-xs font-bold">
                  <div>
                    <p className="text-slate-800">{field.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">কী (Key): {field.name} • টাইপ: {field.type}</p>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setCustomFields(customFields.filter((_, i) => i !== idx))}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ------------------------- */}
      {/* 4. PREMIUM PLANS & LIST  */}
      {/* ------------------------- */}
      {viewType === 'premium' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">প্রিমিয়াম প্ল্যান ও পেমেন্ট লোগ</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">মেম্বারশিপ সাবস্ক্রিপশন প্ল্যান সমূহ</p>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Active Plans card */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <span className="text-[10px] bg-amber-50 text-amber-800 font-black px-2 py-0.5 rounded-full">সক্রিয় মেম্বারশিপ প্ল্যান</span>
              
              <div className="space-y-3 pt-1.5">
                {premiumPlans.map(plan => (
                  <div key={plan.id} className="p-3 bg-slate-50 rounded-2xl border flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-black text-slate-800">{plan.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{plan.features}</p>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      {editingPlanId === plan.id ? (
                        <div className="flex gap-1.5 items-center">
                          <input 
                            type="text" 
                            value={editPlanPrice}
                            onChange={e => setEditPlanPrice(e.target.value)}
                            className="w-16 px-2 py-1 border rounded text-center text-xs font-black"
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              setPremiumPlans(premiumPlans.map(p => p.id === plan.id ? { ...p, price: editPlanPrice } : p));
                              setEditingPlanId(null);
                            }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-black text-indigo-600">{plan.price}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingPlanId(plan.id);
                              setEditPlanPrice(plan.price);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Transaction logs */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">সাম্প্রতিক পেমেন্ট হিস্ট্রি (Raw Payments list)</span>
              
              <div className="space-y-2 pt-1.5">
                {[
                  { user: 'prokashmal799@gmail.com', txn: 'TXN8930489', plan: 'Yearly Premium', amt: '৳ ৯৯৯', status: 'SUCCESS', date: 'আজ সকাল ১০:১২' },
                  { user: 'rahulroy22@gmail.com', txn: 'TXN4839281', plan: 'Monthly Premium', amt: '৳ ৯৯', status: 'SUCCESS', date: 'গতকাল সন্ধ্যা ০৭:৩০' }
                ].map((txn, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-xl border text-[11px] leading-tight space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span className="truncate max-w-[170px]">{txn.user}</span>
                      <span className="text-indigo-600">{txn.amt}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Txn: {txn.txn} • {txn.plan}</span>
                      <span className="text-emerald-600 font-bold">{txn.status}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 font-medium text-right">{txn.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --------------------------- */}
      {/* 5. NOTIFICATION CENTER      */}
      {/* --------------------------- */}
      {viewType === 'notifications' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">ব্রডকাস্ট নোটিফিকেশন সেন্টার</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">প্রার্থীদের পুশ নোটিফিকেশন প্রেরণ করুন</p>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Create notification form */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">নোটিফিকেশন পাঠান</span>
              
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">নোটিফিকেশন টাইটেল (Title)</label>
                  <input 
                    type="text"
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    placeholder="যেমন: নতুন মক টেস্ট প্রস্তুত!"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">বার্তা বিবরণ (Message content)</label>
                  <textarea 
                    value={notifMsg}
                    onChange={e => setNotifMsg(e.target.value)}
                    placeholder="এখানে আপনার বার্তাটি টাইপ করুন..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                {/* Target audiences */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">টার্গেট অডিয়েন্স (Target Audience)</label>
                  <select 
                    value={notifAudience}
                    onChange={e => setNotifAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none"
                  >
                    <option value="all">সকল নিবন্ধিত ইউজার (All Users)</option>
                    <option value="free">শুধুমাত্র ফ্রি ইউজার (Free Users only)</option>
                    <option value="premium">শুধুমাত্র প্রিমিয়াম ইউজার (Premium Users only)</option>
                  </select>
                </div>

                {/* Channels selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">বার্তা পাঠানোর মাধ্যম</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNotifChannel('web')}
                      className={`py-2 px-1.5 rounded-xl text-[10.5px] font-black border transition-all cursor-pointer ${
                        notifChannel === 'web' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <Globe className="w-4 h-4 mx-auto mb-1 text-slate-400" /> Website
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifChannel('push')}
                      className={`py-2 px-1.5 rounded-xl text-[10.5px] font-black border transition-all cursor-pointer ${
                        notifChannel === 'push' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1 text-slate-400" /> App Push
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifChannel('email')}
                      className={`py-2 px-1.5 rounded-xl text-[10.5px] font-black border transition-all cursor-pointer ${
                        notifChannel === 'email' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <Mail className="w-4 h-4 mx-auto mb-1 text-slate-400" /> Email
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!notifTitle || !notifMsg) return;
                    setNotifTitle('');
                    setNotifMsg('');
                    alert('নোটিফিকেশন ব্রডকাস্ট সফলভাবে পাঠানো হয়েছে!');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm transition-all text-center"
                >
                  ব্রডকাস্ট পাঠান ➔
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --------------------------- */}
      {/* 6. WEBSITE GLOBAL SETTINGS */}
      {/* --------------------------- */}
      {viewType === 'settings' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">গ্লোবাল ওয়েবসাইট সেটিংস</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">WBMockTest কনফিগারেশন প্যানেল</p>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Categorized Settings Tabs */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-150 overflow-x-auto no-scrollbar scroll-smooth">
              {(['general', 'exam', 'seo', 'ads', 'social'] as const).map(tab => {
                const labels = { general: 'সাধারণ', exam: 'মক টেস্ট', seo: 'SEO', ads: 'AdSense', social: 'লিঙ্কস' };
                return (
                  <button
                    key={tab}
                    onClick={() => setSettingsTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black transition-all cursor-pointer ${
                      settingsTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Settings Forms cards */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              
              {settingsTab === 'general' && (
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">সাধারণ তথ্য</span>
                  <div>
                    <label className="mb-1 block">ওয়েবসাইট নাম (Site Name)</label>
                    <input type="text" defaultValue="WBMockTest" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">ট্যাগলাইন (Tagline)</label>
                    <input type="text" defaultValue="WB Competitive Exam Practice Portal" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">অ্যাডমিন ইমেল (Admin Contact Email)</label>
                    <input type="email" defaultValue="admin@wbmocktest.in" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </div>
              )}

              {settingsTab === 'exam' && (
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">ডিফল্ট মক টেস্ট কনফিগ</span>
                  <div>
                    <label className="mb-1 block">ডিফল্ট পরীক্ষা সময়কাল (Default Duration)</label>
                    <input type="number" defaultValue={60} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">ডিফল্ট পাস মার্ক (Default Passing Score)</label>
                    <input type="number" defaultValue={40} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">নেগেটিভ মার্কিং পেনাল্টি</label>
                    <input type="text" defaultValue="0.25" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </div>
              )}

              {settingsTab === 'seo' && (
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">ডিফল্ট হোমপেজ SEO</span>
                  <div>
                    <label className="mb-1 block">ডিফল্ট এসইও টাইটেল (SEO Meta Title)</label>
                    <input type="text" defaultValue="WBMockTest - West Bengal Job Preparation Portal" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">মেটা ডেসক্রিপশন (SEO Meta Description)</label>
                    <textarea rows={2.5} defaultValue="WB Police, Panchayat, Primary TET এবং PSC পরীক্ষার সেরা অনলাইন মক টেস্ট পোর্টাল।" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </div>
              )}

              {settingsTab === 'ads' && (
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">Google AdSense বিজ্ঞাপন স্লট</span>
                  <div>
                    <label className="mb-1 block">AdSense Publisher ID</label>
                    <input type="text" defaultValue="pub-984294029401" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">হেডার ব্যানার স্লট (Header Ad Slot ID)</label>
                    <input type="text" defaultValue="ad-header-101" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </div>
              )}

              {settingsTab === 'social' && (
                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black">সোশ্যাল মিডিয়া প্রোফাইল লিঙ্কস</span>
                  <div>
                    <label className="mb-1 block">Telegram চ্যানেল লিঙ্ক</label>
                    <input type="text" defaultValue="https://t.me/wbmocktest" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-1 block">YouTube চ্যানেল লিঙ্ক</label>
                    <input type="text" defaultValue="https://youtube.com/wbmocktest" className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => alert('কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm text-center"
              >
                সেটিংস সেভ করুন
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ------------------------- */}
      {/* 7. MORE MENU GENERAL NAV */}
      {/* ------------------------- */}
      {viewType === 'more' && (
        <div className="min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-8 relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 opacity-10 translate-x-3 -translate-y-3">
              <Terminal className="w-36 h-36" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                <Settings className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h2 className="text-base font-black">কন্ট্রোল ও অ্যাডমিন প্যানেল</h2>
                <p className="text-[10px] text-blue-100 font-bold opacity-80">WBMockTest এর যাবতীয় সিস্টেম সেটিংস</p>
              </div>
            </div>
          </div>

          {/* Settings list groups */}
          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Quick sections */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              
              <button 
                onClick={() => onGoToView('categories')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xs"><Layers className="w-4 h-4" /></div>
                  <span className="text-xs font-black text-slate-700">ক্যাটাগরি সমূহ পরিচালনা (Exam Categories)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => onGoToView('templates')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-xs"><Sliders className="w-4 h-4" /></div>
                  <span className="text-xs font-black text-slate-700">টেমপ্লেট বিল্ডার (Template Patterns)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => onGoToView('fields')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xs"><Sliders className="w-4 h-4" /></div>
                  <span className="text-xs font-black text-slate-700">ডাইনামিক ফরম ফিল্ডস (Form Field Manager)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => onGoToView('premium')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs"><CreditCard className="w-4 h-4" /></div>
                  <span className="text-xs font-black text-slate-700">মেম্বারশিপ প্ল্যান ও পেমেন্ট ট্র্যাকার</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => onGoToView('notifications')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs"><Bell className="w-4 h-4" /></div>
                  <span className="text-xs font-black text-slate-700">ব্রডকাস্ট নোটিফিকেশন সেন্টার</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => onGoToView('settings')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs"><Settings className="w-4 h-4" /></div>
                  <span className="text-xs font-black text-slate-700">হোমপেজ ও জেনারেল সেটিংস</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
