import React from 'react';
import { Globe, Check, X } from 'lucide-react';
import { SupportedLanguage } from '@studentlife/shared';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  badge: string;
  description: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Default)',
    badge: 'Global Standard',
    description: 'Standard terminology for international exams and tech interviews.'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    badge: 'राष्ट्रीय भाषा',
    description: 'पूर्ण हिन्दी माध्यम — UPSC, State PSCs एवं NCERT अध्ययन के लिए अनुकूल।'
  },
  {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hinglish (Bilingual)',
    badge: 'Most Popular 🚀',
    description: 'Natural blend of Hindi & English for intuitive Indian student explanations.'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    badge: 'আঞ্চলিক',
    description: 'পশ্চিমবঙ্গ ও ত্রিপুরা রাজ্য পরীক্ষার জন্য বিশেষ বাংলা অনুবাদ।'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    badge: 'பிராந்திய',
    description: 'தமிழ்நாடு தேர்வுகளுக்கான விரிவான தமிழ் மொழிபெயர்ப்பு.'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    badge: 'ప్రాంతీయ',
    description: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ విద్యార్థుల కోసం సమగ్ర తెలుగు మాధ్యమం.'
  }
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Select Vernacular Language</h3>
              <p className="text-xs text-slate-400">Choose your preferred Indian regional language for AI tutors & UI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/70 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{lang.nativeName}</span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {lang.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {lang.description}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
          <span>AI Audio & Voice tutors will automatically adapt to your chosen dialect.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
export default LanguageSelectorModal;
