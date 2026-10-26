import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "bn" | "hi";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिन्दी" },
];

const KEY = "leafcheck.lang";

/** Short, simple strings only. Disease details stay in English for now. */
const EN = {
  brand: "Crop Guardian",
  navHome: "Check a leaf",
  navDashboard: "Dashboard",
  navWeather: "Weather & risk",
  navAdvisor: "Spray & water",
  navCare: "Care calendar",
  navOutbreaks: "Outbreak watch",
  navLibrary: "Knowledge",
  navFaq: "Help",
  navContact: "Contact",
  navAbout: "About us",
  menu: "Menu",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  system: "System",
  language: "Language",
  langNote: "Menus change language. Disease details stay in English for now.",
  heroTitle: "Is your leaf healthy?",
  heroText:
    "Take a photo of one leaf or a whole plant. We check the photo first, then show you what may be wrong and what to do.",
  step1: "Step 1",
  addPhoto: "Add a leaf photo",
  freeCheck: "Free check",
  dropHere: "Drop a photo here",
  dropHelp: "Or choose a file, take a photo, or paste with Ctrl + V.",
  choosePhoto: "Choose photo",
  useCamera: "Use camera",
  replacePhoto: "Replace photo",
  analyse: "Analyse leaf",
  analysing: "Checking the leaf...",
  photoQuality: "Photo quality",
  photoGood: "This photo looks good.",
  clearer: "Please upload a clearer photo.",
  tipsTitle: "Tips for a good photo",
  yourResult: "Your result",
  healthy: "Healthy",
  diseased: "Diseased",
  confidence: "Confidence",
  severity: "Severity",
  download: "Download report (PDF)",
  pastChecks: "Past checks",
  view: "View",
  report: "Report",
  delete: "Delete",
  search: "Search",
  noHistory: "No checks yet. Add a photo to start.",
  offline:
    "You are offline. Your scan has been saved and will be uploaded when you are back online.",
  backOnline: "You are back online.",
  weatherTitle: "Weather and disease risk",
  totalScans: "Total checks",
  healthyPlants: "Healthy leaves",
  diseasedPlants: "Sick leaves",
  todayScans: "Today",
  weekScans: "This week",
  commonDisease: "Most seen problem",
  avgConfidence: "Average confidence",
  diseasesDetected: "Diseases & pests",
  cropsSupported: "Crops supported",
  offlineReady: "Offline ready",
  multilingual: "Languages",
  demoData: "Demo data",
  voiceSearch: "Voice search",
  voiceListening: "Listening...",
  readAloud: "Read aloud",
  stopReading: "Stop reading",
  costEstimator: "Treatment cost & dosage",
  bigha: "Bigha (33 dec)",
  acre: "Acre (100 dec)",
  decimal: "Decimal / Shatak",
  phiSafety: "Pre-harvest interval (PHI)",
  reportSighting: "Report a sighting",
  judgeDemo: "Judge Demo Mode",
  simulateOffline: "Demo Offline UI Mode",
  tourStep: "Step",
  tourNext: "Next step",
  tourClose: "Exit tour",
  askAgronomist: "Ask an agronomist",
  callKrishi: "Call Krishi Helpline",
  shareWhatsApp: "Share on WhatsApp",
  // New keys for judge issues resolution
  "weather.cachedBanner": "⚠️ Showing cached weather. Connect to refresh.",
  "weather.offlineCard": "No weather data available offline.",
  "disclaimer.text":
    "⚠️ Crop Guardian provides educational information only. Always verify with a certified agronomist before applying treatments. Not liable for crop loss.",
  "judgeDemo.offlineUIMode": "Demo Offline UI Mode",
  "judgeDemo.offlineUINote":
    "Shows offline UI states. For true offline testing, use DevTools → Network → Offline.",
  "consent.locationLabel": "I consent to sharing my approximate location for this report.",
  "consent.locationNote": "GPS is only captured when this consent is enabled.",
  "pdf.banglaModeNote": "PDF exported as image (Bangla font mode).",
  "outbreaks.demoWarning":
    "⚠️ DEMO DATA — Risk percentages on this page are illustrative only. They are NOT live government surveillance data. Do not make field decisions based solely on these figures.",
  "onboarding.step1": "Take a photo of a sick leaf → get instant disease name",
  "onboarding.step2": "Check today's spray safety before spraying",
  "onboarding.step3": "Browse 100+ diseases — works offline",
  "onboarding.dismiss": "Got it",
};

type Dict = typeof EN;

const BN: Partial<Dict> = {
  brand: "ক্রপ গার্ডিয়ান",
  navHome: "পাতা পরীক্ষা",
  navDashboard: "ড্যাশবোর্ড",
  navWeather: "আবহাওয়া ও ঝুঁকি",
  navAdvisor: "স্প্রে ও সেচ",
  navCare: "যত্নের ক্যালেন্ডার",
  navOutbreaks: "রোগ ছড়ানোর সতর্কতা",
  navLibrary: "জ্ঞানকেন্দ্র",
  navFaq: "সাহায্য",
  navContact: "যোগাযোগ",
  navAbout: "আমাদের সম্পর্কে",
  menu: "মেনু",
  theme: "থিম",
  light: "উজ্জ্বল",
  dark: "অন্ধকার",
  system: "ফোনের সেটিং",
  language: "ভাষা",
  langNote: "মেনুর ভাষা বদলাবে। রোগের বিবরণ এখন ইংরেজিতে থাকবে।",
  heroTitle: "আপনার পাতা কি ভালো আছে?",
  heroText: "একটি পাতার ছবি তুলুন। আমরা আগে ছবি দেখি, তারপর সমস্যা ও করণীয় দেখাই।",
  step1: "ধাপ ১",
  addPhoto: "পাতার ছবি দিন",
  freeCheck: "ফ্রি পরীক্ষা",
  dropHere: "এখানে ছবি ছাড়ুন",
  dropHelp: "অথবা ফাইল বাছুন, ছবি তুলুন, বা Ctrl + V চাপুন।",
  choosePhoto: "ছবি বাছুন",
  useCamera: "ক্যামেরা",
  replacePhoto: "ছবি বদলান",
  analyse: "পাতা পরীক্ষা করুন",
  analysing: "পাতা দেখা হচ্ছে...",
  photoQuality: "ছবির মান",
  photoGood: "ছবিটি ভালো আছে।",
  clearer: "আরও পরিষ্কার ছবি দিন।",
  tipsTitle: "ভালো ছবির জন্য পরামর্শ",
  yourResult: "আপনার ফল",
  healthy: "সুস্থ",
  diseased: "রোগ আছে",
  confidence: "নিশ্চয়তা",
  severity: "মাত্রা",
  download: "রিপোর্ট নামান (PDF)",
  pastChecks: "আগের পরীক্ষা",
  view: "দেখুন",
  report: "রিপোর্ট",
  delete: "মুছুন",
  search: "খুঁজুন",
  noHistory: "এখনো কিছু নেই। একটি ছবি দিন।",
  offline: "আপনি অফলাইনে আছেন। আপনার স্ক্যান সেভ করা হয়েছে, ইন্টারনেট এলে আপলোড হবে।",
  backOnline: "ইন্টারনেট ফিরে এসেছে।",
  weatherTitle: "আবহাওয়া ও রোগের ঝুঁকি",
  totalScans: "মোট পরীক্ষা",
  healthyPlants: "সুস্থ পাতা",
  diseasedPlants: "রোগী পাতা",
  todayScans: "আজ",
  weekScans: "এই সপ্তাহে",
  commonDisease: "বেশি দেখা সমস্যা",
  avgConfidence: "গড় নিশ্চয়তা",
  diseasesDetected: "শনাক্তকৃত রোগ ও কীট",
  cropsSupported: "সমর্থিত ফসল",
  offlineReady: "অফলাইন প্রস্তুত",
  multilingual: "ভাষা",
  demoData: "ডেমো তথ্য",
  voiceSearch: "ভয়েস অনুসন্ধান",
  voiceListening: "শুনছি...",
  readAloud: "পড়ে শোনান",
  stopReading: "পড়া বন্ধ করুন",
  costEstimator: "চিকিৎসা খরচ ও মাত্রা",
  bigha: "বিঘা (৩৩ শতাংশ)",
  acre: "একর (১০০ শতাংশ)",
  decimal: "শতাংশ",
  phiSafety: "ফসল তোলার পূর্ববর্তী সুরক্ষা সময় (PHI)",
  reportSighting: "রোগের প্রাদুর্ভাব জানান",
  judgeDemo: "বিচারক ডেমো মোড",
  simulateOffline: "ডেমো অফলাইন ইউআই মোড",
  tourStep: "ধাপ",
  tourNext: "পরবর্তী ধাপ",
  tourClose: "ট্যুর বন্ধ করুন",
  askAgronomist: "কৃষি কর্মকর্তার পরামর্শ",
  callKrishi: "কৃষি কল সেন্টার (১৬১২৩)",
  shareWhatsApp: "হোয়াটসঅ্যাপে পাঠান",
  "weather.cachedBanner": "⚠️ সংরক্ষিত আবহাওয়া দেখানো হচ্ছে। রিফ্রেশ করতে সংযোগ করুন।",
  "weather.offlineCard": "অফলাইনে কোনো আবহাওয়া তথ্য নেই।",
  "disclaimer.text":
    "⚠️ ক্রপ গার্ডিয়ান শুধুমাত্র শিক্ষামূলক তথ্য প্রদান করে। চিকিৎসার পূর্বে সর্বদা প্রত্যয়িত কৃষিবিদের সাথে নিশ্চিত করুন। ফসল ক্ষতির জন্য দায়বদ্ধ নয়।",
  "judgeDemo.offlineUIMode": "ডেমো অফলাইন ইউআই মোড",
  "judgeDemo.offlineUINote":
    "অফলাইন ইউআই দেখায়। প্রকৃত অফলাইন পরীক্ষার জন্য DevTools → Network → Offline ব্যবহার করুন।",
  "consent.locationLabel": "আমি এই রিপোর্টের জন্য আমার আনুমানিক অবস্থান ভাগ করতে সম্মতি দিচ্ছি।",
  "consent.locationNote": "শুধুমাত্র এই সম্মতি সক্ষম থাকলেই জিপিএস গ্রহণ করা হয়।",
  "pdf.banglaModeNote": "পিডিএফ ইমেজ মোডে রপ্তানি করা হয়েছে (বাংলা ফন্ট মোড)।",
  "outbreaks.demoWarning":
    "⚠️ ডেমো তথ্য — এই পৃষ্ঠার ঝুঁকির শতাংশ কেবল উদাহরণের জন্য। এগুলো সরাসরি সরকারি নজরদারি তথ্য নয়। শুধুমাত্র এই তথ্যের উপর ভিত্তি করে মাঠের সিদ্ধান্ত নেবেন না।",
  "onboarding.step1": "অসুস্থ পাতার ছবি তুলুন → তাৎক্ষণিক রোগের নাম জানুন",
  "onboarding.step2": "স্প্রে করার আগে আজকের স্প্রে নিরাপত্তা যাচাই করুন",
  "onboarding.step3": "১০০+ রোগ ব্রাউজ করুন — অফলাইনে কাজ করে",
  "onboarding.dismiss": "বুঝেছি",
};

const HI: Partial<Dict> = {
  brand: "क्रॉप गार्जियन",
  navHome: "पत्ती जाँच",
  navDashboard: "डैशबोर्ड",
  navWeather: "मौसम और जोखिम",
  navAdvisor: "छिड़काव और सिंचाई",
  navCare: "देखभाल कैलेंडर",
  navOutbreaks: "प्रकोप निगरानी",
  navLibrary: "ज्ञान केंद्र",
  navFaq: "मदद",
  navContact: "संपर्क",
  navAbout: "हमारे बारे में",
  menu: "मेन्यू",
  theme: "थीम",
  light: "उजाला",
  dark: "अंधेरा",
  system: "फ़ोन सेटिंग",
  language: "भाषा",
  langNote: "मेन्यू की भाषा बदलेगी। रोग की जानकारी अभी अंग्रेज़ी में रहेगी।",
  heroTitle: "क्या आपकी पत्ती स्वस्थ है?",
  heroText: "एक पत्ती की फ़ोटो लें। हम पहले फ़ोटो जाँचते हैं, फिर समस्या और उपाय बताते हैं।",
  step1: "चरण १",
  addPhoto: "पत्ती की फ़ोटो दें",
  freeCheck: "मुफ़्त जाँच",
  dropHere: "फ़ोटो यहाँ छोड़ें",
  dropHelp: "या फ़ाइल चुनें, फ़ोटो लें, या Ctrl + V दबाएँ।",
  choosePhoto: "फ़ोटो चुनें",
  useCamera: "कैमरा",
  replacePhoto: "फ़ोटो बदलें",
  analyse: "पत्ती जाँचें",
  analysing: "पत्ती देखी जा रही है...",
  photoQuality: "फ़ोटो की गुणवत्ता",
  photoGood: "यह फ़ोटो अच्छी है।",
  clearer: "कृपया साफ़ फ़ोटो दें।",
  tipsTitle: "अच्छी फ़ोटो के लिए सुझाव",
  yourResult: "आपका परिणाम",
  healthy: "स्वस्थ",
  diseased: "रोग है",
  confidence: "भरोसा",
  severity: "गंभीरता",
  download: "रिपोर्ट लें (PDF)",
  pastChecks: "पुरानी जाँच",
  view: "देखें",
  report: "रिपोर्ट",
  delete: "हटाएँ",
  search: "खोजें",
  noHistory: "अभी कुछ नहीं है। एक फ़ोटो दें।",
  offline: "आप ऑफ़लाइन हैं। आपका स्कैन सेव हो गया है, इंटरनेट आने पर अपलोड होगा।",
  backOnline: "इंटरनेट वापस आ गया।",
  weatherTitle: "मौसम और रोग का जोखिम",
  totalScans: "कुल जाँच",
  healthyPlants: "स्वस्थ पत्तियाँ",
  diseasedPlants: "रोगी पत्तियाँ",
  todayScans: "आज",
  weekScans: "इस हफ़्ते",
  commonDisease: "सबसे आम समस्या",
  avgConfidence: "औसत भरोसा",
  diseasesDetected: "पहचाने गए रोग व कीट",
  cropsSupported: "समर्थित फसलें",
  offlineReady: "ऑफ़लाइन तैयार",
  multilingual: "भाषाएं",
  demoData: "डेमो डेटा",
  voiceSearch: "वॉयस सर्च",
  voiceListening: "सुन रहे हैं...",
  readAloud: "बोलकर सुनाएं",
  stopReading: "रोकें",
  costEstimator: "उपचार लागत और खुराक",
  bigha: "बीघा",
  acre: "एकड़",
  decimal: "डिसमिल",
  phiSafety: "कटाई पूर्व सुरक्षा अवधि (PHI)",
  reportSighting: "प्रकोप की सूचना दें",
  judgeDemo: "जज डेमो मोड",
  simulateOffline: "डेमो ऑफलाइन यूआई मोड",
  tourStep: "कदम",
  tourNext: "अगला कदम",
  tourClose: "टूर समाप्त करें",
  askAgronomist: "कृषि विशेषज्ञ सलाह",
  callKrishi: "किसान कॉल सेंटर (1800-180-1551)",
  shareWhatsApp: "व्हाट्सएप पर भेजें",
  "weather.cachedBanner": "⚠️ कैश्ड मौसम दिखाया जा रहा है। रीफ्रेश करने के लिए कनेक्ट करें।",
  "weather.offlineCard": "ऑफ़लाइन कोई मौसम डेटा उपलब्ध नहीं है।",
  "disclaimer.text":
    "⚠️ क्रॉप गार्जियन केवल शैक्षणिक जानकारी प्रदान करता है। उपचार लागू करने से पहले हमेशा प्रमाणित कृषि विशेषज्ञ से पुष्टि करें। फसल के नुकसान के लिए उत्तरदायी नहीं।",
  "judgeDemo.offlineUIMode": "डेमो ऑफलाइन यूआई मोड",
  "judgeDemo.offlineUINote":
    "ऑफलाइन यूआई दिखाता है। वास्तविक ऑफलाइन परीक्षण के लिए DevTools → Network → Offline का उपयोग करें।",
  "consent.locationLabel": "मैं इस रिपोर्ट के लिए अपना अनुमानित स्थान साझा करने की सहमति देता हूँ।",
  "consent.locationNote": "केवल इस सहमति के सक्षम होने पर ही जीपीएस कैप्चर किया जाता है।",
  "pdf.banglaModeNote": "पीडीएफ इमेज मोड में निर्यात किया गया (बांग्ला फॉन्ट मोड)।",
  "outbreaks.demoWarning":
    "⚠️ डेमो डेटा — इस पृष्ठ पर जोखिम प्रतिशत केवल उदाहरण के लिए हैं। ये लाइव सरकारी निगरानी डेटा नहीं हैं। केवल इन आंकड़ों के आधार पर खेत के निर्णय न लें।",
  "onboarding.step1": "बीमार पत्ती की फोटो लें → तुरंत बीमारी का नाम पाएं",
  "onboarding.step2": "छिड़काव करने से पहले आज की स्प्रे सुरक्षा जांचें",
  "onboarding.step3": "100+ बीमारियों को ब्राउज़ करें — ऑफलाइन काम करता है",
  "onboarding.dismiss": "समझ गया",
};

const DICTS: Record<Lang, Partial<Dict>> = { en: EN, bn: BN, hi: HI };

interface LangValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (key: keyof Dict) => string;
}

const LangContext = createContext<LangValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => EN[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Lang | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(KEY, next);
      document.documentElement.lang = next;
    } catch {
      /* storage blocked - language still works for this visit */
    }
  }, []);

  const value = useMemo<LangValue>(
    () => ({ lang, setLang, t: (key) => DICTS[lang]?.[key] ?? EN[key] }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
