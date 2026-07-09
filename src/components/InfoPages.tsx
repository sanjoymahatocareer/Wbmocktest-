import React, { useState } from 'react';
import { Shield, Mail, Phone, MapPin, Heart, ArrowLeft, MessageSquare, Info, Scale, CheckCircle } from 'lucide-react';
import { ViewType } from '../types';

interface InfoPagesProps {
  initialTab: 'about' | 'contact' | 'privacy' | 'disclaimer' | 'terms';
  onGoBack: () => void;
  setView: (view: ViewType) => void;
}

export default function InfoPages({ initialTab, onGoBack, setView }: InfoPagesProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'privacy' | 'disclaimer' | 'terms'>(initialTab);
  
  // Contact Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      alert('দয়া করে আপনার নাম এবং বার্তাটি লিখুন।');
      return;
    }
    
    // Create WhatsApp link
    const whatsappNo = '7407319638';
    const text = `নাম: ${name}\nইমেইল: ${email || 'N/A'}\nবিষয়: ${subject || 'সাধারণ জিজ্ঞাসা'}\nবার্তা: ${message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/91${whatsappNo}?text=${encodedText}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  const tabs = [
    { id: 'about' as const, label: 'আমাদের সম্পর্কে', icon: Info },
    { id: 'contact' as const, label: 'যোগাযোগ করুন', icon: Mail },
    { id: 'privacy' as const, label: 'গোপনীয়তা নীতি', icon: Shield },
    { id: 'disclaimer' as const, label: 'দাবিত্যাগ', icon: Scale },
    { id: 'terms' as const, label: 'শর্তাবলী', icon: Scale },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 font-sans animate-fadeIn">
      {/* Back button and navigation header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </button>
        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 dark:text-slate-400 font-extrabold tracking-wider uppercase">
          WBMockTest Info Hub
        </span>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-1.5 rounded-2xl gap-1 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSubmitted(false);
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 rounded-[32px] shadow-sm animate-fadeIn">
        
        {/* ABOUT US */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-2xl">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white">আমাদের সম্পর্কে (About Us)</h3>
                <p className="text-[10.5px] text-slate-400 font-bold">WBMockTest.in — পশ্চিমবঙ্গের এক নম্বর ফ্রি অনলাইন প্রিপারেশন পোর্টাল</p>
              </div>
            </div>

            <div className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
              <p>
                <strong>WBMockTest.in</strong>-এ আপনাকে স্বাগতম। আমাদের মূল লক্ষ্য হল পশ্চিমবঙ্গের সমস্ত চাকরিপ্রার্থীদের জন্য একটি গুণমানসম্পন্ন এবং সম্পূর্ণ ফ্রি অনলাইন মক টেস্ট ও প্রিপারেশন প্ল্যাটফর্ম প্রদান করা। 
              </p>
              <p>
                আমরা বিশ্বাস করি যে আর্থিক অভাব যেন কোনো মেধাবী ছাত্র-ছাত্রীর সরকারি চাকরি পাওয়ার স্বপ্নের পথে বাধা হয়ে না দাঁড়ায়। এই কারণেই আমাদের সাইটের সমস্ত টেস্ট, ডেইলি জিকে ও কারেন্ট অ্যাফেয়ার্স সবার জন্য <strong>১০০% ফ্রি</strong> রাখা হয়েছে।
              </p>
              
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100/30 space-y-2 mt-2">
                <h4 className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider">আমরা কোন কোন পরীক্ষার প্রস্তুতিতে সাহায্য করি?</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-650 dark:text-slate-300">
                  <li>পশ্চিমবঙ্গ পুলিশ (WBP Sub-Inspector, Constable) & কলকাতা পুলিশ</li>
                  <li>WBPSC (Food SI, Miscellaneous, Clerkship, WBCS)</li>
                  <li>পশ্চিমবঙ্গ পঞ্চায়েত রিক্রুটমেন্ট (Panchayat Clerk, Executive)</li>
                  <li>প্রাথমিক টেট (Primary TET)</li>
                  <li>গ্রুপ সি ও ডি (Group C & D)</li>
                  <li>রেলওয়ে (RRB NTPC, Group D) ও অন্যান্য কেন্দ্রীয় সরকারি পরীক্ষা</li>
                </ul>
              </div>

              <p className="pt-2">
                আমাদের অভিজ্ঞ শিক্ষক ও কন্টেন্ট টিম প্রতিদিন পশ্চিমবঙ্গ সিলেবাস অনুযায়ী কমনযোগ্য এবং অত্যন্ত গুরুত্বপূর্ণ প্রশ্ন ব্যাংক তৈরি করে থাকে। যেকোনো পরামর্শ, ফিডব্যাক বা সহযোগিতার জন্য নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
              </p>
            </div>
            
            <div className="pt-4 flex justify-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                <span>for West Bengal Job Aspirants</span>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT US */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-2xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white">যোগাযোগ করুন (Contact Us)</h3>
                <p className="text-[10.5px] text-slate-400 font-bold">যেকোনো প্রশ্ন, জিজ্ঞাসা বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact info cards */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">সরাসরি যোগাযোগের ঠিকানা</h4>
                
                <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <Phone className="w-4 h-4 text-green-550 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-black text-slate-800 dark:text-white">হোয়াটসঅ্যাপ সাপোর্ট (WhatsApp Support)</p>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-1">+91 7407319638</p>
                    <a
                      href="https://wa.me/917407319638"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-extrabold inline-block mt-1"
                    >
                      সরাসরি চ্যাট করুন →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-black text-slate-800 dark:text-white">ইমেইল ঠিকানা (Email Support)</p>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-1">support@wbmocktest.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-black text-slate-800 dark:text-white">প্রধান কার্যালয়</p>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-1">কলকাতা, পশ্চিমবঙ্গ, ভারত</p>
                  </div>
                </div>
              </div>

              {/* Contact form / WhatsApp Sender */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-3">আমাদের মেসেজ পাঠান</h4>
                
                {submitted ? (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black text-slate-800 dark:text-white">মেসেজ পাঠানো হয়েছে!</p>
                    <p className="text-[10px] text-slate-400">আপনাকে হোয়াটসঅ্যাপে রিডাইরেক্ট করা হচ্ছে। ধন্যবাদ!</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-blue-600 font-black hover:underline mt-2 cursor-pointer"
                    >
                      আরেকটি মেসেজ পাঠান
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] text-slate-450 dark:text-slate-400 font-black uppercase mb-1 block">আপনার নাম *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পুরো নাম লিখুন"
                        className="w-full text-xs px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 dark:text-slate-400 font-black uppercase mb-1 block">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full text-xs px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 dark:text-slate-400 font-black uppercase mb-1 block">মেসেজের বিষয়</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="যেমন: মক টেস্টে ভুল, বিজ্ঞাপন জিজ্ঞাসা"
                        className="w-full text-xs px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 dark:text-slate-400 font-black uppercase mb-1 block">আপনার বার্তা *</label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="আপনার মেসেজ বিস্তারিত লিখুন..."
                        className="w-full text-xs px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none transition-all dark:text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-750 text-white py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-green-500/10 flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      হোয়াটসঅ্যাপের মাধ্যমে মেসেজ পাঠান
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white">গোপনীয়তা নীতি (Privacy Policy)</h3>
                <p className="text-[10.5px] text-slate-400 font-bold">WBMockTest.in-এর ইউজার ডাটা এবং কুকি ব্যবহারের নিয়মনীতি</p>
              </div>
            </div>

            <div className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
              <p>
                WBMockTest.in-এ আমরা আমাদের ভিজিটরদের গোপনীয়তাকে অত্যন্ত গুরুত্ব সহকারে বিবেচনা করি। এই ডকুমেন্টটিতে বিস্তারিত রয়েছে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ এবং ব্যবহার করি।
              </p>
              
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider pt-2">১. আমরা কোন তথ্য সংগ্রহ করি?</h4>
              <p>
                আপনি যখন আমাদের সাইটে রেজিস্ট্রেশন করেন বা জিমেইল দিয়ে লগইন করেন, আমরা আপনার নাম, ইমেইল এড্রেস এবং প্রোফাইল ছবি সংগ্রহ করি যাতে আপনার মক টেস্ট প্রোগ্রেস ও রেজাল্ট হিস্ট্রি সুরক্ষিতভাবে সংরক্ষণ করা যায়।
              </p>

              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider pt-2">২. লগ ফাইল এবং অ্যানালিটিক্স</h4>
              <p>
                অন্যান্য সাধারণ ওয়েবসাইটের মতো, আমরাও Google Analytics ব্যবহার করে সাইটের ট্রাফিক, ভিজিটরদের সাধারণ ব্রাউজিং প্যাটার্ন, ব্রাউজার টাইপ এবং আইপি এড্রেস ট্র্যাক করি। এই ডাটা কোনো ব্যক্তিগত ব্যক্তির সাথে সংযুক্ত করা যায় না এবং এটি সম্পূর্ণ বেনামী (anonymous)।
              </p>

              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider pt-2">৩. কুকিজ এবং বিজ্ঞাপন নীতি</h4>
              <p>
                আমরা সাইটের ইউজার এক্সপেরিয়েন্স উন্নত করতে কুকিজ ব্যবহার করি। এছাড়াও আমাদের সাইটে গুগল অ্যাডসেন্স (Google AdSense) বিজ্ঞাপন দেখানোর জন্য থার্ড-পার্টি কুকি ব্যবহার করতে পারে। গুগল এবং তাদের পার্টনাররা পূর্বে আপনার ব্রাউজিং হিস্ট্রির ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন দেখাতে DoubleClick কুকি ব্যবহার করে।
              </p>
              <p>
                আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকি নিষ্ক্রিয় (disable) করে দিতে পারেন।
              </p>
            </div>
          </div>
        )}

        {/* DISCLAIMER */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-2xl">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white">দাবিত্যাগ (Disclaimer)</h3>
                <p className="text-[10.5px] text-slate-400 font-bold">WBMockTest.in-এর আইনগত সীমারেখা ও আইনি সতর্কীকরণ</p>
              </div>
            </div>

            <div className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
              <p>
                <strong>১. সরকারি কোনো সংস্থার সাথে সম্পর্কহীনতা:</strong> WBMockTest.in একটি সম্পূর্ণ বেসরকারি এবং স্বাধীন শিক্ষামূলক প্রিপারেশন পোর্টাল। এই ওয়েবসাইটটির সাথে পশ্চিমবঙ্গ সরকার, কেন্দ্র সরকার, পশ্চিমবঙ্গ পুলিশ রিক্রুটমেন্ট বোর্ড (WBPPRB), WBPSC, বা অন্য কোনো সরকারি নিয়োগকারী সংস্থার কোনো প্রত্যক্ষ বা পরোক্ষ প্রাতিষ্ঠানিক সম্পর্ক নেই।
              </p>
              
              <p>
                <strong>২. তথ্যের নির্ভুলতা:</strong> আমাদের পোর্টালে প্রকাশিত বিভিন্ন চাকরির খবর এবং সিলেবাসের তথ্যসমূহ বিভিন্ন বিশ্বস্ত সংবাদ মাধ্যম ও অফিসিয়াল নোটিফিকেশন থেকে সংগ্রহ করা হয়। আমরা সর্বোচ্চ নির্ভুলতা বজায় রাখার চেষ্টা করি, তবে যেকোনো জবে আবেদন করার আগে অনুগ্রহ করে সংশ্লিষ্ট সরকারি বোর্ডের অফিশিয়াল নোটিফিকেশন মিলিয়ে নেওয়ার জন্য বিশেষভাবে অনুরোধ করা হচ্ছে। তথ্যের কোনো অসঙ্গতি বা টাইপো জনিত ভুলের জন্য কর্তৃপক্ষ দায়ী থাকবে না।
              </p>

              <p>
                <strong>৩. মক টেস্ট ও ফলাফল:</strong> এখানে দেওয়া মক টেস্টের প্রশ্নসমূহ শুধুমাত্র শিক্ষার্থীদের অনুশীলনের উদ্দেশ্যে তৈরি করা হয়েছে। পরীক্ষায় এই প্রশ্নগুলো হুবহু আসবে এমন কোনো গ্যারান্টি আমরা প্রদান করি না।
              </p>
            </div>
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-2xl">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-white">শর্তাবলী (Terms & Conditions)</h3>
                <p className="text-[10.5px] text-slate-400 font-bold">WBMockTest.in ব্যবহারের আইনি শর্তসমূহ ও নিয়মাবলী</p>
              </div>
            </div>

            <div className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
              <p>
                আমাদের ওয়েবসাইটটি ব্রাউজ এবং ব্যবহার করে আপনি নিম্নোক্ত শর্তাবলী মেনে চলছেন বলে গণ্য হবে। আপনি যদি এই শর্তাবলীর কোনোটির সাথে একমত না হন, তবে দয়া করে সাইটটি ব্যবহার করা থেকে বিরত থাকুন।
              </p>
              
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider pt-2">১. মেধা সম্পত্তি ও কপিরাইট</h4>
              <p>
                WBMockTest.in পোর্টালে সংরক্ষিত মক টেস্টের সমস্ত প্রশ্ন, ডিজাইন, আর্টিকেলের লেখা, লোগো এবং কোড WBMockTest.in-এর নিজস্ব সম্পত্তি। কর্তৃপক্ষের লিখিত অনুমতি ছাড়া আমাদের কন্টেন্ট অন্য কোনো ওয়েবসাইট, বাণিজ্যিক অ্যাপ বা ইউটিউব চ্যানেলে কপি বা হুবহু প্রকাশ করা সম্পূর্ণ নিষিদ্ধ এবং আইনত দণ্ডনীয় অপরাধ।
              </p>

              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider pt-2">২. ইউজার আচরণবিধি</h4>
              <p>
                ব্যবহারকারীগণ মক টেস্ট দিতে এবং সাধারণ শিক্ষার উদ্দেশ্যে সাইটটি ব্যবহার করতে পারবেন। সাইটে কোনো স্প্যামিং, ম্যালিসিয়াস কোড ইনজেকশন বা স্ক্র্যাপার বট দিয়ে ডাটা চুরির চেষ্টা করা হলে সংশ্লিষ্ট ইউজারের অ্যাকাউন্ট চিরতরে ব্যান করা হবে এবং প্রয়োজনে আইনি ব্যবস্থা নেওয়া হতে পারে।
              </p>

              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider pt-2">৩. পরিষেবার পরিবর্তন</h4>
              <p>
                আমরা পূর্ব ঘোষণা ছাড়াই পোর্টালে যেকোনো পরিবর্তন, পরিমার্জন বা সাময়িকভাবে কোনো সার্ভিস বন্ধ করার পূর্ণ অধিকার সংরক্ষণ করি।
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
