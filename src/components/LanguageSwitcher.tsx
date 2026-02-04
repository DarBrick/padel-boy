import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0]

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = languages.length * 48 // approximate height per item
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      
      // Open upward if not enough space below but more space above
      setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow)
    }
  }, [isOpen])

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
        aria-label="Change language"
      >
        <Languages className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-medium">{currentLang.flag}</span>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`absolute right-0 w-48 bg-slate-800 rounded-lg shadow-xl z-20 ${
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  i18n.language === lang.code ? 'bg-slate-700/50' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-white text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
