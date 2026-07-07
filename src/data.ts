import { MockTest, ExamCategory, JobNotification, SuccessStory, Question } from './types';

export const examCategories: ExamCategory[] = [
  { id: 'police', name: 'WB Police', bengaliName: 'পুলিশ চাকরি', iconName: 'ShieldAlert', subtitle: 'WB Police, Kolkata Police, SI, Constable', emoji: '🔴', gradientClass: 'from-red-500/10 via-red-600/5 to-rose-600/10 border-red-500/25 text-red-500 dark:text-red-400' },
  { id: 'groupd', name: 'Group D', bengaliName: 'গ্রুপ D চাকরি', iconName: 'Briefcase', subtitle: 'Group D, Support Staff', emoji: '🟢', gradientClass: 'from-emerald-500/10 via-emerald-600/5 to-green-600/10 border-emerald-500/25 text-emerald-500 dark:text-emerald-400' },
  { id: 'clerkship', name: 'Clerkship', bengaliName: 'ক্লার্কশিপ', iconName: 'FileText', subtitle: 'Clerk, LDC, Office Assistant', emoji: '🟣', gradientClass: 'from-purple-500/10 via-purple-600/5 to-fuchsia-600/10 border-purple-500/25 text-purple-500 dark:text-purple-400' },
  { id: 'railway', name: 'Railway Group D', bengaliName: 'রেলওয়ে চাকরি', iconName: 'Train', subtitle: 'RRB, NTPC, Group D', emoji: '🟠', gradientClass: 'from-amber-500/10 via-amber-600/5 to-orange-600/10 border-amber-500/25 text-amber-500 dark:text-amber-400' },
  { id: 'bank', name: 'Bank Jobs', bengaliName: 'ব্যাংক চাকরি', iconName: 'Coins', subtitle: 'SBI, IBPS, RBI', emoji: '🟡', gradientClass: 'from-yellow-500/10 via-yellow-600/5 to-amber-600/10 border-yellow-500/25 text-yellow-500 dark:text-yellow-400' },
  { id: 'school', name: 'School Jobs', bengaliName: 'স্কুল চাকরি', iconName: 'GraduationCap', subtitle: 'Primary, Upper Primary, Teacher', emoji: '🔷', gradientClass: 'from-sky-500/10 via-sky-600/5 to-blue-600/10 border-sky-500/25 text-sky-500 dark:text-sky-455' },
  { id: 'health', name: 'Health Department', bengaliName: 'স্বাস্থ্য বিভাগ', iconName: 'Activity', subtitle: 'ANM, GNM, Staff Nurse', emoji: '🟤', gradientClass: 'from-amber-600/10 via-amber-700/5 to-amber-900/10 border-amber-600/25 text-amber-600 dark:text-amber-400' },
  { id: 'foodsi', name: 'Food SI', bengaliName: 'ফুড SI', iconName: 'Utensils', subtitle: 'Food Sub Inspector', emoji: '🔵', gradientClass: 'from-cyan-500/10 via-cyan-600/5 to-blue-600/10 border-cyan-500/25 text-cyan-500 dark:text-cyan-400' },
  { id: 'miscellaneous', name: 'Miscellaneous', bengaliName: 'মিসলেনিয়াস সার্ভিস', iconName: 'Layers', subtitle: 'WBPSC Miscellaneous', emoji: '🟢', gradientClass: 'from-teal-500/10 via-teal-600/5 to-emerald-600/10 border-teal-500/25 text-teal-500 dark:text-teal-400' },
  { id: 'wbcs', name: 'WBCS', bengaliName: 'WBCS', iconName: 'Award', subtitle: 'Civil Service Preparation', emoji: '🟠', gradientClass: 'from-orange-500/10 via-orange-600/5 to-amber-600/10 border-orange-500/25 text-orange-500 dark:text-orange-400' },
  { id: 'kmc', name: 'KMC Recruitment', bengaliName: 'কলকাতা মিউনিসিপ্যাল', iconName: 'Building', subtitle: 'KMC Recruitment', emoji: '🔴', gradientClass: 'from-pink-500/10 via-pink-600/5 to-rose-600/10 border-pink-500/25 text-pink-500 dark:text-pink-400' },
  { id: 'electricity', name: 'Electricity Department', bengaliName: 'বিদ্যুৎ বিভাগ', iconName: 'Zap', subtitle: 'WBSEDCL, Electricity Jobs', emoji: '🟣', gradientClass: 'from-indigo-500/10 via-indigo-600/5 to-violet-600/10 border-indigo-500/25 text-indigo-500 dark:text-indigo-400' },
  { id: 'court', name: 'Court Jobs', bengaliName: 'কোর্ট চাকরি', iconName: 'Scale', subtitle: 'High Court, District Court', emoji: '🟡', gradientClass: 'from-yellow-450/10 via-yellow-500/5 to-amber-600/10 border-yellow-450/25 text-yellow-600 dark:text-yellow-400' },
  { id: 'defense', name: 'Defense Jobs', bengaliName: 'ডিফেন্স চাকরি', iconName: 'ShieldAlert', subtitle: 'Army, Navy, Air Force', emoji: '🟢', gradientClass: 'from-green-500/10 via-green-600/5 to-emerald-600/10 border-green-500/25 text-green-500 dark:text-green-400' },
  { id: 'central', name: 'Central Govt Jobs', bengaliName: 'কেন্দ্রীয় সরকারি চাকরি', iconName: 'Flag', subtitle: 'SSC, UPSC, CGL, CHSL', emoji: '🔵', gradientClass: 'from-blue-600/10 via-blue-700/5 to-indigo-700/10 border-blue-600/25 text-blue-600 dark:text-blue-400' }
];

export const questionsPanchayat: Question[] = [
  {
    id: 'p1',
    questionText: 'পশ্চিমবঙ্গে পঞ্চায়েত আইন কত সালে পাস হয়?',
    options: ['১৯৭৩ সালে', '১৯৭৮ সালে', '১৯৮৫ সালে', '১৯৯০ সালে'],
    correctOptionIndex: 0,
    subject: 'সাধারণ জ্ঞান',
    explanation: '১৯৭৩ সালের পশ্চিমবঙ্গ পঞ্চায়েত আইনের মাধ্যমে ত্রিস্তর পঞ্চায়েত ব্যবস্থা চালু করা হয় এবং প্রথম নির্বাচন হয় ১৯৭৮ সালে।'
  },
  {
    id: 'p2',
    questionText: 'পঞ্চায়েত ব্যবস্থার সর্বনিম্ন স্তর কোনটি?',
    options: ['জেলা পরিষদ', 'পঞ্চায়েত সমিতি', 'গ্রাম পঞ্চায়েত', 'গ্রাম সভা'],
    correctOptionIndex: 2,
    subject: 'রাষ্ট্রবিজ্ঞান',
    explanation: 'ত্রিস্তর পঞ্চায়েত ব্যবস্থার সর্বনিম্ন স্তর হল গ্রাম পঞ্চায়েত, মাঝের স্তর পঞ্চায়েত সমিতি এবং সর্বোচ্চ স্তর জেলা পরিষদ।'
  },
  {
    id: 'p3',
    questionText: 'সংবিধানের কততম সংশোধনীর মাধ্যমে পঞ্চায়েতি রাজকে সাংবিধানিক স্বীকৃতি দেওয়া হয়?',
    options: ['৬৪তম', '৭৩তম', '৭৪তম', '৪২তম'],
    correctOptionIndex: 1,
    subject: 'রাষ্ট্রবিজ্ঞান',
    explanation: '১৯৯২ সালের ৭৩তম সংবিধান সংশোধনীর মাধ্যমে পঞ্চায়েতি রাজ ব্যবস্থাকে সাংবিধানিক স্বীকৃতি দেওয়া হয়।'
  },
  {
    id: 'p4',
    questionText: 'গ্রাম পঞ্চায়েতের সদস্যদের কার্যকালের মেয়াদ কত বছর?',
    options: ['৩ বছর', '৪ বছর', '৫ বছর', '৬ বছর'],
    correctOptionIndex: 2,
    subject: 'রাষ্ট্রবিজ্ঞান',
    explanation: 'গ্রাম পঞ্চায়েতের সদস্যদের সাধারণ কার্যকালের মেয়াদ ৫ বছর।'
  },
  {
    id: 'p5',
    questionText: 'পশ্চিমবঙ্গের পঞ্চায়েত ব্যবস্থায় মহিলাদের জন্য কত শতাংশ আসন সংরক্ষিত থাকে?',
    options: ['৩৩%', '৫০%', '৪০%', '২৫%'],
    correctOptionIndex: 1,
    subject: 'সাধারণ জ্ঞান',
    explanation: 'পশ্চিমবঙ্গে পঞ্চায়েতের প্রতিটি স্তরে মহিলাদের জন্য শতকরা ৫০ ভাগ আসন সংরক্ষিত থাকে।'
  }
];

export const questionsGroupD: Question[] = [
  {
    id: 'gd1',
    questionText: 'বায়ুমণ্ডলের কোন স্তরে উল্কাপিন্ড পুড়ে ছাই হয়ে যায়?',
    options: ['ট্রপোস্ফিয়ার', 'মেসোস্ফিয়ার', 'স্ট্র্যাটোস্ফিয়ার', 'থার্মোস্ফিয়ার'],
    correctOptionIndex: 1,
    subject: 'ভূগোল',
    explanation: 'মেসোস্ফিয়ারে বায়ু অত্যন্ত ঠান্ডা থাকে এবং এই স্তরে ধেয়ে আসা উল্কাপিন্ড ঘর্ষণে পুড়ে ছাই হয়।'
  },
  {
    id: 'gd2',
    questionText: 'কোন তরল ধাতুর ঘনত্ব সবচেয়ে বেশি?',
    options: ['পারদ', 'গ্যালিয়াম', 'সোডিয়াম', 'লিথিয়াম'],
    correctOptionIndex: 0,
    subject: 'ভৌত বিজ্ঞান',
    explanation: 'পারদ (Mercury) ঘরের তাপমাত্রায় তরল এবং এটি অত্যন্ত ঘন ধাতু (ঘনত্ব প্রায় ১৩.৬ গ্রাম/সেমি³)।'
  },
  {
    id: 'gd3',
    questionText: 'একটি আয়তক্ষেত্রের দৈর্ঘ্য ২০% বৃদ্ধি এবং প্রস্থ ১০% হ্রাস পেলে ক্ষেত্রফলের কী পরিবর্তন হবে?',
    options: ['১০% বৃদ্ধি', '৮% বৃদ্ধি', '১০% হ্রাস', '১২% বৃদ্ধি'],
    correctOptionIndex: 1,
    subject: 'গণিত',
    explanation: 'শর্টকাট সূত্র: x + y + xy/100 = 20 - 10 + (20 * -10)/100 = 10 - 2 = 8% বৃদ্ধি।'
  },
  {
    id: 'gd4',
    questionText: 'মানবদেহের কোন গ্রন্থিকে ‘মাস্টার গ্ল্যান্ড’ বা ‘প্রভু গ্রন্থি’ বলা হয়?',
    options: ['থাইরয়েড', 'অ্যাড্রেনাল', 'পিটুইটারি', 'অগ্ন্যাশয়'],
    correctOptionIndex: 2,
    subject: 'জীবন বিজ্ঞান',
    explanation: 'পিটুইটারি গ্রন্থি থেকে ক্ষরিত হরমোন অন্যান্য অনেক গ্রন্থির কাজ নিয়ন্ত্রণ করে বলে একে মাস্টার গ্ল্যান্ড বলে।'
  },
  {
    id: 'gd5',
    questionText: '‘গীতগোবিন্দ’ কাব্যের রচয়িতা জয়দেব কোন রাজার সভাকবি ছিলেন?',
    options: ['লক্ষণ সেন', 'ধর্মপাল', 'বল্লাল সেন', 'শশাঙ্ক'],
    correctOptionIndex: 0,
    subject: 'ইতিহাস',
    explanation: 'কবি জয়দেব সেন বংশের শেষ শক্তিশালী শাসক রাজা লক্ষণ সেনের পঞ্চরত্নের একজন অন্যতম কবি ছিলেন।'
  }
];

export const questionsClerkship: Question[] = [
  {
    id: 'c1',
    questionText: 'ভারতের সংবিধানের কোন ধারাটি আইনের চোখে সকলের সমতার কথা বলে?',
    options: ['১৪ নম্বর ধারা', '১৫ নম্বর ধারা', '১৬ নম্বর ধারা', '১৭ নম্বর ধারা'],
    correctOptionIndex: 0,
    subject: 'রাষ্ট্রবিজ্ঞান',
    explanation: 'ভারতের সংবিধানের ১৪ নম্বর ধারা দেশের অভ্যন্তরে সকলের আইনের চোখে সমতা এবং সুরক্ষার নিশ্চয়তা দেয়।'
  },
  {
    id: 'c2',
    questionText: '‘কাগজের নৌকা’ বাগধারাটির সঠিক অর্থ কী?',
    options: ['খেলাধুলা', 'ক্ষণভঙ্গুর বস্তু', 'অসহায় অবস্থা', 'অসম্ভব কল্পনা'],
    correctOptionIndex: 1,
    subject: 'বাংলা ব্যাকরণ',
    explanation: 'বাংলা ব্যাকরণে কাগজের নৌকা বোঝাতে অত্যন্ত দুর্বল বা ক্ষণভঙ্গুর কোন বস্তু বোঝানো হয়।'
  },
  {
    id: 'c3',
    questionText: 'নিচের কোনটি একটি virusঘটিত রোগ নয়?',
    options: ['ডেঙ্গু', 'ইনফ্লুয়েঞ্জা', 'কলেরা', 'জলবসন্ত'],
    correctOptionIndex: 2,
    subject: 'জীবন বিজ্ঞান',
    explanation: 'কলেরা ভিব্রিও কলেরি নামক ব্যাকটেরিয়ার কারণে ঘটিত একটি মারাত্মক সংক্রামক রোগ।'
  },
  {
    id: 'c4',
    questionText: '১০% সরল সুদে কত বছরে কোনো আসল তিন গুণ হবে?',
    options: ['১০ বছর', '১৫ বছর', '২০ বছর', '২৫ বছর'],
    correctOptionIndex: 2,
    subject: 'গণিত',
    explanation: 'আসল P টাকা হলে তিনগুণ মানে সুদ ২P টাকা। সূত্র: I = PRT/100 => 2P = P * 10 * T/100 => 2 = T/10 => T = ২০ বছর।'
  }
];

export const questionsPolice: Question[] = [
  {
    id: 'pol1',
    questionText: 'কলকাতা পুলিশের প্রথম পুলিশ কমিশনার কে ছিলেন?',
    options: ['ডব্লিউ জে রিডলে', 'এস ওয়াটস', 'স্যার এস সি ফিলিপস', 'স্যার জন এলিয়ট'],
    correctOptionIndex: 0,
    subject: 'সাধারণ জ্ঞান',
    explanation: '১৮৫৬ সালে কলকাতা পুলিশ কমিশনার পদের সূচনা হয় এবং প্রথম কমিশনার ছিলেন ডব্লিউ জে রিডলে।'
  },
  {
    id: 'pol2',
    questionText: 'একটি চাকার ব্যাসার্ধ ১৪ সেমি হলে, চাকাটি ১০০ বার ঘুরলে কত দূরত্ব অতিক্রম করবে?',
    options: ['৮৮ মিটার', '১২০ মিটার', '৪৪ মিটার', '১৭৬ মিটার'],
    correctOptionIndex: 0,
    subject: 'গণিত',
    explanation: 'চাকার পরিধি = 2 * (22/7) * 14 = 88 সেমি। ১০০ বার ঘুরলে দূরত্ব = ১০০ * ৮৮ সেমি = ৮৮০০ সেমি = ৮৮ মিটার।'
  }
];

export const questionsRailway: Question[] = [
  {
    id: 'rail1',
    questionText: 'ভারতের দ্রুততম ট্রেন কোনটি (বর্তমানে সর্বাধিক গতিসম্পন্ন)?',
    options: ['রাজধানী এক্সপ্রেস', 'বন্দে ভারত এক্সপ্রেস', 'শতাব্দী এক্সপ্রেস', 'দুরন্ত এক্সপ্রেস'],
    correctOptionIndex: 1,
    subject: 'সাধারণ জ্ঞান',
    explanation: 'বন্দে ভারত এক্সপ্রেস (Train 18) হল সেমি-হাইস্পিড ট্রেন যা ভারতের দ্রুততম ট্রেনের তকমা পেয়েছে।'
  }
];

export const questionsBank: Question[] = [
  {
    id: 'bank1',
    questionText: 'রিজার্ভ ব্যাঙ্ক অফ ইন্ডিয়ার বর্তমান গভর্নর কে?',
    options: ['রঘুরাম রাজন', 'উর্জিত প্যাটেল', 'শক্তিকান্ত দাস', 'নির্মলা সীতারামন'],
    correctOptionIndex: 2,
    subject: 'ব্যাংকিং এওয়ারনেস',
    explanation: 'শক্তিকান্ত দাস হলেন রিজার্ভ ব্যাঙ্কের ২৫তম গভর্নর।'
  }
];

export const questionsSchool: Question[] = [
  {
    id: 'sch1',
    questionText: 'শিশুর বিকাশ হল একটি -',
    options: ['গুণগত প্রক্রিয়া', 'পরিমাণগত প্রক্রিয়া', 'উভয়ই', 'কোনোটিই নয়'],
    correctOptionIndex: 2,
    subject: 'শিশু মনস্তত্ত্ব',
    explanation: 'শিশুর বিকাশ (Development) গুণগত ও পরিমাণগত উভয় প্রকার পরিবর্তনকেই নির্দেশ করে।'
  }
];

export const questionsHealth: Question[] = [
  {
    id: 'hlth1',
    questionText: 'মানবদেহের দীর্ঘতম হাড় কোনটি?',
    options: ['ফিমার (Femur)', 'টিবিয়া', 'হিউমেরাস', 'স্টেপিস'],
    correctOptionIndex: 0,
    subject: 'শারীরবৃত্ত',
    explanation: 'ফিমার হল মানবদেহের উরুতে অবস্থিত সবচেয়ে দীর্ঘ এবং শক্তিশালী হাড়।'
  }
];

export const questionsFoodSI: Question[] = [
  {
    id: 'food1',
    questionText: 'নিচের কোন ভিটামিনটি জলে দ্রবণীয়?',
    options: ['ভিটামিন A', 'ভিটামিন D', 'ভিটামিন C', 'ভিটামিন E'],
    correctOptionIndex: 2,
    subject: 'সাধারণ বিজ্ঞান',
    explanation: 'ভিটামিন B কমপ্লেক্স এবং ভিটামিন C জলে দ্রবণীয়, বাকি ভিটামিনগুলি ফ্যাটে দ্রবণীয়।'
  }
];

export const questionsMiscellaneous: Question[] = [
  {
    id: 'misc1',
    questionText: 'রবীন্দ্রনাথ ঠাকুর কত সালে সাহিত্যে নোবেল পুরস্কার পেয়েছিলেন?',
    options: ['১৯১১', '১৯১৩', '১৯১৫', '১৯১৯'],
    correctOptionIndex: 1,
    subject: 'সাহিত্য',
    explanation: '১৯১৩ সালে গীতাঞ্জলি কাব্যগ্রন্থের অনুবাদের জন্য রবীন্দ্রনাথ এশিয়ার প্রথম ব্যক্তি হিসেবে নোবেল পান।'
  }
];

export const questionsWBCS: Question[] = [
  {
    id: 'wbcs1',
    questionText: 'গদর পার্টি (Ghadar Party) কত সালে এবং কোথায় প্রতিষ্ঠিত হয়েছিল?',
    options: ['১৯১৩, সান ফ্রান্সিসকো', '১৯১৫, লন্ডন', '১৯০৭, প্যারিস', '১৯২০, টোকিও'],
    correctOptionIndex: 0,
    subject: 'ইতিহাস',
    explanation: '১৯১৩ সালে লালা হরদয়াল সান ফ্রান্সিসকোতে গদর পার্টি প্রতিষ্ঠা করেন।'
  }
];

export const questionsKMC: Question[] = [
  {
    id: 'kmc1',
    questionText: 'কলকাতা পুর কর্পোরেশনের (KMC) প্রথম মেয়র কে ছিলেন?',
    options: ['চিত্তরঞ্জন দাস', 'সুভাষচন্দ্র বসু', 'সুরেন্দ্রনাথ বন্দ্যোপাধ্যায়', 'বিধানচন্দ্র রায়'],
    correctOptionIndex: 0,
    subject: 'পৌর ইতিহাস',
    explanation: '১৯২৪ সালে দেশবন্ধু চিত্তরঞ্জন দাস কলকাতা কর্পোরেশনের প্রথম মেয়র নির্বাচিত হন।'
  }
];

export const questionsElectricity: Question[] = [
  {
    id: 'elec1',
    questionText: 'তড়িৎ প্রবাহমাত্রার এস আই (SI) এককটি কী?',
    options: ['ভোল্ট', 'ওহম', 'অ্যাম্পিয়ার', 'ওয়াট'],
    correctOptionIndex: 2,
    subject: 'পদার্থবিদ্যা',
    explanation: 'অ্যাম্পিয়ার (Ampere) হল ইন্টারন্যাশনাল সিস্টেম অব ইউনিটস (SI) এ তড়িৎ প্রবাহের একক।'
  }
];

export const questionsCourt: Question[] = [
  {
    id: 'crt1',
    questionText: 'কলকাতা হাইকোর্ট কত সালে প্রতিষ্ঠিত হয়েছিল?',
    options: ['১৮৬২', '১৮৭২', '১৮৮২', '১৮৯২'],
    correctOptionIndex: 0,
    subject: 'আইন ও বিচার',
    explanation: '১লা জুলাই ১৮৬২ সালে ভারতের প্রাচীনতম হাইকোর্ট হিসেবে কলকাতা হাইকোর্ট প্রতিষ্ঠিত হয়।'
  }
];

export const questionsDefense: Question[] = [
  {
    id: 'def1',
    questionText: 'ভারতের প্রথম প্রধান সেনাপতি (Commander-in-Chief) কে ছিলেন?',
    options: ['কে এম কারিয়াপ্পা', 'স্যাম মানেকশ', 'বিপিন রাওয়াত', 'রাজেন্দ্রসিংজী'],
    correctOptionIndex: 0,
    subject: 'ডিফেন্স',
    explanation: 'ফিল্ড মার্শাল কে এম কারিয়াপ্পা ১৯৪৯ সালে স্বাধীন ভারতের প্রথম প্রধান সেনাপতি হন।'
  }
];

export const questionsCentral: Question[] = [
  {
    id: 'cent1',
    questionText: 'আইন অমান্য আন্দোলন কত সালে শুরু হয়েছিল?',
    options: ['১৯২০', '১৯৩০', '১৯৪২', '১৯৪৬'],
    correctOptionIndex: 1,
    subject: 'ইতিহাস',
    explanation: '১৯৩০ সালে মহাত্মা গান্ধীর ডান্ডি অভিযানের মধ্য দিয়ে আইন অমান্য আন্দোলনের সূচনা হয়।'
  }
];

export const questionsFreeSpecial: Question[] = [
  {
    id: 'f-spec1',
    questionText: 'পশ্চিমবঙ্গের রাজ্য পশু কোনটি?',
    options: ['রয়েল বেঙ্গল টাইগার', 'মেছো বিড়াল (Fishing Cat)', 'হাতি', 'একশৃঙ্গ গণ্ডার'],
    correctOptionIndex: 1,
    subject: 'পশ্চিমবঙ্গ ভূগোল',
    explanation: 'পশ্চিমবঙ্গের রাজ্য পশু বা State Animal হল মেছো বিড়াল (Fishing Cat)।'
  },
  {
    id: 'f-spec2',
    questionText: 'বিশ্বের বৃহত্তম বদ্বীপ কোনটি?',
    options: ['সুন্দরবন বদ্বীপ', 'মাজুলি দ্বীপ', 'গ্রিনল্যান্ড', 'শ্রীলঙ্কা'],
    correctOptionIndex: 0,
    subject: 'ভূগোল',
    explanation: 'গঙ্গা ও ব্রহ্মপুত্র নদী দ্বারা গঠিত সুন্দরবন বদ্বীপ হল বিশ্বের বৃহত্তম বদ্বীপ।'
  },
  {
    id: 'f-spec3',
    questionText: 'পশ্চিমবঙ্গের দীর্ঘতম নদী কোনটি?',
    options: ['তিস্তা', 'রূপনারায়ণ', 'ভাগীরথী-হুগলী', 'দামোদর'],
    correctOptionIndex: 2,
    subject: 'পশ্চিমবঙ্গ ভূগোল',
    explanation: 'পশ্চিমবঙ্গের প্রধান ও দীর্ঘতম নদী হল ভাগীরথী-হুগলী নদী।'
  },
  {
    id: 'f-spec4',
    questionText: 'কোন শহরকে পশ্চিমবঙ্গের ‘প্রবেশদ্বার’ বলা হয়?',
    options: ['শিলিগুড়ি', 'কলকাতা', 'হলদিয়া', 'জলপাইগুড়ি'],
    correctOptionIndex: 1,
    subject: 'সাধারণ জ্ঞান',
    explanation: 'কলকাতা শহরকে পশ্চিমবঙ্গের প্রবেশদ্বার বা Gateway of West Bengal বলা হয়।'
  },
  {
    id: 'f-spec5',
    questionText: 'পশ্চিমবঙ্গের सुंदरবন অঞ্চলকে কত সালে ‘ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট’ ঘোষণা করা হয়?',
    options: ['১৯৭৩ সালে', '১৯৮৭ সালে', '১৯৮৯ সালে', '২০০১ সালে'],
    correctOptionIndex: 1,
    subject: 'সাধারণ জ্ঞান',
    explanation: '১৯৮৭ সালে সুন্দরবনকে ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট (UNESCO World Heritage Site) হিসেবে ঘোষণা করে।'
  }
];

export const questionsPremiumBooster: Question[] = [
  {
    id: 'p-boost1',
    questionText: 'একটি সংখ্যাকে ১১৯ দ্বারা ভাগ করলে ১৯ অবশিষ্টাংশ থাকে। সংখ্যাটিকে ১৭ দ্বারা ভাগ করলে কত অবশিষ্টাংশ থাকবে?',
    options: ['১', '২', '৩', '৪'],
    correctOptionIndex: 1,
    subject: 'গণিত (পাটিগণিত)',
    explanation: 'যেহেতু ১৭ দ্বারা ১১৯ বিভাজ্য (১৭ * ৭ = ১১৯), তাই কেবল ১৯-কে ১৭ দিয়ে ভাগ করলেই অবশিষ্টাংশ পাওয়া যাবে। ১৯ = ১৭ * ১ + ২। সুতরাং অবশিষ্টাংশ থাকবে ২।'
  },
  {
    id: 'p-boost2',
    questionText: 'কোন গুপ্ত সম্রাটকে ‘ভারতের নেপোলিয়ন’ বলা হয়?',
    options: ['প্রথম চন্দ্রগুপ্ত', 'সমুদ্রগুপ্ত', 'দ্বিতীয় চন্দ্রগুপ্ত', 'স্কন্দগুপ্ত'],
    correctOptionIndex: 1,
    subject: 'ইতিহাস',
    explanation: 'ঐতিহাসিক ভি. এ. স্মিথ গুপ্ত সম্রাট সমুদ্রগুপ্তের দিগ্বিজয় ও সামরিক দক্ষতার জন্য তাঁকে ‘ভারতের নেপোলিয়ন’ বলে অভিহিত করেছেন।'
  },
  {
    id: 'p-boost3',
    questionText: 'Choose the correct synonym for "RESOLUTE":',
    options: ['Undecided', 'Determined', 'Hesitant', 'Weak'],
    correctOptionIndex: 1,
    subject: 'English (Vocabulary)',
    explanation: 'Resolute শব্দের অর্থ দৃঢ়সংকল্প বা অবিচল। এর সমার্থক বা Synonym শব্দ হল Determined।'
  },
  {
    id: 'p-boost4',
    questionText: 'কোন নদীকে ‘পশ্চিমবঙ্গের দুঃখ’ (Sorrow of Bengal) বলা হয়?',
    options: ['তিস্তা', 'মহানন্দা', 'দামোদর', 'অজয়'],
    correctOptionIndex: 2,
    subject: 'পশ্চিমবঙ্গ ভূগোল',
    explanation: 'দামোদর নদীকে এককালে পশ্চিমবঙ্গের দুঃখ বলা হত কারণ প্রতি বছর এর বিধ্বংসী বন্যায় প্লাবিত হত।'
  },
  {
    id: 'p-boost5',
    questionText: 'নিচের সিরিজটির শূন্যস্থান পূরণ করুন: 3, 5, 9, 17, 33, ?',
    options: ['৪৫', '৫৫', '৬৫', '৫৭'],
    correctOptionIndex: 2,
    subject: 'Reasoning (Number Series)',
    explanation: 'প্যাটার্নটি হল: পূর্ববর্তী সংখ্যার দ্বিগুণ থেকে ১ বিয়োগ (3*2-1=5, 5*2-1=9, 9*2-1=17, 17*2-1=33, 33*2-1=65)। অথবা ব্যবধানগুলি হল: ২, ৪, ৮, ১৬, ৩২ (ব্যবধানগুলি দ্বিগুণ হচ্ছে)। ৩৩ + ৩২ = ৬৫।'
  }
];

export const mockTestsList: MockTest[] = [
  {
    id: 'test-free-spec',
    title: 'WB Police Special General Knowledge - Free Mock Test 02',
    bengaliTitle: 'WB পুলিশ স্পেশাল সাধারণ জ্ঞান - ফ্রী মক টেস্ট ০২',
    examType: 'police',
    examTypeBengali: 'পুলিশ চাকরি',
    totalQuestions: 5,
    totalMarks: 5,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: false,
    questions: questionsFreeSpecial
  },
  {
    id: 'test-premium-spec',
    title: 'WB Police SI & Warder Special - Premium Booster Mock 02',
    bengaliTitle: 'WB পুলিশ SI ও ওয়ার্ডার স্পেশাল - প্রিমিয়াম বুস্টার মক ০২',
    examType: 'police',
    examTypeBengali: 'পুলিশ চাকরি',
    totalQuestions: 5,
    totalMarks: 5,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsPremiumBooster
  },
  {
    id: 'test-1',
    title: 'West Bengal Panchayat Recruitment 2024 - Mock Test 01',
    bengaliTitle: 'পশ্চিমবঙ্গ পঞ্চায়েত নিয়োগ ২০২৪ - মক টেস্ট ০১',
    examType: 'panchayat',
    examTypeBengali: 'Panchayat Recruitment',
    totalQuestions: 5,
    totalMarks: 5,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: false,
    questions: questionsPanchayat
  },
  {
    id: 'test-2',
    title: 'WB Group D Mock Test - 01',
    bengaliTitle: 'WB গ্রুপ ডি মক টেস্ট - ০১',
    examType: 'groupd',
    examTypeBengali: 'Group D',
    totalQuestions: 5,
    totalMarks: 5,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsGroupD
  },
  {
    id: 'test-3',
    title: 'Clerkship Mock Test Series - 01',
    bengaliTitle: 'ক্লার্কশিপ মক টেস্ট সিরিজ - ০১',
    examType: 'clerkship',
    examTypeBengali: 'Clerkship',
    totalQuestions: 4,
    totalMarks: 4,
    durationMinutes: 4,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsClerkship
  },
  {
    id: 'test-police-1',
    title: 'WB Police Constable & SI Combined - Mock Test 01',
    bengaliTitle: 'WB পুলিশ কনস্টেবল ও SI স্পেশাল মক টেস্ট০১',
    examType: 'police',
    examTypeBengali: 'WB Police',
    totalQuestions: 2,
    totalMarks: 20,
    durationMinutes: 10,
    difficulty: 'মাঝারি',
    isPremium: false,
    questions: questionsPolice
  },
  {
    id: 'test-railway-1',
    title: 'Railway NTPC & Group D - Special Mock 01',
    bengaliTitle: 'রেলওয়ে NTPC এবং গ্রুপ ডি স্পেশাল মক ০১',
    examType: 'railway',
    examTypeBengali: 'Railway Group D',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: true,
    questions: questionsRailway
  },
  {
    id: 'test-bank-1',
    title: 'Banking SBI/IBPS Clerk Combined Mock 01',
    bengaliTitle: 'ব্যাংকিং SBI এবং IBPS ক্লার্ক মক ০১',
    examType: 'bank',
    examTypeBengali: 'Bank Jobs',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: true,
    questions: questionsBank
  },
  {
    id: 'test-school-1',
    title: 'WB Primary TET & School Service Mock - 01',
    bengaliTitle: 'প্রাইমারি TET ও স্কুল সার্ভিস মক টেস্ট ০১',
    examType: 'school',
    examTypeBengali: 'School Jobs',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsSchool
  },
  {
    id: 'test-health-1',
    title: 'Health Dept ANM & GNM Combined Mock 01',
    bengaliTitle: 'স্বাস্থ্য বিভাগ ANM ও GNM স্পেশাল মক ০১',
    examType: 'health',
    examTypeBengali: 'Health Department',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsHealth
  },
  {
    id: 'test-foodsi-1',
    title: 'WBPSC Food SI Mock Challenge - Test 01',
    bengaliTitle: 'ফুড SI বিশেষ মক টেস্ট সিরিজ ০১',
    examType: 'foodsi',
    examTypeBengali: 'Food SI',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: false,
    questions: questionsFoodSI
  },
  {
    id: 'test-misc-1',
    title: 'WBPSC Miscellaneous Mock Series - 01',
    bengaliTitle: 'মিসলেনিয়াস সার্বিস মক টেস্ট সিরিজ ০১',
    examType: 'miscellaneous',
    examTypeBengali: 'Miscellaneous',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: false,
    questions: questionsMiscellaneous
  },
  {
    id: 'test-wbcs-1',
    title: 'WBCS Civil Service Prelims Mock Drill - 01',
    bengaliTitle: 'WBCS সিভিল সার্ভিস প্রিলিমিনারি মক ০১',
    examType: 'wbcs',
    examTypeBengali: 'WBCS',
    totalQuestions: 1,
    totalMarks: 12,
    durationMinutes: 8,
    difficulty: 'কঠিন',
    isPremium: true,
    questions: questionsWBCS
  },
  {
    id: 'test-kmc-1',
    title: 'Kolkata Municipal Corporation KMC Mock Series',
    bengaliTitle: 'কলকাতা মিউনিসিপ্যাল KMC বিশেষ মক ০১',
    examType: 'kmc',
    examTypeBengali: 'KMC Recruitment',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: false,
    questions: questionsKMC
  },
  {
    id: 'test-electricity-1',
    title: 'WBSEDCL Electricity Department Tech Mock',
    bengaliTitle: 'বিদ্যুৎ বিভাগ WBSEDCL বিশেষ মক ০১',
    examType: 'electricity',
    examTypeBengali: 'Electricity Department',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsElectricity
  },
  {
    id: 'test-court-1',
    title: 'High Court & District Court Combined Mock 01',
    bengaliTitle: 'উচ্চ আদালত ও জেলা আদালত মক টেস্ট ০১',
    examType: 'court',
    examTypeBengali: 'Court Jobs',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'মাঝারি',
    isPremium: true,
    questions: questionsCourt
  },
  {
    id: 'test-defense-1',
    title: 'Indian Army/Navy/AirForce General Mock',
    bengaliTitle: 'ডিফেন্স আর্মি ও নেভি সাধারণ মক টেস্ট ০১',
    examType: 'defense',
    examTypeBengali: 'Defense Jobs',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'সহজ',
    isPremium: false,
    questions: questionsDefense
  },
  {
    id: 'test-central-1',
    title: 'Central Government SSC & UPSC Combined Mock',
    bengaliTitle: 'কেন্দ্রীয় সরকারি চাকরি SSC ও UPSC মক ০১',
    examType: 'central',
    examTypeBengali: 'Central Govt Jobs',
    totalQuestions: 1,
    totalMarks: 10,
    durationMinutes: 5,
    difficulty: 'কঠিন',
    isPremium: true,
    questions: questionsCentral
  }
];

export const jobNotifications: JobNotification[] = [
  {
    id: 'job-1',
    organization: 'WBSSC (পশ্চিমবঙ্গ কর্মী নির্বাচন কমিশন)',
    title: 'লোয়ার ডিভিশন ক্লার্ক (LDC) এবং অ্যাসিস্ট্যান্ট নিয়োগ ২০২৬',
    lastDate: '৩০ জুলাই, ২০২৬',
    logoColor: 'from-blue-500 to-indigo-600',
    isNew: true,
    applyUrl: 'https://wbssc.gov.in',
    syllabus: ['বাংলা ব্যাকরণ ও সাহিত্য', 'পাটিগণিত ও বীজগণিত', 'ইংলিশ গ্রামার', 'ইতিহাস, ভূগোল ও সাম্প্রতিক ঘটনা']
  },
  {
    id: 'job-2',
    organization: 'West Bengal Police Recruitment board (WBPRB)',
    title: 'ডিভিশনাল সাব-ইন্সপেক্টর ও কনস্টেবল পদে ১২,০০০ শূন্যপদ',
    lastDate: '১৫ আগস্ট, ২০২৬',
    logoColor: 'from-purple-500 to-pink-600',
    isNew: true,
    applyUrl: 'https://prb.wb.gov.in',
    syllabus: ['জেনারেল অ্যাওয়ারনেস', 'প্রাথমিক গণিত', 'রিজননিং (Reasoning)', 'শারীরিক দক্ষতা পরীক্ষা']
  },
  {
    id: 'job-3',
    organization: 'পশ্চিমবঙ্গ পঞ্চায়েত ও গ্রামোন্নয়ন দপ্তর',
    title: 'গ্রাম পঞ্চায়েত ও পঞ্চায়েত সমিতি স্তরে কর্মী নিয়োগ ২০২৬',
    lastDate: '০৫ সেপ্টেম্বর, ২০২৬',
    logoColor: 'from-emerald-500 to-teal-600',
    isNew: true,
    applyUrl: 'https://wbdprd.gov.in',
    syllabus: ['প্রশাসনিক জ্ঞান ও গ্রামীণ ভারতের ইতিহাস', 'পাটিগণিত', 'ইংরেজি ভাষা', 'বাংলা ভাষা']
  }
];

export const successStories: SuccessStory[] = [
  {
    id: 's1',
    name: 'Animesh Ghosh',
    bengaliName: 'অনিমেষ ঘোষ',
    examCleared: 'WBCS (Executive) - Rank 12',
    quote: 'WBMockTest মক টেস্ট আমাকে সঠিক টাইম ম্যানেজমেন্ট শিখিয়েছে। এর বিস্তারিত বাংলা বিশ্লেষণগুলি অসাধারণ!',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 's2',
    name: 'Priyanka Dey',
    bengaliName: 'প্রিয়াঙ্কা দে',
    examCleared: 'WB Primary TET 2024 - Qualified',
    quote: 'ফ্রি মক টেস্ট এবং সিলেবাস ধরে গাইড পাওয়ার জন্য WBMockTest ওয়েবসাইটের প্রতি কৃতজ্ঞ। দারুণ ইউজার ইন্টারফেস!',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 's3',
    name: 'Suman Mondal',
    bengaliName: 'সুমন মন্ডল',
    examCleared: 'WB Police SI - Selected',
    quote: 'চাকরির নোটিফিকেশন পাওয়ার সঙ্গে সঙ্গে মক টেস্ট সিরিজ দেওয়ার সুবিধা অন্য কোথাও পাইনি। সম্পূর্ণ সেরা EdTech ওয়েবসাইট!',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const syllabusData = [
  {
    exam: 'WB Panchayat Recruitment',
    title: 'পঞ্চায়েত সিলেবাস ও নম্বর বিভাজন',
    sections: [
      { subject: 'সাধারণ জ্ঞান (General Knowledge)', marks: '২০ নম্বর', description: 'ভারতের ইতিহাস, ভূগোল, পশ্চিমবঙ্গ সাধারণ জ্ঞান, কারেন্ট অ্যাফেয়ার্স' },
      { subject: 'পাটিগণিত (Arithmetic)', marks: '২৫ নম্বর', description: 'শতকরা, লাভ-ক্ষতি, অনুপাত-সহানুপাত, গড়, সরল সুদ' },
      { subject: 'ইংরেজি ভাষা (English Language)', marks: '২০ নম্বর', description: 'Grammar, Synonyms/Antonyms, Idioms, Correction' },
      { subject: 'বাংলা ভাষা (Bengali Language)', marks: '২০ নম্বর', description: 'বাংলা ব্যাকরণ, বাগধারা, সন্ধি বিচ্ছেদ, সমার্থক শব্দ' }
    ]
  },
  {
    exam: 'WB Police Constable',
    title: 'পুলিশ কনস্টেবল পরীক্ষার সিলেবাস',
    sections: [
      { subject: 'জেনারেল স্টাডিজ ও জিকে', marks: '২৫ নম্বর', description: 'বিজ্ঞান, ইতিহাস, রাষ্ট্রনীতি, খেলাধুলা, কারেন্ট অ্যাফেয়ার্স' },
      { subject: 'প্রাথমিক গণিত (মাধ্যমিক মান)', marks: '৩০ নম্বর', description: 'পাটিগণিত, পরিমিতি, প্রাথমিক ত্রিকোণমিতি' },
      { subject: 'রিজননিং এবং লজিক্যাল অ্যানালিসিস', marks: '২০ নম্বর', description: 'কোডিং-ডিকোডিং, রক্ত সম্পর্কীয় সমস্যা, পাজল' },
      { subject: 'ইংরেজি (English Grammar)', marks: '১০ নম্বর', description: 'Vocabulary, Grammar, Sentence structural analysis' }
    ]
  },
  {
    exam: 'WBPSC Clerkship',
    title: 'ক্লাকশিপ প্রিলিমিনারি সিলেবাস',
    sections: [
      { subject: 'ইংরেজি (English Language)', marks: '৩০ নম্বর', description: 'Vocabulary, Spelling mistakes, Voice/Narration changes' },
      { subject: 'সাধারণ জ্ঞান ও কারেন্ট অ্যাফেয়ার্স', marks: '৪০ নম্বর', description: 'ভারতের ভূগোল এবং অর্থনীতি, উল্লেখযোগ্য ইভেন্টসমূহ' },
      { subject: 'পাটিগণিত', marks: '৩০ নম্বর', description: 'লসাগু-গসাগু, সময় ও কার্য, নল ও চৌবাচ্চা, অংশীদারি কারবার' }
    ]
  }
];

export const questionBankData = [
  {
    subject: 'ইতিহাস (History)',
    bengaliSubject: 'ইতিহাস প্রশ্ন ব্যাংক',
    count: 2450,
    chapters: ['সিন্ধু সভ্যতা', 'বৈদিক যুগ', 'মৌর্য ও গুপ্ত সাম্রাজ্য', 'সুলতানি যুগ', 'মুঘল শাসন', 'ভারতের স্বাধীনতাসংগ্রাম']
  },
  {
    subject: 'ভূগোল (Geography)',
    bengaliSubject: 'ভূগোল প্রশ্ন ব্যাংক',
    count: 1800,
    chapters: ['পশ্চিমবঙ্গের ভূগোল', 'ভারতের ফিজিওগ্রাফি', 'নদ-নদী ও জলবায়ু', 'মৃত্তিকা ও বনভূমি', 'মহাকাশ ও সৌরজগৎ']
  },
  {
    subject: 'সংবিধান (Indian Polity)',
    bengaliSubject: 'রাষ্ট্রবিজ্ঞান প্রশ্ন ব্যাংক',
    count: 1250,
    chapters: ['মৌলিক অধিকার ও কর্তব্য', 'রাষ্ট্রপতি ও উপরাষ্ট্রপতি', 'লোকসভা ও রাজ্যসভা', 'পঞ্চায়েতি রাজ ব্যবস্থা']
  },
  {
    subject: 'পাটিগণিত (Mathematics)',
    bengaliSubject: 'পাটিগণিত প্রশ্ন ব্যাংক',
    count: 3100,
    chapters: ['অনুপাত ও সমানুপাত', 'শতকরা ও গড়', 'লাভ ও ক্ষতি', 'সরল ও চক্রবৃদ্ধি সুদ', 'সময়, দূরত্ব ও বেগ']
  }
];
