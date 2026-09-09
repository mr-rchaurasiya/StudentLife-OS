import React, { useState, useMemo } from 'react';
import { Globe, Check, X, Search, Sparkles } from 'lucide-react';
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
  category: 'INDIAN' | 'GLOBAL';
  flag: string;
  description: string;
}

const ALL_LANGUAGES: LanguageOption[] = [
  // Indian Regional & Vernacular Languages
  {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hinglish (हिंग्लिश)',
    badge: 'Most Popular 🚀',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'Natural blend of Hindi & English — most intuitive for Indian college & tech students.'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    badge: 'राष्ट्रीय भाषा',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'पूर्ण हिन्दी माध्यम — UPSC, State PSCs एवं NCERT अध्ययन के लिए अनुकूल।'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Default)',
    badge: 'Global Standard',
    category: 'GLOBAL',
    flag: '🌐',
    description: 'Standard terminology for international exams, GRE, GATE, and tech interviews.'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    badge: 'পূর্ব ভারত',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'পশ্চিমবঙ্গ ও ত্রিপুরা রাজ্য পরীক্ষার জন্য বিশেষ বাংলা অনুবাদ।'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    badge: 'महाराष्ट्र',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'MPSC व महाराष्ट्र राज्य बोर्ड परीक्षांसाठी सर्वसमावेशक मराठी अभ्यासक्रम।'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    badge: 'తెలంగాణ & ఏపీ',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ విద్యార్థుల కోసం సమగ్ర తెలుగు మాధ్యమం.'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    badge: 'தமிழ்நாடு',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'TNPSC மற்றும் தமிழ்நாடு கல்லூரி மாணவர்களுக்கான தமிழ் மொழிபெயர்ப்பு.'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    badge: 'ગુજરાત',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'GPSC અને ગુજરાતના વિદ્યાર્થીઓ માટે સરળ ગુજરાતી સમજૂતી.'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    badge: 'ಕರ್ನಾಟಕ',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'KPSC ಮತ್ತು ಕರ್ನಾಟಕದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಕನ್ನಡ ಮಾಧ್ಯಮ.'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    badge: 'കേരളം',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'കേരള PSC, സർവകലാശാലാ പരീക്ഷകൾക്കുള്ള സമഗ്ര മലയാളം.'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    badge: 'ਪੰਜਾਬ',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'PPSC ਅਤੇ ਉੱਤਰੀ ਭਾਰਤ ਦੇ ਪ੍ਰੀਖਿਆਰਥੀਆਂ ਲਈ ਸਰਲ ਪੰਜਾਬੀ ਮਾਧਿਅਮ।'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    badge: 'ଓଡ଼ିଶା',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'OPSC ଓ ଓଡ଼ିଶା ବିଶ୍ୱବିଦ୍ୟାଳୟ ପରୀକ୍ଷା ପାଇଁ ଓଡ଼ିଆ ଅନୁବାଦ।'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    badge: 'قومی زبان',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'جامع اردو میڈیم برائے امتحانات اور علمی مضامین۔'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    badge: 'উত্তৰ-পূব',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'APSC আৰু অসমৰ মহাবিদ্যালয়ৰ বাবে অসমীয়া মাধ্যম।'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    badge: 'प्राचीन भाषा',
    category: 'INDIAN',
    flag: '🇮🇳',
    description: 'वैदिक ज्ञानम्, साहित्यम् तथा प्राचीन दर्शनस्य अध्ययनम्।'
  },
  // Global Languages
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇪🇸',
    description: 'Terminología académica en español para estudiantes de todo el mundo.'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇫🇷',
    description: 'Support académique complet en français pour les concours et études.'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇩🇪',
    description: 'Präzise deutsche Übersetzung für MINT-Fächer und Forschung.'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇯🇵',
    description: '学術用語とAIチューターによる日本語インターフェース。'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇷🇺',
    description: 'Академический перевод и поддержка на русском языке.'
  },
  {
    code: 'zh',
    name: 'Mandarin',
    nativeName: '中文 (简体)',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇨🇳',
    description: '为全球学术与考研准备的中文系统和AI导师。'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇸🇦',
    description: 'واجهة أكاديمية عربية كاملة لجميع التخصصات العلمية.'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇧🇷',
    description: 'Suporte acadêmico completo em português para exames e estudos universitários.'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇮🇹',
    description: 'Interfaccia e supporto accademico in lingua italiana per università e ricerca.'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇰🇷',
    description: '학술 연구 및 시험 준비를 위한 한국어 인터페이스와 스마트 AI 도구.'
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇳🇱',
    description: 'Volledige academische ondersteuning in het Nederlands voor studies en examens.'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇹🇷',
    description: 'Üniversite ve sınav hazırlığı için kapsamlı Türkçe akademik arayüz.'
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇮🇩',
    description: 'Platform studi dan persiapan ujian lengkap dalam Bahasa Indonesia.'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    badge: 'International',
    category: 'GLOBAL',
    flag: '🇻🇳',
    description: 'Giao diện học tập và luyện thi thông minh hoàn toàn bằng Tiếng Việt.'
  }
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INDIAN' | 'GLOBAL'>('ALL');

  const filteredLanguages = useMemo(() => {
    return ALL_LANGUAGES.filter((lang) => {
      const matchesFilter = activeFilter === 'ALL' || lang.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.description.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(3, 7, 18, 0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#0b1329',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15)',
          overflow: 'hidden',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(11, 19, 41, 0.5) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.35)'
              }}
            >
              <Globe size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                  Select Vernacular Language
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontWeight: 700,
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}
                >
                  {ALL_LANGUAGES.length} Languages
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                Choose your preferred Indian regional or global language for AI Voice Tutors, Podcasts & UI localization.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
            background: 'rgba(15, 23, 42, 0.4)'
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {(
              [
                { id: 'ALL', label: 'All (22)' },
                { id: 'INDIAN', label: '🇮🇳 Indian Languages (15)' },
                { id: 'GLOBAL', label: '🌐 Global (7)' }
              ] as const
            ).map((tab) => {
              const isTabActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: isTabActive ? 700 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    background: isTabActive ? 'var(--accent-primary, #6366f1)' : 'transparent',
                    color: isTabActive ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 200px',
              maxWidth: '300px'
            }}
          >
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name or script..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 30px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.76rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Languages Grid */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px'
          }}
        >
          {filteredLanguages.map((lang) => {
            const isSelected = currentLanguage === lang.code;

            return (
              <div
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(6, 182, 212, 0.15))'
                    : 'rgba(15, 23, 42, 0.6)',
                  boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.25)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'all 0.18s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>{lang.flag}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                        {lang.nativeName}
                      </span>
                    </div>

                    {isSelected ? (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#22d3ee',
                          color: '#020617',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 8px #22d3ee'
                        }}
                      >
                        <Check size={12} strokeWidth={3.5} />
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#94a3b8'
                        }}
                      >
                        {lang.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600, marginBottom: '4px' }}>
                    {lang.name} ({lang.code.toUpperCase()})
                  </div>

                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                    {lang.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Done */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(11, 19, 41, 0.9)',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#38bdf8" />
            <span>AI Voice Tutors, Flashcards & Podcasts seamlessly translate into your selected dialect.</span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '7px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-primary, #6366f1)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.78rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
