'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLanguage, Language } from '@/lib/i18n/languageContext';
import { useTheme } from '@/lib/theme/themeContext';
import { fetchFarms, Farm } from '@/lib/api/farms';

interface HeaderProps {
  collapsed: boolean;
}

export default function Header({ collapsed }: HeaderProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [farmsList, setFarmsList] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState('Select Registered Farm');
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    async function loadFarms() {
      const data = await fetchFarms();
      setFarmsList(data);
      if (data.length > 0) {
        setSelectedFarm(data[0].name);
      } else {
        setSelectedFarm('No Registered Farms');
      }
    }
    loadFarms();
  }, []);

  const languagesList: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    document.cookie = 'eden-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#091b12]/95 backdrop-blur-md border-b border-[#133e2b] transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Left: Global Search & Dynamic Farm Switcher */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Dynamic Farm Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFarmDropdown(!showFarmDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] hover:border-emerald-500/40 text-xs font-semibold text-white transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="max-w-[130px] sm:max-w-[180px] md:max-w-[220px] truncate">{selectedFarm}</span>
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFarmDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-[#091b12] border border-[#133e2b] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#133e2b]">
                Registered Farm Facilities ({farmsList.length})
              </div>

              {farmsList.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No farms registered yet. Click Farms in sidebar to add one.
                </div>
              ) : (
                farmsList.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFarm(f.name);
                      setShowFarmDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#133e2b]/60 transition-colors ${
                      selectedFarm === f.name ? 'bg-emerald-600/20 text-emerald-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold truncate">{f.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{f.location_name || 'Location N/A'}</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0 ml-2">
                      {f.total_bird_count?.toLocaleString() || 0} Birds
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden sm:block">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Language Selector, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="px-2.5 py-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] hover:border-emerald-500/40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Toggle Light / Dark Mode"
        >
          <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#06140e] border border-[#133e2b] hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition-all"
          >
            <span>{currentLangObj.flag}</span>
            <span className="hidden md:inline">{currentLangObj.name.split(' ')[0]}</span>
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-[#091b12] border border-[#133e2b] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#133e2b] mb-1">
                Select Language
              </div>
              {languagesList.map((langObj) => (
                <button
                  key={langObj.code}
                  onClick={() => {
                    setLanguage(langObj.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#133e2b]/60 transition-colors ${
                    language === langObj.code ? 'bg-emerald-600/20 text-emerald-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{langObj.flag}</span>
                    <span>{langObj.name}</span>
                  </span>
                  {language === langObj.code && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#133e2b]/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center text-xs">
              RA
            </div>
            <span className="text-xs font-semibold text-white hidden md:inline">Roshan Alexander</span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#091b12] border border-[#133e2b] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-3 py-2 border-b border-[#133e2b]">
                <div className="text-xs font-bold text-white">Roshan Alexander</div>
                <div className="text-[10px] text-slate-400">Owner & Administrator</div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 transition-colors font-semibold flex items-center gap-2 mt-1"
              >
                <span>🚪</span> {t.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
