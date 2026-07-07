import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckCircle, Circle, Target, AlertTriangle, BookOpen, 
  Clock, Plus, Bookmark, RefreshCw, ChevronRight, Award, Trophy, 
  HelpCircle, Sparkles, BookOpenCheck, ListTodo, Star, Dumbbell, 
  Heart, Zap, Compass, Share2, Clipboard, Printer
} from 'lucide-react';
import { MockTest, ExamCategory, ViewType } from '../types';
import { examCategories, mockTestsList, questionBankData } from '../data';
import { safeLocalStorage } from '../lib/storage';

// Define structures for Study Plan Tasks
interface PlanTask {
  id: string;
  title: string;
  bengaliTitle: string;
  type: 'revision' | 'practice' | 'mock-test';
  subject: string;
  chapter?: string;
  estimatedMinutes: number;
  completed: boolean;
  relatedTestId?: string;
}

interface DailySchedule {
  dayNum: number;
  dayName: string;
  tasks: PlanTask[];
  completed: boolean;
  motivationalQuote: string;
}

interface StudyPlan {
  id: string;
  targetExamId: string;
  targetExamName: string;
  weakSubjects: string[];
  durationWeeks: number;
  dailyHours: number;
  createdAt: string;
  schedule: DailySchedule[];
}

interface StudyPlannerProps {
  setView: (view: ViewType) => void;
  mockTests: MockTest[];
  onStartMockTest: (test: MockTest) => void;
  isPremiumUser: boolean;
  onOpenPremium: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "আজকের পরিশ্রম আগামীকালের সাফল্যের ভিত্তি। মন দিয়ে পড়ুন!",
  "ছোট ছোট লক্ষ্য পূরণ করলেই বড় বড় স্বপ্ন বাস্তবায়িত হয়।",
  "কঠিন অধ্যায়গুলোই আপনাকে অন্যদের থেকে এগিয়ে রাখবে। হাল ছাড়বেন না!",
  "সবচেয়ে ভালো প্রস্তুতি হল আজ নিজের সেরাটা দেওয়া।",
  "ধৈর্য ও ধারাবাহিকতাই সরকারি চাকরি পাওয়ার একমাত্র চাবিকাঠি।",
  "আপনি যা অর্জন করতে চান, তার জন্য আজ থেকেই ফোকাস করুন।",
  "ঘড়ির দিকে তাকাবেন না, ঘড়ি যা করে তাই করুন - চলতে থাকুন।"
];

export default function StudyPlanner({
  setView,
  mockTests,
  onStartMockTest,
  isPremiumUser,
  onOpenPremium
}: StudyPlannerProps) {
  // Wizard state
  const [targetExam, setTargetExam] = useState<string>('panchayat');
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Mathematics']);
  const [durationWeeks, setDurationWeeks] = useState<number>(2);
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Active Plan State
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [showCelebration, setShowCelebration] = useState(false);

  // Available subjects matching Bengal Edtech standard
  const availableSubjects = [
    { id: 'Mathematics', name: 'পাটিগণিত ও গণিত', icon: '🔢', color: 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-500' },
    { id: 'History', name: 'ইতিহাস', icon: '📜', color: 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 text-amber-500' },
    { id: 'Geography', name: 'ভূগোল ও পরিবেশ', icon: '🌍', color: 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-500' },
    { id: 'Polity', name: 'রাষ্ট্রবিজ্ঞান ও সংবিধান', icon: '🏛️', color: 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 text-blue-500' },
    { id: 'English', name: 'ইংরেজি গ্রামার', icon: '✍️', color: 'border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 text-purple-500' },
    { id: 'Bengali', name: 'বাংলা ব্যাকরণ', icon: '🗣️', color: 'border-teal-200 bg-teal-50/50 dark:bg-teal-950/20 text-teal-500' },
    { id: 'Science', name: 'জেনারেল সায়েন্স', icon: '🔬', color: 'border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500' },
    { id: 'GK', name: 'সাম্প্রতিক ঘটনা ও জিকে', icon: '📰', color: 'border-pink-200 bg-pink-50/50 dark:bg-pink-950/20 text-pink-500' }
  ];

  // Load plan from localStorage
  useEffect(() => {
    const saved = safeLocalStorage.getItem('exambangla_study_plan_v2');
    if (saved) {
      try {
        setActivePlan(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading study plan", e);
      }
    }
  }, []);

  // Handle weak subject toggle
  const toggleWeakSubject = (subjectId: string) => {
    if (weakSubjects.includes(subjectId)) {
      if (weakSubjects.length > 1) {
        setWeakSubjects(weakSubjects.filter(id => id !== subjectId));
      }
    } else {
      setWeakSubjects([...weakSubjects, subjectId]);
    }
  };

  // Generate dynamic schedule tasks
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const selectedCat = examCategories.find(c => c.id === targetExam);
      const examName = selectedCat ? selectedCat.bengaliName : 'পরীক্ষা প্রিপারেশন';
      const totalDays = durationWeeks * 7;
      const generatedSchedule: DailySchedule[] = [];

      // Map subject ids to appropriate chapter sets
      const subjectChapters: { [key: string]: string[] } = {
        'History': ['সিন্ধু সভ্যতা ও বৈদিক যুগ', 'মৌর্য ও গুপ্ত সাম্রাজ্য', 'ভারতের স্বাধীনতাসংগ্রাম', 'মুঘল শাসন'],
        'Geography': ['পশ্চিমবঙ্গের ভূগোল ও নদ-নদী', 'ভারতের জলবায়ু ও মাটি', 'সৌরজগৎ ও মহাকাশ', 'খনিজ সম্পদ'],
        'Polity': ['মৌলিক অধিকার ও কর্তব্য', 'রাষ্ট্রপতি ও সংসদ শাসন', 'পঞ্চায়েতি রাজ ব্যবস্থা', 'শাসনতন্ত্র সংশোধন'],
        'Mathematics': ['শতকরা ও গড় হিসাব', 'লাভ-ক্ষতি ও সরল সুদ', 'অনুপাত ও সমানুপাত', 'সময়, দূরত্ব ও বেগ'],
        'English': ['English Grammer Rules', 'Synonyms/Antonyms Check', 'Prepositions Practice', 'Voice Changes'],
        'Bengali': ['সন্ধি বিচ্ছেদ ও সমাস', 'বাংলা ব্যাকরণ ও বাগধারা', 'সমার্থক ও বিপরীত শব্দ', 'কারক ও বিভক্তি'],
        'Science': ['মাস্টার সেলস ও পিটুইটারি গ্রন্থি', 'তরল ধাতুর ঘনত্ব ও পরিমাপ', 'রক্ত সংবহন তন্ত্র', 'আলো ও শব্দবিজ্ঞান'],
        'GK': ['সাম্প্রতিক নোবেল ও খেলাধুলা', 'ভারতের ঐতিহাসিক ব্যক্তিত্ব', 'গুরুত্বপূর্ণ জাতীয় দিবস', 'পশ্চিমবঙ্গের স্কিমসমূহ']
      };

      for (let day = 1; day <= totalDays; day++) {
        // Determine primary focus of index
        const focusSubjectId = weakSubjects[(day - 1) % weakSubjects.length];
        const primarySubject = availableSubjects.find(s => s.id === focusSubjectId) || availableSubjects[0];
        
        // Pick dynamic chapter
        const chapters = subjectChapters[primarySubject.id] || ['সাজেস্টিভ অধ্যায় রিভিশন'];
        const chapter = chapters[(Math.floor((day - 1) / weakSubjects.length)) % chapters.length];

        const dayTasks: PlanTask[] = [];

        // Task 1: Revision (Focusing on Weak area)
        dayTasks.push({
          id: `task-rev-${day}`,
          title: `Revision: ${primarySubject.id}`,
          bengaliTitle: `${primarySubject.name} - '${chapter}' পুঙ্খানুপুঙ্খ রিভিশন দিন`,
          type: 'revision',
          subject: primarySubject.name,
          chapter: chapter,
          estimatedMinutes: Math.round(dailyHours * 60 * 0.4),
          completed: false
        });

        // Task 2: Question Bank Chapter Practice
        dayTasks.push({
          id: `task-prac-${day}`,
          title: `Practice: ${primarySubject.id}`,
          bengaliTitle: `প্রশ্ন ব্যাংক খনি থেকে '${chapter}' সংক্রান্ত ৫০টি প্রশ্ন সমাধান করুন`,
          type: 'practice',
          subject: primarySubject.name,
          chapter: chapter,
          estimatedMinutes: Math.round(dailyHours * 60 * 0.35),
          completed: false
        });

        // Task 3: Mock Test challenge mapping
        // Recommends real mock tests from exambangla database when possible
        const matchingGlobalTests = mockTestsList.filter(t => t.examType === targetExam);
        let recommendedTestId = undefined;
        let testTitleBengali = 'সংযুক্ত বিভাগের ডেইলি প্র্যাকটিস কুইজ দিন';

        if (day % 2 === 1 && matchingGlobalTests.length > 0) {
          const matchedTest = matchingGlobalTests[(Math.floor(day / 2)) % matchingGlobalTests.length];
          recommendedTestId = matchedTest.id;
          testTitleBengali = `মক টেস্ট দিন: ${matchedTest.bengaliTitle}`;
        } else if (matchingGlobalTests.length > 0) {
          const randomTest = matchingGlobalTests[0];
          recommendedTestId = randomTest.id;
          testTitleBengali = `কুইক মক ল্যাব: ${randomTest.bengaliTitle}`;
        }

        dayTasks.push({
          id: `task-mock-${day}`,
          title: `Mock Test`,
          bengaliTitle: testTitleBengali,
          type: 'mock-test',
          subject: 'মক ল্যাব',
          estimatedMinutes: Math.round(dailyHours * 60 * 0.25),
          completed: false,
          relatedTestId: recommendedTestId
        });

        generatedSchedule.push({
          dayNum: day,
          dayName: `দিন ${day}`,
          tasks: dayTasks,
          completed: false,
          motivationalQuote: MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length]
        });
      }

      const newPlan: StudyPlan = {
        id: `plan-${Date.now()}`,
        targetExamId: targetExam,
        targetExamName: examName,
        weakSubjects: weakSubjects.map(id => availableSubjects.find(s => s.id === id)?.name || id),
        durationWeeks: durationWeeks,
        dailyHours: dailyHours,
        createdAt: new Date().toLocaleDateString('bn-BD'),
        schedule: generatedSchedule
      };

      setActivePlan(newPlan);
      safeLocalStorage.setItem('exambangla_study_plan_v2', JSON.stringify(newPlan));
      setSelectedWeek(1);
      setIsGenerating(false);
    }, 1200);
  };

  // Toggle task completion
  const handleToggleTask = (dayNum: number, taskId: string) => {
    if (!activePlan) return;

    const updatedSchedule = activePlan.schedule.map(d => {
      if (d.dayNum === dayNum) {
        const updatedTasks = d.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });
        
        // Day is fully completed if all its tasks are completed
        const isDayDone = updatedTasks.every(t => t.completed);
        return { ...d, tasks: updatedTasks, completed: isDayDone };
      }
      return d;
    });

    const isEntirePlanDoneBefore = activePlan.schedule.every(d => d.completed);
    const isEntirePlanDoneNow = updatedSchedule.every(d => d.completed);

    if (!isEntirePlanDoneBefore && isEntirePlanDoneNow) {
      setShowCelebration(true);
    }

    const updatedPlan = { ...activePlan, schedule: updatedSchedule };
    setActivePlan(updatedPlan);
    safeLocalStorage.setItem('exambangla_study_plan_v2', JSON.stringify(updatedPlan));
  };

  // Reset study plan
  const handleResetPlan = () => {
    if (window.confirm('আপনি কি সত্যিই বর্তমান স্টাডি প্ল্যানটি মুছে নতুন প্ল্যান তৈরি করতে চান?')) {
      setActivePlan(null);
      safeLocalStorage.removeItem('exambangla_study_plan_v2');
      setWeakSubjects(['Mathematics']);
      setTargetExam('panchayat');
    }
  };

  // Calculations for current active plan metrics
  const getPlanMetrics = () => {
    if (!activePlan) return { total: 0, completed: 0, percent: 0, completedDays: 0 };
    
    let totalTasks = 0;
    let completedTasks = 0;
    let completedDays = 0;

    activePlan.schedule.forEach(d => {
      if (d.completed) completedDays++;
      d.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return {
      total: totalTasks,
      completed: completedTasks,
      percent,
      completedDays
    };
  };

  const metrics = getPlanMetrics();

  // Print schedule
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full font-sans pb-16 animate-fadeIn">
      {/* HEADER SECTION WITH BACKGROUND GLOW */}
      <div className="relative text-center p-6 bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl border border-indigo-500/20 shadow-2xl py-8 overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-black/20 rounded-full text-[10px] font-black tracking-widest text-indigo-200 uppercase leading-none border border-white/5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>স্মার্ট এআই স্টাডি ল্যাব</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">
            ব্যক্তিগত পরীক্ষার স্টাডি প্ল্যানার
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed max-w-sm mt-1 font-sans">
            আপনার লক্ষ্য স্থির করুন, দুর্বল বিষয়গুলো চিহ্নিত করুন এবং নিখুঁত দৈনিক গাইডলাইনসহ সফলতা সুনিশ্চিত করুন।
          </p>
        </div>
      </div>

      {/* RENDER PLANNER MAKER WIZARD */}
      {!activePlan ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-6">
          
          {/* STEP 1: SELECT TARGET EXAMS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-2">
              <span className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center text-xs font-black">১</span>
              <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-pink-500" />
                <span>আপনার লক্ষ্য পরীক্ষা বেছে নিন (Select Goal Exam)</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              {examCategories.map((cat) => {
                const isSelected = targetExam === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setTargetExam(cat.id)}
                    className={`flex flex-col text-left p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-pink-500 bg-pink-50/20 dark:bg-pink-950/20' 
                        : 'border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-850 dark:text-slate-100 leading-snug">{cat.bengaliName}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">{cat.name} Section</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: REVEAL WEAK TOPICS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-xs font-black">২</span>
              <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>আপনার দুর্বল বিষয়গুলো সিলেক্ট করুন (Multiple Select Allowed)</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {availableSubjects.map((sub) => {
                const isSelected = weakSubjects.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggleWeakSubject(sub.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-black'
                        : 'border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{sub.icon}</span>
                    <span className="text-[11px] truncate leading-tight">{sub.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 italic">ব্যক্তিগত প্ল্যানে এই দুর্বল বিষয়গুলোর উপর দৈনিক দ্বিগুণ রিভিশন ও অনুশীলনের জোর দেওয়া হবে।</p>
          </div>

          {/* STEP 3: DURATION & DAILY COMMITMENT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-black">৩</span>
              <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>প্ল্যানের সময়সীমা ও দৈনিক পড়ার সময় নির্ধারণ করুন</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Duration weeks */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">প্ল্যানের মেয়াদকাল:</span>
                  <span className="text-xs font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-mono">
                    {durationWeeks} {durationWeeks === 1 ? 'সপ্তাহ (৭ দিন)' : 'সপ্তাহ (' + (durationWeeks*7) + ' দিন)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <button 
                    onClick={() => setDurationWeeks(1)} 
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-black text-center ${durationWeeks === 1 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-150 text-slate-600'}`}
                  >
                    ১ সপ্তাহ
                  </button>
                  <button 
                    onClick={() => setDurationWeeks(2)} 
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-black text-center ${durationWeeks === 2 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-150 text-slate-600'}`}
                  >
                    ২ সপ্তাহ
                  </button>
                  <button 
                    onClick={() => setDurationWeeks(4)} 
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-black text-center ${durationWeeks === 4 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-150 text-slate-600'}`}
                  >
                    ৪ সপ্তাহ
                  </button>
                </div>
              </div>

              {/* Committment daily Hours */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">দৈনিক পড়ালেখা:</span>
                  <span className="text-xs font-black bg-blue-500 text-white px-2.5 py-0.5 rounded-full font-sans">
                    {dailyHours} ঘণ্টা / প্রতিদিন
                  </span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="10" 
                  step="1"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm my-2"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1">
                  <span>২ ঘণ্টা</span>
                  <span>৬ ঘণ্টা</span>
                  <span>১০ ঘণ্টা</span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className={`w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/20 active:scale-98 ${isGenerating ? 'animate-pulse' : ''}`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>অ্যালগরিদম স্টাডি রুটিন সাজাচ্ছে... অনুগ্রহ করে অপেক্ষা করুন...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-305" />
                  <span>কাস্টম স্টাডি প্ল্যান তৈরি করুন (Generate Study Routine)</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* RENDER ACTIVE STUDY ROUTINE DASHBOARD */
        <div className="space-y-6">
          
          {/* CELEBRATION BOX ON COMPLETE */}
          {showCelebration && (
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-5 rounded-3xl border border-amber-300 shadow-xl relative overflow-hidden animate-scaleIn text-white text-center space-y-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <Trophy className="w-12 h-12 text-white fill-amber-100 mx-auto animate-bounce" />
              <h3 className="text-base font-black">অসাধারণ! আপনি সম্পূর্ণ স্টাডি রুটিন সম্পন্ন করেছেন!</h3>
              <p className="text-xs leading-normal">
                অভিনন্দন! আপনার ধারাবাহিকতা এবং অধ্যবসায় প্রশংসনীয়। এই গতি ধরে রাখলে যেকোনো সরকারি চাকরি আপনার হাতের মুঠোয়।
              </p>
              <button 
                onClick={() => setShowCelebration(false)}
                className="bg-white text-amber-800 text-xs font-black px-4 py-1.5 rounded-xl block mx-auto shadow"
              >
                দারুণ, এগিয়ে যাই!
              </button>
            </div>
          )}

          {/* ACTIVE PLAN METRICS OVERVIEW */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center gap-6">
            
            {/* Left: Progress score circle */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              {/* SVGs circular progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="56" cy="56" r="48" 
                  className="stroke-slate-100 dark:stroke-slate-800 stroke-[8]" 
                  fill="transparent" 
                />
                <circle 
                  cx="56" cy="56" r="48" 
                  className="stroke-indigo-600 dark:stroke-indigo-400 stroke-[8] transition-all duration-700" 
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - metrics.percent / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-850 dark:text-white font-mono leading-none">{metrics.percent}%</span>
                <span className="text-[9px] text-slate-400 font-bold block mt-1 tracking-tight">সম্পন্ন টাস্ক</span>
              </div>
            </div>

            {/* Right: Plan descriptors */}
            <div className="flex-1 w-full space-y-3 text-center md:text-left self-stretch flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                  <span className="bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    🎯 {activePlan.targetExamName}
                  </span>
                  <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    🗓️ {activePlan.durationWeeks} সপ্তাহের মিশন
                  </span>
                </div>
                
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-2 leading-snug">
                  আপনার গোল সেট সম্পন্ন: <span className="text-indigo-600 dark:text-indigo-400">{activePlan.targetExamName} ক্র্যাক ২০২৬</span>
                </h3>
                
                {/* Weak domains pills mapping */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 mt-2.5">
                  <span className="text-[10px] text-slate-400 font-bold">দুর্বল বিষয় ফোকাস:</span>
                  {activePlan.weakSubjects.map((subName, i) => (
                    <span key={i} className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 text-rose-600 dark:text-rose-450 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {subName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>তৈরি হয়েছে: {activePlan.createdAt}</span>
                <span>মোট সম্পন্ন দিন: {metrics.completedDays} / {activePlan.schedule.length} দিন</span>
              </div>
            </div>
          </div>

          {/* ACTION BAR: RESET & PRINT DYNAMICALLY */}
          <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-900">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 text-[11px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ডাউনলোড / প্রিন্ট</span>
            </button>
            
            <button
              onClick={handleResetPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>রুটিন মুছে নতুন বানান</span>
            </button>
          </div>

          {/* WEEK SWITCHER TAB BAR (IF DRILLDOWN LONGER THAN 1 WEEK) */}
          {activePlan.durationWeeks > 1 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest block mb-1">সাপ্তাহিক মিশন ট্র্যাকার</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Array.from({ length: activePlan.durationWeeks }).map((_, idx) => {
                  const weekNum = idx + 1;
                  const isSelected = selectedWeek === weekNum;
                  
                  // Calculate week's percentage completion
                  const startDay = (weekNum - 1) * 7;
                  const weekDays = activePlan.schedule.slice(startDay, startDay + 7);
                  let weekTotal = 0;
                  let weekDone = 0;
                  weekDays.forEach(d => {
                    d.tasks.forEach(t => {
                      weekTotal++;
                      if (t.completed) weekDone++;
                    });
                  });
                  const weekPercent = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

                  return (
                    <button
                      key={weekNum}
                      onClick={() => setSelectedWeek(weekNum)}
                      className={`flex-1 shrink-0 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border relative ${
                        isSelected
                          ? 'bg-indigo-650 text-white border-indigo-500 shadow-md shadow-indigo-600/10'
                          : 'bg-white text-slate-700 hover:text-slate-950 dark:bg-slate-900 dark:text-slate-400 border-slate-100 dark:border-slate-850 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-center">
                        <span className="block leading-none">সপ্তাহ ০{weekNum}</span>
                        <div className={`mt-1.5 h-1.5 w-full rounded-full transition-all flex overflow-hidden ${isSelected ? 'bg-indigo-805' : 'bg-slate-100 dark:bg-slate-900 border border-slate-150'}`}>
                          <div 
                            className={`h-full rounded-full ${isSelected ? 'bg-amber-300' : 'bg-indigo-500'}`} 
                            style={{ width: `${weekPercent}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVE WEEK TIMELINE FLOW */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-indigo-500" />
                <span>সপ্তাহ ০{selectedWeek} এর দৈনিক পড়ালেখার সূচী:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                দিন {(selectedWeek - 1) * 7 + 1} থেকে {selectedWeek * 7}
              </span>
            </div>

            {/* Days drilldown */}
            <div className="space-y-4">
              {activePlan.schedule
                .slice((selectedWeek - 1) * 7, selectedWeek * 7)
                .map((day) => {
                  return (
                    <div 
                      key={day.dayNum}
                      className={`bg-white dark:bg-slate-900 border rounded-3xl p-4.5 shadow-sm transition-all relative overflow-hidden ${
                        day.completed 
                          ? 'border-emerald-500/40 bg-emerald-500/[0.01]' 
                          : 'border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                    >
                      {/* Left border badge indicating finished status */}
                      {day.completed && (
                        <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-bl-3xl">
                          <CheckCircle className="w-4.5 h-4.5 fill-emerald-50" />
                        </div>
                      )}

                      {/* Day Heading */}
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider leading-none text-center ${
                            day.completed 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-indigo-50 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 font-bold'
                          }`}>
                            {day.dayName}
                          </span>
                          <span className="text-[9px] text-slate-450 italic font-medium">
                            "{day.motivationalQuote}"
                          </span>
                        </div>
                      </div>

                      {/* Scheduled tasks list */}
                      <div className="space-y-2 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800/80">
                        {day.tasks.map((task) => {
                          const isTaskDone = task.completed;
                          
                          // Task Icon mappings
                          const taskIconMap = {
                            'revision': <BookOpenCheck className="w-4 h-4 text-purple-500" />,
                            'practice': <HelpCircle className="w-4 h-4 text-blue-500" />,
                            'mock-test': <Award className="w-4 h-4 text-rose-500" />
                          }[task.type];

                          return (
                            <div 
                              key={task.id}
                              className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                                isTaskDone 
                                  ? 'bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 border-emerald-500/20' 
                                  : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-150/40 dark:border-slate-900 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {/* Left Checkbox button */}
                              <button
                                onClick={() => handleToggleTask(day.dayNum, task.id)}
                                className="mt-0.5 shadow-sm text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                              >
                                {isTaskDone ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-5" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-350 dark:text-slate-650 hover:text-indigo-500" />
                                )}
                              </button>

                              {/* Task core descriptor */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {taskIconMap}
                                  <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded uppercase leading-none ${
                                    task.type === 'revision' ? 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400' :
                                    task.type === 'practice' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' :
                                    'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-450'
                                  }`}>
                                    {task.type === 'revision' ? 'রিভিশন' : task.type === 'practice' ? 'অনুশীলন' : 'টেস্ট সেশন'}
                                  </span>
                                  {task.chapter && (
                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 italic">
                                      #{task.chapter}
                                    </span>
                                  )}
                                </div>

                                <p className={`text-xs font-bold leading-normal mt-1.5 ${isTaskDone ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>
                                  {task.bengaliTitle}
                                </p>

                                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/20 text-[9px] font-bold text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-405" />
                                    <span>নির্ধারিত সময়: {task.estimatedMinutes} মিনিট</span>
                                  </span>

                                  {/* CLICKABLE MOCK TEST DIRECT LINK CTA (If mock test matches database) */}
                                  {task.type === 'mock-test' && task.relatedTestId && !isTaskDone && (
                                    <button
                                      onClick={() => {
                                        const foundTest = mockTests.find(t => t.id === task.relatedTestId);
                                        if (foundTest) {
                                          onStartMockTest(foundTest);
                                        } else {
                                          setView('mock-tests');
                                        }
                                      }}
                                      className="flex items-center gap-1 text-blue-600 hover:text-indigo-600 font-extrabold"
                                    >
                                      <span>পরীক্ষা শুরু করুন</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
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

        </div>
      )}
    </div>
  );
}
