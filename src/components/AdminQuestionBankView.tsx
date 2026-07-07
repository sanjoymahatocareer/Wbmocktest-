import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Plus, Search, Filter, Edit3, Trash2, Copy, Eye, Save, 
  ArrowLeft, Upload, CheckCircle, FileCheck, Check, Trash, ArrowRight, Play 
} from 'lucide-react';
import { Question, MockTest, ExamCategory } from '../types';

interface AdminQuestionBankViewProps {
  mockTests: MockTest[];
  categories: ExamCategory[];
  onSaveMockTests: (tests: MockTest[]) => void;
  onBack: () => void;
}

export default function AdminQuestionBankView({
  mockTests,
  categories,
  onSaveMockTests,
  onBack
}: AdminQuestionBankViewProps) {
  const [selectedTestId, setSelectedTestId] = useState<string>(mockTests[0]?.id || '');
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // Selection
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Forms
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [bulkMode, setBulkMode] = useState<'none' | 'excel' | 'paste'>('none');
  const [csvPaste, setCsvPaste] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Quick Mock Test state for when mockTests is empty
  const [quickTestTitle, setQuickTestTitle] = useState('');
  const [quickTestCategory, setQuickTestCategory] = useState(categories[0]?.id || 'other');

  const handleCreateQuickMockTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTestTitle.trim()) return;

    const matchedCat = categories.find(c => c.id === quickTestCategory);
    const newTest: MockTest = {
      id: 'test-' + Date.now(),
      title: quickTestTitle.trim(),
      bengaliTitle: quickTestTitle.trim(),
      examType: quickTestCategory,
      examTypeBengali: matchedCat?.bengaliName || 'অন্যান্য পরীক্ষা',
      totalQuestions: 10,
      totalMarks: 10,
      durationMinutes: 10,
      difficulty: 'মাঝারি',
      isPremium: false,
      isPublished: true,
      questions: []
    };

    onSaveMockTests([...mockTests, newTest]);
    setSelectedTestId(newTest.id);
    setQuickTestTitle('');
  };

  // Auto-fill active test
  const activeTest = mockTests.find(t => t.id === selectedTestId);
  const questionsList = activeTest?.questions || [];

  // Extract unique subjects for filters
  const subjects = Array.from(new Set(questionsList.map(q => q.subject || 'General Knowledge')));

  // Filtered list
  const filteredQuestions = questionsList.filter(q => {
    const term = search.toLowerCase();
    const textMatch = q.questionText.toLowerCase().includes(term) || (q.explanation || '').toLowerCase().includes(term);
    const subjectMatch = subjectFilter === 'all' || q.subject === subjectFilter;
    const diffMatch = difficultyFilter === 'all' || (q as any).difficulty === difficultyFilter;
    return textMatch && subjectMatch && diffMatch;
  });

  const handleSelectAll = () => {
    if (selectedQuestionIds.length === filteredQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredQuestions.map(q => q.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.questionText || !selectedTestId) return;

    const test = mockTests.find(t => t.id === selectedTestId);
    if (!test) return;

    let updatedQuestions = [...(test.questions || [])];

    const finalQuestion: Question = {
      id: editingQuestion.id || 'q-' + Date.now(),
      questionText: editingQuestion.questionText,
      options: editingQuestion.options || ['', '', '', ''],
      correctOptionIndex: editingQuestion.correctOptionIndex ?? 0,
      subject: editingQuestion.subject || 'General Knowledge',
      explanation: editingQuestion.explanation || ''
    };
    
    // Add custom fields
    (finalQuestion as any).difficulty = editingQuestion.difficulty || 'মাঝারি';
    (finalQuestion as any).topic = editingQuestion.topic || '';
    (finalQuestion as any).source = editingQuestion.source || '';

    if (editingQuestion.index !== undefined) {
      updatedQuestions[editingQuestion.index] = finalQuestion;
    } else {
      updatedQuestions.push(finalQuestion);
    }

    const updatedTests = mockTests.map(t => {
      if (t.id === selectedTestId) {
        return {
          ...t,
          questions: updatedQuestions,
          totalQuestions: updatedQuestions.length,
          totalMarks: updatedQuestions.length
        };
      }
      return t;
    });

    onSaveMockTests(updatedTests);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি ডিলিট করতে চান?')) return;
    const test = mockTests.find(t => t.id === selectedTestId);
    if (!test) return;

    const updatedQuestions = (test.questions || []).filter((_, i) => i !== idx);
    const updatedTests = mockTests.map(t => {
      if (t.id === selectedTestId) {
        return {
          ...t,
          questions: updatedQuestions,
          totalQuestions: updatedQuestions.length,
          totalMarks: updatedQuestions.length
        };
      }
      return t;
    });

    onSaveMockTests(updatedTests);
  };

  const handleBulkUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError('');
    setBulkSuccess('');
    setUploadProgress(10);

    if (!selectedTestId) {
      setBulkError('মক টেস্ট নির্বাচন করুন!');
      return;
    }

    if (!csvPaste.trim()) {
      setBulkError('সঠিক ফরম্যাটে তথ্য পেস্ট করুন!');
      return;
    }

    try {
      const lines = csvPaste.split('\n').filter(line => line.trim());
      const parsedQuestions: Question[] = [];

      lines.forEach((line, i) => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length < 6) {
          throw new Error(`লাইন ${i + 1}: ফরম্যাট ভুল। ন্যূনতম ৫টি পাইপ (|) থাকতে হবে।`);
        }

        const [questionText, opt1, opt2, opt3, opt4, correctStr, subject, explanation] = parts;
        const correctIndex = parseInt(correctStr) - 1;

        if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
          throw new Error(`লাইন ${i + 1}: সঠিক উত্তর অবশ্যই ১ থেকে ৪ এর মধ্যে একটি সংখ্যা হতে হবে।`);
        }

        parsedQuestions.push({
          id: `q-bulk-${Date.now()}-${i}`,
          questionText,
          options: [opt1, opt2, opt3, opt4],
          correctOptionIndex: correctIndex,
          subject: subject || 'General Knowledge',
          explanation: explanation || ''
        });
      });

      setUploadProgress(50);
      const test = mockTests.find(t => t.id === selectedTestId);
      if (!test) return;

      const updatedQuestions = [...(test.questions || []), ...parsedQuestions];
      const updatedTests = mockTests.map(t => {
        if (t.id === selectedTestId) {
          return {
            ...t,
            questions: updatedQuestions,
            totalQuestions: updatedQuestions.length,
            totalMarks: updatedQuestions.length
          };
        }
        return t;
      });

      setTimeout(() => {
        setUploadProgress(100);
        onSaveMockTests(updatedTests);
        setBulkSuccess(`সফলভাবে ${parsedQuestions.length} টি প্রশ্ন ইম্পোর্ট করা হয়েছে!`);
        setCsvPaste('');
        setTimeout(() => setUploadProgress(0), 1000);
      }, 500);

    } catch (err: any) {
      setUploadProgress(0);
      setBulkError(err.message || 'CSV পার্সিং করতে ত্রুটি দেখা দিয়েছে।');
    }
  };

  const handleBulkDelete = () => {
    if (selectedQuestionIds.length === 0) return;
    if (!window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedQuestionIds.length} টি প্রশ্ন ডিলিট করতে চান?`)) return;

    const test = mockTests.find(t => t.id === selectedTestId);
    if (!test) return;

    const updatedQuestions = (test.questions || []).filter(q => !selectedQuestionIds.includes(q.id));
    const updatedTests = mockTests.map(t => {
      if (t.id === selectedTestId) {
        return {
          ...t,
          questions: updatedQuestions,
          totalQuestions: updatedQuestions.length,
          totalMarks: updatedQuestions.length
        };
      }
      return t;
    });

    onSaveMockTests(updatedTests);
    setSelectedQuestionIds([]);
    setIsBulkMode(false);
  };

  if (mockTests.length === 0) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900">কোনো মক টেস্ট খুঁজে পাওয়া যায়নি!</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              প্রশ্নাবলি সরাসরি কোনো না কোনো পরীক্ষার সেটের (মক টেস্ট) সাথে যুক্ত থাকে। প্রশ্ন তৈরি করতে প্রথমে নিচে একটি কুইক মক টেস্ট তৈরি করুন।
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateQuickMockTest} className="bg-white p-5 rounded-3xl border border-slate-150 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2">
            ⚡ কুইক মক টেস্ট বা প্রশ্ন সেট তৈরি করুন
          </h4>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 block">মক টেস্ট বা পরীক্ষার নাম <span className="text-rose-500">*</span></label>
              <input 
                type="text"
                required
                placeholder="যেমন: পঞ্চায়েত সাধারণ জ্ঞান টেস্ট - ১"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400"
                value={quickTestTitle}
                onChange={e => setQuickTestTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 block">পরীক্ষার ক্যাটাগরি</label>
              <select 
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                value={quickTestCategory}
                onChange={e => setQuickTestCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.bengaliName}</option>
                ))}
                {categories.length === 0 && <option value="other">অন্যান্য পরীক্ষা</option>}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> টেস্ট তৈরি করুন এবং প্রশ্ন যোগে যান
          </button>
        </form>

        <button 
          onClick={onBack}
          className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold text-center transition-all"
        >
          ড্যাশবোর্ডে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Test Selector bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-sm space-y-2">
        <label className="text-[10px] font-extrabold text-slate-400 uppercase">মক টেস্ট নির্বাচন করুন</label>
        <select 
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400"
          value={selectedTestId}
          onChange={e => {
            setSelectedTestId(e.target.value);
            setEditingQuestion(null);
            setBulkMode('none');
          }}
        >
          {mockTests.map(t => (
            <option key={t.id} value={t.id}>{t.bengaliTitle} ({t.questions?.length || 0} টি প্রশ্ন)</option>
          ))}
        </select>
      </div>

      {editingQuestion ? (
        /* ================= ADD/EDIT QUESTION FORM ================= */
        <form onSubmit={handleSaveQuestion} className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              {editingQuestion.index !== undefined ? 'প্রশ্ন সম্পাদনা' : 'নতুন প্রশ্ন সংযোজন'}
            </h4>
            <button 
              type="button" 
              onClick={() => setEditingQuestion(null)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 block">প্রশ্ন টেক্সট (Question Text) <span className="text-rose-500">*</span></label>
              <textarea 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white"
                rows={3}
                value={editingQuestion.questionText || ''}
                onChange={e => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                placeholder="যেমন: ভারতের সংবিধানের জনক কাকে বলা হয়?"
                required
              />
            </div>

            {/* MCQ Options A, B, C, D */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-500 block">উত্তর অপশনসমূহ (MCQ Options)</label>
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-black text-slate-400 w-5">{(idx + 1)}.</span>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white"
                    value={editingQuestion.options?.[idx] || ''}
                    onChange={e => {
                      const opts = [...(editingQuestion.options || ['', '', '', ''])];
                      opts[idx] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: opts });
                    }}
                    placeholder={`যেমন: অপশন ${String.fromCharCode(65 + idx)}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 block">সঠিক উত্তর নির্বাচন</label>
                <select 
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingQuestion.correctOptionIndex}
                  onChange={e => setEditingQuestion({ ...editingQuestion, correctOptionIndex: parseInt(e.target.value) })}
                >
                  <option value={0}>অপশন ১</option>
                  <option value={1}>অপশন ২</option>
                  <option value={2}>অপশন ৩</option>
                  <option value={3}>অপশন ৪</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 block">বিষয় / Subject</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingQuestion.subject || ''}
                  onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                  placeholder="যেমন: ইতিহাস, ভূগোল"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 block">টপিক (Topic)</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingQuestion.topic || ''}
                  onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                  placeholder="যেমন: মোঘল সাম্রাজ্য"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 block">কাঠিন্য (Difficulty)</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={editingQuestion.difficulty || 'মাঝারি'}
                  onChange={e => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })}
                >
                  <option value="সহজ">সহজ (Easy)</option>
                  <option value="মাঝারি">মাঝারি (Medium)</option>
                  <option value="কঠিন">কঠিন (Hard)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 block">বিশদ ব্যাখ্যা (Explanation/Solution)</label>
              <textarea 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white"
                rows={2}
                value={editingQuestion.explanation || ''}
                onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                placeholder="সঠিক উত্তরের পেছনে যুক্তি বা সমাধান এখানে লিখুন..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setEditingQuestion(null)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-extrabold"
            >
              বাতিল
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow"
            >
              <Save className="w-3.5 h-3.5" /> প্রশ্ন সংরক্ষণ করুন
            </button>
          </div>
        </form>
      ) : bulkMode !== 'none' ? (
        /* ================= BULK QUESTION UPLOADER ================= */
        <form onSubmit={handleBulkUploadSubmit} className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-indigo-600" />
              বাল্ক প্রশ্ন আপলোডার (Bulk Uploader)
            </h4>
            <button 
              type="button" 
              onClick={() => setBulkMode('none')}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 text-[10.5px] font-bold text-slate-600 space-y-1.5">
              <span className="font-extrabold text-slate-800">📋 পাইপ (|) ফরম্যাট গাইড:</span>
              <p>প্রতিটি নতুন প্রশ্ন একটি নতুন লাইনে লিখুন। ফরম্যাট নিম্নরূপ:</p>
              <code className="block bg-white p-2 rounded-lg border border-slate-250 font-mono text-[9px] leading-relaxed select-all">
                প্রশ্ন টেক্সট | অপশন ১ | অপশন ২ | অপশন ৩ | অপশন ৪ | সঠিক উত্তর (1-4) | বিষয় | ব্যাখ্যা
              </code>
            </div>

            <textarea 
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:outline-none"
              rows={8}
              placeholder="যেমন: ভারতের আইন সভার উচ্চকক্ষের নাম কী? | লোকসভা | রাজ্যসভা | বিধানসভা | বিধান পরিষদ | 2 | ভারতের শাসনব্যবস্থা | ভারতের পার্লামেন্টের উচ্চকক্ষ হলো রাজ্যসভা।"
              value={csvPaste}
              onChange={e => setCsvPaste(e.target.value)}
            />

            {uploadProgress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-extrabold text-indigo-600">
                  <span>আপলোড প্রগ্রেস...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {bulkError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[10.5px] font-bold rounded-xl">
                ⚠️ {bulkError}
              </div>
            )}

            {bulkSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold rounded-xl flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bulkSuccess}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setBulkMode('none')}
              className="w-1/3 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-extrabold text-center"
            >
              বাতিল
            </button>
            <button 
              type="submit"
              className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black text-center shadow"
            >
              বাল্ক ইম্পোর্ট চালু করুন
            </button>
          </div>
        </form>
      ) : (
        /* ================= QUESTIONS VIEW & LIST ================= */
        <div className="space-y-4">
          {/* Question Creation Center Dashboard Card */}
          <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 p-4.5 rounded-3xl text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute right-[-15px] top-[-15px] w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <span className="text-[9px] text-indigo-300 font-extrabold uppercase tracking-wider block">QUESTION PANEL</span>
              <h4 className="text-xs font-black">প্রশ্ন সংযোজন কন্ট্রোল (Create Questions)</h4>
              <p className="text-[10px] text-slate-300 font-bold">নিচের যেকোনো একটি অপশন ব্যবহার করে নতুন প্রশ্ন যুক্ত করুন</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
              <button 
                onClick={() => setEditingQuestion({
                  id: '',
                  questionText: '',
                  options: ['', '', '', ''],
                  correctOptionIndex: 0,
                  subject: 'General Knowledge',
                  explanation: '',
                  difficulty: 'মাঝারি',
                  topic: ''
                })}
                className="p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex flex-col items-start gap-1.5 text-left active:scale-95 transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-purple-500/10">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-white block">১টি নতুন প্রশ্ন তৈরি</span>
                  <span className="text-[8px] text-indigo-200 font-bold block">ম্যানুয়ালি প্রশ্ন লিখুন</span>
                </div>
              </button>

              <button 
                onClick={() => setBulkMode('paste')}
                className="p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex flex-col items-start gap-1.5 text-left active:scale-95 transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-indigo-500/10">
                  <Upload className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-white block">বাল্ক প্রশ্ন আপলোড</span>
                  <span className="text-[8px] text-indigo-200 font-bold block">কপি-পেস্ট করে স্পিড সংযোজন</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
              প্রশ্ন তালিকা ({filteredQuestions.length} টি)
            </h3>
            
            <div className="flex gap-1">
              <button 
                onClick={() => setBulkMode('paste')}
                className="bg-indigo-50 border border-indigo-150 text-indigo-600 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                📥 বাল্ক আপলোড
              </button>

              <button 
                onClick={() => setEditingQuestion({
                  id: '',
                  questionText: '',
                  options: ['', '', '', ''],
                  correctOptionIndex: 0,
                  subject: 'General Knowledge',
                  explanation: '',
                  difficulty: 'মাঝারি',
                  topic: ''
                })}
                className="bg-purple-600 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> প্রশ্ন যোগ
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase block">বিষয় ফিল্টার</label>
              <select 
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold"
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
              >
                <option value="all">সব বিষয়</option>
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase block">কাঠিন্য ফিল্টার</label>
              <select 
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold"
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
              >
                <option value="all">সব কাঠিন্য</option>
                <option value="সহজ">সহজ</option>
                <option value="মাঝারি">মাঝারি</option>
                <option value="কঠিন">কঠিন</option>
              </select>
            </div>
          </div>

          {/* Bulk mode checklist button */}
          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10.5px] font-extrabold text-slate-600">মাল্টি-সিলেকশন মোড:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  setSelectedQuestionIds([]);
                }}
                className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                  isBulkMode ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
                }`}
              >
                {isBulkMode ? 'বন্ধ করুন' : 'চালু করুন'}
              </button>
              {isBulkMode && selectedQuestionIds.length > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-black flex items-center gap-0.5"
                >
                  <Trash className="w-3 h-3" /> ({selectedQuestionIds.length}) মুছুন
                </button>
              )}
            </div>
          </div>

          {/* List of cards */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-1">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">কোনো প্রশ্ন খুঁজে পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredQuestions.map((q, qIdx) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div key={q.id} className={`bg-white rounded-2xl border p-3.5 shadow-sm space-y-3 transition-all ${
                    isSelected ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-150'
                  }`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-2 min-w-0">
                        {isBulkMode && (
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(q.id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded mt-0.5"
                          />
                        )}
                        <div className="space-y-1 min-w-0">
                          <div className="flex gap-1.5 flex-wrap">
                            <span className="text-[8.5px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                              {q.subject || 'সাধারণ জ্ঞান'}
                            </span>
                            <span className="text-[8.5px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded">
                              {((q as any).difficulty) || 'মাঝারি'}
                            </span>
                          </div>
                          <p className="text-xs font-black text-slate-800 leading-relaxed">
                            <span className="text-indigo-600 mr-1">#{qIdx + 1}</span> {q.questionText}
                          </p>
                        </div>
                      </div>

                      {!isBulkMode && (
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => setEditingQuestion({ ...q, index: qIdx })}
                            className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(qIdx)}
                            className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px] font-semibold text-slate-600">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctOptionIndex;
                        return (
                          <div key={oIdx} className={`p-2 rounded-xl border leading-snug ${
                            isCorrect 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold' 
                              : 'bg-slate-50/50 border-slate-150'
                          }`}>
                            <span className="mr-1">{oIdx + 1}.</span> {opt}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-xl text-[10px] text-slate-500 font-medium leading-relaxed">
                        <span className="font-extrabold text-indigo-700 block mb-0.5">💡 ব্যাখ্যা / সমাধান:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
