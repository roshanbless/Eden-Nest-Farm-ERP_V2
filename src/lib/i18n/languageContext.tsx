'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ml' | 'hi';

export interface Translations {
  // Navigation & Common
  languageName: string;
  selectLanguage: string;
  dashboard: string;
  farms: string;
  production: string;
  inventory: string;
  flockHealth: string;
  salesOrders: string;
  subscriptions: string;
  deliveries: string;
  customers: string;
  manure: string;
  reports: string;
  rolesPermissions: string;
  settings: string;

  // Header & User
  searchPlaceholder: string;
  logProduction: string;
  activeFarm: string;
  signOut: string;

  // Subscriptions Page
  subscriptionsHeader: string;
  subscriptionsSubtext: string;
  newSubscription: string;
  mrrTitle: string;
  activeSubscribers: string;
  pausedSubs: string;
  planAlignment: string;
  choosePlan: string;
  selectedPlan: string;
  mostPopular: string;
  freeDelivery: string;
  skipAnytime: string;
  pauseAnytime: string;
  freshnessGuarantee: string;
  priorityDispatch: string;
  premiumSupport: string;

  // Orders Page
  createOrder: string;
  packagingSpec: string;
  singleEggs: string;
  packTrays: string;
  bulkWholesale: string;
  editableUnitPrice: string;
  orderQuantity: string;
  calculatedTotal: string;

  // Flock Health
  vaccinationSchedule: string;
  flockAgeDaysWeeks: string;
  pendingAlerts: string;
}

const translations: Record<Language, Translations> = {
  en: {
    languageName: 'English',
    selectLanguage: 'Choose Language',
    dashboard: 'Dashboard',
    farms: 'Farm Infrastructure',
    production: 'Daily Egg Production',
    inventory: 'Cold Storage & Inventory',
    flockHealth: 'Flock Health & Vaccines',
    salesOrders: 'Order Management',
    subscriptions: 'Doorstep Subscriptions',
    deliveries: 'Dispatch & Deliveries',
    customers: 'Customers & B2B Accounts',
    manure: 'Organic Manure Processing',
    reports: 'Business Intelligence & Reports',
    rolesPermissions: 'Roles & User Permissions',
    settings: 'System Configuration',

    searchPlaceholder: 'Search batches, orders, subscriptions, customers... (Ctrl+K)',
    logProduction: 'Log Production',
    activeFarm: 'Select Active Farm Location',
    signOut: 'Sign Out of Workspace',

    subscriptionsHeader: 'Recurring Egg Subscriptions',
    subscriptionsSubtext: 'Manage doorstep plans: Eden Starter, Eden Essentials, Eden Family, Eden Premium, Cafe & Restaurant, Hotel.',
    newSubscription: 'New Doorstep Subscription',
    mrrTitle: 'Monthly Recurring Revenue (MRR)',
    activeSubscribers: 'Total Active Subscribers',
    pausedSubs: 'Subscriptions Paused',
    planAlignment: 'Plan Alignment',
    choosePlan: 'Choose plan',
    selectedPlan: 'Selected',
    mostPopular: 'MOST POPULAR',
    freeDelivery: 'Free delivery',
    skipAnytime: 'Skip anytime',
    pauseAnytime: 'Pause anytime',
    freshnessGuarantee: 'Freshness guarantee',
    priorityDispatch: 'Priority dispatch',
    premiumSupport: 'Premium support',

    createOrder: 'Create Sales Order',
    packagingSpec: 'Packaging Specification',
    singleEggs: 'Single Eggs',
    packTrays: 'Pack Trays',
    bulkWholesale: 'Bulk Wholesale',
    editableUnitPrice: 'Editable Unit Price (₹)',
    orderQuantity: 'Order Quantity (Units)',
    calculatedTotal: 'Calculated Net Total',

    vaccinationSchedule: 'Flock Immunization & Vaccination',
    flockAgeDaysWeeks: 'Flock Age (in Days & Weeks)',
    pendingAlerts: 'Pending Alerts',
  },
  ml: {
    languageName: 'മലയാളം (Malayalam)',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    farms: 'ഫാം ഇൻഫ്രാസ്ട്രക്ചർ',
    production: 'ദിനാന്തരീക്ഷ മുട്ട ഉത്പാദനം',
    inventory: 'കോൾഡ് സ്റ്റോറേജും സ്റ്റോക്കും',
    flockHealth: 'കോഴികളുടെ ആരോഗ്യവും വാക്സിനേഷനും',
    salesOrders: 'ഓർഡർ മാനേജ്മെന്റ്',
    subscriptions: 'വീട്ടുപടിക്കൽ സബ്‌സ്‌ക്രിപ്ഷൻ',
    deliveries: 'വിതരണവും ഡെലിവറിയും',
    customers: 'ഉപഭോക്താക്കളും കച്ചവടക്കാരും',
    manure: 'ജൈവവളം സംസ്കരണം',
    reports: 'റിപ്പോർട്ടുകളും വിശകലനവും',
    rolesPermissions: 'റോളുകളും അനുമതികളും',
    settings: 'സിസ്റ്റം സജ്ജീകരണങ്ങൾ',

    searchPlaceholder: 'ബാച്ചുകൾ, ഓർഡറുകൾ, സബ്‌സ്‌ക്രിപ്ഷനുകൾ തിരയുക...',
    logProduction: 'ഉത്പാദനം രേഖപ്പെടുത്തുക',
    activeFarm: 'ആക്ടീവ് ഫാം തിരഞ്ഞെടുക്കുക',
    signOut: 'സൈൻ ഔട്ട് ചെയ്യുക',

    subscriptionsHeader: 'വീട്ടുപടിക്കൽ മുട്ട സബ്‌സ്‌ക്രിപ്ഷൻ',
    subscriptionsSubtext: 'ഈഡൻ സ്റ്റാർട്ടർ, എസൻഷ്യൽസ്, ഫാമിലി, പ്രീമിയം, ഹോട്ടൽ സബ്‌സ്‌ക്രിപ്ഷൻ പ്ലാനുകൾ.',
    newSubscription: 'പുതിയ സബ്‌സ്‌ക്രിപ്ഷൻ ചേർക്കുക',
    mrrTitle: 'പ്രതിമാസ വരുമാനം (MRR)',
    activeSubscribers: 'ആക്ടീവ് സബ്‌സ്‌ക്രൈബർമാർ',
    pausedSubs: 'താൽക്കാലികമായി നിർത്തിവെച്ചവ',
    planAlignment: 'പ്ലാൻ പൊരുത്തം',
    choosePlan: 'പ്ലാൻ തിരഞ്ഞെടുക്കുക',
    selectedPlan: 'തിരഞ്ഞെടുത്തു',
    mostPopular: 'ഏറ്റവും ജനപ്രിയം',
    freeDelivery: 'സൗജന്യ ഡെലിവറി',
    skipAnytime: 'എപ്പോൾ വേണമെങ്കിലും സ്കിപ്പ് ചെയ്യാം',
    pauseAnytime: 'എപ്പോൾ വേണമെങ്കിലും നിർത്താം',
    freshnessGuarantee: 'ഫ്രഷ്‌നസ് ഗ്യാരണ്ടി',
    priorityDispatch: 'മുൻഗണനാ ഡെലിവറി',
    premiumSupport: 'പ്രീമിയം സപ്പോർട്ട്',

    createOrder: 'സെയിൽസ് ഓർഡർ സൃഷ്ടിക്കുക',
    packagingSpec: 'പാക്കിംഗ് രീതി',
    singleEggs: 'ഒറ്റ മുട്ടകൾ',
    packTrays: 'ട്രേ പാക്കുകൾ',
    bulkWholesale: 'ഹോൾസെയിൽ ബൾക്ക്',
    editableUnitPrice: 'മാറ്റാവുന്ന വില (₹)',
    orderQuantity: 'ഓർഡർ അളവ്',
    calculatedTotal: 'ആകെ തുക',

    vaccinationSchedule: 'വാക്സിനേഷൻ ഷെഡ്യൂൾ',
    flockAgeDaysWeeks: 'കോഴികളുടെ പ്രായം (ദിവസങ്ങളിലും ആഴ്ചകളിലും)',
    pendingAlerts: 'തീർപ്പുകൽപ്പിക്കാത്ത മുന്നറിയിപ്പുകൾ',
  },
  hi: {
    languageName: 'हिंदी (Hindi)',
    selectLanguage: 'भाषा चुनें',
    dashboard: 'डैशबोर्ड',
    farms: 'फार्म अवसंरचना',
    production: 'दैनिक अंडा उत्पादन',
    inventory: 'कोल्ड स्टोरेज और इन्वेंटरी',
    flockHealth: 'मुर्गियों का स्वास्थ्य और टीकाकरण',
    salesOrders: 'ऑर्डर प्रबंधन',
    subscriptions: 'घर-घर डिलीवरी सब्सक्राइब',
    deliveries: 'डिस्पैच और डिलीवरी',
    customers: 'ग्राहक और व्यवसाय खाते',
    manure: 'जैविक खाद प्रसंस्करण',
    reports: 'व्यापार रिपोर्ट और विश्लेषण',
    rolesPermissions: 'भूमिकाएं और अनुमतियां',
    settings: 'सिस्टम सेटिंग्स',

    searchPlaceholder: 'बैच, ऑर्डर, सब्सक्रिप्शन, ग्राहक खोजें...',
    logProduction: 'उत्पादन दर्ज करें',
    activeFarm: 'सक्रिय फार्म चुनें',
    signOut: 'साइन आउट करें',

    subscriptionsHeader: 'डोरस्टेप अंडा सब्सक्रिप्शन',
    subscriptionsSubtext: 'ईडन स्टार्टर, एसेंशियल्स, फैमिली, प्रीमियम, कैफे और होटल प्लान प्रबंधित करें।',
    newSubscription: 'नया सब्सक्रिप्शन जोड़ें',
    mrrTitle: 'मासिक आवर्ती राजस्व (MRR)',
    activeSubscribers: 'कुल सक्रिय सब्सक्राइबर',
    pausedSubs: 'रोके गए सब्सक्रिप्शन',
    planAlignment: 'प्लान संरेखण',
    choosePlan: 'प्लान चुनें',
    selectedPlan: 'चयनित',
    mostPopular: 'सबसे लोकप्रिय',
    freeDelivery: 'मुफ्त डिलीवरी',
    skipAnytime: 'कभी भी स्किप करें',
    pauseAnytime: 'कभी भी रोकें',
    freshnessGuarantee: 'ताजगी की गारंटी',
    priorityDispatch: 'प्राथमिकता डिलीवरी',
    premiumSupport: 'प्रीमियम सपोर्ट',

    createOrder: 'बिक्री ऑर्डर बनाएं',
    packagingSpec: 'पैकिंग प्रकार',
    singleEggs: 'सिंगल अंडे',
    packTrays: 'ट्रे पैक',
    bulkWholesale: 'बल्क थोक बिक्री',
    editableUnitPrice: 'संशोधनीय दर (₹)',
    orderQuantity: 'ऑर्डर मात्रा',
    calculatedTotal: 'कुल शुद्ध राशि',

    vaccinationSchedule: 'टीकाकरण अनुसूची',
    flockAgeDaysWeeks: 'आयु (दिनों और सप्ताहों में)',
    pendingAlerts: 'लंबित अलर्ट',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('eden_erp_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ml' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('eden_erp_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
