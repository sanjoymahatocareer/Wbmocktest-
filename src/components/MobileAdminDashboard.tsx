import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, Users, Crown, BookOpen, Plus, Briefcase, CreditCard, 
  LayoutDashboard, Settings, FileText, BarChart, BellRing, User, 
  Shield, HelpCircle, Trophy, Trash2, Edit3, Save, X, ArrowLeft, 
  Upload, FileCheck, CheckCircle, Sparkles, PlusCircle, MinusCircle, 
  FileCode, Layers, Calendar, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  getCategories, saveCategories, getPosts, savePosts, 
  getMockTests, saveMockTests, getUsers, saveUsers, 
  getDashboardStats, getAttempts, getTemplates, saveTemplates 
} from '../lib/db';
import { ExamCategory, PostName, MockTest, Question, CustomTemplate, CustomTemplateField } from '../types';

export default function MobileAdminDashboard() {
  const [activeView, setActiveView] = useState<'dashboard' | 'categories' | 'posts' | 'templates' | 'mock_tests' | 'questions' | 'bulk_upload' | 'users' | 'attempts'>('dashboard');

  // Stats State
  const [stats, setStats] = useState(getDashboardStats());

  // Data States
  const [categories, setCategoriesState] = useState<ExamCategory[]>([]);
  const [posts, setPostsState] = useState<PostName[]>([]);
  const [templates, setTemplatesState] = useState<CustomTemplate[]>([]);
  const [mockTests, setMockTestsState] = useState<MockTest[]>([]);
  const [users, setUsersState] = useState<any[]>([]);
  const [attempts, setAttemptsState] = useState<any[]>([]);

  // Selection Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>('');

  // Editing Forms State
  const [editingCategory, setEditingCategory] = useState<Partial<ExamCategory> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<PostName> | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Partial<CustomTemplate> | null>(null);
  const [editingTest, setEditingTest] = useState<Partial<MockTest> | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> & { index?: number } | null>(null);

  // Dynamic Template Field Builder State
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomTemplateField['type']>('text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');

  // FAQ Input Temp State
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Bulk Upload state
  const [csvPaste, setCsvPaste] = useState<string>('');
  const [bulkError, setBulkError] = useState<string>('');
  const [bulkSuccess, setBulkSuccess] = useState<string>('');

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const reloadAllData = () => {
    setCategoriesState(getCategories());
    setPostsState(getPosts());
    setTemplatesState(getTemplates());
    setMockTestsState(getMockTests());
    setUsersState(getUsers());
    setAttemptsState(getAttempts());
    setStats(getDashboardStats());
  };

  useEffect(() => {
    reloadAllData();
  }, [activeView]);

  // CATEGORIES CRUD
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.bengaliName) {
      showToast('Please fill out all fields', 'error');
      return;
    }

    let updated = [...categories];
    if (editingCategory.id) {
      updated = updated.map(c => c.id === editingCategory.id ? (editingCategory as ExamCategory) : c);
      showToast('Category updated successfully');
    } else {
      const newCat: ExamCategory = {
        id: 'cat-' + Date.now(),
        name: editingCategory.name,
        bengaliName: editingCategory.bengaliName,
        iconName: editingCategory.iconName || 'BookOpen',
        emoji: editingCategory.emoji || '🎓',
        gradientClass: editingCategory.gradientClass || 'from-blue-500/10 via-blue-600/5 to-sky-600/10 border-blue-500/25 text-blue-600'
      };
      updated.push(newCat);
      showToast('Category added successfully');
    }
    saveCategories(updated);
    setEditingCategory(null);
    reloadAllData();
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Category? All linked Posts, Mock Tests and Questions will be orphaned.')) {
      const updated = categories.filter(c => c.id !== id);
      saveCategories(updated);
      showToast('Category deleted');
      reloadAllData();
    }
  };

  // TEMPLATES CRUD (Dynamic Builder)
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate?.name) {
      showToast('Please specify a Template Name', 'error');
      return;
    }

    let updated = [...templates];
    if (editingTemplate.id) {
      updated = updated.map(t => t.id === editingTemplate.id ? (editingTemplate as CustomTemplate) : t);
      showToast('Recruitment Template updated');
    } else {
      const newTpl: CustomTemplate = {
        id: 'tpl-' + Date.now(),
        name: editingTemplate.name,
        fields: editingTemplate.fields || []
      };
      updated.push(newTpl);
      showToast('Recruitment Template created successfully');
    }
    saveTemplates(updated);
    setEditingTemplate(null);
    reloadAllData();
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Custom Template? Any associated Posts will fallback to default views.')) {
      const updated = templates.filter(t => t.id !== id);
      saveTemplates(updated);
      showToast('Template deleted');
      reloadAllData();
    }
  };

  const handleAddFieldToTemplate = () => {
    if (!newFieldName || !newFieldLabel) {
      showToast('Please specify Field Name and Label', 'error');
      return;
    }

    // sanitize name
    const sanitizedName = newFieldName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const currentFields = editingTemplate?.fields || [];

    if (currentFields.some(f => f.name === sanitizedName)) {
      showToast('Field name already exists in this template', 'error');
      return;
    }

    const newField: CustomTemplateField = {
      name: sanitizedName,
      label: newFieldLabel,
      type: newFieldType,
      placeholder: newFieldPlaceholder
    };

    setEditingTemplate({
      ...editingTemplate,
      fields: [...currentFields, newField]
    });

    setNewFieldName('');
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    showToast('Field added to builder buffer');
  };

  const handleRemoveFieldFromTemplate = (fieldName: string) => {
    const currentFields = editingTemplate?.fields || [];
    setEditingTemplate({
      ...editingTemplate,
      fields: currentFields.filter(f => f.name !== fieldName)
    });
    showToast('Field removed');
  };

  // POSTS CRUD (with Template fields and FAQ integration)
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.name || !editingPost?.bengaliName || !editingPost?.categoryId) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    let updated = [...posts];
    if (editingPost.id) {
      updated = updated.map(p => p.id === editingPost.id ? (editingPost as PostName) : p);
      showToast('Job Post updated successfully');
    } else {
      const newPost: PostName = {
        id: 'post-' + Date.now(),
        categoryId: editingPost.categoryId,
        name: editingPost.name,
        bengaliName: editingPost.bengaliName,
        subtitle: editingPost.subtitle || '',
        templateId: editingPost.templateId || undefined,
        fields: editingPost.fields || {},
        faqs: editingPost.faqs || []
      };
      updated.push(newPost);
      showToast('Job Post created successfully');
    }
    savePosts(updated);
    setEditingPost(null);
    reloadAllData();
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Post? All associated mock tests and question banks will lose association.')) {
      const updated = posts.filter(p => p.id !== id);
      savePosts(updated);
      showToast('Post deleted');
      reloadAllData();
    }
  };

  const handleAddFaqToPost = () => {
    if (!newFaqQuestion || !newFaqAnswer) {
      showToast('Please fill FAQ Question and Answer', 'error');
      return;
    }

    const currentFaqs = editingPost?.faqs || [];
    setEditingPost({
      ...editingPost,
      faqs: [...currentFaqs, { question: newFaqQuestion, answer: newFaqAnswer }]
    });

    setNewFaqQuestion('');
    setNewFaqAnswer('');
    showToast('FAQ added');
  };

  const handleRemoveFaqFromPost = (index: number) => {
    const currentFaqs = editingPost?.faqs || [];
    setEditingPost({
      ...editingPost,
      faqs: currentFaqs.filter((_, i) => i !== index)
    });
    showToast('FAQ removed');
  };

  // MOCK TESTS CRUD
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest?.title || !editingTest?.bengaliTitle || !editingTest?.postId) {
      showToast('Please fill out required fields', 'error');
      return;
    }

    const testPost = posts.find(p => p.id === editingTest.postId);
    const categoryOfPost = categories.find(c => c.id === testPost?.categoryId);

    let updated = [...mockTests];
    if (editingTest.id) {
      const existing = updated.find(t => t.id === editingTest.id);
      const savedTest: MockTest = {
        ...existing,
        ...editingTest,
        totalQuestions: editingTest.questions?.length || existing?.questions?.length || 0,
        examType: categoryOfPost?.id || 'general',
        examTypeBengali: categoryOfPost?.bengaliName || 'সাধারণ',
      } as MockTest;
      updated = updated.map(t => t.id === editingTest.id ? savedTest : t);
      showToast('Mock Test updated successfully');
    } else {
      const newTest: MockTest = {
        id: 'test-' + Date.now(),
        postId: editingTest.postId,
        title: editingTest.title,
        bengaliTitle: editingTest.bengaliTitle,
        examType: categoryOfPost?.id || 'general',
        examTypeBengali: categoryOfPost?.bengaliName || 'সাধারণ',
        totalQuestions: 0,
        totalMarks: editingTest.totalMarks || 100,
        passingMarks: editingTest.passingMarks || 40,
        durationMinutes: editingTest.durationMinutes || 60,
        difficulty: 'Medium',
        isPremium: !!editingTest.isPremium,
        questions: []
      };
      updated.push(newTest);
      showToast('Mock Test added! Now manage its questions.');
    }
    saveMockTests(updated);
    setEditingTest(null);
    reloadAllData();
  };

  const handleDeleteTest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Mock Test? All submitted results and attempts will be affected.')) {
      const updated = mockTests.filter(t => t.id !== id);
      saveMockTests(updated);
      showToast('Mock Test deleted');
      reloadAllData();
    }
  };

  // QUESTIONS CRUD
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.questionText || !selectedTestId) {
      showToast('Please fill required fields', 'error');
      return;
    }

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

    if (editingQuestion.index !== undefined) {
      // Edit
      updatedQuestions[editingQuestion.index] = finalQuestion;
      showToast('Question updated');
    } else {
      // Add
      updatedQuestions.push(finalQuestion);
      showToast('Question added');
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

    saveMockTests(updatedTests);
    setEditingQuestion(null);
    reloadAllData();
  };

  const handleDeleteQuestion = (index: number) => {
    if (window.confirm('Delete this question?')) {
      const test = mockTests.find(t => t.id === selectedTestId);
      if (!test) return;

      const updatedQuestions = (test.questions || []).filter((_, i) => i !== index);
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

      saveMockTests(updatedTests);
      showToast('Question removed');
      reloadAllData();
    }
  };

  // USERS MANAGEMENT
  const toggleUserPremium = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextState = !u.isPremium;
        showToast(`User premium status ${nextState ? 'Activated ★' : 'Deactivated'}`);
        return { ...u, isPremium: nextState };
      }
      return u;
    });
    saveUsers(updated);
    reloadAllData();
  };

  // BULK UPLOAD QUESTIONS (CSV Parser)
  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError('');
    setBulkSuccess('');

    if (!selectedTestId) {
      setBulkError('মক টেস্ট নির্বাচন করুন!');
      return;
    }

    if (!csvPaste.trim()) {
      setBulkError('CSV টেক্সট পেস্ট করুন!');
      return;
    }

    try {
      const lines = csvPaste.split('\n').filter(line => line.trim());
      const parsedQuestions: Question[] = [];

      lines.forEach((line, i) => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length < 6) {
          throw new Error(`লাইন ${i + 1}: সঠিক ফরম্যাট নেই। কমপক্ষে ৫টি পাইপ (|) থাকতে হবে।`);
        }

        const [questionText, opt1, opt2, opt3, opt4, correctStr, subject, explanation] = parts;
        const correctIndex = parseInt(correctStr) - 1;

        if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
          throw new Error(`লাইন ${i + 1}: সঠিক উত্তর অপশন অবশ্যই ১ এবং ৪ এর মধ্যে সংখ্যা হতে হবে।`);
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

      saveMockTests(updatedTests);
      setBulkSuccess(`সফলভাবে ${parsedQuestions.length} টি প্রশ্ন যুক্ত করা হয়েছে!`);
      setCsvPaste('');
      showToast(`${parsedQuestions.length} questions uploaded successfully!`);
      reloadAllData();
    } catch (err: any) {
      setBulkError(err.message || 'CSV পার্সিং ব্যর্থ হয়েছে। দয়া করে ফরম্যাট চেক করুন।');
    }
  };

  const activeTest = mockTests.find(t => t.id === selectedTestId);

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24 text-slate-800">
      {/* Top Floating Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {toast.message}
        </div>
      )}

      {/* Admin Panel Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-md border border-white/15 shadow-inner">
                <Shield className="w-8 h-8 text-blue-200" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  WBMockTest Admin <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">SUPER ADMIN</span>
                </h1>
                <p className="text-xs text-blue-100 font-bold opacity-85 mt-0.5">রিয়েল-টাইম ক্যাটাগরি, পোস্ট এবং প্রশ্ন ব্যাংক ম্যানেজার</p>
              </div>
            </div>
            {activeView !== 'dashboard' && (
              <button 
                onClick={() => {
                  setEditingCategory(null);
                  setEditingPost(null);
                  setEditingTemplate(null);
                  setEditingTest(null);
                  setEditingQuestion(null);
                  setActiveView('dashboard');
                }}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" /> ফিরে যান
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View Manager */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        
        {/* ======================================= */}
        {/* VIEW 1: DASHBOARD                       */}
        {/* ======================================= */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Real Stats Grid */}
            <div>
              <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                📈 রিয়েল-টাইম প্ল্যাটফর্ম পরিসংখ্যান
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatBox title="মোট ক্যাটাগরি" value={stats.totalCategories} icon="🗳️" color="bg-blue-500" />
                <StatBox title="মোট পোস্ট" value={stats.totalPosts} icon="💼" color="bg-indigo-500" />
                <StatBox title="কাস্টম টেমপ্লেট" value={templates.length} icon="📋" color="bg-emerald-500" />
                <StatBox title="মোট মক টেস্ট" value={stats.totalMockTests} icon="📝" color="bg-purple-500" />
                <StatBox title="মোট প্রশ্ন" value={stats.totalQuestions} icon="❓" color="bg-amber-500" />
                <StatBox title="পরীক্ষা দেওয়ার সংখ্যা" value={stats.totalAttempts} icon="🏆" color="bg-rose-500" />
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div>
              <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                ⚙️ কুইক ম্যানেজমেন্ট কন্ট্রোল প্যানেল
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Exam Category</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">ক্যাটাগরি যুক্ত বা পরিবর্তন করুন (Panchayat, Police, PSC, etc.)</p>
                  </div>
                  <button 
                    onClick={() => setActiveView('categories')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    ম্যানেজ
                  </button>
                </div>

                {/* Templates Builder Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Custom Template Builder</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">ভ্যাকেন্সি, যোগ্যতা, পিটি মাঠের কাস্টম টেমপ্লেট তৈরি করুন</p>
                  </div>
                  <button 
                    onClick={() => setActiveView('templates')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    ম্যানেজ
                  </button>
                </div>

                {/* Posts Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between sm:col-span-2">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Post & Dynamic Form Field Management</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">নির্দিষ্ট চাকরির পোস্ট যুক্ত করুন, টেমপ্লেট নির্বাচন করে কাস্টম ফিল্ড ও FAQ রিপিটার পূরণ করুন</p>
                  </div>
                  <button 
                    onClick={() => setActiveView('posts')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shrink-0"
                  >
                    ম্যানেজ
                  </button>
                </div>

                {/* Mock Tests Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Mock Tests</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">মক টেস্ট সংযোজন, সময়সীমা, পাসিং মার্কস নির্ধারণ</p>
                  </div>
                  <button 
                    onClick={() => setActiveView('mock_tests')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    ম্যানেজ
                  </button>
                </div>

                {/* Questions Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Separate Question Bank</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1">পোস্টভিত্তিক প্রশ্নব্যাংক আপডেট করুন (প্রশ্ন ও ব্যাখ্যা সংযোজন)</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (mockTests.length > 0) {
                        setSelectedTestId(mockTests[0].id);
                      }
                      setActiveView('questions');
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    ম্যানেজ
                  </button>
                </div>

                {/* CSV Bulk uploader Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        Bulk Question Uploader <span className="bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-full">CSV / EXCEL</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold mt-1">একসাথে শত শত প্রশ্ন কপি-পেস্ট করে মক টেস্টে আপলোড করুন</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (mockTests.length > 0) setSelectedTestId(mockTests[0].id);
                      setActiveView('bulk_upload');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    বাল্ক আপলোড
                  </button>
                </div>
              </div>
            </div>

            {/* Quick lists (Users and Activity logs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-sm text-slate-950">👥 নিবন্ধিত ইউজার</h3>
                  <button onClick={() => setActiveView('users')} className="text-blue-600 font-black text-xs hover:underline">সব দেখুন</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {users.slice(0, 4).map((u, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100">
                      <span className="font-bold truncate max-w-[150px]">{u.email}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${u.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                        {u.isPremium ? '★ PREMIUM' : 'FREE'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-sm text-slate-950">🏆 সাম্প্রতিক টেস্ট সাবমিশন</h3>
                  <button onClick={() => setActiveView('attempts')} className="text-blue-600 font-black text-xs hover:underline">সব দেখুন</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {attempts.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 font-bold">এখনো কোনো পরীক্ষা দেওয়া হয়নি</div>
                  ) : (
                    attempts.slice(0, 4).map((att: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100 flex items-center justify-between">
                        <div className="truncate max-w-[140px]">
                          <p className="font-black truncate">{att.testTitle || 'Mock Test'}</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">{att.date}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 font-black px-2 py-1 rounded-lg text-[10px]">
                          স্কোর: {att.score}/{att.totalMarks}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 2: CATEGORY MANAGEMENT            */}
        {/* ======================================= */}
        {activeView === 'categories' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">🗳️ Exam Category Management</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">নতুন পরীক্ষা বা নিয়োগ ক্যাটাগরি তৈরি ও সংশোধন করুন</p>
              </div>
              <button 
                onClick={() => setEditingCategory({ name: '', bengaliName: '', emoji: '🗳️', iconName: 'Building' })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> নতুন ক্যাটাগরি
              </button>
            </div>

            {/* Form */}
            {editingCategory && (
              <form onSubmit={handleSaveCategory} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-sm text-slate-900">
                  {editingCategory.id ? '✏️ ক্যাটাগরি সংশোধন করুন' : '➕ নতুন ক্যাটাগরি যোগ করুন'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Category Name (English)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingCategory.name || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="e.g., WB Police"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Category Name (Bengali)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingCategory.bengaliName || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, bengaliName: e.target.value })}
                      placeholder="যেমন: পশ্চিমবঙ্গ পুলিশ"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Category Emoji (Icon/Accent)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingCategory.emoji || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                      placeholder="যেমন: 🗳️, 👮, 🏛️"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Icon Name (Lucide string)</label>
                    <select 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingCategory.iconName || 'BookOpen'}
                      onChange={e => setEditingCategory({ ...editingCategory, iconName: e.target.value })}
                    >
                      <option value="Building">Building (Panchayat)</option>
                      <option value="ShieldAlert">ShieldAlert (Police)</option>
                      <option value="Award">Award (PSC)</option>
                      <option value="FileText">FileText (SSC)</option>
                      <option value="Train">Train (Railway)</option>
                      <option value="Coins">Coins (Banking)</option>
                      <option value="Heart">Heart (ICDS)</option>
                      <option value="GraduationCap">GraduationCap (TET)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition-all"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-150 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.emoji || '🗳️'}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{cat.bengaliName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{cat.name} ({cat.iconName})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setEditingCategory(cat)}
                      className="p-2 hover:bg-white text-blue-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 hover:bg-white text-rose-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 3: CUSTOM TEMPLATES BUILDER        */}
        {/* ======================================= */}
        {activeView === 'templates' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">📋 Custom Template Builder</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">ভ্যাকেন্সি, যোগ্যতা, পরীক্ষার মাঠের জন্য আনলিমিটেড কাস্টম টেমপ্লেট ও ফিল্ড টাইপ তৈরি করুন</p>
              </div>
              <button 
                onClick={() => setEditingTemplate({ name: '', fields: [] })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> নতুন টেমপ্লেট
              </button>
            </div>

            {/* Template Editing Form */}
            {editingTemplate && (
              <form onSubmit={handleSaveTemplate} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
                <h3 className="font-black text-sm text-slate-900">
                  {editingTemplate.id ? '✏️ টেমপ্লেট সংশোধন করুন' : '➕ নতুন কাস্টম টেমপ্লেট তৈরি'}
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-600">Template Name</label>
                  <input 
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                    value={editingTemplate.name || ''}
                    onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="যেমন: SSC Recruitment Template"
                    required
                  />
                </div>

                {/* Template fields defined */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-xs font-black text-slate-700 mb-3">🛠️ টেমপ্লেটের বর্তমান ফিল্ড সমূহ ({editingTemplate.fields?.length || 0})</h4>
                  
                  {(!editingTemplate.fields || editingTemplate.fields.length === 0) ? (
                    <p className="text-xs text-slate-400 font-bold bg-white p-4 rounded-xl border border-slate-200/60 text-center">কোনো কাস্টম ফিল্ড যোগ করা হয়নি। নিচে নতুন ফিল্ড যোগ করুন।</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {editingTemplate.fields.map((f, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 text-xs font-bold">
                          <div className="space-y-0.5">
                            <span className="text-slate-900">{f.label}</span>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">
                              <span>key: {f.name}</span>
                              <span className="bg-slate-100 text-slate-600 px-1 py-0.2 rounded">{f.type}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveFieldFromTemplate(f.name)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field Adder Buffer */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">➕ নতুন কাস্টম ফিল্ড যোগ করুন</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Field Key (English, uniquely identifying, no spaces)</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={newFieldName}
                        onChange={e => setNewFieldName(e.target.value)}
                        placeholder="যেমন: qualification, height"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Field Label (Title / বাংলা অনুবাদ সহ)</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={newFieldLabel}
                        onChange={e => setNewFieldLabel(e.target.value)}
                        placeholder="যেমন: Qualification / শিক্ষাগত যোগ্যতা"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Field Type</label>
                      <select 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={newFieldType}
                        onChange={e => setNewFieldType(e.target.value as CustomTemplateField['type'])}
                      >
                        <option value="text">Text (এক লাইনের টেক্সট)</option>
                        <option value="textarea">Textarea (দীর্ঘ বিবরণ)</option>
                        <option value="number">Number (সংখ্যা)</option>
                        <option value="date">Date (তারিখ)</option>
                        <option value="richtext">Rich Text / Syllabus (সিলেবাস ও নম্বর বণ্টন)</option>
                        <option value="pdf">PDF Download URL (বিজ্ঞপ্তির PDF লিঙ্ক)</option>
                        <option value="url">Website URL (অফিসিয়াল ওয়েবসাইট লিঙ্ক)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Placeholder (সাজেশন টেক্সট)</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={newFieldPlaceholder}
                        onChange={e => setNewFieldPlaceholder(e.target.value)}
                        placeholder="যেমন: Madhyamik Passed"
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddFieldToTemplate}
                    className="w-full py-2 bg-emerald-50 text-[#059669] hover:bg-emerald-100 rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> বাফারে ফিল্ড যোগ করুন
                  </button>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition-all"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> টেমপ্লেট সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Templates list */}
            <div className="space-y-3">
              {templates.map((tpl) => (
                <div key={tpl.id} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-150 flex items-center justify-between transition-colors">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-emerald-600" /> {tpl.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      মোট কাস্টম ফিল্ড: <span className="text-emerald-600">{tpl.fields?.length || 0} টি</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setEditingTemplate(tpl)}
                      className="p-2 hover:bg-white text-blue-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="p-2 hover:bg-white text-rose-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 4: POSTS & FORM BUILDER           */}
        {/* ======================================= */}
        {activeView === 'posts' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">💼 Post Name & Dynamic Form Field Management</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">ক্যাটাগরির ভেতরের নির্দিষ্ট চাকরির পোস্ট বা পদ সমূহ পরিচালনা করুন</p>
              </div>
              <button 
                onClick={() => setEditingPost({ name: '', bengaliName: '', categoryId: categories[0]?.id || '', fields: {}, faqs: [] })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> নতুন পদ যোগ করুন
              </button>
            </div>

            {/* Filter by Category */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex items-center gap-3">
              <span className="text-xs font-black text-slate-500">ক্যাটাগরি অনুযায়ী ফিল্টার:</span>
              <select 
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
              >
                <option value="">সকল ক্যাটাগরি</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.bengaliName}</option>
                ))}
              </select>
            </div>

            {/* Editing Form with Dynamic Fields & FAQs */}
            {editingPost && (
              <form onSubmit={handleSavePost} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
                <h3 className="font-black text-sm text-slate-900">
                  {editingPost.id ? '✏️ পোস্ট ও কাস্টম ফিল্ড এডিট করুন' : '➕ নতুন পদ যুক্ত করুন'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Parent Category</label>
                    <select 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingPost.categoryId || ''}
                      onChange={e => setEditingPost({ ...editingPost, categoryId: e.target.value })}
                      required
                    >
                      <option value="">নির্বাচন করুন</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.bengaliName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Post Name (English)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingPost.name || ''}
                      onChange={e => setEditingPost({ ...editingPost, name: e.target.value })}
                      placeholder="e.g., Executive Assistant"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Post Name (Bengali)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingPost.bengaliName || ''}
                      onChange={e => setEditingPost({ ...editingPost, bengaliName: e.target.value })}
                      placeholder="e.g., এক্সিকিউটিভ অ্যাসিস্ট্যান্ট"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Associated Layout Template</label>
                    <select 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingPost.templateId || ''}
                      onChange={e => {
                        const tId = e.target.value;
                        const matchingTpl = templates.find(t => t.id === tId);
                        const initialFields: Record<string, any> = {};
                        matchingTpl?.fields.forEach(f => {
                          initialFields[f.name] = editingPost.fields?.[f.name] || '';
                        });
                        setEditingPost({ 
                          ...editingPost, 
                          templateId: tId || undefined,
                          fields: initialFields
                        });
                      }}
                    >
                      <option value="">No Template (Default Layout)</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DYNAMIC FORM BUILDER ACCORDING TO SELECTED TEMPLATE */}
                {editingPost.templateId && (
                  <div className="border-t border-slate-200 pt-4 space-y-4">
                    <div className="flex items-center gap-1.5 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      <Sparkles className="w-4 h-4 text-[#059669]" />
                      <h4 className="text-xs font-black text-slate-900">📋 কাস্টম রিক্রুটমেন্ট টেমপ্লেট ফিল্ড সমূহ</h4>
                    </div>

                    <div className="space-y-4">
                      {templates.find(t => t.id === editingPost.templateId)?.fields.map((field) => {
                        const fieldValue = editingPost.fields?.[field.name] || '';
                        return (
                          <div key={field.name} className="space-y-1">
                            <label className="text-[11px] font-black text-slate-700 block">{field.label}</label>
                            
                            {field.type === 'textarea' || field.type === 'richtext' ? (
                              <textarea
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                                rows={3}
                                value={fieldValue}
                                onChange={e => setEditingPost({
                                  ...editingPost,
                                  fields: {
                                    ...(editingPost.fields || {}),
                                    [field.name]: e.target.value
                                  }
                                })}
                                placeholder={field.placeholder || 'বিবরণ লিখুন...'}
                              />
                            ) : (
                              <input
                                type={field.type === 'number' ? 'number' : 'text'}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                                value={fieldValue}
                                onChange={e => setEditingPost({
                                  ...editingPost,
                                  fields: {
                                    ...(editingPost.fields || {}),
                                    [field.name]: e.target.value
                                  }
                                })}
                                placeholder={field.placeholder || 'তথ্য লিখুন...'}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FAQ REPEATER BUILDER */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black text-slate-900">❓ FAQ (সাধারণ জিজ্ঞাসা ও উত্তর) রিপিটার</h4>
                  </div>

                  {/* Added list */}
                  {(editingPost.faqs && editingPost.faqs.length > 0) && (
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-3 rounded-xl border border-slate-200">
                      {editingPost.faqs.map((faq, fIdx) => (
                        <div key={fIdx} className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-xs font-bold flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <p className="text-slate-900">Q: {faq.question}</p>
                            <p className="text-slate-500 font-semibold">A: {faq.answer}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveFaqFromPost(fIdx)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New FAQ Form */}
                  <div className="grid grid-cols-1 gap-2 bg-white p-3.5 rounded-xl border border-slate-200">
                    <input 
                      type="text"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      value={newFaqQuestion}
                      onChange={e => setNewFaqQuestion(e.target.value)}
                      placeholder="যেমন: আবেদন ফি কত?"
                    />
                    <textarea 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      rows={2}
                      value={newFaqAnswer}
                      onChange={e => setNewFaqAnswer(e.target.value)}
                      placeholder="যেমন: জেনারেল ক্যাটাগরির জন্য ১৫০ টাকা এবং সংরক্ষিতদের জন্য বিনামূল্যে।"
                    />
                    <button 
                      type="button"
                      onClick={handleAddFaqToPost}
                      className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-black transition-colors"
                    >
                      + এফএকিউ যোগ করুন (Add FAQ)
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition-all"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* List of posts */}
            <div className="space-y-3">
              {posts
                .filter(p => !selectedCategoryId || p.categoryId === selectedCategoryId)
                .map((post) => {
                  const parentCat = categories.find(c => c.id === post.categoryId);
                  const matchedTpl = templates.find(t => t.id === post.templateId);
                  return (
                    <div key={post.id} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-150 flex items-center justify-between transition-colors">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{post.bengaliName || post.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[9px] font-bold">
                          <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                            বিভাগ: {parentCat?.bengaliName || post.categoryId}
                          </span>
                          {matchedTpl && (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                              টেমপ্লেট: {matchedTpl.name}
                            </span>
                          )}
                          {post.faqs && post.faqs.length > 0 && (
                            <span className="text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                              {post.faqs.length} FAQs
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setEditingPost(post)}
                          className="p-2 hover:bg-white text-blue-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 hover:bg-white text-rose-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 5: MOCK TEST MANAGEMENT           */}
        {/* ======================================= */}
        {activeView === 'mock_tests' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">📝 Mock Test Management</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">মক টেস্ট সমূহ তৈরি করুন এবং পদের সাথে লিংক করুন</p>
              </div>
              <button 
                onClick={() => setEditingTest({ title: '', bengaliTitle: '', postId: posts[0]?.id || '', durationMinutes: 60, totalMarks: 100, passingMarks: 40, isPremium: false })}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> নতুন মক টেস্ট
              </button>
            </div>

            {/* Editing Form */}
            {editingTest && (
              <form onSubmit={handleSaveTest} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-sm text-slate-900">
                  {editingTest.id ? '✏️ মক টেস্ট সংশোধন' : '➕ নতুন মক টেস্ট সংযোজন'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Associated Post (কোন পদের অধীনে?)</label>
                    <select 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingTest.postId || ''}
                      onChange={e => setEditingTest({ ...editingTest, postId: e.target.value })}
                      required
                    >
                      <option value="">নির্বাচন করুন</option>
                      {posts.map(p => (
                        <option key={p.id} value={p.id}>{p.bengaliName || p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Mock Test Title (English)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingTest.title || ''}
                      onChange={e => setEditingTest({ ...editingTest, title: e.target.value })}
                      placeholder="e.g., General Knowledge Mock Test 01"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Mock Test Title (Bengali)</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingTest.bengaliTitle || ''}
                      onChange={e => setEditingTest({ ...editingTest, bengaliTitle: e.target.value })}
                      placeholder="যেমন: সাধারণ জ্ঞান মক টেস্ট ০১"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Duration (Minutes)</label>
                    <input 
                      type="number"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingTest.durationMinutes || 60}
                      onChange={e => setEditingTest({ ...editingTest, durationMinutes: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Passing Score / পাসিং মার্কস</label>
                    <input 
                      type="number"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingTest.passingMarks || 40}
                      onChange={e => setEditingTest({ ...editingTest, passingMarks: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox"
                      id="isPremiumTest"
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                      checked={!!editingTest.isPremium}
                      onChange={e => setEditingTest({ ...editingTest, isPremium: e.target.checked })}
                    />
                    <label htmlFor="isPremiumTest" className="text-xs font-bold text-slate-700 select-none">
                      এটি একটি প্রিমিয়াম মক টেস্ট ( requires user premium subscription)
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingTest(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition-all"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Test list */}
            <div className="space-y-3.5">
              {mockTests.map((test) => {
                const associatedPost = posts.find(p => p.id === test.postId);
                return (
                  <div key={test.id} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-150 flex items-center justify-between transition-colors">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{test.bengaliTitle}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-slate-400 mt-1.5">
                        <span className="text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                          পদ: {associatedPost?.bengaliName || test.postId || 'সাধারন'}
                        </span>
                        <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                          {test.questions?.length || 0}টি প্রশ্ন
                        </span>
                        <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                          {test.durationMinutes} মিনিট
                        </span>
                        {test.isPremium && (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider text-[8px]">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => {
                          setSelectedTestId(test.id);
                          setActiveView('questions');
                        }}
                        className="p-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200"
                        title="প্রশ্নব্যাংক পরিচালনা করুন"
                      >
                        প্রশ্নসমূহ ({test.questions?.length || 0})
                      </button>
                      <button 
                        onClick={() => setEditingTest(test)}
                        className="p-2 hover:bg-white text-blue-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTest(test.id)}
                        className="p-2 hover:bg-white text-rose-600 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 6: QUESTION BANK EDITOR           */}
        {/* ======================================= */}
        {activeView === 'questions' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">❓ separate Question Bank Manager</h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">মক টেস্টভিত্তিক প্রশ্ন যোগ করুন, সঠিক উত্তর ও ব্যাখ্যা সহ</p>
              </div>
              <button 
                onClick={() => setEditingQuestion({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, subject: 'General Knowledge', explanation: '' })}
                className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                disabled={!selectedTestId}
              >
                <Plus className="w-4 h-4" /> নতুন প্রশ্ন যুক্ত করুন
              </button>
            </div>

            {/* Test Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-black text-slate-600">মক টেস্ট সিলেক্ট করুন:</span>
              <select 
                className="bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold flex-1"
                value={selectedTestId}
                onChange={e => {
                  setSelectedTestId(e.target.value);
                  setEditingQuestion(null);
                }}
              >
                <option value="">নির্বাচন করুন</option>
                {mockTests.map(t => (
                  <option key={t.id} value={t.id}>{t.bengaliTitle} ({t.questions?.length || 0} টি প্রশ্ন)</option>
                ))}
              </select>
            </div>

            {/* Question form */}
            {editingQuestion && (
              <form onSubmit={handleSaveQuestion} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider text-amber-700">
                  {editingQuestion.index !== undefined ? `✏️ প্রশ্ন এডিট (#${editingQuestion.index + 1})` : '➕ নতুন প্রশ্ন সংযোজন'}
                </h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">প্রশ্ন টেক্সট (Question text in Bengali / English)</label>
                  <textarea 
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                    rows={3}
                    value={editingQuestion.questionText || ''}
                    onChange={e => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                    required
                    placeholder="যেমন: ভারতের আইন সভার উচ্চকক্ষের নাম কী?"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Options */}
                  {[0, 1, 2, 3].map((optIdx) => (
                    <div key={optIdx} className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">অপশন {optIdx + 1}</label>
                      <input 
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                        value={editingQuestion.options?.[optIdx] || ''}
                        onChange={e => {
                          const opts = [...(editingQuestion.options || ['', '', '', ''])];
                          opts[optIdx] = e.target.value;
                          setEditingQuestion({ ...editingQuestion, options: opts });
                        }}
                        required
                        placeholder={`যেমন: অপশন ${String.fromCharCode(65 + optIdx)}`}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">সঠিক উত্তর নির্ধারণ করুন</label>
                    <select 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingQuestion.correctOptionIndex ?? 0}
                      onChange={e => setEditingQuestion({ ...editingQuestion, correctOptionIndex: parseInt(e.target.value) })}
                    >
                      <option value={0}>অপশন ১</option>
                      <option value={1}>অপশন ২</option>
                      <option value={2}>অপশন ৩</option>
                      <option value={3}>অপশন ৪</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">বিষয় / Subject</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      value={editingQuestion.subject || ''}
                      onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                      placeholder="e.g., ইতিহাস, ভূগোল, গণিত"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">ব্যাখ্যা / Answer Explanation (ঐচ্ছিক)</label>
                    <textarea 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-inner"
                      rows={2.5}
                      value={editingQuestion.explanation || ''}
                      onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                      placeholder="সঠিক উত্তরের যুক্তি এবং বিস্তারিত ব্যাখ্যা এখানে লিখুন..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition-all"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> প্রশ্ন সেভ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Questions List */}
            {activeTest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider text-indigo-600">
                    প্রশ্নব্যাংক তালিকা ({activeTest.questions?.length || 0} টি প্রশ্ন)
                  </h4>
                </div>

                {(!activeTest.questions || activeTest.questions.length === 0) ? (
                  <div className="text-center py-10 bg-slate-50 border border-slate-150 rounded-2xl">
                    <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400">এই মক টেস্টে কোনো প্রশ্ন যুক্ত করা হয়নি।</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activeTest.questions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-xs font-black text-slate-900 leading-relaxed">
                            <span className="text-indigo-600 mr-1">প্রশ্ন {idx + 1}.</span> {q.questionText}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => setEditingQuestion({ ...q, index: idx })}
                              className="p-1.5 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteQuestion(idx)}
                              className="p-1.5 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => (
                            <div 
                              key={oIdx} 
                              className={`p-2 rounded-xl text-[11px] font-bold border ${
                                oIdx === q.correctOptionIndex 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                  : 'bg-white border-slate-150 text-slate-600'
                              }`}
                            >
                              <span className="mr-1">{oIdx + 1}.</span> {opt}
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[10.5px] font-semibold text-slate-600 leading-relaxed">
                            <span className="text-indigo-700 font-extrabold block mb-0.5">💡 ব্যাখ্যা:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-center py-8 font-bold text-slate-400">মক টেস্ট নির্বাচন করলে এখানে প্রশ্ন ব্যাংক দেখাবে</p>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 7: BULK UPLOAD                    */}
        {/* ======================================= */}
        {activeView === 'bulk_upload' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">📥 Dynamic Bulk Question Uploader</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">CSV/টেক্সট ফরম্যাটে একসাথে অসংখ্য প্রশ্ন কপি-পেস্ট করে মক টেস্টে ইম্পোর্ট করুন</p>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">মক টেস্ট সিলেক্ট করুন</label>
                  <select 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={selectedTestId}
                    onChange={e => setSelectedTestId(e.target.value)}
                    required
                  >
                    <option value="">নির্বাচন করুন</option>
                    {mockTests.map(t => (
                      <option key={t.id} value={t.id}>{t.bengaliTitle} ({t.questions?.length || 0}টি প্রশ্ন)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex justify-between">
                    <span>পাইপ-ফরম্যাটেড পাইপ টেক্সট (Pipe Format Text)</span>
                    <span className="text-blue-600 font-extrabold text-[11px] underline cursor-help" onClick={() => alert("ফরম্যাট:\nপ্রশ্ন | অপশন ১ | অপশন ২ | অপশন ৩ | অপশন ৪ | সঠিক অপশন সংখ্যা (1-4) | বিষয় | ব্যাখ্যা\n\nউদাহরণ:\nভারতের রাজধানী কী? | কলকাতা | মুম্বাই | নতুন দিল্লি | চেন্নাই | 3 | ভূগোল | ভারতের রাজধানী হলো নতুন দিল্লি।")}>সহায়িকা / ফরম্যাট কেমন হবে?</span>
                  </label>
                  
                  <textarea 
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-250 rounded-2xl font-mono text-xs font-bold focus:bg-white transition-colors"
                    rows={10}
                    value={csvPaste}
                    onChange={e => setCsvPaste(e.target.value)}
                    placeholder="প্রশ্ন ১ | অপশন ১ | অপশন ২ | অপশন ৩ | অপশন ৪ | সঠিক অপশন সংখ্যা (1-4) | বিষয় | ব্যাখ্যা (ঐচ্ছিক)"
                  />
                </div>
              </div>

              {bulkError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl whitespace-pre-line">
                  ⚠️ {bulkError}
                </div>
              )}

              {bulkSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl whitespace-pre-line flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{bulkSuccess}</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-600/10"
              >
                প্রশ্নাবলী মক টেস্টে ইম্পোর্ট করুন (Bulk Upload)
              </button>
            </form>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 8: REGISTERED USERS MANAGEMENT     */}
        {/* ======================================= */}
        {activeView === 'users' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">👥 Registered Users Manager</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">নিবন্ধিত প্রার্থীরা পরিচালনা করুন এবং প্রিমিয়াম মেম্বারশিপ টগল করুন</p>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900">{u.email}</p>
                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <span>আইডি: {u.id}</span>
                      <span>•</span>
                      <span className="uppercase text-indigo-600 font-extrabold">{u.role}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleUserPremium(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black transition-all ${
                        u.isPremium 
                          ? 'bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {u.isPremium ? '★ Active Premium' : 'Activate Premium'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 9: ATTEMPTS LIST                  */}
        {/* ======================================= */}
        {activeView === 'attempts' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm animate-fade-in space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">🏆 Live Candidates Mock Test Submission History</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">অনলাইন প্রার্থীদের টেস্ট রিপোর্ট কার্ড ট্র্যাকার</p>
            </div>

            {attempts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10 font-bold">এখনো কোনো টেস্ট সাবমিশন হয়নি</p>
            ) : (
              <div className="space-y-3.5">
                {attempts.map((att: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{att.testTitle || 'Mock Test'}</h4>
                      <p className="text-[10.5px] text-slate-500 font-semibold mt-1">প্রার্থী: {att.userEmail || 'Anonymous Student'}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">তারিখ: {att.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">প্রাপ্ত নম্বর: {att.score}/{att.totalMarks}</p>
                        <p className={`text-[10px] font-extrabold mt-0.5 ${att.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {att.passed ? '✓ PASSED (পাস)' : '✗ FAILED (ফেল)'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// Sub components
function StatBox({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-xl font-black text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-2xl ${color} text-white flex items-center justify-center text-lg shadow-sm shadow-indigo-100 shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
