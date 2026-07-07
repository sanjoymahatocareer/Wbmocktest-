import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Eye, Copy, ArrowLeft, Save, Sparkles, 
  ChevronDown, ChevronUp, Check, AlertTriangle, X, Heading, Bold, 
  Italic, Underline, List, ListOrdered, Quote, Link, Image, Table, 
  Settings, Sliders, FileText, CheckCircle
} from 'lucide-react';
import { PostName, ExamCategory, CustomTemplate } from '../types';

interface AdminPostsProps {
  posts: PostName[];
  categories: ExamCategory[];
  templates: CustomTemplate[];
  onSavePost: (post: Partial<PostName>) => void;
  onDeletePost: (id: string) => void;
  onGoBack: () => void;
}

export default function AdminPosts({ 
  posts, 
  categories, 
  templates, 
  onSavePost, 
  onDeletePost,
  onGoBack 
}: AdminPostsProps) {
  const [activeSubView, setActiveSubView] = useState<'list' | 'editor'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [editingPost, setEditingPost] = useState<Partial<PostName> | null>(null);

  // SEO state within editor
  const [seoFocusKeyword, setSeoFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [seoSlug, setSeoSlug] = useState('');
  const [seoSecondaryKeywords, setSeoSecondaryKeywords] = useState('');
  const [seoCanonical, setSeoCanonical] = useState('');
  const [seoRobots, setSeoRobots] = useState('index, follow');

  // Accordions in editor
  const [expandedSection, setExpandedSection] = useState<'basic' | 'custom' | 'faq' | 'seo'>('basic');

  // FAQ states
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Auto-save feedback
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');

  // Simulated auto-save trigger
  useEffect(() => {
    if (activeSubView === 'editor' && editingPost) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [editingPost?.name, editingPost?.bengaliName, editingPost?.subtitle]);

  const handleOpenEditor = (post: Partial<PostName> | null) => {
    if (post) {
      setEditingPost(post);
      setSeoFocusKeyword(post.name || '');
      setSeoTitle(post.bengaliName || '');
      setSeoMetaDescription(post.subtitle || '');
      setSeoSlug((post.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-'));
    } else {
      setEditingPost({
        name: '',
        bengaliName: '',
        categoryId: categories[0]?.id || '',
        subtitle: '',
        fields: {},
        faqs: []
      });
      setSeoFocusKeyword('');
      setSeoTitle('');
      setSeoMetaDescription('');
      setSeoSlug('');
    }
    setActiveSubView('editor');
  };

  const handleSaveAndExit = (status: 'Published' | 'Draft' | 'Scheduled') => {
    if (!editingPost?.name || !editingPost?.bengaliName) {
      alert('অনুগ্রহ করে নাম এবং বাংলা নাম পূরণ করুন!');
      return;
    }
    onSavePost({
      ...editingPost,
      // store metadata or status
      subtitle: editingPost.subtitle || seoMetaDescription,
    });
    setActiveSubView('list');
  };

  const calculateSEOScore = () => {
    let score = 20;
    if (seoFocusKeyword && editingPost?.name?.toLowerCase().includes(seoFocusKeyword.toLowerCase())) score += 15;
    if (seoTitle && seoTitle.includes(seoFocusKeyword)) score += 15;
    if (seoMetaDescription && seoMetaDescription.includes(seoFocusKeyword)) score += 15;
    if (seoMetaDescription && seoMetaDescription.length > 50 && seoMetaDescription.length <= 160) score += 15;
    if (seoTitle && seoTitle.length > 10 && seoTitle.length <= 60) score += 10;
    if (editingPost?.faqs && editingPost.faqs.length > 0) score += 10;
    return score > 100 ? 100 : score;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.bengaliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simulating status filters for display
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'draft') return matchesSearch && post.id.includes('draft');
    if (filterStatus === 'published') return matchesSearch && !post.id.includes('draft') && !post.id.includes('schedule');
    if (filterStatus === 'scheduled') return matchesSearch && post.id.includes('schedule');
    return matchesSearch;
  });

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.bengaliName || catId;
  };

  if (activeSubView === 'editor' && editingPost) {
    const seoScore = calculateSEOScore();
    const activeTemplate = templates.find(t => t.id === editingPost.templateId);

    return (
      <div className="bg-slate-50 min-h-screen text-slate-800 pb-16">
        {/* Sticky Editor Bar */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveSubView('list')}
              className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">পোস্ট এডিটর</p>
              <h2 className="text-sm font-black text-slate-800 truncate max-w-[150px]">
                {editingPost.bengaliName || 'নতুন পোস্ট'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-slate-400 mr-1 hidden sm:inline">
              {autoSaveStatus === 'saving' ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষিত'}
            </span>
            <button 
              onClick={() => handleSaveAndExit('Draft')}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-lg cursor-pointer"
            >
              খসড়া
            </button>
            <button 
              onClick={() => handleSaveAndExit('Published')}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-black rounded-lg shadow-sm cursor-pointer"
            >
              পাবলিশ
            </button>
          </div>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-4">
          {/* WordPress-like rich editor section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">বেসিক ইনফো</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-semibold text-slate-400">রিয়েল-টাইম অটোসেভ</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1 block">পোস্টের নাম (ইংরেজিতে / Slug generation এর জন্য)</label>
                <input 
                  type="text" 
                  value={editingPost.name || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    setEditingPost({ ...editingPost, name: val });
                    setSeoFocusKeyword(val);
                    setSeoSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  placeholder="যেমন: WB Panchayat Executive Assistant" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1 block">বাংলায় পোস্টের টাইটেল (মূল শিরোনাম)</label>
                <input 
                  type="text" 
                  value={editingPost.bengaliName || ''} 
                  onChange={e => {
                    setEditingPost({ ...editingPost, bengaliName: e.target.value });
                    setSeoTitle(e.target.value);
                  }}
                  placeholder="যেমন: পঞ্চায়েত এক্সিকিউটিভ অ্যাসিস্ট্যান্ট নিয়োগ" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1 block">পরীক্ষার ক্যাটাগরি</label>
                <select 
                  value={editingPost.categoryId || ''} 
                  onChange={e => setEditingPost({ ...editingPost, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:border-blue-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.bengaliName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1 block">রিক্রুটমেন্ট টেমপ্লেট লিঙ্ক (ফীডস সক্রিয় করার জন্য)</label>
                <select 
                  value={editingPost.templateId || ''} 
                  onChange={e => setEditingPost({ ...editingPost, templateId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:border-blue-500 outline-none text-slate-700"
                >
                  <option value="">কোন টেমপ্লেট নেই (সাধারণ পোস্ট)</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1 block">সংক্ষিপ্ত বিবরণ (Short Description)</label>
                <textarea 
                  value={editingPost.subtitle || ''} 
                  onChange={e => {
                    setEditingPost({ ...editingPost, subtitle: e.target.value });
                    setSeoMetaDescription(e.target.value);
                  }}
                  rows={3}
                  placeholder="পরীক্ষা ও যোগ্যতা সংক্রান্ত সংক্ষিপ্ত বিবরণ..." 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* WordPress Block Content Editor toolbar simulated */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">ফুল কনটেন্ট এডিটর</span>
            
            <div className="border border-slate-150 rounded-xl overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-150 p-2 flex flex-wrap gap-1.5 justify-start">
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Heading"><Heading className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded font-bold" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded italic" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded underline" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Blockquote"><Quote className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Link"><Link className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Insert Image"><Image className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 text-slate-600 hover:bg-slate-200 rounded" title="Table"><Table className="w-3.5 h-3.5" /></button>
              </div>
              <textarea 
                rows={6}
                placeholder="এখানে বিস্তারিত আর্টিকেল বা সিলেবাস বিবরণ বাংলা টাইপ করে লিখুন..."
                className="w-full p-3 text-xs outline-none bg-white font-medium"
              />
            </div>
          </div>

          {/* Accordion: Collapsible Custom template fields */}
          {activeTemplate && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'custom' ? 'basic' : 'custom')}
                className="w-full flex items-center justify-between p-4 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-left">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-black text-slate-800">টেমপ্লেট কাস্টম ফিল্ডস</span>
                  <span className="bg-orange-100 text-orange-700 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                    {activeTemplate.fields.length}টি ফিল্ড
                  </span>
                </div>
                {expandedSection === 'custom' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSection === 'custom' && (
                <div className="p-4 pt-0 border-t border-slate-50 space-y-3 bg-slate-50/50">
                  {activeTemplate.fields.map(f => {
                    const fields = editingPost.fields || {};
                    return (
                      <div key={f.name}>
                        <label className="text-[11px] font-bold text-slate-600 mb-1 block">{f.label}</label>
                        <input 
                          type="text"
                          value={fields[f.name] || ''}
                          onChange={e => {
                            const newFields = { ...fields, [f.name]: e.target.value };
                            setEditingPost({ ...editingPost, fields: newFields });
                          }}
                          placeholder={f.placeholder || 'তথ্য লিখুন...'}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Accordion: Collapsible FAQS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'faq' ? 'basic' : 'faq')}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-800">জিজ্ঞাসাবাদ ও FAQ সমূহ</span>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  {(editingPost.faqs || []).length}টি FAQ
                </span>
              </div>
              {expandedSection === 'faq' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'faq' && (
              <div className="p-4 pt-0 border-t border-slate-50 space-y-3.5 bg-slate-50/50">
                <div className="space-y-2 mt-3 p-3 bg-white border border-slate-200/60 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400">নতুন FAQ যোগ করুন:</p>
                  <input 
                    type="text" 
                    value={newFaqQuestion}
                    onChange={e => setNewFaqQuestion(e.target.value)}
                    placeholder="প্রশ্ন: শিক্ষাগত যোগ্যতা কী প্রয়োজন?"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                  <textarea 
                    value={newFaqAnswer}
                    onChange={e => setNewFaqAnswer(e.target.value)}
                    placeholder="উত্তর: এই পদের জন্য মাধ্যমিক পাশ প্রয়োজন..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    rows={2}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (!newFaqQuestion || !newFaqAnswer) return;
                      const faqs = editingPost.faqs || [];
                      setEditingPost({
                        ...editingPost,
                        faqs: [...faqs, { question: newFaqQuestion, answer: newFaqAnswer }]
                      });
                      setNewFaqQuestion('');
                      setNewFaqAnswer('');
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-xl cursor-pointer shadow-sm"
                  >
                    + নতুন FAQ যুক্ত করুন
                  </button>
                </div>

                {editingPost.faqs && editingPost.faqs.length > 0 && (
                  <div className="space-y-2">
                    {editingPost.faqs.map((f, i) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 flex items-start justify-between gap-2 shadow-sm">
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-slate-800">Q: {f.question}</p>
                          <p className="text-[10.5px] font-medium text-slate-500">A: {f.answer}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingPost({
                              ...editingPost,
                              faqs: editingPost.faqs?.filter((_, idx) => idx !== i)
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion: Collapsible ADVANCED SEO MANAGER */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'seo' ? 'basic' : 'seo')}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <Sparkles className="w-4 h-4 text-purple-600 animate-spin-slow" />
                <span className="text-xs font-black text-slate-800">অ্যাডভান্সড SEO ম্যানেজার</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  seoScore >= 80 ? 'bg-emerald-55 bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  SEO স্কোর: {seoScore}/100
                </span>
              </div>
              {expandedSection === 'seo' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'seo' && (
              <div className="p-4 pt-0 border-t border-slate-50 space-y-4 bg-slate-50/50">
                {/* Score progress bar */}
                <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 mb-1">
                    <span>Google SEO Optimization</span>
                    <span>{seoScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        seoScore >= 80 ? 'bg-emerald-500' : seoScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`} 
                      style={{ width: `${seoScore}%` }} 
                    />
                  </div>
                </div>

                {/* Focus Keywords */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">Focus Keyword (মূল ফোকাস কি-ওয়ার্ড)</label>
                    <input 
                      type="text" 
                      value={seoFocusKeyword}
                      onChange={e => setSeoFocusKeyword(e.target.value)}
                      placeholder="যেমন: Panchayat DEO Recruitment"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">Secondary Keywords (কমা দিয়ে লিখুন)</label>
                    <input 
                      type="text" 
                      value={seoSecondaryKeywords}
                      onChange={e => setSeoSecondaryKeywords(e.target.value)}
                      placeholder="যেমন: Panchayat Syllabus, EA Exam, WB Govt Job"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  {/* SEO Title with Counter */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <label>SEO Meta Title</label>
                      <span className={seoTitle.length > 60 ? 'text-rose-600' : seoTitle.length >= 40 ? 'text-emerald-600' : 'text-slate-400'}>
                        {seoTitle.length}/60
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={seoTitle}
                      onChange={e => setSeoTitle(e.target.value)}
                      placeholder="Google সার্চের জন্য ক্যাচি মেটা টাইটেল..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  {/* Meta Description with Counter */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <label>SEO Meta Description</label>
                      <span className={seoMetaDescription.length > 160 ? 'text-rose-600' : seoMetaDescription.length >= 120 ? 'text-emerald-600' : 'text-slate-400'}>
                        {seoMetaDescription.length}/160
                      </span>
                    </div>
                    <textarea 
                      value={seoMetaDescription}
                      onChange={e => setSeoMetaDescription(e.target.value)}
                      placeholder="সার্চ ফলাফলে দেখানোর জন্য আকর্ষণীয় বিবরণ..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                      rows={2.5}
                    />
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">URL Slug</label>
                    <input 
                      type="text" 
                      value={seoSlug}
                      onChange={e => setSeoSlug(e.target.value)}
                      placeholder="যেমন: wb-panchayat-clerk"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none"
                    />
                  </div>

                  {/* Google Search Result Preview */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-inner space-y-1">
                    <p className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Google Search Preview (মোবাইল)
                    </p>
                    <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 text-[11px] leading-tight space-y-0.5">
                      <div className="text-slate-500 flex items-center gap-1 text-[9px] truncate">
                        <span>wbmocktest.in</span>
                        <span>› job</span>
                        <span>› {seoSlug || 'post-name'}</span>
                      </div>
                      <h4 className="text-blue-800 font-bold text-xs hover:underline cursor-pointer truncate">
                        {seoTitle || 'আকর্ষণীয় মেটা টাইটেল...'}
                      </h4>
                      <p className="text-slate-600 text-[10px] line-clamp-2">
                        {seoMetaDescription || 'Google সার্চ ইঞ্জিন ব্যবহারকারীদের আকৃষ্ট করার মতো তথ্যবহুল মেটা ডেসক্রিপশন লিখুন...'}
                      </p>
                    </div>
                  </div>

                  {/* Robots & Canonical */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block">Robots Meta</label>
                      <select 
                        value={seoRobots}
                        onChange={e => setSeoRobots(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none"
                      >
                        <option value="index, follow">Index, Follow</option>
                        <option value="noindex, follow">Noindex, Follow</option>
                        <option value="index, nofollow">Index, Nofollow</option>
                        <option value="noindex, nofollow">Noindex, Nofollow</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block">Canonical URL</label>
                      <input 
                        type="text" 
                        value={seoCanonical}
                        onChange={e => setSeoCanonical(e.target.value)}
                        placeholder="https://wbmocktest.in/..."
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold outline-none"
                      />
                    </div>
                  </div>

                  {/* Checklists */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 space-y-2 text-[10px]">
                    <span className="font-bold text-slate-700 block">SEO অডিট চেকলিস্ট:</span>
                    <div className="space-y-1.5 font-semibold">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Focus keyword in page title
                      </div>
                      <div className={`flex items-center gap-1.5 ${seoSlug.includes(seoFocusKeyword.toLowerCase().replace(/ /g, '-')) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Focus keyword in URL Slug
                      </div>
                      <div className={`flex items-center gap-1.5 ${seoMetaDescription.includes(seoFocusKeyword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Focus keyword in Meta description
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Focus keyword in first paragraph
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> High-quality FAQ Schemas
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      {/* Top sticky bar */}
      <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800">আর্টিকেল ও নিয়োগ পোস্ট সমূহ</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">রিয়েল-টাইম ক্যাটাগরি ও পোস্ট প্যানেল</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenEditor(null)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-indigo-600/10"
        >
          <Plus className="w-3.5 h-3.5" /> পোস্ট
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Search and Filters */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="পোস্ট খুঁজুন..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {(['all', 'published', 'draft', 'scheduled'] as const).map(status => {
              const labelMap = { all: 'সব', published: 'পাবলিশড', draft: 'খসড়া', scheduled: 'তফসিল' };
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap cursor-pointer transition-all border shrink-0 ${
                    filterStatus === status 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'
                  }`}
                >
                  {labelMap[status]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Card list */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-700">কোনো পোস্ট খুঁজে পাওয়া যায়নি</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">নতুন নিয়োগের খবর পাবলিশ করতে প্লাস বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map(post => {
              const isDraft = post.id.includes('draft');
              const isScheduled = post.id.includes('schedule');
              
              return (
                <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 max-w-[70%]">
                      <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {getCategoryName(post.categoryId)}
                      </span>
                      <h3 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">
                        {post.bengaliName}
                      </h3>
                      {post.subtitle && (
                        <p className="text-[10px] text-slate-400 font-semibold line-clamp-1">{post.subtitle}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isDraft 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : isScheduled 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isDraft ? 'Draft' : isScheduled ? 'Scheduled' : 'Published'}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                        <Sparkles className="w-2.5 h-2.5" /> SEO: 85
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] font-bold text-slate-500">
                    <span className="text-[9.5px]">ভিউজ: ৩৪০ বার</span>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEditor(post)}
                        className="p-1.5 hover:bg-slate-50 text-slate-600 hover:text-blue-600 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const dup = { ...post, id: post.id + '-copy-' + Date.now(), name: post.name + ' Copy', bengaliName: post.bengaliName + ' (অনুলিপি)' };
                          onSavePost(dup);
                        }}
                        className="p-1.5 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-lg cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeletePost(post.id)}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
