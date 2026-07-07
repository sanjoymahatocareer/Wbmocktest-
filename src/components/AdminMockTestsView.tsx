import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Search, Edit3, Trash2, ArrowLeft, ArrowRight, Save, 
  Check, Settings, Shield, Lock, Eye, Calendar, Clock, Award, HelpCircle, 
  X, ChevronUp, ChevronDown, Copy, CheckCircle, AlertTriangle, Upload, 
  Play, CheckSquare, Sparkles, PlusCircle, MinusCircle, ListOrdered, RefreshCw, FileText
} from 'lucide-react';
import { MockTest, PostName, ExamCategory, CustomTemplate, Question } from '../types';

interface AdminMockTestsViewProps {
  mockTests: MockTest[];
  posts: PostName[];
  categories: ExamCategory[];
  templates: CustomTemplate[];
  onSaveMockTest: (test: MockTest) => void;
  onDeleteMockTest: (id: string) => void;
  onViewQuestions: (testId: string) => void;
  onBack: () => void;
}

export default function AdminMockTestsView({
  mockTests,
  posts,
  categories,
  templates,
  onSaveMockTest,
  onDeleteMockTest,
  onViewQuestions,
  onBack
}: AdminMockTestsViewProps) {
  // Navigation & filtering states
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  
  // Custom states
  const [editingTest, setEditingTest] = useState<any | null>(null);
  const [managingQuestionsTestId, setManagingQuestionsTestId] = useState<string | null>(null);
  const [previewingTest, setPreviewingTest] = useState<MockTest | null>(null);

  // Question selection/adding states for "Manage Questions" subview
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    subject: '',
    explanation: '',
    difficulty: 'মাঝারি' as const
  });
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  
  // For copying from other tests
  const [copySourceTestId, setCopySourceTestId] = useState('');
  const [copySearchQuery, setCopySearchQuery] = useState('');

  // Auto scroll to top on tab shifts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [editingTest, managingQuestionsTestId, previewingTest]);

  // Aggregate statistics by category
  const getCategoryStats = (catId: string) => {
    const tests = mockTests.filter(t => t.categoryId === catId || t.examType === catId);
    const totalQ = tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);
    return {
      count: tests.length,
      questions: totalQ
    };
  };

  // Filtered mock tests
  const filteredTests = mockTests.filter(t => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (t.bengaliTitle || '').toLowerCase().includes(term) || 
      (t.title || '').toLowerCase().includes(term);
    
    const matchesCategory = 
      selectedCategoryId === 'all' || 
      t.categoryId === selectedCategoryId || 
      t.examType === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  // Start creation with default values
  const handleStartCreate = () => {
    setEditingTest({
      id: '',
      categoryId: categories[0]?.id || 'panchayat',
      postId: posts[0]?.id || '',
      title: '',
      bengaliTitle: '',
      examType: categories[0]?.id || 'panchayat',
      examTypeBengali: categories[0]?.bengaliName || '',
      testNumber: mockTests.length + 1,
      totalQuestions: 100,
      totalMarks: 100,
      passingMarks: 40,
      durationMinutes: 60,
      difficulty: 'মাঝারি',
      isPremium: false,
      isPublished: false,
      negativeMarking: '0.25',
      subjectsDistribution: [
        { subject: 'Bengali', questionCount: 25, marksCount: 25 },
        { subject: 'English', questionCount: 25, marksCount: 25 },
        { subject: 'Mathematics', questionCount: 25, marksCount: 25 },
        { subject: 'GK & Current Affairs', questionCount: 25, marksCount: 25 }
      ],
      questions: []
    });
  };

  const handleStartEdit = (test: MockTest) => {
    setEditingTest({
      ...test,
      categoryId: test.categoryId || test.examType || 'panchayat',
      negativeMarking: test.negativeMarking || '0.25',
      testNumber: test.testNumber || 1,
      isPublished: test.isPublished ?? true,
      subjectsDistribution: test.subjectsDistribution || [
        { subject: 'Bengali', questionCount: 25, marksCount: 25 },
        { subject: 'English', questionCount: 25, marksCount: 25 },
        { subject: 'Mathematics', questionCount: 25, marksCount: 25 },
        { subject: 'GK & Current Affairs', questionCount: 25, marksCount: 25 }
      ]
    });
  };

  // Reordering subjects
  const moveSubject = (index: number, direction: 'up' | 'down') => {
    if (!editingTest) return;
    const list = [...(editingTest.subjectsDistribution || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setEditingTest({ ...editingTest, subjectsDistribution: list });
  };

  // Subject distribution totals
  const subjectQuestionTotal = editingTest?.subjectsDistribution
    ? editingTest.subjectsDistribution.reduce((sum: number, s: any) => sum + (parseInt(s.questionCount) || 0), 0)
    : 0;

  const subjectMarksTotal = editingTest?.subjectsDistribution
    ? editingTest.subjectsDistribution.reduce((sum: number, s: any) => sum + (parseInt(s.marksCount) || 0), 0)
    : 0;

  // Validation before saving
  const validateTestForm = () => {
    if (!editingTest.categoryId) {
      alert('দয়া করে একটি পরীক্ষা ক্যাটাগরি নির্বাচন করুন!');
      return false;
    }
    if (!editingTest.title || !editingTest.bengaliTitle) {
      alert('দয়া করে মক টেস্টের নাম ও বাংলা নাম লিখুন!');
      return false;
    }
    if (subjectQuestionTotal !== parseInt(editingTest.totalQuestions)) {
      alert(`ভুল: বিষয়ের মোট প্রশ্ন সংখ্যা (${subjectQuestionTotal}) মোট নির্ধারিত প্রশ্ন সংখ্যা (${editingTest.totalQuestions}) এর সাথে সমান হতে হবে!`);
      return false;
    }
    return true;
  };

  const handleSaveDraft = () => {
    if (!validateTestForm()) return;
    const final: MockTest = {
      ...editingTest,
      id: editingTest.id || 'test-' + Date.now(),
      totalQuestions: parseInt(editingTest.totalQuestions) || 100,
      totalMarks: parseInt(editingTest.totalMarks) || 100,
      isPublished: false
    };
    onSaveMockTest(final);
    setEditingTest(null);
  };

  const handleSaveAndAddQuestions = () => {
    if (!validateTestForm()) return;
    const testId = editingTest.id || 'test-' + Date.now();
    const final: MockTest = {
      ...editingTest,
      id: testId,
      totalQuestions: parseInt(editingTest.totalQuestions) || 100,
      totalMarks: parseInt(editingTest.totalMarks) || 100
    };
    onSaveMockTest(final);
    setManagingQuestionsTestId(testId);
    setEditingTest(null);
  };

  const handlePublishTest = () => {
    if (!validateTestForm()) return;
    
    // Warn or check if required questions are added
    const qCount = editingTest.questions?.length || 0;
    const required = parseInt(editingTest.totalQuestions) || 100;
    if (qCount < required) {
      alert(`দুঃখিত! আপনি এখনই পাবলিশ করতে পারবেন না। এই মক টেস্টে প্রয়োজনীয় প্রশ্নের সংখ্যা (${required}) পূরণ হয়নি। বর্তমানে মাত্র ${qCount} টি প্রশ্ন যোগ করা হয়েছে। দয়া করে "Save & Add Questions" এ ক্লিক করে সব প্রশ্ন যোগ করুন।`);
      return;
    }

    const final: MockTest = {
      ...editingTest,
      id: editingTest.id || 'test-' + Date.now(),
      totalQuestions: required,
      totalMarks: parseInt(editingTest.totalMarks) || 100,
      isPublished: true
    };
    onSaveMockTest(final);
    setEditingTest(null);
  };

  // Instant publish toggle
  const handleTogglePublish = (test: MockTest) => {
    const isNowPublishing = !test.isPublished;
    if (isNowPublishing && (test.questions?.length || 0) < (test.totalQuestions || 0)) {
      alert(`দুঃখিত! এই টেস্টে প্রয়োজনীয় প্রশ্নসংখ্যা এখনও পূর্ণ হয়নি (${test.questions?.length || 0}/${test.totalQuestions})। সব প্রশ্ন যোগ না করে এটি পাবলিশ করা যাবে না।`);
      return;
    }
    const updated = {
      ...test,
      isPublished: isNowPublishing
    };
    onSaveMockTest(updated);
  };

  // Duplication Engine
  const handleDuplicateTest = (test: MockTest) => {
    // Get next sequential test number or default to current + 1
    const currentNum = test.testNumber || 1;
    const nextNum = currentNum + 1;
    
    // Regex replace test numbers in Bengali and English names
    const numRegex = /(\d+)/g;
    const newBengaliTitle = test.bengaliTitle.replace(numRegex, String(nextNum)) || `${test.bengaliTitle} Copy`;
    const newTitle = test.title.replace(numRegex, String(nextNum)) || `${test.title} Copy`;

    const duplicated: MockTest = {
      ...test,
      id: 'test-' + Date.now(),
      title: newTitle,
      bengaliTitle: newBengaliTitle,
      testNumber: nextNum,
      isPublished: false, // defaulted to unpublished draft
      questions: [...(test.questions || [])].map((q, i) => ({
        ...q,
        id: `q-dup-${Date.now()}-${i}`
      }))
    };

    onSaveMockTest(duplicated);
    alert(`মক টেস্ট সফলভাবে ডুপ্লিকেট করা হয়েছে!\n\nনতুন টেস্ট: ${newBengaliTitle}\nঅবস্থা: Draft (অপ্রকাশিত)`);
  };

  // MANAGING QUESTIONS ENGINE
  const activeManageTest = mockTests.find(t => t.id === managingQuestionsTestId);
  
  // Calculate actual progress per subject in managed test
  const getSubjectProgress = (test: MockTest) => {
    const subjects = test.subjectsDistribution || [];
    return subjects.map(s => {
      const current = (test.questions || []).filter(
        q => (q.subject || '').trim().toLowerCase() === s.subject.trim().toLowerCase()
      ).length;
      return {
        subject: s.subject,
        required: s.questionCount,
        current,
        isCompleted: current >= s.questionCount
      };
    });
  };

  // Manual Question Addition
  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeManageTest) return;

    if (!newQuestion.questionText.trim()) {
      alert('প্রশ্নের টেক্সট লিখুন!');
      return;
    }
    if (!newQuestion.subject) {
      alert('বিষয়ের নাম সিলেক্ট করুন!');
      return;
    }

    const created: Question = {
      id: 'q-' + Date.now(),
      questionText: newQuestion.questionText,
      options: [...newQuestion.options],
      correctOptionIndex: newQuestion.correctOptionIndex,
      subject: newQuestion.subject,
      explanation: newQuestion.explanation
    };

    const updatedQuestions = [...(activeManageTest.questions || []), created];
    const updatedTest = {
      ...activeManageTest,
      questions: updatedQuestions
    };

    onSaveMockTest(updatedTest);
    
    // Reset manual form except subject to speed up sequential entries
    setNewQuestion({
      ...newQuestion,
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: ''
    });
    alert('প্রশ্নটি মক টেস্টে যুক্ত করা হয়েছে!');
  };

  // Bulk Upload Parsing
  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError('');
    setBulkSuccess('');

    if (!activeManageTest) return;
    if (!bulkPasteText.trim()) {
      setBulkError('দয়া করে ফরম্যাট অনুযায়ী টেক্সট পেস্ট করুন!');
      return;
    }

    try {
      const lines = bulkPasteText.split('\n').filter(l => l.trim());
      const parsed: Question[] = [];

      lines.forEach((line, i) => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length < 6) {
          throw new Error(`লাইন ${i + 1}: তথ্য কম আছে (ন্যূনতম ৬টি ক্ষেত্র প্রয়োজন। পাইপ (|) দিয়ে আলাদা করুন)`);
        }

        const [qText, o1, o2, o3, o4, correctStr, subject, explanation] = parts;
        const correctIdx = parseInt(correctStr) - 1;

        if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) {
          throw new Error(`লাইন ${i + 1}: সঠিক উত্তর অবশ্যই ১ থেকে ৪ এর মধ্যে হতে হবে।`);
        }

        parsed.push({
          id: `q-bulk-${Date.now()}-${i}`,
          questionText: qText,
          options: [o1, o2, o3, o4],
          correctOptionIndex: correctIdx,
          subject: subject || activeManageTest.subjectsDistribution?.[0]?.subject || 'General Knowledge',
          explanation: explanation || ''
        });
      });

      const updatedQuestions = [...(activeManageTest.questions || []), ...parsed];
      const updatedTest = {
        ...activeManageTest,
        questions: updatedQuestions
      };

      onSaveMockTest(updatedTest);
      setBulkSuccess(`সফলভাবে ${parsed.length} টি প্রশ্ন যুক্ত করা হয়েছে!`);
      setBulkPasteText('');
    } catch (err: any) {
      setBulkError(err.message || 'পার্সিং করতে ত্রুটি দেখা দিয়েছে।');
    }
  };

  // Question copy from another mock test
  const handleCopyQuestion = (q: Question, targetSubject: string) => {
    if (!activeManageTest) return;

    const copied: Question = {
      ...q,
      id: `q-copy-${Date.now()}`,
      subject: targetSubject // Map into target subject distribution of this test
    };

    const updatedQuestions = [...(activeManageTest.questions || []), copied];
    const updatedTest = {
      ...activeManageTest,
      questions: updatedQuestions
    };

    onSaveMockTest(updatedTest);
    alert('প্রশ্নটি সফলভাবে কপি করা হয়েছে!');
  };

  // Delete question from managed test
  const handleDeleteQuestionFromTest = (qId: string) => {
    if (!activeManageTest) return;
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি টেস্ট থেকে মুছে দিতে চান?')) return;

    const updatedQuestions = (activeManageTest.questions || []).filter(q => q.id !== qId);
    const updatedTest = {
      ...activeManageTest,
      questions: updatedQuestions
    };
    onSaveMockTest(updatedTest);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      
      {/* 1. MOCK TEST SERIES OVERVIEW / HOME VIEW */}
      {!editingTest && !managingQuestionsTestId && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="flex justify-between items-center gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                মক টেস্ট সিরিজ ({mockTests.length} সেট)
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Exam Category → Mock Test Series</p>
            </div>
            
            <button 
              onClick={handleStartCreate}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-extrabold text-[11px] px-3.5 py-2.5 rounded-xl flex items-center gap-1 shadow hover:opacity-95 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> মক টেস্ট যোগ
            </button>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 gap-2 bg-white p-3 rounded-2xl border border-slate-150 shadow-sm">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="সিরিজ বা মক টেস্টের নাম দিয়ে খুঁজুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-4 py-2 text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Horizontally scrollable Category Selectors */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-black whitespace-nowrap border transition-all ${
                  selectedCategoryId === 'all' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                সব ক্যাটাগরি ({mockTests.length})
              </button>
              {categories.map(cat => {
                const stats = getCategoryStats(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] font-black whitespace-nowrap border transition-all ${
                      selectedCategoryId === cat.id 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.emoji} {cat.bengaliName} ({stats.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* GROUPED MOCK TEST SERIES DISPLAY */}
          <div className="space-y-5">
            {categories
              .filter(cat => selectedCategoryId === 'all' || cat.id === selectedCategoryId)
              .map(cat => {
                const categoryTests = mockTests.filter(t => t.categoryId === cat.id || t.examType === cat.id);
                if (categoryTests.length === 0 && selectedCategoryId !== 'all') {
                  return (
                    <div key={cat.id} className="bg-white p-5 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-bold space-y-1">
                      <p>{cat.emoji} {cat.bengaliName} এ এখনও কোনো মক টেস্ট যুক্ত করা হয়নি।</p>
                      <button 
                        onClick={() => {
                          handleStartCreate();
                          setEditingTest(prev => prev ? { ...prev, categoryId: cat.id } : prev);
                        }} 
                        className="text-indigo-600 underline text-[11px] block mx-auto font-black"
                      >
                        পরীক্ষাটি যোগ করুন ➔
                      </button>
                    </div>
                  );
                }
                if (categoryTests.length === 0) return null;

                const totalQSum = categoryTests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);

                return (
                  <div key={cat.id} className="space-y-2.5">
                    
                    {/* Category Title Header */}
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50/20 p-3 rounded-2xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span className="text-base">{cat.emoji || '🗳️'}</span>
                          {cat.bengaliName}
                        </h4>
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block mt-0.5">
                          {categoryTests.length} Mock Tests • {totalQSum} Total Questions
                        </span>
                      </div>
                      <span className="text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg">
                        সিস্টেম সিরিজ
                      </span>
                    </div>

                    {/* Category Tests Cards */}
                    <div className="space-y-3 pl-1">
                      {categoryTests.map((test) => {
                        const actualQuestionsCount = test.questions?.length || 0;
                        const isFullyMapped = actualQuestionsCount >= (test.totalQuestions || 100);

                        return (
                          <div key={test.id} className="bg-white border border-slate-150 rounded-2xl p-3.5 shadow-sm space-y-3.5 hover:border-indigo-200 transition-colors">
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {/* Access Badge */}
                                  {test.isPremium ? (
                                    <span className="text-[9px] font-black bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
                                      <Lock className="w-2.5 h-2.5 text-amber-500" /> PREMIUM
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-black bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
                                      ✓ FREE
                                    </span>
                                  )}

                                  {/* Publication Badge */}
                                  {test.isPublished ? (
                                    <span className="text-[9px] font-black bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-lg">
                                      Published
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-black bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-lg">
                                      Draft
                                    </span>
                                  )}

                                  {/* Progress Badge */}
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                                    isFullyMapped 
                                      ? 'bg-teal-50 border border-teal-150 text-teal-700' 
                                      : 'bg-rose-50 border border-rose-150 text-rose-700'
                                  }`}>
                                    প্রশ্ন: {actualQuestionsCount}/{test.totalQuestions || 100}
                                  </span>
                                </div>

                                <h5 className="text-xs font-black text-slate-800 leading-snug">
                                  {test.bengaliTitle} <span className="text-slate-400 font-bold">({test.title})</span>
                                </h5>

                                <div className="flex gap-3 text-[10px] font-extrabold text-slate-400">
                                  <span>⏱ {test.durationMinutes} Minutes</span>
                                  <span>🏆 Marks: {test.totalMarks}</span>
                                  {test.passingMarks && <span>🎯 Pass: {test.passingMarks}</span>}
                                  {test.negativeMarking && test.negativeMarking !== 'none' && (
                                    <span className="text-rose-600">⚠ Negative: -{test.negativeMarking}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Cards Footer Actions */}
                            <div className="flex flex-wrap justify-between items-center gap-2 pt-2.5 border-t border-slate-100">
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => setManagingQuestionsTestId(test.id)}
                                  className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1.5 rounded-xl transition-all"
                                >
                                  Manage Questions ({actualQuestionsCount})
                                </button>
                                <button 
                                  onClick={() => setPreviewingTest(test)}
                                  className="text-[10px] font-black text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-xl transition-all"
                                >
                                  Preview
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleStartEdit(test)}
                                  className="p-1.5 text-blue-600 bg-blue-50 border border-blue-150 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit Test Settings"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDuplicateTest(test)}
                                  className="p-1.5 text-indigo-600 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 rounded-lg transition-colors"
                                  title="Duplicate Mock Test"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleTogglePublish(test)}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    test.isPublished 
                                      ? 'text-amber-600 bg-amber-50 border-amber-150 hover:bg-amber-100' 
                                      : 'text-emerald-600 bg-emerald-50 border-emerald-150 hover:bg-emerald-100'
                                  }`}
                                  title={test.isPublished ? "Unpublish Test" : "Publish Test"}
                                >
                                  {test.isPublished ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                                <button 
                                  onClick={() => onDeleteMockTest(test.id)}
                                  className="p-1.5 text-rose-600 bg-rose-50 border border-rose-150 hover:bg-rose-100 rounded-lg transition-colors"
                                  title="Delete Test"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* 2. DYNAMIC "ADD MOCK TEST" / "EDIT MOCK TEST" MOBILE FORM */}
      {editingTest && (
        <div className="space-y-4 animate-slide-up">
          
          <div className="sticky top-0 bg-slate-50 z-20 pb-3 border-b border-slate-200 flex items-center justify-between">
            <button 
              onClick={() => setEditingTest(null)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h4 className="text-xs font-black text-slate-900">
              {editingTest.id ? 'মক টেস্ট সম্পাদন করুন' : 'নতুন মক টেস্ট উইজার্ড'}
            </h4>
            <div className="w-8"></div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-4">
            
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-extrabold text-slate-500 block">পরীক্ষার ক্যাটাগরি (Exam Category) <span className="text-rose-500">*</span></label>
              <select 
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                value={editingTest.categoryId || ''}
                onChange={e => {
                  const catId = e.target.value;
                  const cat = categories.find(c => c.id === catId);
                  setEditingTest({ 
                    ...editingTest, 
                    categoryId: catId,
                    examType: catId,
                    examTypeBengali: cat?.bengaliName || ''
                  });
                }}
                required
              >
                <option value="">ক্যাটাগরি নির্বাচন করুন...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.bengaliName} ({c.name})</option>
                ))}
              </select>
            </div>

            {/* Mock Test Name */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-extrabold text-slate-500 block">মক টেস্টের নাম (English Series Name) <span className="text-rose-500">*</span></label>
              <input 
                type="text"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                value={editingTest.title || ''}
                onChange={e => {
                  const val = e.target.value;
                  setEditingTest({ 
                    ...editingTest, 
                    title: val,
                    bengaliTitle: editingTest.bengaliTitle || val
                  });
                }}
                placeholder="যেমন: WB Panchayat Mock Test 1"
                required
              />
            </div>

            {/* Mock Test Name Bengali */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-extrabold text-slate-500 block">মক টেস্টের নাম বাংলায় (Bengali Series Name) <span className="text-rose-500">*</span></label>
              <input 
                type="text"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                value={editingTest.bengaliTitle || ''}
                onChange={e => setEditingTest({ ...editingTest, bengaliTitle: e.target.value })}
                placeholder="যেমন: পঞ্চায়েত মক টেস্ট ০১"
                required
              />
            </div>

            {/* Test Number */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-extrabold text-slate-500 block">মক টেস্ট নম্বর (Test Number) <span className="text-rose-500">*</span></label>
              <input 
                type="number"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                value={editingTest.testNumber || 1}
                onChange={e => setEditingTest({ ...editingTest, testNumber: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            {/* Access Type (FREE or PREMIUM) */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
              <label className="text-[10.5px] font-black text-slate-600 block uppercase tracking-wider">অ্যাক্সেস টাইপ (Access Type)</label>
              <div className="flex gap-5 mt-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="isPremiumRadio" 
                    checked={!editingTest.isPremium}
                    onChange={() => setEditingTest({ ...editingTest, isPremium: false })}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    ফ্রি মক টেস্ট (FREE)
                  </span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="isPremiumRadio" 
                    checked={editingTest.isPremium}
                    onChange={() => setEditingTest({ ...editingTest, isPremium: true })}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    প্রিমিয়াম মক টেস্ট (PREMIUM)
                  </span>
                </label>
              </div>
            </div>

            {/* Question Counts & Marks Counts */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">মোট প্রশ্ন (Total Questions) <span className="text-rose-500">*</span></label>
                <input 
                  type="number"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                  value={editingTest.totalQuestions || 100}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingTest({ 
                      ...editingTest, 
                      totalQuestions: val,
                      totalMarks: val
                    });
                  }}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">মোট নম্বর (Total Marks) <span className="text-rose-500">*</span></label>
                <input 
                  type="number"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                  value={editingTest.totalMarks || 100}
                  onChange={e => setEditingTest({ ...editingTest, totalMarks: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            {/* Duration and Pass marks */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">সময়সীমা (Duration Minutes) <span className="text-rose-500">*</span></label>
                <input 
                  type="number"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                  value={editingTest.durationMinutes || 60}
                  onChange={e => setEditingTest({ ...editingTest, durationMinutes: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">পাস নম্বর (Pass Marks)</label>
                <input 
                  type="number"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400 transition-colors"
                  value={editingTest.passingMarks || 40}
                  onChange={e => setEditingTest({ ...editingTest, passingMarks: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Negative marking & Difficulty */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">নেগেটিভ মার্কিং</label>
                <select 
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  value={editingTest.negativeMarking || '0.25'}
                  onChange={e => setEditingTest({ ...editingTest, negativeMarking: e.target.value })}
                >
                  <option value="none">কোনো নেগেটিভ মার্কিং নেই</option>
                  <option value="0.25">0.25 মার্কস কাটা যাবে (ডিফল্ট)</option>
                  <option value="0.33">0.33 মার্কস কাটা যাবে</option>
                  <option value="0.50">0.50 মার্কস কাটা যাবে</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 block">কঠিনতা স্তর (Difficulty)</label>
                <select 
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  value={editingTest.difficulty || 'মাঝারি'}
                  onChange={e => setEditingTest({ ...editingTest, difficulty: e.target.value as any })}
                >
                  <option value="সহজ">সহজ (Easy)</option>
                  <option value="মাঝারি">মাঝারি (Medium)</option>
                  <option value="কঠিন">কঠিন (Hard)</option>
                </select>
              </div>
            </div>

            {/* SUBJECT DISTRIBUTION REPEATER */}
            <div className="border-t border-slate-150 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="text-[11px] font-black text-slate-950 flex items-center gap-1">
                  <ListOrdered className="w-4 h-4 text-indigo-600" />
                  বিষয়ভিত্তিক ডিস্ট্রিবিউশন (SUBJECT DISTRIBUTION)
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    const list = editingTest.subjectsDistribution || [];
                    setEditingTest({
                      ...editingTest,
                      subjectsDistribution: [...list, { subject: '', questionCount: 25, marksCount: 25 }]
                    });
                  }}
                  className="text-[10px] font-black text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-50 flex items-center gap-0.5"
                >
                  + Add Subject
                </button>
              </div>

              <div className="space-y-2">
                {(editingTest.subjectsDistribution || []).map((s: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 relative space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500">বিষয় #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          type="button" 
                          onClick={() => moveSubject(idx, 'up')}
                          disabled={idx === 0}
                          className={`p-1 rounded ${idx === 0 ? 'text-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveSubject(idx, 'down')}
                          disabled={idx === (editingTest.subjectsDistribution || []).length - 1}
                          className={`p-1 rounded ${idx === (editingTest.subjectsDistribution || []).length - 1 ? 'text-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            const list = [...editingTest.subjectsDistribution];
                            list.splice(idx, 1);
                            setEditingTest({ ...editingTest, subjectsDistribution: list });
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <input 
                        type="text"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        value={s.subject}
                        onChange={e => {
                          const list = [...editingTest.subjectsDistribution];
                          list[idx].subject = e.target.value;
                          setEditingTest({ ...editingTest, subjectsDistribution: list });
                        }}
                        placeholder="বিষয়ের নাম (যেমন: Bengali, English, Math)"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="text-[9px] text-slate-450 font-bold block">প্রশ্নসংখ্যা</label>
                          <input 
                            type="number"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            value={s.questionCount}
                            onChange={e => {
                              const list = [...editingTest.subjectsDistribution];
                              const num = parseInt(e.target.value) || 0;
                              list[idx].questionCount = num;
                              list[idx].marksCount = num;
                              setEditingTest({ ...editingTest, subjectsDistribution: list });
                            }}
                            required
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[9px] text-slate-450 font-bold block">নম্বর</label>
                          <input 
                            type="number"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            value={s.marksCount}
                            onChange={e => {
                              const list = [...editingTest.subjectsDistribution];
                              list[idx].marksCount = parseInt(e.target.value) || 0;
                              setEditingTest({ ...editingTest, subjectsDistribution: list });
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject question total validation warning */}
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>বিষয়ভিত্তিক প্রশ্নের যোগফল:</span>
                  <span className={subjectQuestionTotal === parseInt(editingTest.totalQuestions) ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}>
                    {subjectQuestionTotal} / {editingTest.totalQuestions || 0} Questions
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>বিষয়ভিত্তিক নম্বরের যোগফল:</span>
                  <span className={subjectMarksTotal === parseInt(editingTest.totalMarks) ? 'text-emerald-600' : 'text-rose-600'}>
                    {subjectMarksTotal} / {editingTest.totalMarks || 0} Marks
                  </span>
                </div>
              </div>

              {subjectQuestionTotal !== parseInt(editingTest.totalQuestions) && (
                <div className="p-3 bg-rose-50 border border-rose-150 text-rose-800 text-[10px] font-black rounded-xl flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>সতর্কতা: বিষয়ের প্রশ্নসংখ্যা ({subjectQuestionTotal}) অবশ্যই মোট প্রশ্নসংখ্যার ({editingTest.totalQuestions}) সাথে মিলতে হবে!</span>
                </div>
              )}
            </div>

            {/* Action Form Footer */}
            <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={handleSaveAndAddQuestions}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save & Add Questions
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={handleSaveDraft}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl"
                >
                  Save Draft (খসড়া)
                </button>
                <button 
                  type="button"
                  onClick={handlePublishTest}
                  disabled={subjectQuestionTotal !== parseInt(editingTest.totalQuestions)}
                  className={`py-2.5 text-xs font-black rounded-xl transition-all ${
                    subjectQuestionTotal === parseInt(editingTest.totalQuestions)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Publish Mock Test
                </button>
              </div>
            </div>

          </form>

        </div>
      )}

      {/* 3. INTERACTIVE "MANAGE QUESTIONS" SCREEN */}
      {managingQuestionsTestId && activeManageTest && (
        <div className="space-y-4 animate-slide-up">
          
          <div className="sticky top-0 bg-slate-50 z-20 pb-3 border-b border-slate-200 flex items-center justify-between">
            <button 
              onClick={() => setManagingQuestionsTestId(null)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
            <h4 className="text-xs font-black text-slate-900 truncate max-w-[200px]">
              {activeManageTest.bengaliTitle}
            </h4>
            <div className="w-10"></div>
          </div>

          {/* Stat Board */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-4 rounded-3xl text-white space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-wider block">প্রশ্ন পত্র ম্যানেজমেন্ট</span>
                <h5 className="text-sm font-black mt-0.5">{activeManageTest.bengaliTitle}</h5>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-2xl text-center">
                <span className="text-[9px] text-indigo-200 font-black block uppercase">প্রশ্ন যোগ</span>
                <span className="text-sm font-black">{activeManageTest.questions?.length || 0} / {activeManageTest.totalQuestions}</span>
              </div>
            </div>

            {/* Subject wise checklists */}
            <div className="border-t border-indigo-850 pt-2.5 space-y-1.5">
              <span className="text-[9.5px] text-indigo-300 font-extrabold uppercase block mb-1">Subject Progress:</span>
              <div className="grid grid-cols-2 gap-2">
                {getSubjectProgress(activeManageTest).map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black truncate text-white/90">{s.subject}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[10px] font-black ${s.isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {s.current} / {s.required}
                      </span>
                      {s.isCompleted ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-ping"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion status warning */}
            {activeManageTest.questions?.length === activeManageTest.totalQuestions ? (
              <div className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 p-2.5 rounded-2xl text-[10.5px] font-bold text-center">
                🎉 All required {activeManageTest.totalQuestions} questions added successfully!
              </div>
            ) : (
              <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 p-2.5 rounded-2xl text-[10px] font-semibold text-center">
                ⚠️ মক টেস্টটি পাবলিশ করার পূর্বে বিষয়ের কোটা অনুযায়ী সব প্রশ্ন পূরণ করুন।
              </div>
            )}
          </div>

          {/* ADDING METHOD TABS */}
          <div className="space-y-4">
            
            {/* METHOD 1: MANUAL QUESTION FORM */}
            <details className="bg-white border border-slate-200 rounded-3xl overflow-hidden group shadow-sm transition-all" open>
              <summary className="p-3.5 font-black text-xs text-slate-800 flex justify-between items-center cursor-pointer select-none bg-slate-50 border-b border-slate-100">
                <span>১. ম্যানুয়ালি প্রশ্ন সংযোজন (Add Manually)</span>
                <span className="text-[10px] text-indigo-600 font-extrabold group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <form onSubmit={handleAddManualQuestion} className="p-4 space-y-3.5">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 block">প্রশ্ন বিবরণ (Question Text) *</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-400"
                    rows={3}
                    value={newQuestion.questionText}
                    onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                    placeholder="যেমন: ডাব্লুবি পঞ্চায়েত আইনের কোনো ধারায় ক্লার্ক নিয়োগের আলোচনা করা হয়েছে?"
                    required
                  />
                </div>

                {/* Options 1-4 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 block">অপশনসমূহ (MCQ Options) *</label>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs font-black text-slate-400 w-4">{i + 1}.</span>
                      <input 
                        type="text"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:outline-none"
                        value={newQuestion.options[i]}
                        onChange={e => {
                          const opts = [...newQuestion.options];
                          opts[i] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: opts });
                        }}
                        placeholder={`অপশন ${String.fromCharCode(65 + i)}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct index & dynamic Subject selector */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 block">সঠিক উত্তর *</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={newQuestion.correctOptionIndex}
                      onChange={e => setNewQuestion({ ...newQuestion, correctOptionIndex: parseInt(e.target.value) })}
                    >
                      <option value={0}>অপশন ১</option>
                      <option value={1}>অপশন ২</option>
                      <option value={2}>অপশন ৩</option>
                      <option value={3}>অপশন ৪</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 block">বিষয় (Subject) *</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={newQuestion.subject}
                      onChange={e => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                      required
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {activeManageTest.subjectsDistribution?.map((s, idx) => (
                        <option key={idx} value={s.subject}>{s.subject}</option>
                      ))}
                      <option value="General Knowledge">General Knowledge (অন্যান্য)</option>
                    </select>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 block">বিশদ সমাধান / ব্যাখ্যা (Explanation)</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                    rows={2}
                    value={newQuestion.explanation}
                    onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    placeholder="সঠিক উত্তরের স্বপক্ষে ব্যাখ্যা বা সমাধান থাকলে লিখুন..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  ✓ Add Question to Test
                </button>
              </form>
            </details>

            {/* METHOD 2: COPY FROM QUESTION BANK (OTHER MOCK TESTS) */}
            <details className="bg-white border border-slate-200 rounded-3xl overflow-hidden group shadow-sm transition-all">
              <summary className="p-3.5 font-black text-xs text-slate-800 flex justify-between items-center cursor-pointer select-none bg-slate-50 border-b border-slate-100">
                <span>২. অন্য মক টেস্ট থেকে প্রশ্ন আনুন (From Question Bank)</span>
                <span className="text-[10px] text-indigo-600 font-extrabold group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 space-y-4">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 block">উৎস মক টেস্ট নির্বাচন করুন (Select Source Test)</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={copySourceTestId}
                    onChange={e => setCopySourceTestId(e.target.value)}
                  >
                    <option value="">মক টেস্ট লিস্ট...</option>
                    {mockTests
                      .filter(t => t.id !== activeManageTest.id)
                      .map(t => (
                        <option key={t.id} value={t.id}>{t.bengaliTitle || t.title} ({t.questions?.length || 0}টি প্রশ্ন)</option>
                      ))}
                  </select>
                </div>

                {copySourceTestId && (
                  <div className="space-y-3">
                    <input 
                      type="text"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      placeholder="প্রশ্ন টেক্সট বা কিওয়ার্ড লিখে খুঁজুন..."
                      value={copySearchQuery}
                      onChange={e => setCopySearchQuery(e.target.value)}
                    />

                    {/* Scrollable Questions list matching filter */}
                    <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                      {(mockTests.find(t => t.id === copySourceTestId)?.questions || [])
                        .filter(q => q.questionText.toLowerCase().includes(copySearchQuery.toLowerCase()))
                        .map((q, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
                            <p className="font-black text-slate-850">{q.questionText}</p>
                            
                            <div className="flex justify-between items-center pt-1.5 border-t border-slate-100/50">
                              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-extrabold">
                                অরিজিনাল বিষয়: {q.subject}
                              </span>
                              
                              {/* Quick dropdown select subject to add */}
                              <div className="flex gap-1">
                                <select 
                                  className="bg-white border border-slate-200 text-[10px] font-black p-1 rounded-lg"
                                  onChange={e => {
                                    if (e.target.value) {
                                      handleCopyQuestion(q, e.target.value);
                                      e.target.value = ''; // reset dropdown
                                    }
                                  }}
                                >
                                  <option value="">+ Copy To...</option>
                                  {activeManageTest.subjectsDistribution?.map((sub, sIdx) => (
                                    <option key={sIdx} value={sub.subject}>{sub.subject}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </details>

            {/* METHOD 3: BULK PASTE CSV/PIPE UPLOADER */}
            <details className="bg-white border border-slate-200 rounded-3xl overflow-hidden group shadow-sm transition-all">
              <summary className="p-3.5 font-black text-xs text-slate-800 flex justify-between items-center cursor-pointer select-none bg-slate-50 border-b border-slate-100">
                <span>৩. বাল্ক পেস্ট আপলোডার (Bulk Upload CSV/Pipe)</span>
                <span className="text-[10px] text-indigo-600 font-extrabold group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <form onSubmit={handleBulkUpload} className="p-4 space-y-3.5">
                
                <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100 text-[10px] text-indigo-950 font-semibold space-y-1 leading-relaxed">
                  <span className="font-extrabold text-indigo-900 block mb-0.5">📋 ফরম্যাট নির্দেশিকা:</span>
                  <p>নিচের ফরম্যাটে প্রতিটি প্রশ্ন নতুন লাইনে পাইপ (|) চিহ্ন দিয়ে আলাদা করে লিখুন:</p>
                  <code className="block bg-white p-1.5 rounded border border-indigo-150 font-mono text-[9px] mt-1 overflow-x-auto select-all">
                    প্রশ্ন টেক্সট | অপশন ১ | অপশন ২ | অপশন ৩ | অপশন ৪ | সঠিক উত্তরের ক্রমিক (1-4) | বিষয় | সমাধান ব্যাখ্যা
                  </code>
                </div>

                <textarea 
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none"
                  rows={6}
                  placeholder="যেমন: ভারতের সর্বোচ্চ শৃঙ্গের নাম কী? | এভারেস্ট | গডউইন অস্টিন | কাঞ্চনজঙ্ঘা | নন্দাদেবী | 2 | Geography | গডউইন অস্টিনকে K2 ও বলা হয়।"
                  value={bulkPasteText}
                  onChange={e => setBulkPasteText(e.target.value)}
                />

                {bulkError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold rounded-xl">
                    ⚠️ {bulkError}
                  </div>
                )}

                {bulkSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-xl">
                    ✓ {bulkSuccess}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  বাল্ক আপলোড করুন
                </button>
              </form>
            </details>

          </div>

          {/* ALREADY ADDED QUESTIONS LIST */}
          <div className="space-y-2.5 pt-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">যুক্ত হওয়া প্রশ্নাবলি ({activeManageTest.questions?.length || 0})</span>
            
            <div className="space-y-2.5">
              {(activeManageTest.questions || []).map((q, idx) => (
                <div key={q.id} className="bg-white p-3.5 rounded-2xl border border-slate-150 shadow-sm space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-black text-slate-800 leading-relaxed">
                      <span className="text-indigo-600 mr-1 font-extrabold">#{idx + 1}</span> {q.questionText}
                    </p>
                    <button 
                      onClick={() => handleDeleteQuestionFromTest(q.id)}
                      className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-100 shrink-0"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Options display */}
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-semibold text-slate-600">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctOptionIndex;
                      return (
                        <div key={oIdx} className={`p-1.5 rounded-lg border leading-snug ${
                          isCorrect 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold' 
                            : 'bg-slate-50/50 border-slate-150'
                        }`}>
                          <span className="mr-0.5">{oIdx + 1}.</span> {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400 pt-1 border-t border-slate-100">
                    <span>বিষয়: {q.subject}</span>
                    {q.explanation && <span className="text-indigo-500">সমাধান ব্যাখ্যা যুক্ত আছে</span>}
                  </div>
                </div>
              ))}

              {(activeManageTest.questions || []).length === 0 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-150 text-center text-slate-400 text-xs font-bold">
                  এই মক টেস্টে কোনো প্রশ্ন এখনও যোগ করা হয়নি।
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 4. PREVIEW DRAWER (BOTTOM SHEET MODAL) */}
      {previewingTest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          
          <div className="w-full max-w-md bg-white rounded-t-3xl border-t border-slate-200 p-4 pb-6 space-y-4 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
            
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto cursor-pointer" onClick={() => setPreviewingTest(null)}></div>
            
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-black text-slate-950">মক টেস্ট প্রাক-দর্শন (Preview)</h4>
                <p className="text-[10px] text-slate-400 font-bold">{previewingTest.title}</p>
              </div>
              <button 
                onClick={() => setPreviewingTest(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview specs list */}
            <div className="space-y-3 text-xs font-bold text-slate-700">
              
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-1.5">
                <p><span className="text-slate-400 font-medium">বাংলা টাইটেল:</span> {previewingTest.bengaliTitle}</p>
                <p><span className="text-slate-400 font-medium">পরীক্ষার ক্যাটাগরি ID:</span> {previewingTest.categoryId || previewingTest.examType}</p>
                <p><span className="text-slate-400 font-medium">টেস্ট নম্বর:</span> {previewingTest.testNumber || 1}</p>
                <p>
                  <span className="text-slate-400 font-medium">অ্যাক্সেস টাইপ:</span> 
                  {previewingTest.isPremium ? (
                    <span className="text-amber-700 ml-1">★ PREMIUM</span>
                  ) : (
                    <span className="text-emerald-700 ml-1">✓ FREE</span>
                  )}
                </p>
                <p><span className="text-slate-400 font-medium">সময়সীমা:</span> {previewingTest.durationMinutes} Minutes</p>
                <p><span className="text-slate-400 font-medium">মোট প্রশ্ন:</span> {previewingTest.totalQuestions}</p>
                <p><span className="text-slate-400 font-medium">মোট নম্বর:</span> {previewingTest.totalMarks}</p>
                <p><span className="text-slate-400 font-medium">পাস নম্বর:</span> {previewingTest.passingMarks || 40}</p>
                <p><span className="text-slate-400 font-medium">নেগেটিভ মার্কস:</span> {previewingTest.negativeMarking || '0.25'}</p>
                <p><span className="text-slate-400 font-medium">প্রকাশের অবস্থা:</span> {previewingTest.isPublished ? 'Published' : 'Draft'}</p>
              </div>

              {/* Subject Distribution */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-450 uppercase block">বিষয় ভিত্তিক বণ্টন (Subject Distribution):</span>
                <div className="space-y-1.5">
                  {(previewingTest.subjectsDistribution || []).map((s: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-150">
                      <span>{idx + 1}. {s.subject}</span>
                      <span className="text-indigo-600 font-black">{s.questionCount} Qs / {s.marksCount} Marks</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button 
              onClick={() => setPreviewingTest(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl text-center"
            >
              বন্ধ করুন
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
