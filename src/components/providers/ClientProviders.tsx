'use client';

import React from 'react';
import { ThemeProvider } from '@/lib/theme/themeContext';
import { LanguageProvider } from '@/lib/i18n/languageContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
