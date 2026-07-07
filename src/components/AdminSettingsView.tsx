import React, { useState } from 'react';
import { 
  Settings, Layers, Sparkles, HelpCircle, Save, Bell, Plus, Trash2, 
  ChevronDown, ChevronUp, Check, ArrowLeft, ArrowRight, Play, Edit3 
} from 'lucide-react';
import { ExamCategory, CustomTemplate, CustomTemplateField } from '../types';
import CategoryManager from './CategoryManager';

interface AdminSettingsViewProps {
  categories: ExamCategory[];
  templates: CustomTemplate[];
  onSaveCategories: (cats: ExamCategory[]) => void;
  onSaveTemplates: (tpls: CustomTemplate[]) => void;
  onBack: () => void;
  initialSubView?: 'menu' | 'categories' | 'templates' | 'fields' | 'website' | 'notifications';
}

export default function AdminSettingsView({
  categories,
  templates,
  onSaveCategories,
  onSaveTemplates,
  onBack,
  initialSubView = 'menu'
}: AdminSettingsViewProps) {
  const [subView, setSubView] = useState<'menu' | 'categories' | 'templates' | 'fields' | 'website' | 'notifications'>(initialSubView);

  React.useEffect(() => {
    setSubView(initialSubView);
  }, [initialSubView]);

  // Reusable Template Builder state
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'number' | 'richtext'>('text');

  // Website Settings form State
  const [siteName, setSiteName] = useState('WBMockTest');
  const [tagline, setTagline] = useState('পশ্চিমবঙ্গের সেরা প্রতিযোগিতামূলক মক টেস্ট পোর্টাল');
  const [adminEmail, setAdminEmail] = useState('prokashmal799@gmail.com');
  const [adsPublisherId, setAdsPublisherId] = useState('pub-382903829038290');
  const [isNegativeMarkingEnabled, setIsNegativeMarkingEnabled] = useState(true);

  // Notification center form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifAudience, setNotifAudience] = useState<'all' | 'free' | 'premium'>('all');
  const [notifSentLog, setNotifSentLog] = useState<any[]>([
    { title: 'নতুন মক টেস্ট যুক্ত করা হয়েছে!', audience: 'All', date: '2026-07-06 05:30 PM', count: 1240 },
    { title: 'পরীক্ষার অফার! মেম্বারশিপ ফি ডিসকাউন্ট', audience: 'Free Users', date: '2026-07-02 11:00 AM', count: 850 }
  ]);
  const [notifSuccess, setNotifSuccess] = useState('');

  // 2. Custom Templates CRUD
  const handleSaveTemplate = () => {
    if (!editingTemplate.name) return;
    let updated = [...templates];
    const finalTpl: CustomTemplate = {
      id: editingTemplate.id || 'tpl-' + Date.now(),
      name: editingTemplate.name,
      fields: editingTemplate.fields || []
    };

    if (editingTemplate.id) {
      updated = updated.map(t => t.id === editingTemplate.id ? finalTpl : t);
    } else {
      updated.push(finalTpl);
    }

    onSaveTemplates(updated);
    setEditingTemplate(null);
  };

  const handleAddFieldToTemplate = () => {
    if (!newFieldName.trim() || !newFieldLabel.trim()) return;
    const currentFields = editingTemplate.fields || [];
    
    const newField: CustomTemplateField = {
      name: newFieldName.toLowerCase().replace(/\s+/g, '_'),
      label: newFieldLabel,
      type: newFieldType,
      placeholder: `তথ্য লিখুন...`
    };

    setEditingTemplate({
      ...editingTemplate,
      fields: [...currentFields, newField]
    });

    setNewFieldName('');
    setNewFieldLabel('');
  };

  const handleRemoveFieldFromTemplate = (idx: number) => {
    const currentFields = [...(editingTemplate.fields || [])];
    currentFields.splice(idx, 1);
    setEditingTemplate({ ...editingTemplate, fields: currentFields });
  };

  const handleReorderField = (idx: number, dir: 'up' | 'down') => {
    const currentFields = [...(editingTemplate.fields || [])];
    if (dir === 'up' && idx > 0) {
      const temp = currentFields[idx];
      currentFields[idx] = currentFields[idx - 1];
      currentFields[idx - 1] = temp;
    } else if (dir === 'down' && idx < currentFields.length - 1) {
      const temp = currentFields[idx];
      currentFields[idx] = currentFields[idx + 1];
      currentFields[idx + 1] = temp;
    }
    setEditingTemplate({ ...editingTemplate, fields: currentFields });
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const newLog = {
      title: notifTitle,
      audience: notifAudience === 'all' ? 'All' : notifAudience === 'free' ? 'Free Users' : 'Premium Users',
      date: '2026-07-07 10:45 AM',
      count: notifAudience === 'all' ? 1240 : notifAudience === 'free' ? 850 : 390
    };

    setNotifSentLog([newLog, ...notifSentLog]);
    setNotifTitle('');
    setNotifMessage('');
    setNotifSuccess('নোটিফিকেশনটি সফলভাবে প্রেরিত হয়েছে!');
    setTimeout(() => setNotifSuccess(''), 4000);
  };

  return (
    <div className="space-y-4">
      {subView === 'menu' ? (
        /* ================= SETTINGS MAIN GRID MENU ================= */
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Settings className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-black text-slate-800">সাইট সেটিংস ও কন্ট্রোল প্যানেল</h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <button 
              onClick={() => setSubView('categories')}
              className="p-3.5 bg-white border border-slate-150 hover:border-indigo-400 rounded-2xl flex items-center justify-between text-left shadow-sm active:scale-98 transition-all"
            >
              <div>
                <span className="text-xs font-black text-slate-800 block">📁 ক্যাটাগরি ম্যানেজমেন্ট</span>
                <span className="text-[10px] text-slate-400 font-bold block">পরীক্ষার ক্যাটাগরি ও নোটিফিকেশন বিভাগ তৈরি করুন</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => setSubView('templates')}
              className="p-3.5 bg-white border border-slate-150 hover:border-indigo-400 rounded-2xl flex items-center justify-between text-left shadow-sm active:scale-98 transition-all"
            >
              <div>
                <span className="text-xs font-black text-slate-800 block">📋 কাস্টম টেমপ্লেট বিল্ডার</span>
                <span className="text-[10px] text-slate-400 font-bold block">পরীক্ষার সিলেবাস, মার্কস ও বিষয় ডিস্ট্রিবিউশন টেমপ্লেট</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => setSubView('website')}
              className="p-3.5 bg-white border border-slate-150 hover:border-indigo-400 rounded-2xl flex items-center justify-between text-left shadow-sm active:scale-98 transition-all"
            >
              <div>
                <span className="text-xs font-black text-slate-800 block">⚙️ ওয়েবসাইট কনফিগারেশন</span>
                <span className="text-[10px] text-slate-400 font-bold block">সাইটের নাম, এসইও, এডসেন্স অ্যাড কোড, সোশ্যাল মিডিয়া লিংক</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => setSubView('notifications')}
              className="p-3.5 bg-white border border-slate-150 hover:border-indigo-400 rounded-2xl flex items-center justify-between text-left shadow-sm active:scale-98 transition-all"
            >
              <div>
                <span className="text-xs font-black text-slate-800 block">🔔 পুশ নোটিফিকেশন সেন্টার</span>
                <span className="text-[10px] text-slate-400 font-bold block">সব প্রার্থী বা নির্বাচিত প্রিমিয়াম প্রার্থীদের কাছে নোটিফিকেশন পাঠান</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      ) : subView === 'categories' ? (
        /* ================= CATEGORIES MANAGEMENT VIEW ================= */
        <CategoryManager 
          categories={categories}
          onSaveCategories={onSaveCategories}
          onBack={() => setSubView('menu')}
        />
      ) : subView === 'templates' ? (
        /* ================= CUSTOM TEMPLATE BUILDER ================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <button onClick={() => setSubView('menu')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h4 className="text-xs font-black text-slate-800">কাস্টম সিলেবাস ও ফর্ম টেমপ্লেট</h4>
            <button 
              onClick={() => setEditingTemplate({ id: '', name: '', fields: [] })}
              className="bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              + নতুন টেমপ্লেট
            </button>
          </div>

          {editingTemplate ? (
            <div className="bg-white p-4 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <span className="text-[10px] font-black text-indigo-600 uppercase block">টেমপ্লেট বিল্ডার</span>
              
              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">টেমপ্লেটের নাম (Template Name) *</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingTemplate.name || ''}
                  onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  placeholder="যেমন: পুলিশ নিয়োগ পরীক্ষার সিলেবাস প্যাটার্ন"
                  required
                />
              </div>

              {/* Dynamic Field Repeater List inside Template builder */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="text-[10px] font-black text-slate-400 block uppercase">সিলেবাস সাবজেক্ট ডিস্ট্রিবিউশন (Fields List)</span>
                
                {editingTemplate.fields && editingTemplate.fields.length > 0 && (
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                    {editingTemplate.fields.map((f: any, idx: number) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200 text-xs font-bold flex justify-between items-center gap-2">
                        <div>
                          <span className="block font-black text-slate-800">{f.label}</span>
                          <span className="block text-[9px] text-slate-400 uppercase">কি: {f.name} • টাইপ: {f.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => handleReorderField(idx, 'up')} className="p-1 text-slate-400 hover:bg-slate-100 rounded">▲</button>
                          <button type="button" onClick={() => handleReorderField(idx, 'down')} className="p-1 text-slate-400 hover:bg-slate-100 rounded">▼</button>
                          <button type="button" onClick={() => handleRemoveFieldFromTemplate(idx)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new field form block */}
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-250 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <div className="space-y-1">
                      <label>লেবেল (Field Label) *</label>
                      <input 
                        type="text"
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl"
                        placeholder="যেমন: গণিত (Maths)"
                        value={newFieldLabel}
                        onChange={e => setNewFieldLabel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label>ইউনিক আইডি (Key) *</label>
                      <input 
                        type="text"
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                        placeholder="যেমন: maths"
                        value={newFieldName}
                        onChange={e => setNewFieldName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-bold">
                    <label>ফিল্ড টাইপ (Field Input Type)</label>
                    <select 
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      value={newFieldType}
                      onChange={e => setNewFieldType(e.target.value as any)}
                    >
                      <option value="text">ছোট টেক্সট ইনপুট (Short Text)</option>
                      <option value="textarea">বড় ডেসক্রিপশন বক্স (Textarea)</option>
                      <option value="number">সংখ্যা / সংখ্যাগত মান (Number)</option>
                      <option value="richtext">সমৃদ্ধ টেক্সট এডিটর (Rich Text)</option>
                    </select>
                  </div>

                  <button 
                    type="button"
                    onClick={handleAddFieldToTemplate}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-black rounded-xl"
                  >
                    + ফিল্ড যোগ করুন (Add Field to Template)
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingTemplate(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-extrabold">বাতিল</button>
                <button type="button" onClick={handleSaveTemplate} className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black">সংরক্ষণ</button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map(t => (
                <div key={t.id} className="bg-white p-3.5 rounded-2xl border border-slate-150 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800">{t.name}</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-extrabold">{t.fields?.length || 0}টি কাস্টম কলাম</span>
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-slate-100 justify-end">
                    <button 
                      onClick={() => setEditingTemplate(t)}
                      className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded"
                    >
                      সিলেবাস ও ফিল্ডস এডিট করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : subView === 'website' ? (
        /* ================= WEBSITE CONFIGURATION ================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <button onClick={() => setSubView('menu')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h4 className="text-xs font-black text-slate-800">ওয়েবসাইট কনফিগারেশন সেটিংস</h4>
            <button 
              onClick={() => {
                alert("সেটিংস সফলভাবে সেভ করা হয়েছে!");
                setSubView('menu');
              }}
              className="bg-indigo-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              সেভ করুন
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-4">
            <div className="space-y-3.5 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label>সাইটের নাম (Site Name)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  value={siteName} 
                  onChange={e => setSiteName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label>সাইটের ট্যাগলাইন (Tagline)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  value={tagline} 
                  onChange={e => setTagline(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label>অ্যাডমিন ইমেইল আইডি (Admin Email)</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  value={adminEmail} 
                  onChange={e => setAdminEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label>গুগল অ্যাডসেন্স আইডি (AdSense Publisher ID)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  value={adsPublisherId} 
                  onChange={e => setAdsPublisherId(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">ডিফল্ট নেগেটিভ মার্কিং</span>
                  <span className="text-[9.5px] text-slate-400 block">মক টেস্ট পরীক্ষার জন্য স্বয়ংক্রিয় নেগেটিভ মার্কস।</span>
                </div>
                <input 
                  type="checkbox"
                  checked={isNegativeMarkingEnabled}
                  onChange={e => setIsNegativeMarkingEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= PUSH NOTIFICATION CENTER ================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <button onClick={() => setSubView('menu')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h4 className="text-xs font-black text-slate-800">🔔 পুশ নোটিফিকেশন সেন্টার</h4>
            <div className="w-8"></div>
          </div>

          <form onSubmit={handleSendNotification} className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-4">
            {notifSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold rounded-xl">
                ✓ {notifSuccess}
              </div>
            )}

            <div className="space-y-3.5 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label>নোটিফিকেশন টাইটেল (Notification Title) *</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  placeholder="যেমন: নতুন আইসিডিএস মক টেস্ট সেট করা হয়েছে!"
                  value={notifTitle}
                  onChange={e => setNotifTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label>বার্তা / মেসেজ (Message Body) *</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="পরীক্ষার্থীদের নোটিফিকেশনে কোন বার্তাটি দেখাবেন তা বিশদভাবে লিখুন..."
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label>লক্ষ্য অডিয়েন্স (Target Audience)</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  value={notifAudience}
                  onChange={e => setNotifAudience(e.target.value as any)}
                >
                  <option value="all">সব নিবন্ধিত পরীক্ষার্থী (All Users)</option>
                  <option value="free">শুধু ফ্রি মেম্বারস (Free Users Only)</option>
                  <option value="premium">শুধু প্রিমিয়াম মেম্বারস (Premium Members Only)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100"
            >
              <Bell className="w-4 h-4" /> অবিলম্বে নোটিফিকেশন পাঠান (Send Now)
            </button>
          </form>

          {/* Past sent logs */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase block">পূর্বে প্রেরিত নোটিফিকেশনের ইতিহাস</span>
            <div className="space-y-2">
              {notifSentLog.map((log, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-150 shadow-sm flex justify-between items-center text-xs">
                  <div>
                    <span className="block font-black text-slate-800">{log.title}</span>
                    <span className="block text-[9.5px] text-slate-400 font-semibold">গ্রাহক: {log.audience} • {log.date}</span>
                  </div>
                  <span className="text-[10.5px] font-black text-indigo-600">✓ {log.count} জন</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
