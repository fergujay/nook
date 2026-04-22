import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'sr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    home: 'Home',
    products: 'Products',
    aboutUs: 'About Us',
    textileCare: 'Textile Care',
    courier: 'Courier',
    favorites: 'Favorites',
    cart: 'Cart',
  },
  sr: {
    home: 'Početna',
    products: 'Proizvodi',
    aboutUs: 'O nama',
    textileCare: 'Negovanje tekstila',
    courier: 'Kurirska služba',
    favorites: 'Omiljeno',
    cart: 'Korpa',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'sr' || saved === 'en' ? saved : 'en') as Language
  })

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

