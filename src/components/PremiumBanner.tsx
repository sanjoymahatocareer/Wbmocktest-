import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Info, CheckCircle2, Lock, ChevronRight, Check, Copy, AlertCircle, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ActiveSubscription } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { examCategories } from '../data';

interface PremiumBannerProps {
  isPremiumUser: boolean;
  activeSubscription?: ActiveSubscription | null;
  firebaseUser?: FirebaseUser | null;
  onGoBack?: () => void;
  onUpgradeSuccess?: (durationPlan: string) => void;
  onBuyPlan?: (planId: 'basic' | 'standard' | 'premium') => void;
}

export default function PremiumBanner({
  onGoBack,
  firebaseUser,
}: PremiumBannerProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');
  const [selectedExam, setSelectedExam] = useState<typeof examCategories[0]>(() => examCategories[0]);
  const [showExamSelector, setShowExamSelector] = useState(false);
  
  // UPI configuration fetched dynamically from admin settings
  const [upiId, setUpiId] = useState('prokashmal799@okhdfcbank');
  const [upiName, setUpiName] = useState('Prokash Mal');
  const [enableUpi, setEnableUpi] = useState(true);

  // Checkout states
  const [showCheckout, setShowCheckout] = useState(false);
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Dynamic load payee UPI details from admin settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/payment-settings');
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data && typeof data === 'object') {
              if (data.upiId) setUpiId(data.upiId);
              if (data.upiName) setUpiName(data.upiName);
              if (data.enableUpi !== undefined) setEnableUpi(data.enableUpi);
            }
          } else {
            console.warn("Received non-JSON response from payment settings:", contentType);
          }
        } else {
          console.warn("Failed response from payment settings:", response.status, response.statusText);
        }
      } catch (err) {
        console.warn("Failed to fetch payee settings dynamically (possibly network or boot blip):", err);
      }
    };
    fetchSettings();
  }, []);

  const planAmount = selectedPlan === 'basic' ? 49 : 99;
  const planTitle = selectedPlan === 'basic' ? 'Basic Plan' : 'Premium Plan';

  // Construct UPI payload for the dynamic scan QR Code
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${planAmount}&cu=INR&tn=WBMockTest_${selectedPlan}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitiatePayment = () => {
    if (!firebaseUser) {
      alert("পেমেন্ট করতে দয়া করে প্রথমে গুগল দিয়ে লগইন করুন।");
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || utr.trim().length !== 12 || isNaN(Number(utr))) {
      alert("দয়া করে ১২ সংখ্যার সঠিক UTR / Transaction ID লিখুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: firebaseUser?.uid || 'anonymous',
        userName: firebaseUser?.displayName || 'পরীক্ষার্থী',
        userEmail: firebaseUser?.email || 'student@exambangla.com',
        planId: selectedPlan,
        utr: utr.trim(),
        targetExam: `${selectedExam.bengaliName} (${selectedExam.name})`
      };

      const res = await fetch('/api/submit-upi-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert("রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pb-28 font-sans">
        <div className="bg-[#0A3D91] text-white sticky top-0 z-20 shadow-md">
          <div className="flex items-center px-4 py-4 max-w-[480px] mx-auto">
            <h1 className="text-xl font-bold tracking-wide">পেমেন্ট স্ট্যাটাস 👑</h1>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto pt-10 px-6 bg-white min-h-screen text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-400 mb-6 animate-pulse">
            <Check className="w-10 h-10 text-emerald-600 stroke-[3]" />
          </div>

          <h2 className="text-[22px] font-black text-slate-800 leading-tight mb-3">পেমেন্ট রিকোয়েস্ট সফল!</h2>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 w-full text-slate-600 text-[14px] leading-relaxed mb-6 space-y-2 text-left">
            <p className="font-bold text-center text-slate-800 border-b pb-2 mb-2">পেমেন্ট মেটাডেটা</p>
            <p><strong>প্ল্যান:</strong> {planTitle}</p>
            <p><strong>মূল্য:</strong> ₹{planAmount}</p>
            <p><strong>UTR নম্বর:</strong> {utr}</p>
            <p><strong>যাচাইকরণ সময়:</strong> অনূর্ধ্ব ১ ঘন্টা</p>
          </div>

          <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed mb-8">
            আপনার ১২ সংখ্যার পেমেন্ট UTR নম্বরটি সফলভাবে জমা নেওয়া হয়েছে। অ্যাডমিন অ্যাকাউন্ট যাচাই করে ১ ঘন্টার মধ্যে আপনার প্রিমিয়াম সুবিধা সচল করে দেবেন।
          </p>

          <button 
            onClick={onGoBack}
            className="w-full bg-[#0A3D91] hover:bg-[#1e3a8a] text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pb-28 font-sans">
        {/* Header */}
        <div className="bg-[#0A3D91] text-white sticky top-0 z-20 shadow-md">
          <div className="flex items-center px-4 py-4 max-w-[480px] mx-auto">
            <button onClick={() => setShowCheckout(false)} className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-lg font-bold">UPI সুরক্ষিত পেমেন্ট করুন 🛡️</h1>
              <p className="text-[12px] text-blue-100 opacity-95 font-medium">নিরাপদ এবং তাত্ক্ষণিক গেটওয়ে</p>
            </div>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto pt-4 px-4 bg-white min-h-screen">
          
          {/* Selected Plan Review */}
          <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-4 mb-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {selectedPlan === 'basic' ? '30 Days' : '90 Days'}
              </span>
              <h3 className="text-[15px] font-black text-slate-800 mt-1.5">{planTitle}</h3>
              <p className="text-[12px] text-slate-500 font-semibold">{selectedExam.bengaliName} ({selectedExam.name}) Mock Tests</p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-black text-[#0A3D91]">₹{planAmount}</p>
              <p className="text-[11px] text-slate-400 font-bold">এককালীন চার্জ</p>
            </div>
          </div>

          {/* Payment Steps */}
          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#0A3D91] text-white text-[11px] font-black rounded-full flex items-center justify-center shrink-0">১</span>
                <h4 className="text-[13.5px] font-extrabold text-slate-800">নিচের কিউআর কোডটি স্ক্যান করে পেমেন্ট করুন</h4>
              </div>

              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm relative">
                  <img src={qrCodeUrl} alt="UPI QR Code" className="w-[180px] h-[180px] object-contain" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-2.5">PhonePe, Google Pay, Paytm বা যেকোনো UPI অ্যাপ ব্যবহার করুন</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#0A3D91] text-white text-[11px] font-black rounded-full flex items-center justify-center shrink-0">২</span>
                <h4 className="text-[13.5px] font-extrabold text-slate-800">অথবা ম্যানুয়ালি UPI ID কপি করে পে করুন</h4>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-bold leading-none">UPI Address</p>
                  <p className="text-xs font-black text-slate-700 truncate mt-1 select-all">{upiId}</p>
                </div>
                <button 
                  onClick={handleCopyUpi}
                  className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] bg-slate-50 rounded-xl p-2.5 text-slate-500 font-bold border border-slate-100">
                👤 <strong>Payee Name:</strong> {upiName}
              </div>
            </div>

            {/* Step 3 */}
            <form onSubmit={handleSubmitUpiPayment} className="space-y-3.5 pb-20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#0A3D91] text-white text-[11px] font-black rounded-full flex items-center justify-center shrink-0">৩</span>
                <h4 className="text-[13.5px] font-extrabold text-slate-800">১২ সংখ্যার UTR / Transaction ID টি এখানে লিখুন</h4>
              </div>

              <div className="space-y-2">
                <input 
                  type="text"
                  maxLength={12}
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="যেমন: 412356789012"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#0A3D91]/15 focus:border-[#0A3D91] rounded-2xl text-center text-md font-black tracking-widest text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <p className="text-[11px] font-bold text-slate-400 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" /> পেমেন্ট করার পর রিসিভ কপি থেকে ১২ সংখ্যার নম্বরটি দেখে লিখুন।
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>পেমেন্ট রিকোয়েস্ট সাবমিট করুন</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] md:bg-white min-h-screen pb-28 font-sans">
      {/* Header - Premium Blue Theme */}
      <div className="bg-[#0A3D91] text-white sticky top-0 z-20 shadow-md">
        <div className="flex items-center px-4 py-4 max-w-[480px] mx-auto">
          <button onClick={onGoBack} className="p-1 -ml-1 mr-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="flex-grow">
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              WBMockTest Premium <span className="text-xl">👑</span>
            </h1>
            <p className="text-[13px] text-blue-100 mt-0.5 font-medium">সেরা প্রস্তুতি, সেরা রেজাল্ট</p>
          </div>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto pt-4 px-4 bg-white min-h-screen md:border-x md:border-slate-100 md:shadow-[0_0_40px_rgba(0,0,0,0.02)]">
        
        {/* Selected Exam Card */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-slate-100 p-4 mb-4 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0A3D91] flex items-center justify-center shrink-0 shadow-md text-2xl select-none">
               {selectedExam.emoji || '🔴'}
            </div>
            <div className="flex-1 pt-0.5">
               <div className="inline-block bg-[#eef2ff] text-[#0A3D91] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5 border border-blue-100">
                  {selectedExam.bengaliName}
               </div>
               <h2 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">{selectedExam.name} Exam Preparation</h2>
               <p className="text-[13px] font-bold text-slate-500">{selectedExam.subtitle || 'সেরা মক টেস্ট সিরিজ'}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex justify-center">
              <button 
                onClick={() => setShowExamSelector(!showExamSelector)}
                className="text-[#0A3D91] text-[13.5px] font-black flex items-center gap-1 hover:underline cursor-pointer transition-all active:scale-95"
                id="change-exam-trigger-button"
              >
                <span>{showExamSelector ? 'পরীক্ষা তালিকা বন্ধ করুন' : 'পরীক্ষা পরিবর্তন করুন'}</span>
                {showExamSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {showExamSelector && (
              <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-1 animate-fadeIn border-t border-slate-100 pt-3">
                <p className="text-[11px] text-slate-400 font-bold mb-2">যে পরীক্ষার প্রস্তুতি নিতে চান সেটি সিলেক্ট করুন:</p>
                <div className="grid grid-cols-1 gap-2">
                  {examCategories.map((cat) => {
                    const isSelected = selectedExam.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedExam(cat);
                          setShowExamSelector(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm' 
                            : 'bg-white border-slate-150 hover:bg-slate-50 text-slate-700'
                        }`}
                        id={`inline-category-option-${cat.id}`}
                      >
                        <span className="text-xl select-none">{cat.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-black truncate">{cat.bengaliName}</h4>
                            {isSelected && (
                              <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none font-sans">
                                SELECTED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{cat.subtitle || cat.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
           <div className="bg-[#16A34A] text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
             <Info className="w-3.5 h-3.5" />
           </div>
           <p className="text-[13px] font-bold text-[#166534] leading-relaxed">
             এই প্ল্যান কিনলে শুধুমাত্র এই পরীক্ষার Mock Test পাবেন
           </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-4 mb-6">
          
          {/* Basic Plan */}
          <div 
            onClick={() => setSelectedPlan('basic')}
            className={`rounded-[20px] p-5 cursor-pointer transition-all ${
              selectedPlan === 'basic' 
              ? 'border-2 border-[#0A3D91] bg-white shadow-[0_4px_20px_rgba(10,61,145,0.12)]' 
              : 'border border-slate-200 bg-white shadow-sm hover:border-[#0A3D91]/50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-[16px] font-black text-slate-800">Basic Plan</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[28px] font-black text-slate-900 leading-none">₹49</span>
                  </div>
               </div>
               <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                 selectedPlan === 'basic' ? 'border-[#0A3D91] bg-[#0A3D91]' : 'border-slate-300'
               }`}>
                 {selectedPlan === 'basic' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
               </div>
            </div>

            <p className="text-[14.5px] font-bold text-[#0A3D91] mb-4">20 Mock Test</p>

            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[14px] font-medium text-slate-600">Detailed Solution</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[14px] font-medium text-slate-600">Exam Based Mock Test</span>
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleInitiatePayment();
              }}
              className={`w-full py-3 rounded-xl font-bold text-[15px] transition-all ${
                selectedPlan === 'basic' 
                ? 'bg-[#0A3D91] text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              এখনই কিনুন
            </button>
          </div>

          {/* Premium Plan (Most Popular) */}
          <div 
             onClick={() => setSelectedPlan('premium')}
             className={`rounded-[20px] p-5 cursor-pointer transition-all relative ${
               selectedPlan === 'premium' 
               ? 'border-2 border-[#16A34A] bg-[#f8fff9] shadow-[0_4px_20px_rgba(22,163,74,0.12)]' 
               : 'border border-slate-200 bg-white shadow-sm hover:border-[#16A34A]/50'
             }`}
          >
            <div className="absolute -top-3.5 left-6 bg-[#ef4444] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center shadow-sm">
               🔥 Most Popular
            </div>

            <div className="flex justify-between items-start mb-4 mt-1">
               <div>
                  <h3 className="text-[16px] font-black text-slate-800">Premium Plan</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[28px] font-black text-slate-900 leading-none">₹99</span>
                  </div>
               </div>
               <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                 selectedPlan === 'premium' ? 'border-[#16A34A] bg-[#16A34A]' : 'border-slate-300'
               }`}>
                 {selectedPlan === 'premium' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
               </div>
            </div>

            <p className="text-[14.5px] font-bold text-[#16A34A] mb-4">45 Mock Test</p>

            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[14px] font-medium text-slate-600">Detailed Solution</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[14px] font-medium text-slate-600">All India Rank</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[14px] font-medium text-slate-600">Performance Analytics</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[14px] font-medium text-slate-600">Exam Based Mock Test</span>
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleInitiatePayment();
              }}
              className={`w-full py-3 rounded-xl font-bold text-[15px] transition-all ${
                selectedPlan === 'premium' 
                ? 'bg-[#16A34A] text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              এখনই কিনুন
            </button>
          </div>

        </div>

        {/* Feature Strip */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 flex justify-between items-center mb-6">
          <div className="flex flex-col items-center text-center gap-1.5 flex-1">
            <div className="text-[20px]">🏆</div>
            <div className="text-[11px] font-bold text-slate-600 leading-tight">All India<br/>Rank</div>
          </div>
          <div className="w-[1px] h-10 bg-slate-100"></div>
          <div className="flex flex-col items-center text-center gap-1.5 flex-1">
            <div className="text-[20px]">📄</div>
            <div className="text-[11px] font-bold text-slate-600 leading-tight">Detailed<br/>Solution</div>
          </div>
          <div className="w-[1px] h-10 bg-slate-100"></div>
          <div className="flex flex-col items-center text-center gap-1.5 flex-1">
            <div className="text-[20px]">📊</div>
            <div className="text-[11px] font-bold text-slate-600 leading-tight">Performance<br/>Analytics</div>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
           <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-slate-500" />
              <h3 className="text-[14px] font-bold text-slate-600">নিরাপদ পেমেন্ট</h3>
           </div>
           
           <div className="flex flex-wrap justify-center items-center gap-2.5">
             {['UPI', 'PhonePe', 'Google Pay', 'Paytm', 'BHIM UPI'].map((method) => (
                <div key={method} className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-500 flex items-center gap-1">
                   <span className="text-[#16A34A] text-[12px]">✅</span> {method}
                </div>
             ))}
           </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-6 pb-4">
           <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A]" />
              <span className="text-[12px] font-medium text-slate-500">100% নিরাপদ পেমেন্ট</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A]" />
              <span className="text-[12px] font-medium text-slate-500">টাকা ফেরত সহায়তা</span>
           </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-[480px] mx-auto">
          <button 
            onClick={handleInitiatePayment}
            className={`w-full font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
              selectedPlan === 'premium' ? 'bg-[#16A34A] text-white hover:bg-[#15803d]' : 'bg-[#0A3D91] text-white hover:bg-[#1e3a8a]'
            }`}
          >
             <Lock className="w-5 h-5" />
             <span className="text-[16px]">সুরক্ষিত পেমেন্ট করুন</span>
          </button>
        </div>
      </div>


    </div>
  );
}
