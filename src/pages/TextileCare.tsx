import { Droplet, Sun, Shirt, Wind } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function TextileCare() {
  const { t, tList } = useLanguage()

  const sections = [
    {
      icon: Droplet,
      title: t('textileCare.sections.washing.title'),
      tips: tList('textileCare.sections.washing.tips'),
    },
    {
      icon: Sun,
      title: t('textileCare.sections.drying.title'),
      tips: tList('textileCare.sections.drying.tips'),
    },
    {
      icon: Shirt,
      title: t('textileCare.sections.ironing.title'),
      tips: tList('textileCare.sections.ironing.tips'),
    },
    {
      icon: Wind,
      title: t('textileCare.sections.storage.title'),
      tips: tList('textileCare.sections.storage.tips'),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto container-padding py-16">
      <div className="text-center mb-20">
        <h1 className="heading-medium mb-6">{t('textileCare.title')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('textileCare.lead')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h2 className="text-2xl font-medium">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1.5 font-bold">•</span>
                    <span className="text-gray-700 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
        <h2 className="text-2xl font-medium mb-6">
          {t('textileCare.notesTitle')}
        </h2>
        <ul className="space-y-3 text-gray-700 leading-relaxed">
          {tList('textileCare.notesItems').map((note, idx) => (
            <li key={idx} className="flex items-start gap-3 text-lg">
              <span className="text-primary-600 mt-1.5 font-bold">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
