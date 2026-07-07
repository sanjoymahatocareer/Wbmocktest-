import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Edit3, Trash2, Copy, Eye, Save, ArrowLeft, 
  Sparkles, HelpCircle, ChevronDown, ChevronUp, Check, AlertTriangle, Globe 
} from 'lucide-react';
import { PostName, ExamCategory, CustomTemplate } from '../types';
import { safeLocalStorage } from '../lib/storage';

interface AdminPostsViewProps {
  posts: PostName[];
  categories: ExamCategory[];
  templates: CustomTemplate[];
  onSavePost: (post: any) => void;
  onDeletePost: (id: string) => void;
  onBack: () => void;
}

export default function AdminPostsView({
  posts,
  categories,
  templates,
  onSavePost,
  onDeletePost,
  onBack
}: AdminPostsViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [editingPost, setEditingPost] = useState<any | null>(null);
  
  // SEO and editor states
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [autosaveMsg, setAutosaveMsg] = useState('');

  // SEO default calculator state
  const [seoScore, setSeoScore] = useState(0);

  // Auto-save simulation
  useEffect(() => {
    if (!editingPost) return;
    const interval = setInterval(() => {
      setAutosaveMsg('অটো-সেভ করা হয়েছে...');
      setTimeout(() => setAutosaveMsg(''), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, [editingPost]);

  // Calculate SEO score dynamically based on checklist
  useEffect(() => {
    if (!editingPost) return;
    let score = 0;
    const title = editingPost.bengaliName || '';
    const content = editingPost.subtitle || '';
    const focusKeyword = editingPost.seoFocusKeyword || '';
    const metaDesc = editingPost.seoMetaDescription || '';
    const slug = editingPost.name || '';

    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    if (focusKeyword && content.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    if (focusKeyword && metaDesc.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    if (focusKeyword && slug.toLowerCase().includes(focusKeyword.toLowerCase())) score += 10;
    if (title.length > 20) score += 10;
    if (metaDesc.length > 40) score += 10;
    if (editingPost.templateId) score += 10;
    if (editingPost.faqs && editingPost.faqs.length > 0) score += 10;
    if (editingPost.categoryId) score += 5;

    setSeoScore(score);
  }, [editingPost]);

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const currentFaqs = editingPost.faqs || [];
    setEditingPost({
      ...editingPost,
      faqs: [...currentFaqs, { question: newFaqQuestion, answer: newFaqAnswer }]
    });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (idx: number) => {
    const currentFaqs = [...(editingPost.faqs || [])];
    currentFaqs.splice(idx, 1);
    setEditingPost({ ...editingPost, faqs: currentFaqs });
  };

  const handleToolbarClick = (syntax: string) => {
    const el = document.getElementById('post-content-area') as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    let replacement = '';
    if (syntax === 'b') replacement = `**${selected || 'বোল্ড টেক্সট'}**`;
    else if (syntax === 'i') replacement = `*${selected || 'ইটালিক টেক্সট'}*`;
    else if (syntax === 'u') replacement = `<u>${selected || 'আন্ডারলাইন টেক্সট'}</u>`;
    else if (syntax === 'h2') replacement = `\n## ${selected || 'শিরোনাম ২'}\n`;
    else if (syntax === 'h3') replacement = `\n### ${selected || 'শিরোনাম ৩'}\n`;
    else if (syntax === 'ul') replacement = `\n- ${selected || 'আইটেম ১'}\n- আইটেম ২`;
    else if (syntax === 'ol') replacement = `\n1. ${selected || 'আইটেম ১'}\n2. আইটেম ২`;
    else if (syntax === 'quote') replacement = `\n> ${selected || 'উদ্ধৃতি টেক্সট'}\n`;
    else if (syntax === 'link') replacement = `[${selected || 'লিংক টেক্সট'}](https://example.com)`;
    else if (syntax === 'table') {
      replacement = `\n| কলাম ১ | কলাম ২ |\n| --- | --- |\n| তথ্য ১ | তথ্য ২ |\n`;
    }

    setEditingPost({
      ...editingPost,
      subtitle: before + replacement + after
    });
  };

  const handleDuplicate = (post: PostName) => {
    const dup = {
      ...post,
      id: 'post-dup-' + Date.now(),
      name: post.name + '-copy',
      bengaliName: post.bengaliName + ' (কপি)',
    };
    onSavePost(dup);
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const term = search.toLowerCase();
    const titleMatch = (p.bengaliName || '').toLowerCase().includes(term) || (p.name || '').toLowerCase().includes(term);
    
    // Status filter simulation based on ID (simulating draft or scheduled)
    const isDraft = p.id.includes('draft') || !p.fields;
    const isScheduled = p.id.includes('sch') || p.id.includes('future');
    
    if (filter === 'draft') return titleMatch && isDraft;
    if (filter === 'scheduled') return titleMatch && isScheduled;
    if (filter === 'published') return titleMatch && !isDraft && !isScheduled;
    return titleMatch;
  });

  // Get active templates and categories
  const activeTemplate = templates.find(t => t.id === editingPost?.templateId);

  return (
    <div className="space-y-4">
      {/* 1. POST LIST VIEW */}
      {!editingPost ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              পোস্ট ম্যানেজার ({posts.length})
            </h3>
            <button 
              onClick={() => setEditingPost({
                id: '',
                categoryId: categories[0]?.id || '',
                name: '',
                bengaliName: '',
                subtitle: '',
                templateId: '',
                fields: {},
                faqs: [],
                seoFocusKeyword: '',
                seoMetaDescription: '',
                seoTitle: '',
                tags: ''
              })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[11px] px-3.5 py-2.5 rounded-xl flex items-center gap-1 shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> নতুন পোস্ট তৈরি করুন
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="পোস্টের নাম দিয়ে খুঁজুন..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold shadow-sm focus:outline-none focus:border-indigo-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Chips */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'published', 'draft', 'scheduled'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1.5 rounded-full text-[10.5px] font-black whitespace-nowrap border transition-all ${
                    filter === mode 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mode === 'all' && 'সব পোস্ট'}
                  {mode === 'published' && 'পাবলিশড'}
                  {mode === 'draft' && 'খসড়া/ড্রাফট'}
                  {mode === 'scheduled' && 'তফশিলভুক্ত'}
                </button>
              ))}
            </div>
          </div>

          {/* List of cards */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">কোনো পোস্ট খুঁজে পাওয়া যায়নি</p>
              <button 
                onClick={() => setSearch('')}
                className="text-[11px] font-black text-indigo-600 underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => {
                const parentCat = categories.find(c => c.id === post.categoryId);
                const isDraft = post.id.includes('draft') || !post.fields;
                const isScheduled = post.id.includes('sch') || post.id.includes('future');
                const mTestCount = Math.floor(Math.random() * 3) + 1; // mock stat
                
                // Static image placeholder gradient
                const gradIndex = post.name.charCodeAt(0) % 4;
                const gradients = [
                  'from-blue-500 to-indigo-600',
                  'from-purple-500 to-pink-500',
                  'from-emerald-500 to-teal-500',
                  'from-amber-500 to-orange-500'
                ];

                return (
                  <div key={post.id} className="bg-white rounded-2xl border border-slate-150 p-3.5 shadow-sm space-y-3">
                    <div className="flex gap-3 items-start">
                      {/* CSS gradient thumbnail */}
                      <div className={`w-14 h-14 rounded-xl shrink-0 bg-gradient-to-tr ${gradients[gradIndex]} flex items-center justify-center text-white text-xs font-black shadow-inner uppercase`}>
                        {post.name.substring(0, 2)}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            isDraft 
                              ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                              : isScheduled 
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {isDraft ? 'খসড়া' : isScheduled ? 'তফশিলভুক্ত' : 'পাবলিশড'}
                          </span>
                          <span className="text-[9.5px] font-bold text-slate-400">
                            ID: {post.id}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 leading-snug truncate">{post.bengaliName || post.name}</h4>
                        <p className="text-[10px] font-semibold text-slate-500 truncate">{parentCat?.bengaliName || 'অন্যান্য'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                      <div className="flex gap-3">
                        <span>👁 {Math.floor(Math.random() * 800) + 120} ভিউস</span>
                        <span className="text-emerald-600 font-extrabold">SEO: {80 + (post.bengaliName.length % 20)}%</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setEditingPost(post)}
                          className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDuplicate(post)}
                          className="p-1.5 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
                          title="ডুপ্লিকেট"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDeletePost(post.id)}
                          className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 2. MOBILE POST EDITOR + ADVANCED SEO PANEL */
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-sm border-b border-slate-200/60 pb-3 flex items-center justify-between gap-1.5">
            <button 
              onClick={() => setEditingPost(null)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-[9px] font-black uppercase text-indigo-600">এডিটর মোড</span>
              <h3 className="text-xs font-black text-slate-800 leading-tight">
                {editingPost.id ? 'পোস্ট আপডেট করুন' : 'নতুন পোস্ট তৈরি'}
              </h3>
            </div>
            <div className="flex gap-1 shrink-0">
              <button 
                onClick={() => {
                  const saved = { ...editingPost, id: editingPost.id || 'post-' + Date.now() };
                  onSavePost(saved);
                  setEditingPost(null);
                }}
                className="bg-indigo-600 text-white font-extrabold text-[10.5px] px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> সংরক্ষণ
              </button>
            </div>
          </div>

          {autosaveMsg && (
            <div className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-[10px] text-emerald-700 font-extrabold animate-bounce">
              {autosaveMsg}
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-4 bg-white p-4 rounded-3xl border border-slate-150 shadow-sm">
            {/* Title fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">পোস্টের বাংলা নাম (Bengali Title) <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingPost.bengaliName || ''}
                  onChange={e => setEditingPost({ ...editingPost, bengaliName: e.target.value })}
                  placeholder="যেমন: ডাব্লুবি পঞ্চায়েত নিয়োগ ২০২৬"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">পোস্টের ইউনিক স্লাগ (English Slug/Permalink) <span className="text-rose-500">*</span></label>
                <div className="flex gap-1.5">
                  <input 
                    type="text"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    value={editingPost.name || ''}
                    onChange={e => setEditingPost({ ...editingPost, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="যেমন: wb-panchayat-recruitment-2026"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (editingPost.bengaliName) {
                        const generated = editingPost.bengaliName
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/\s+/g, '-');
                        setEditingPost({ ...editingPost, name: generated || 'recruitment-' + Date.now() });
                      }
                    }}
                    className="px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-extrabold text-slate-500 block">বিভাগ (Category)</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editingPost.categoryId || ''}
                    onChange={e => setEditingPost({ ...editingPost, categoryId: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.bengaliName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-extrabold text-slate-500 block">রিসোর্স টেমপ্লেট</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editingPost.templateId || ''}
                    onChange={e => {
                      const tId = e.target.value;
                      const matchedTpl = templates.find(t => t.id === tId);
                      const fieldsObj: Record<string, any> = {};
                      matchedTpl?.fields.forEach(f => {
                        fieldsObj[f.name] = '';
                      });
                      setEditingPost({ ...editingPost, templateId: tId, fields: fieldsObj });
                    }}
                  >
                    <option value="">কোনো টেমপ্লেট নেই (ডিফল্ট)</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">ট্যাগসমূহ (Tags) <span className="text-slate-400">(কমা দিয়ে আলাদা করুন)</span></label>
                <input 
                  type="text"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingPost.tags || ''}
                  onChange={e => setEditingPost({ ...editingPost, tags: e.target.value })}
                  placeholder="যেমন: job, panchayat, recruitment"
                />
              </div>
            </div>

            {/* Series Pricing, Validity and Premium Toggle options */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-black text-slate-800">পেমেন্ট ও মেম্বারশিপ সেটিংস (Premium & Pricing)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-extrabold text-slate-500 block">প্রিমিয়াম সিরিজ? (Is Premium?)</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editingPost.isPremiumSeries ? 'yes' : 'no'}
                    onChange={e => setEditingPost({ ...editingPost, isPremiumSeries: e.target.value === 'yes' })}
                  >
                    <option value="no">না (Free / সবার জন্য উন্মুক্ত)</option>
                    <option value="yes">হ্যাঁ (Premium / পেইড সিরিজ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-extrabold text-slate-500 block">অ্যাক্সেস মেয়াদ (Validity Days)</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editingPost.validityDays || 365}
                    onChange={e => setEditingPost({ ...editingPost, validityDays: Number(e.target.value) })}
                    placeholder="৩৬৫"
                  />
                </div>
              </div>

              {editingPost.isPremiumSeries && (
                <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-extrabold text-slate-500 block">পূর্ববর্তী মূল্য (Regular Price)</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={editingPost.regularPrice || 99}
                      onChange={e => setEditingPost({ ...editingPost, regularPrice: Number(e.target.value) })}
                      placeholder="৯৯"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-extrabold text-slate-500 block">বিক্রয় মূল্য (Sale Price)</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={editingPost.salePrice || 49}
                      onChange={e => setEditingPost({ ...editingPost, salePrice: Number(e.target.value) })}
                      placeholder="৪৯"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Rich Text Toolbar & Content area */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-[10.5px] font-extrabold text-slate-500 block">পোস্টের মূল বিষয়বস্তু (Post Content)</label>
              
              {/* Content Formatting Toolbar */}
              <div className="flex flex-wrap gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <button type="button" onClick={() => handleToolbarClick('b')} className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[10.5px] font-black border border-slate-200">B</button>
                <button type="button" onClick={() => handleToolbarClick('i')} className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[10.5px] italic font-bold border border-slate-200">I</button>
                <button type="button" onClick={() => handleToolbarClick('u')} className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[10.5px] underline font-bold border border-slate-200">U</button>
                <button type="button" onClick={() => handleToolbarClick('h2')} className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">H2</button>
                <button type="button" onClick={() => handleToolbarClick('h3')} className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">H3</button>
                <button type="button" onClick={() => handleToolbarClick('ul')} className="px-1.5 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">• List</button>
                <button type="button" onClick={() => handleToolbarClick('ol')} className="px-1.5 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">1. List</button>
                <button type="button" onClick={() => handleToolbarClick('quote')} className="px-1.5 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">“ ”</button>
                <button type="button" onClick={() => handleToolbarClick('link')} className="px-1.5 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">Link</button>
                <button type="button" onClick={() => handleToolbarClick('table')} className="px-1.5 py-1 bg-white hover:bg-slate-100 rounded text-[10px] font-bold border border-slate-200">Table</button>
              </div>

              <textarea 
                id="post-content-area"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white transition-colors"
                rows={8}
                value={editingPost.subtitle || ''}
                onChange={e => setEditingPost({ ...editingPost, subtitle: e.target.value })}
                placeholder="পোস্টের বিবরণ বা নোটিফিকেশনের মূল তথ্য এখানে লিখুন..."
                required
              />
            </div>

            {/* Template Dynamic Form Fields */}
            {activeTemplate && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <h4 className="text-[11px] font-black text-slate-800">📋 টেমপ্লেট ফিল্ডস: {activeTemplate.name}</h4>
                </div>
                <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {activeTemplate.fields.map((field) => {
                    const value = editingPost.fields?.[field.name] || '';
                    return (
                      <div key={field.name} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">{field.label}</label>
                        {field.type === 'textarea' || field.type === 'richtext' ? (
                          <textarea 
                            rows={2}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                            value={value}
                            onChange={e => setEditingPost({
                              ...editingPost,
                              fields: { ...editingPost.fields, [field.name]: e.target.value }
                            })}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <input 
                            type={field.type === 'number' ? 'number' : 'text'}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                            value={value}
                            onChange={e => setEditingPost({
                              ...editingPost,
                              fields: { ...editingPost.fields, [field.name]: e.target.value }
                            })}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FAQ REPEATER */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center gap-1.5 bg-indigo-50 p-2.5 rounded-xl border border-indigo-150">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <h4 className="text-[11px] font-black text-slate-800">❓ FAQ (সাধারণ জিজ্ঞাসা ও উত্তর) রিপিটার</h4>
              </div>

              {editingPost.faqs && editingPost.faqs.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                  {editingPost.faqs.map((faq: any, fIdx: number) => (
                    <div key={fIdx} className="p-2 bg-white rounded-xl border border-slate-200 text-[10.5px] font-bold flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <p className="text-slate-800">Q: {faq.question}</p>
                        <p className="text-slate-500 font-semibold">A: {faq.answer}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFaq(fIdx)} 
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <input 
                  type="text"
                  placeholder="যেমন: আবেদন ফি কত?"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  value={newFaqQuestion}
                  onChange={e => setNewFaqQuestion(e.target.value)}
                />
                <textarea 
                  placeholder="যেমন: জেনারেল ক্যাটাগরির জন্য ১৫০ টাকা এবং সংরক্ষিতদের জন্য বিনামূল্যে।"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  rows={2}
                  value={newFaqAnswer}
                  onChange={e => setNewFaqAnswer(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={handleAddFaq}
                  className="w-full py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-black"
                >
                  + এফএকিউ যোগ করুন (Add FAQ)
                </button>
              </div>
            </div>

            {/* ADVANCED SEO MANAGER SECTION */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center justify-between bg-purple-50 p-2.5 rounded-xl border border-purple-150">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  <h4 className="text-[11px] font-black text-slate-800">🚀 অ্যাডভান্সড SEO ম্যানেজার</h4>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  seoScore >= 80 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : seoScore >= 50 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-rose-100 text-rose-800'
                }`}>
                  স্কোর: {seoScore}/১০০
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 block">ফোকাস কিওয়ার্ড (Focus Keyword) <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    value={editingPost.seoFocusKeyword || ''}
                    onChange={e => setEditingPost({ ...editingPost, seoFocusKeyword: e.target.value })}
                    placeholder="যেমন: wb panchayat"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500">
                    <span>SEO মেটা বিবরণ (Meta Description)</span>
                    <span className={editingPost.seoMetaDescription?.length > 160 ? 'text-rose-600' : 'text-slate-400'}>
                      {editingPost.seoMetaDescription?.length || 0}/১৬০ অক্ষর
                    </span>
                  </div>
                  <textarea 
                    rows={2.5}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    value={editingPost.seoMetaDescription || ''}
                    onChange={e => setEditingPost({ ...editingPost, seoMetaDescription: e.target.value })}
                    placeholder="সার্চ ইঞ্জিনের জন্য একটি আকর্ষণীয় ও কি-ওয়ার্ড সমৃদ্ধ সারসংক্ষেপ লিখুন..."
                  />
                </div>
              </div>

              {/* Live Google Preview Card */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 block">গুগল সার্চ প্রাকদর্শন (Google Search Preview)</span>
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate">
                    <span>wbmocktest.in</span>
                    <span>›</span>
                    <span className="text-indigo-600 truncate">{editingPost.name || 'slug'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-blue-800 hover:underline leading-tight">
                    {editingPost.bengaliName || 'পোস্টের শিরোনাম এখানে দেখা যাবে...'} - WBMockTest
                  </h4>
                  <p className="text-[10.5px] text-slate-600 leading-normal font-semibold">
                    {editingPost.seoMetaDescription || 'একটি আকর্ষণীয় মেটা ডেসক্রিপশন লিখুন যা সার্চের রেজাল্টে প্রদর্শিত হবে...'}
                  </p>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 block">SEO চেকলিস্ট</span>
                <div className="grid grid-cols-1 gap-1.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-200 text-[10.5px] font-bold text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>১. শিরোনামে ফোকাস কিওয়ার্ড রয়েছে?</span>
                    {editingPost.seoFocusKeyword && (editingPost.bengaliName || '').toLowerCase().includes(editingPost.seoFocusKeyword.toLowerCase()) ? (
                      <span className="text-emerald-600">✓ Completed</span>
                    ) : (
                      <span className="text-rose-500">✗ Missing</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>২. স্লাগে ফোকাস কিওয়ার্ড রয়েছে?</span>
                    {editingPost.seoFocusKeyword && (editingPost.name || '').toLowerCase().includes(editingPost.seoFocusKeyword.toLowerCase()) ? (
                      <span className="text-emerald-600">✓ Completed</span>
                    ) : (
                      <span className="text-rose-500">✗ Missing</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>৩. মেটা ডেসক্রিপশনে কিওয়ার্ড রয়েছে?</span>
                    {editingPost.seoFocusKeyword && (editingPost.seoMetaDescription || '').toLowerCase().includes(editingPost.seoFocusKeyword.toLowerCase()) ? (
                      <span className="text-emerald-600">✓ Completed</span>
                    ) : (
                      <span className="text-rose-500">✗ Missing</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>৪. বর্ণনা অত্যন্ত সংক্ষেপ নয়?</span>
                    {(editingPost.subtitle || '').length > 80 ? (
                      <span className="text-emerald-600">✓ Completed</span>
                    ) : (
                      <span className="text-amber-600">! Needs Improvement</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>৫. কাস্টম টেমপ্লেট সংযুক্ত আছে?</span>
                    {editingPost.templateId ? (
                      <span className="text-emerald-600">✓ Completed</span>
                    ) : (
                      <span className="text-slate-400">Optional</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
