import React, { useState, useEffect } from 'react';
import { Clock, CheckSquare, Award, AlertCircle, ChevronLeft, ChevronRight, Bookmark, LogOut, CheckCircle } from 'lucide-react';
import { MockTest, Question, TestResult } from '../types';

interface MockTestInterfaceProps {
  test: MockTest;
  onFinishTest: (result: TestResult) => void;
  onCancel: () => void;
}

export default function MockTestInterface({
  test,
  onFinishTest,
  onCancel
}: MockTestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({}); // questionId -> selectedIndex
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({}); // questionId -> isReview
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>(() => {
    const firstQId = test?.questions?.[0]?.id;
    return firstQId ? { [firstQId]: true } : {};
  });
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((test?.durationMinutes || 0) * 60);

  // Timer countdown hook
  useEffect(() => {
    if (!test?.questions || test.questions.length === 0) return;
    if (timeLeftSeconds <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeftSeconds, test]);

  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-150 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto my-12 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-800 dark:text-white">প্রশ্নোত্তর পাওয়া যায়নি</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          দুঃখিত, এই টেস্টটিতে এখনো কোনো প্রশ্ন যুক্ত করা হয়নি। দয়া করে অন্য কোনো মক টেস্ট নির্বাচন করুন অথবা অ্যাডমিন প্যানেল থেকে প্রশ্ন যোগ করুন।
        </p>
        <button 
          onClick={onCancel}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx
    }));
  };

  const handleMarkReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setVisitedQuestions((prev) => ({ ...prev, [test.questions[nextIdx].id]: true }));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setVisitedQuestions((prev) => ({ ...prev, [test.questions[prevIdx].id]: true }));
    }
  };

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (question: Question, idx: number) => {
    const qId = question.id;
    const isCurrent = idx === currentQuestionIndex;
    const isAnswered = selectedAnswers[qId] !== undefined;
    const isReview = markedForReview[qId];

    if (isCurrent) return 'ring-2 ring-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200 font-bold';
    if (isReview) return 'bg-amber-400 text-white font-bold';
    if (isAnswered) return 'bg-emerald-500 text-white font-bold';
    if (visitedQuestions[qId]) return 'bg-rose-500 text-white font-bold';
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  };

  const handleSubmit = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    // Collect subject aggregates
    const subjectWiseMap: Record<string, { correct: number; total: number }> = {};

    test.questions.forEach((q) => {
      const ansIdx = selectedAnswers[q.id];
      const isCorrect = ansIdx !== undefined && ansIdx === q.correctOptionIndex;

      if (!subjectWiseMap[q.subject]) {
        subjectWiseMap[q.subject] = { correct: 0, total: 0 };
      }
      subjectWiseMap[q.subject].total += 1;

      if (ansIdx === undefined) {
        unanswered += 1;
      } else if (isCorrect) {
        correct += 1;
        score += 1; // 1 mark per question
        subjectWiseMap[q.subject].correct += 1;
      } else {
        wrong += 1;
        // optional 0.25 negative marking
        score -= 0.25;
      }
    });

    const timeTaken = test.durationMinutes * 60 - timeLeftSeconds;
    const maxMarks = test.questions.length;
    const rank = Math.floor(Math.random() * 25) + 3; // simulated ranking status

    const finalResult: TestResult = {
      id: `res-${Date.now()}`,
      testId: test.id,
      testTitle: test.bengaliTitle,
      score: Math.max(0, score),
      totalMarks: maxMarks,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unanswered,
      accuracy: maxMarks ? Math.round((correct / maxMarks) * 100) : 0,
      timeTakenMinutes: Math.round(timeTaken / 60) || 1,
      rank,
      totalParticipants: 1840,
      subjectWise: Object.entries(subjectWiseMap).map(([subject, data]) => ({
        subject,
        correct: data.correct,
        total: data.total
      })),
      date: new Date().toLocaleDateString('bn-IN')
    };

    onFinishTest(finalResult);
  };

  const progressPercent = Math.round(((Object.keys(selectedAnswers).length) / test.questions.length) * 100);

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleSaveAndNext = () => {
    // Just move to the next question. The selection is already saved in selectedAnswers state automatically.
    if (currentQuestionIndex < test.questions.length - 1) {
      handleNext();
    } else {
      // Last question prompt or info
      alert('এটি শেষ প্রশ্ন। আপনি টেস্টটি এখন শেষ করতে পারেন।');
    }
  };

  return (
    <div className="space-y-4 font-sans max-w-4xl mx-auto px-1 md:px-4">
      {/* 1. Sticky Test top status bars */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">
              {test.bengaliTitle}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <span className="font-bold">প্রশ্ন: {currentQuestionIndex + 1} / {test.questions.length}</span>
            </div>
          </div>

          {/* TIMER */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black shadow-inner border ${
            timeLeftSeconds < 120 
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 animate-pulse' 
              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border-indigo-200'
          }`}>
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="font-mono text-xs md:text-sm">{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>

        {/* Dynamic progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>উত্তরিত: {Object.keys(selectedAnswers).length} টি</span>
            <span>অবশিষ্ট: {test.questions.length - Object.keys(selectedAnswers).length} টি</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left/Middle: Questions Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4 relative">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500">
              <span>বিভাগ: {currentQuestion.subject}</span>
              <span className="text-emerald-650 dark:text-emerald-400">মান: +১.০ | নেগেটিভ: -০.২৫</span>
            </div>

            {/* Question Text */}
            <div className="min-h-[80px]">
              <h2 className="text-[15px] md:text-base font-extrabold text-slate-800 dark:text-white leading-relaxed">
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options Area */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                const optionLabels = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/45'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {optionLabels[idx]}
                    </div>
                    <span className="flex-1 text-[13px] leading-tight">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row inside Card */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
            <button
              onClick={handleClearAnswer}
              disabled={selectedAnswers[currentQuestion.id] === undefined}
              className="px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-rose-500 dark:text-rose-455 rounded-xl disabled:opacity-40 transition-all cursor-pointer active:scale-95"
            >
              Clear Answer
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkReview}
                className={`px-4 py-2.5 rounded-12 border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  markedForReview[currentQuestion.id]
                    ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedForReview[currentQuestion.id] ? 'রিভিউ বাতিল' : 'রিভিউ করুন'}</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-12 text-xs transition-all cursor-pointer active:scale-95"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Palette Panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans">
              প্রশ্ন প্যালেট (Question Palette)
            </h4>

            {/* Grid of question states */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
              {test.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setVisitedQuestions((prev) => ({ ...prev, [q.id]: true }));
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-all pointer-events-auto cursor-pointer font-bold ${getQuestionStatus(q, idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Guide labels */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 dark:border-slate-800 text-[10px] font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 block shrink-0" />
                <span>উত্তর দেওয়া</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 block shrink-0" />
                <span>দেখে নাই</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400 block shrink-0" />
                <span>রিভিউ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 block shrink-0" />
                <span>চলতি প্রশ্ন</span>
              </div>
            </div>
          </div>

          {/* Cancel/Exit button */}
          <button
            onClick={() => {
              if (window.confirm('আপনি কি সত্যিই টেস্টটি বাতিল করে হোমপেজে যেতে চান? আপনার প্রোগ্রেস সেভ হবে না।')) {
                onCancel();
              }
            }}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl active:scale-95 text-xs text-center block cursor-pointer hover:bg-slate-150 transition-all"
          >
            পরীক্ষা বাতিল করুন (Exit Test)
          </button>
        </div>
      </div>

      {/* 5. Sticky/Floating Mobile Friendly Bottom Navigation Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-150 dark:border-slate-800 py-3.5 px-4 shadow-lg flex items-center justify-between md:max-w-2xl md:mx-auto md:rounded-t-[24px]">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 rounded-xl active:scale-95 disabled:opacity-40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>আগের প্রশ্ন</span>
        </button>

        <span className="text-xs font-black text-slate-600 dark:text-slate-400">
          Q. {currentQuestionIndex + 1} / {test.questions.length}
        </span>

        {currentQuestionIndex === test.questions.length - 1 ? (
          <button
            onClick={() => {
              if (window.confirm('আপনি কি সত্যিই মক টেস্টটি শেষ করতে চান?')) {
                handleSubmit();
              }
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-xl active:scale-95 text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
          >
            <CheckCircle className="w-4 h-4" />
            <span>শেষ করুন (Submit)</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl active:scale-95 text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/10"
          >
            <span>পরের প্রশ্ন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
