import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-gray-300 hover:text-white p-2 rounded-full transition-colors">
        <Globe className="w-5 h-5" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
              i18n.language === lang.code ? 'bg-gray-700' : ''
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};