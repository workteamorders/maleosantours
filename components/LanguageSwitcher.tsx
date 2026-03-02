'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'id', name: 'Indonesia', flag: 'https://flagcdn.com/id.svg' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/gb.svg' },
  { code: 'zh', name: '中文 (简体)', flag: 'https://flagcdn.com/cn.svg' },
  { code: 'zh-CN', name: '中文 (繁體)', flag: 'https://flagcdn.com/tw.svg' },
];

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export default function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    router.replace(pathname, { locale: langCode });
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${isScrolled
          ? 'border-gray-200 bg-white/50 text-black hover:border-gray-300 hover:bg-white'
          : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20'
          } backdrop-blur-md shadow-sm`}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-sm flex-shrink-0">
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-full h-full object-cover" />
        </div>
        <span className="text-[10px] font-black font-sans uppercase tracking-[0.2em] hidden sm:block opacity-90">
          {currentLocale === 'zh-CN' ? 'ZH-TW' : currentLocale.toUpperCase()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[220px]"
            >
              <div className="p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-sm ${currentLocale === lang.code
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                        <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-xs font-black uppercase tracking-widest opacity-50">{lang.code === 'zh-CN' ? 'zh-tw' : lang.code}</span>
                        <span>{lang.name}</span>
                      </div>
                    </div>
                    {currentLocale === lang.code && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
