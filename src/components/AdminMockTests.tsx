import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Plus, Edit3, Trash2, Sliders, CheckCircle, 
  HelpCircle, ChevronRight, X, Sparkles, Upload, FileCheck, 
  Trash, Save, FileSpreadsheet, Eye, Copy, Star, Layers, Settings, Calendar
} from 'lucide-react';
import { MockTest, Question, PostName, ExamCategory } from '../types';

interface AdminMockTestsProps {
  mockTests: MockTest[];
  posts: PostName[];
  categories: ExamCategory[];
  onSaveMockTest: (test: Partial<MockTest>) => void;
  onDeleteMockTest: (id: string) => void;
  onGoBack: () => void;
}

export default function AdminMockTests({
  mockTests,
  posts,
  categories,
  onSaveMockTest,
  onDeleteMockTest,
  onGoBack
}: AdminMockTestsProps) {
  const [activeSubView, setActiveSubView] = useState<'list' | 'wizard' | 'question_bank' | 'bulk_upload' | 'add_question'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium' | 'draft'>('all');
  
  // Wizard States
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [editingTest, setEditingTest] = useState<Partial<MockTest>>({});
  
  // Question Bank States
  const [qbSearch, setQbSearch] = useState('');
  const [qbDifficulty, setQbDifficulty] = useState<string>('all');
  const [qbType, setQbType] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // New Question form
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question>>({
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    subject: 'General Knowledge',
    explanation: ''
  });

  // Bulk Upload States
  const [csvContent, setCsvContent] = useState('');
  const [validationReport, setValidationReport] = useState<{
    totalRows: number;
    valid: number;
    invalid: number;
    duplicates: number;
    errors: string[];
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isImporting, setIsImporting] = useState(false);

  // Helper functions
  const handleOpenWizard = (test: Partial<MockTest> | null) => {
    if (test) {
      setEditingTest(test);
    } else {
      setEditingTest({
        title: '',
        bengaliTitle: '',
        postId: posts[0]?.id || '',
        durationMinutes: 60,
        totalMarks: 100,
        passingMarks: 40,
        difficulty: 'Medium',
        isPremium: false,
        questions: []
      });
    }
    setWizardStep(1);
    setActiveSubView('wizard');
  };

  const handleSaveWizard = () => {
    if (!editingTest.title || !editingTest.bengaliTitle) {
      alert('অনুগ্রহ করে টাইটেল ও বাংলা টাইটেল প্রদান করুন!');
      return;
    }
    onSaveMockTest(editingTest);
    setActiveSubView('list');
  };

  const handleAddQuestionToTest = () => {
    if (!editingQuestion.questionText) {
      alert('অনুগ্রহ করে প্রশ্ন লিখুন!');
      return;
    }
    const currentQs = editingTest.questions || [];
    const newQ: Question = {
      id: 'q-' + Date.now(),
      questionText: editingQuestion.questionText,
      options: editingQuestion.options || ['', '', '', ''],
      correctOptionIndex: editingQuestion.correctOptionIndex || 0,
      subject: editingQuestion.subject || 'General Knowledge',
      explanation: editingQuestion.explanation
    };
    setEditingTest({
      ...editingTest,
      questions: [...currentQs, newQ]
    });
    setEditingQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      subject: 'General Knowledge',
      explanation: ''
    });
    alert('প্রশ্নটি যুক্ত করা হয়েছে! আরও যুক্ত করতে পারেন।');
  };

  // CSV Validation parsing simulation
  const handleValidateCSV = () => {
    if (!csvContent) {
      alert('CSV বা টেক্সট পেস্ট করুন!');
      return;
    }
    const lines = csvContent.trim().split('\n');
    let valid = 0;
    let invalid = 0;
    let duplicates = 0;
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const parts = line.split('|');
      if (parts.length >= 6) {
        valid++;
      } else {
        invalid++;
        errors.push(`লাইন ${index + 1}: পর্যাপ্ত কলাম নেই (ন্যূনতম ৬টি কলাম প্রয়োজন)।`);
      }
    });

    setValidationReport({
      totalRows: lines.length,
      valid,
      invalid,
      duplicates,
      errors
    });
  };

  const handleImportCSV = () => {
    if (!validationReport || validationReport.valid === 0) return;
    setIsImporting(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        
        // parse and append
        const lines = csvContent.trim().split('\n');
        const parsed: Question[] = [];
        lines.forEach(line => {
          const parts = line.split('|');
          if (parts.length >= 6) {
            parsed.push({
              id: 'q-' + Date.now() + Math.random().toString(36).substr(2, 5),
              questionText: parts[0]?.trim(),
              options: [parts[1]?.trim(), parts[2]?.trim(), parts[3]?.trim(), parts[4]?.trim()],
              correctOptionIndex: parseInt(parts[5]?.trim()) - 1,
              subject: parts[6]?.trim() || 'General Knowledge',
              explanation: parts[7]?.trim() || ''
            });
          }
        });

        const currentQs = editingTest.questions || [];
        setEditingTest({
          ...editingTest,
          questions: [...currentQs, ...parsed]
        });

        setIsImporting(false);
        setUploadProgress(0);
        setValidationReport(null);
        setCsvContent('');
        setActiveSubView('wizard');
        setWizardStep(3); // return to add questions step
        alert('সফলভাবে প্রশ্নসমূহ ইম্পোর্ট করা হয়েছে!');
      }
    }, 500);
  };

  // Filter list
  const filteredTests = mockTests.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bengaliTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'free') return matchesSearch && !t.isPremium;
    if (filterType === 'premium') return matchesSearch && t.isPremium;
    if (filterType === 'draft') return matchesSearch && t.totalQuestions === 0;
    return matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      
      {/* --------------------------------- */}
      {/* 1. MOCK TEST STEP-BY-STEP WIZARD */}
      {/* --------------------------------- */}
      {activeSubView === 'wizard' && (
        <div className="min-h-screen pb-12">
          {/* Wizard Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveSubView('list')} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <p className="text-[10px] text-indigo-600 font-extrabold uppercase">মক টেস্ট উইজার্ড</p>
                <h2 className="text-sm font-black text-slate-800 truncate max-w-[170px]">
                  {editingTest.bengaliTitle || 'নতুন মক টেস্ট'}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-slate-400">ধাপ {wizardStep}/৫</span>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="w-full bg-slate-150 h-1">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${(wizardStep / 5) * 100}%` }}
            />
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* STEP 1: Basic Information */}
            {wizardStep === 1 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ১: বেসিক তথ্য</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">মক টেস্টের নাম (ইংরেজি)</label>
                    <input 
                      type="text"
                      value={editingTest.title || ''}
                      onChange={e => setEditingTest({ ...editingTest, title: e.target.value })}
                      placeholder="যেমন: Panchayat Clerk Mini Mock Test 01"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">মক টেস্টের নাম (বাংলা টাইটেল)</label>
                    <input 
                      type="text"
                      value={editingTest.bengaliTitle || ''}
                      onChange={e => setEditingTest({ ...editingTest, bengaliTitle: e.target.value })}
                      placeholder="যেমন: পঞ্চায়েত ক্লার্ক মিনি মক টেস্ট ০১"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">কোন পদের সাথে যুক্ত করবেন?</label>
                    <select 
                      value={editingTest.postId || ''}
                      onChange={e => setEditingTest({ ...editingTest, postId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none"
                    >
                      {posts.map(p => (
                        <option key={p.id} value={p.id}>{p.bengaliName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">টেস্টের বিবরণ (Description)</label>
                    <textarea 
                      value={editingTest.examTypeBengali || ''}
                      onChange={e => setEditingTest({ ...editingTest, examTypeBengali: e.target.value })}
                      placeholder="এই মক টেস্ট সম্পর্কে প্রার্থীদের জন্য কিছু নির্দেশনা..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Exam Settings */}
            {wizardStep === 2 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ২: পরীক্ষার সেটিংস</span>
                
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">সময় (মিনিট)</label>
                      <input 
                        type="number"
                        value={editingTest.durationMinutes || 60}
                        onChange={e => setEditingTest({ ...editingTest, durationMinutes: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">মোট নম্বর (Total Marks)</label>
                      <input 
                        type="number"
                        value={editingTest.totalMarks || 100}
                        onChange={e => setEditingTest({ ...editingTest, totalMarks: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">পাস নম্বর (Pass Marks)</label>
                      <input 
                        type="number"
                        value={editingTest.passingMarks || 40}
                        onChange={e => setEditingTest({ ...editingTest, passingMarks: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">নেগেটিভ মার্কিং</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none"
                      >
                        <option value="0.25">0.25 (1/4th)</option>
                        <option value="0.33">0.33 (1/3rd)</option>
                        <option value="0.50">0.50 (1/2)</option>
                        <option value="0">কোনো নেগেটিভ নেই</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">কঠিনতার মাত্রা (Difficulty)</label>
                    <select 
                      value={editingTest.difficulty || 'Medium'}
                      onChange={e => setEditingTest({ ...editingTest, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none"
                    >
                      <option value="Easy">Easy (সহজ)</option>
                      <option value="Medium">Medium (মাঝারি)</option>
                      <option value="Hard">Hard (কঠিন)</option>
                    </select>
                  </div>

                  {/* Shuffle check Toggles */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-400" />
                      <span className="text-[11px] font-bold text-slate-600">প্রশ্ন এলোমেলো (Shuffle Questions) করুন</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-400" />
                      <span className="text-[11px] font-bold text-slate-600">অপশন এলোমেলো (Shuffle Options) করুন</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Add Questions (Manually or Bulk) */}
            {wizardStep === 3 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ৩: প্রশ্নব্যাঙ্ক সংযোজন</span>
                  <span className="text-[11px] font-black text-indigo-600">যুক্ত হয়েছে: {(editingTest.questions || []).length} টি</span>
                </div>

                {/* manual question editor inside step */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">প্রশ্ন সংযোজন করুন</span>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">প্রশ্ন (Bengali Question Text)</label>
                    <textarea 
                      value={editingQuestion.questionText || ''}
                      onChange={e => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                      placeholder="যেমন: ভারতের সংবিধান কবে গৃহীত হয়েছিল?"
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">অপশন সমূহ</label>
                    {['A', 'B', 'C', 'D'].map((lbl, idx) => (
                      <div key={lbl} className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-400 w-3">{lbl}</span>
                        <input 
                          type="text"
                          value={editingQuestion.options?.[idx] || ''}
                          onChange={e => {
                            const opts = [...(editingQuestion.options || ['', '', '', ''])];
                            opts[idx] = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: opts });
                          }}
                          placeholder={`অপশন ${idx + 1}`}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">সঠিক উত্তর</label>
                      <select 
                        value={editingQuestion.correctOptionIndex ?? 0}
                        onChange={e => setEditingQuestion({ ...editingQuestion, correctOptionIndex: parseInt(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                      >
                        <option value="0">অপশন A</option>
                        <option value="1">অপশন B</option>
                        <option value="2">অপশন C</option>
                        <option value="3">অপশন D</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">বিষয় / সাবজেক্ট</label>
                      <input 
                        type="text"
                        value={editingQuestion.subject || ''}
                        onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                        placeholder="যেমন: History"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">ব্যাখ্যা (ঐচ্ছিক)</label>
                    <input 
                      type="text"
                      value={editingQuestion.explanation || ''}
                      onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                      placeholder="সঠিক উত্তরের যুক্তি ব্যাখ্যা..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                    />
                  </div>

                  <button 
                    type="button"
                    onClick={handleAddQuestionToTest}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-xl cursor-pointer"
                  >
                    + টেস্টে প্রশ্নটি যোগ করুন
                  </button>
                </div>

                {/* Bulk Import section trigger inside step */}
                <div className="p-4 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/20 text-center space-y-2">
                  <FileSpreadsheet className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div>
                    <p className="text-xs font-black text-slate-700">একসাথে অনেক প্রশ্ন আপলোড করতে চান?</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">CSV বা টেক্সট পেস্ট করে সহজে ইম্পোর্ট করুন।</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setCsvContent('');
                      setValidationReport(null);
                      setActiveSubView('bulk_upload');
                    }}
                    className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-[10px] font-black rounded-xl hover:bg-indigo-50 cursor-pointer"
                  >
                    CSV/Excel ইমপোর্টার খুলুন
                  </button>
                </div>

              </div>
            )}

            {/* STEP 4: Access Settings */}
            {wizardStep === 4 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ৪: মেম্বারশিপ ও অ্যাক্সেস</span>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-2 block">অ্যাক্সেস মোড নির্বাচন করুন</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingTest({ ...editingTest, isPremium: false })}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all ${
                          !editingTest.isPremium 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-100' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-black">Free Test (ফ্রি)</span>
                        <span className="text-[9px] font-semibold text-slate-400">সব ইউজার অংশ নিতে পারবে</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingTest({ ...editingTest, isPremium: true })}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all ${
                          editingTest.isPremium 
                            ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-100' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black">Premium Test</span>
                        <span className="text-[9px] font-semibold text-slate-400">শুধুমাত্র পেইড মেম্বারদের জন্য</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">লগইন আবশ্যিকতা (Login required?)</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none">
                      <option value="yes">হ্যাঁ (লগইন করা ইউজার শুধু টেস্ট দিতে পারবে)</option>
                      <option value="no">না (লগইন ছাড়াও সরাসরি দেওয়া যাবে)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">তফসিল প্রকাশ (Scheduled Publish)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="datetime-local" 
                        defaultValue="2026-07-07T12:00"
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Publish */}
            {wizardStep === 5 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ৫: চূড়ান্ত পর্যালোচনা</span>
                
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs">
                  <h3 className="font-black text-slate-800 text-xs">মক টেস্ট সামারি:</h3>
                  <div className="space-y-2 font-bold text-slate-600 text-[11px]">
                    <p>• ইংরেজী নাম: <span className="text-slate-800">{editingTest.title}</span></p>
                    <p>• বাংলা নাম: <span className="text-slate-800">{editingTest.bengaliTitle}</span></p>
                    <p>• মোট সময়: <span className="text-slate-800">{editingTest.durationMinutes} মিনিট</span></p>
                    <p>• মোট নম্বর: <span className="text-slate-800">{editingTest.totalMarks}</span></p>
                    <p>• পাস নম্বর: <span className="text-slate-800">{editingTest.passingMarks}</span></p>
                    <p>• মোট প্রশ্ন যুক্ত হয়েছে: <span className="text-indigo-600">{(editingTest.questions || []).length} টি</span></p>
                    <p>• টাইপ: <span className={editingTest.isPremium ? 'text-amber-600' : 'text-emerald-600'}>
                      {editingTest.isPremium ? 'Premium ★' : 'Free (ফ্রি)'}
                    </span></p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/60 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-800 font-bold leading-relaxed">
                    আপনার মক টেস্টটি সফলভাবে প্রস্তুত করা হয়েছে। পাবলিশ বাটনে ক্লিক করার সাথে সাথে প্রার্থীরা রিয়েল-টাইমে অ্যাপ থেকে অংশ নিতে পারবে।
                  </p>
                </div>
              </div>
            )}

            {/* Step controller buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  wizardStep === 1 
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' 
                    : 'bg-white text-slate-700 border-slate-150 hover:bg-slate-50'
                }`}
              >
                পূর্ববর্তী
              </button>

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-sm cursor-pointer"
                >
                  পরবর্তী ধাপ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveWizard}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  পাবলিশ করুন ➔
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------- */}
      {/* 2. BULK QUESTION UPLOADER VIEW */}
      {/* ------------------------------- */}
      {activeSubView === 'bulk_upload' && (
        <div className="min-h-screen pb-12">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveSubView('wizard')} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase">CSV / EXCEL ইম্পোর্টার</p>
                <h2 className="text-sm font-black text-slate-800">বাল্ক আপলোড প্যানেল</h2>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Format Instructions */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">নির্দেশনা</span>
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                অনুগ্রহ করে নিচের ফরমেটে পাইপ (`|`) চিহ্ন দিয়ে প্রতিটি কলাম পৃথক করে লিখুন:
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-250 font-mono text-[9px] text-slate-500 overflow-x-auto whitespace-pre">
                প্রশ্ন | অপশন ১ | অপশন ২ | অপশন ৩ | অপশন ৪ | সঠিক উত্তর (১-৪) | সাবজেক্ট
              </div>
              <p className="text-[10px] font-semibold text-slate-400">
                উদাহরণ: ভারতের রাজধানী কোনটি? | কলকাতা | মুম্বাই | দিল্লি | চেন্নাই | ৩ | Geography
              </p>
            </div>

            {/* Paste Textarea */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">বাল্ক ডাটা পেস্ট করুন</label>
                <textarea 
                  value={csvContent}
                  onChange={e => setCsvContent(e.target.value)}
                  placeholder="এখানে আপনার প্রশ্নাবলী পেস্ট করুন..."
                  rows={8}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleValidateCSV}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer transition-all"
                >
                  ডাটা যাচাই (Validate) করুন
                </button>
              </div>
            </div>

            {/* Validation Diagnostic Report */}
            {validationReport && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <span className="text-[10px] bg-teal-50 text-teal-700 font-black px-2 py-0.5 rounded-full">ভ্যালিডেশন রিপোর্ট</span>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border">
                    <p className="text-[10px] font-bold text-slate-400">মোট লাইন</p>
                    <p className="text-base font-black text-slate-800">{validationReport.totalRows}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-500">সঠিক প্রশ্ন</p>
                    <p className="text-base font-black text-emerald-700">{validationReport.valid}</p>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-rose-500">ভুল প্রশ্ন</p>
                    <p className="text-base font-black text-rose-700">{validationReport.invalid}</p>
                  </div>
                </div>

                {validationReport.errors.length > 0 && (
                  <div className="p-3 bg-rose-50 rounded-xl text-[10px] font-bold text-rose-800 max-h-24 overflow-y-auto space-y-1">
                    {validationReport.errors.map((e, idx) => <p key={idx}>⚠️ {e}</p>)}
                  </div>
                )}

                {/* Column Mapping display */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-[10px]">
                  <span className="font-bold text-slate-700 block mb-1">ডিফল্ট কলাম ম্যাপিং (Column Mapping):</span>
                  <p className="text-slate-500">কলাম ১ → প্রশ্ন টেক্সট</p>
                  <p className="text-slate-500">কলাম ২-৫ → অপশন ১-৪</p>
                  <p className="text-slate-500">কলাম ৬ → সঠিক উত্তরের সূচক</p>
                </div>

                {/* Progress bar and button */}
                {isImporting ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>ইম্পোর্ট হচ্ছে...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleImportCSV}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md"
                  >
                    টেস্টে ইমপোর্ট (Import) সম্পন্ন করুন ➔
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ------------------------- */}
      {/* 3. MOCK TEST MANAGE VIEW */}
      {/* ------------------------- */}
      {activeSubView === 'list' && (
        <div className="min-h-screen">
          {/* Top Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">মক টেস্ট ম্যানেজার</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">রিয়েল-টাইম প্রশ্নব্যাংক ও মক এক্সাম</p>
              </div>
            </div>
            <button 
              onClick={() => handleOpenWizard(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-indigo-600/10"
            >
              <Plus className="w-3.5 h-3.5" /> মক টেস্ট
            </button>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            {/* Search and Filters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="মক টেস্ট খুঁজুন..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                {(['all', 'free', 'premium', 'draft'] as const).map(type => {
                  const labelMap = { all: 'সব', free: 'ফ্রি টেস্ট', premium: 'প্রিমিয়াম', draft: 'প্রশ্নহীন' };
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap cursor-pointer transition-all border shrink-0 ${
                        filterType === type 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'
                      }`}
                    >
                      {labelMap[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Cards List */}
            {filteredTests.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Sliders className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700">কোনো মক টেস্ট তৈরি করা হয়নি</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">প্রথম মক টেস্ট তৈরি করতে প্লাস বাটনে ক্লিক করুন।</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTests.map(test => {
                  const isPremium = test.isPremium;
                  
                  return (
                    <div key={test.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 max-w-[70%]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8.5px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                              {test.examTypeBengali || 'General'}
                            </span>
                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full ${
                              isPremium 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isPremium ? 'Premium' : 'Free'}
                            </span>
                          </div>
                          <h3 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">
                            {test.bengaliTitle}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-base font-black text-indigo-600">{(test.questions || []).length}</p>
                          <p className="text-[9px] font-bold text-slate-400">টি প্রশ্ন</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-500 pt-2 border-t border-slate-50">
                        <div className="flex gap-2">
                          <span>সময়: {test.durationMinutes} মি.</span>
                          <span>•</span>
                          <span>পূর্ণমান: {test.totalMarks}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleOpenWizard(test)}
                            className="p-1.5 hover:bg-slate-50 text-slate-600 hover:text-blue-600 rounded-lg cursor-pointer"
                            title="Edit / Questions"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              const dup = { ...test, id: 'test-' + Date.now(), title: test.title + ' Copy', bengaliTitle: test.bengaliTitle + ' (অনুলিপি)' };
                              onSaveMockTest(dup);
                            }}
                            className="p-1.5 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-lg cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteMockTest(test.id)}
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
      )}

    </div>
  );
}
