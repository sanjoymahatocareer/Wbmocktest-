// WBMockTest.in Content Strategy & SEO Optimization Data
// Generates structured content for the Homepage body to optimize search engine ranking (SEO)
// Focuses on key West Bengal competitive exams: WBCS, WBP Constable, KP, Primary TET, PSC Clerkship, and School Service Commission (SSC).

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: Array<{ label: string; value: string }>;
}

export interface ExamCategoryDescription {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  keywords: string[];
  totalTests: number;
  featuredQuestions: string[];
}

export interface SEOTextBlock {
  title: string;
  paragraphs: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface HomepageContent {
  hero: HeroContent;
  categories: ExamCategoryDescription[];
  seoSection: SEOTextBlock;
}

export const getHomepageContent = (): HomepageContent => {
  return {
    hero: {
      badge: "পশ্চিমবঙ্গের #১ সরকারি চাকরি প্রস্তুতি প্ল্যাটফর্ম 🏆",
      title: "আপনার স্বপ্নের সরকারি চাকরির প্রস্তুতিকে করুন আরও মজবুত ও আত্মবিশ্বাসী",
      subtitle: "WBMockTest.in-এ রয়েছে সম্পূর্ণ সিলেবাস ভিত্তিক লেটেস্ট মক টেস্ট সিরিজ, ফ্রি স্টাডি মেটেরিয়ালস এবং দৈনিক কারেন্ট অ্যাফেয়ার্স। ঘরে বসেই যেকোনো সময় যেকোনো ডিভাইস থেকে অংশ নিন এবং নিজের অগ্রগতি যাচাই করুন সম্পূর্ণ ফ্রিতে।",
      ctaPrimary: "ফ্রি মক টেস্ট শুরু করুন",
      ctaSecondary: "চাকরির খবর দেখুন",
      stats: [
        { value: "১,০০,০০০+", label: "সক্রিয় পরীক্ষার্থী" },
        { value: "৫০০+", label: "ফ্রি মক টেস্ট সেট" },
        { value: "৯৮.৫%", label: "সফলতার হার" },
        { value: "১০,০০০+", label: "গুরুত্বপূর্ণ প্রশ্নোত্তর" }
      ]
    },
    categories: [
      {
        id: "wbcs",
        name: "WBCS Exam Preparation",
        banglaName: "ডব্লিউ.বি.সি.এস (WBCS)",
        slug: "wbcs",
        shortDesc: "পশ্চিমবঙ্গ সিভিল সার্ভিস পরীক্ষার প্রিলিমিনারি ও মেইনস পরীক্ষার স্পেশাল অনলাইন মক টেস্ট সিরিজ।",
        longDesc: "পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন (WBPSC) দ্বারা পরিচালিত সিভিল সার্ভিস (WBCS) পরীক্ষার প্রস্তুতিকে সম্পূর্ণ করতে আমাদের এই স্পেশাল মক টেস্ট ক্যাটাগরি। এখানে রয়েছে ইতিহাস, ভূগোল, ভারতীয় সংবিধান ও অর্থনীতি, ইংরেজি, গণিত ও জেনারেল ইন্টেলিজেন্সের সিলেবাস ভিত্তিক অধ্যায় অনুযায়ী এবং সম্পূর্ণ প্রিলিমিনারি সিলেবাস ভিত্তিক ১৫০টি উচ্চমানের প্র্যাকটিস সেট। প্রতিটি প্রশ্নের রয়েছে বিস্তারিত বিশ্লেষণ যা আপনাকে ধারণাগত স্বচ্ছতা দিতে সাহায্য করবে।",
        keywords: ["WBCS mock test", "WBPSC preliminary practice set", "WBCS previous year solved papers bangla", "WBCS study material pdf"],
        totalTests: 120,
        featuredQuestions: [
          "ভারতের জাতীয় কংগ্রেসের প্রথম অধিবেশন কোথায় বসেছিল?",
          "পশ্চিমবঙ্গের কোন জেলাকে উত্তর-পূর্ব ভারতের প্রবেশদ্বার বলা হয়?",
          "সংবিধানের কোন ধারা অনুযায়ী আর্থিক জরুরি অবস্থা জারি করা যায়?"
        ]
      },
      {
        id: "wbp_kp",
        name: "WBP & KP Police",
        banglaName: "পুলিশ রিক্রুটমেন্ট (WBP & KP)",
        slug: "police-recruitment",
        shortDesc: "পশ্চিমবঙ্গ পুলিশ ও কলকাতা পুলিশ কনস্টেবল, এসআই পরীক্ষার জন্য সম্পূর্ণ কমনযোগ্য প্র্যাকটিস সেট।",
        longDesc: "West Bengal Police (WBP) এবং Kolkata Police (KP) কনস্টেবল, লেডি কনস্টেবল ও সাব-ইন্সপেক্টর (SI) পরীক্ষার প্রিলিমিনারি ও মেইনস পরীক্ষার জন্য বিশেষভাবে প্রস্তুত করা মক টেস্ট সিরিজ। জেনারেল নলেজ, বিজ্ঞান, গণিত ও জিআই বিষয়ের উপর সাম্প্রতিক পরীক্ষার ট্রেন্ড ও সিলেবাস বিশ্লেষণ করে প্রশ্নগুলো নির্বাচন করা হয়েছে। নেগেটিভ মার্কিং সহ রিয়েল-টাইম ইন্টারফেসে পরীক্ষা দেওয়ার মাধ্যমে টাইম ম্যানেজমেন্ট আরও উন্নত করুন।",
        keywords: ["WBP Constable mock test in bangla", "KP SI practice paper online", "Kolkata Police constable syllabus", "West Bengal police model question PDF"],
        totalTests: 180,
        featuredQuestions: [
          "সোনার কেল্লা চলচ্চিত্রের পরিচালক কে ছিলেন?",
          "মানবদেহের সবচেয়ে বড় গ্রন্থি কোনটি?",
          "ভারতের প্রথম লোকপাল কে নিযুক্ত হন?"
        ]
      },
      {
        id: "psc_clerkship",
        name: "PSC Clerkship & Miscellaneous",
        banglaName: "পিএসসি ক্লার্কশিপ ও বিবিধ (PSC)",
        slug: "psc-clerkship",
        shortDesc: "WBPSC ক্লার্কশিপ, ফুড এসআই এবং বিবিধ সার্ভিসেস পরীক্ষার সাজেস্টিভ ফ্রি মক টেস্ট পোর্টাল।",
        longDesc: "পশ্চিমবঙ্গ পাবলিক সার্ভিস কমিশন কর্তৃক আয়োজিত ফুড এসআই (Food SI), ক্লার্কশিপ (Clerkship) এবং মিসলেনিয়াস পরীক্ষার জন্য অত্যন্ত গুরুত্বপূর্ণ প্রশ্নোত্তর ও ফুল লেংথ মক টেস্ট প্র্যাকটিস করুন। পাটিগণিত, ইংরেজি এবং সাধারণ জ্ঞান বিষয়ের খুঁটিনাটি সহ প্রতিটি বিষয়ের উত্তর বিস্তারিত ব্যাখ্যা করা হয়েছে যাতে কোনো অতিরিক্ত সহায়িকা ছাড়াই আপনি আপনার দুর্বল স্থানগুলো সংশোধন করতে পারেন।",
        keywords: ["WBPSC Food SI mock test free", "PSC Clerkship question paper", "WBPSC Miscellaneous model practice set", "WB clerkship online test series"],
        totalTests: 150,
        featuredQuestions: [
          "কোন নদীকে বাংলার দুঃখ বলা হয়?",
          "সবুজ বিপ্লব কোন ফসলের সঙ্গে সবচেয়ে বেশি যুক্ত?",
          "ইউনেস্কো (UNESCO)-এর সদর দপ্তর কোথায় অবস্থিত?"
        ]
      },
      {
        id: "tet",
        name: "Primary & Upper Primary TET",
        banglaName: "প্রাথমিক শিক্ষক নিয়োগ (TET)",
        slug: "primary-tet",
        shortDesc: "পশ্চিমবঙ্গ প্রাইমারি ও আপার প্রাইমারি টেট পরীক্ষার শিশু মনস্তত্ত্ব, ইভিএস ও পেডাগজি ভিত্তিক মক টেস্ট।",
        longDesc: "পশ্চিমবঙ্গ প্রাথমিক শিক্ষা পর্ষদ (WBBPE) দ্বারা পরিচালিত প্রাইমারি টেট (Primary TET) পরীক্ষার সর্বশেষ পেডাগজি (Pedagogy) ও সিলেবাস অনুযায়ী তৈরি করা আকর্ষণীয় পরীক্ষা সিরিজ। শিশু বিকাশ ও শিক্ষণ বিজ্ঞান (Child Development and Pedagogy), প্রথম ভাষা বাংলা, দ্বিতীয় ভাষা ইংরেজি, গণিত ও পরিবেশ বিদ্যা (EVS) বিষয়ের উপর সম্পূর্ণ নির্ভরযোগ্য সেট। পেডাগজির জটিল প্রশ্নের সহজ ব্যাখ্যা ও ধারণা নিয়ে ডিজাইন করা বিশেষ প্র্যাকটিস সেটগুলো টেট কোয়ালিফাই করতে আপনার আত্মবিশ্বাস বাড়াবে।",
        keywords: ["WB Primary TET mock test in bengali", "TET pedagogy practice questions", "Primary tet EVS syllabus pdf", "WB TET previous year question online"],
        totalTests: 95,
        featuredQuestions: [
          "স্কিমা (Schema) ধারণার প্রবক্তা কে?",
          "পরিবেশের কোন স্তরে ওজোন গ্যাসের স্তর দেখতে পাওয়া যায়?",
          "বাংলা ব্যাকরণের 'উপমান' এবং 'উপমিত' কর্মধারয় সমাসের মূল পার্থক্য কী?"
        ]
      }
    ],
    seoSection: {
      title: "কেন WBMockTest.in পশ্চিমবঙ্গের সেরা সরকারি চাকরি পরীক্ষার প্রস্তুতি গাইড?",
      paragraphs: [
        "পশ্চিমবঙ্গে সরকারি চাকরির পরীক্ষা দিন দিন অত্যন্ত প্রতিযোগিতাপূর্ণ হয়ে উঠেছে। সঠিক সময়ে সঠিক সিলেবাস অনুসরণ করা এবং নিয়মিত নিজের প্রস্তুতি যাচাই করার কোনো বিকল্প নেই। WBMockTest.in একটি ডেডিকেটেড অনলাইন এডুটেক প্ল্যাটফর্ম যা তৈরি করা হয়েছে বাংলা মাধ্যমে শিক্ষার্থীদের সম্পূর্ণ বিনামূল্যে উন্নতমানের শিক্ষা উপকরণ এবং মক টেস্ট প্রদান করার লক্ষ্যে।",
        "আমাদের ড্যাশবোর্ডে আপনি পাবেন WBCS, West Bengal Police (WBP), Kolkata Police (KP), WBPSC Clerkship, Miscellaneous, Food SI, Primary TET সহ সমস্ত রাজ্য সরকারি এবং স্কুল সার্ভিস কমিশন (SSC) গ্রুপ সি ও ডি পরীক্ষার সম্পূর্ণ সিলেবাস ভিত্তিক প্রশ্নপত্র। প্রতিটি প্রশ্ন বিষয়ভিত্তিক বিশেষজ্ঞদের দ্বারা কঠোরভাবে পরীক্ষিত এবং সিলেবাস ফ্রেমওয়ার্ক অনুযায়ী অত্যন্ত যত্ন সহকারে প্রস্তুত করা হয়েছে।",
        "আমাদের মক টেস্ট ইন্টারফেসটি সম্পূর্ণ বাস্তব পরীক্ষার মতো (Real Exam Simulation) ডিজাইন করা হয়েছে, যা পরীক্ষার হলের ভীতি কাটাতে এবং দ্রুত সময়ের মধ্যে নির্ভুলভাবে উত্তর দেওয়ার দক্ষতা বাড়াতে অত্যন্ত সাহায্য করে। বিস্তারিত সমাধান বিশ্লেষণ এবং ইনস্ট্যান্ট রেজাল্ট কার্ডের মাধ্যমে আপনি খুব সহজেই আপনার শক্তিশালী এবং দুর্বল ক্ষেত্রগুলি চিহ্নিত করতে পারবেন।"
      ],
      faqs: [
        {
          question: "এই মক টেস্টগুলো কি সম্পূর্ণ বিনামূল্যে দেওয়া যাবে?",
          answer: "হ্যাঁ, WBMockTest.in প্ল্যাটফর্মের বেশিরভাগ মক টেস্ট এবং স্টাডি মেটেরিয়ালস সম্পূর্ণ বিনামূল্যে শিক্ষার্থীদের জন্য উন্মুক্ত রাখা হয়েছে। কোনো গোপন চার্জ ছাড়াই আপনি যেকোনো সময় প্র্যাকটিস শুরু করতে পারেন।"
        },
        {
          question: "এখানে কি বিগত বছরের সরকারি চাকরির পরীক্ষার প্রশ্ন সমাধান সহ পাওয়া যায়?",
          answer: "হ্যাঁ! আমাদের স্পেশাল আর্কাইভ এবং টেস্ট ক্যাটাগরিতে বিগত ৫ থেকে ১০ বছরের সমস্ত গুরুত্বপূর্ণ পশ্চিমবঙ্গ সরকারি চাকরির পরীক্ষার সমাধান এবং বিস্তারিত ব্যাখ্যা সহ প্রশ্নপত্র মক টেস্ট আকারে উপলব্ধ রয়েছে।"
        },
        {
          question: "মোবাইল এবং কম্পিউটার উভয় ডিভাইস থেকেই কি টেস্ট দেওয়া সম্ভব?",
          answer: "অবশ্যই। আমাদের ওয়েবসাইটটি শতভাগ রেসপন্সিভ এবং মোবাইল-ফ্রেন্ডলি ডিজাইনে তৈরি করা হয়েছে। আপনি চাইলে স্মার্টফোন, ট্যাবলেট অথবা ল্যাপটপ থেকে কোনো রকম ঝামেলা ছাড়াই পরীক্ষা দিতে পারবেন।"
        },
        {
          question: "কারেন্ট অ্যাফেয়ার্স (Current Affairs) কীভাবে আপডেট করা হয়?",
          answer: "আমরা দৈনিক ও সাপ্তাহিক ভিত্তিতে পশ্চিমবঙ্গ ও ভারতের জাতীয় ও আন্তর্জাতিক গুরুত্বপূর্ণ ঘটনাবলী নিয়ে সাজানো কারেন্ট অ্যাফেয়ার্স আপডেট করি যা বিশেষ করে রাজ্য সরকারি চাকরিগুলোতে অত্যন্ত সাহায্য করে।"
        }
      ]
    }
  };
};
