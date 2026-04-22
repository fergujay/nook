import { Link } from 'react-router-dom'
import { CheckCircle, Package, Home } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Order() {
  const { t, language } = useLanguage()
  const dateLocale = language === 'sr' ? 'sr-RS' : 'en-GB'

  return (
    <div className="max-w-3xl mx-auto container-padding py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 shadow-soft animate-scale-in">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="heading-medium mb-4">{t('order.confirmed')}</h1>
        <p className="text-gray-600 text-xl mb-8 leading-relaxed">
          {t('order.thankYou')}
        </p>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
            <Package className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="text-2xl font-medium">{t('order.orderDetails')}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">
              {t('order.orderNumber')}
            </span>
            <span className="font-bold text-lg">
              #NOOK-{new Date().getFullYear()}-
              {String(Math.floor(Math.random() * 900) + 100)}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">
              {t('order.orderDate')}
            </span>
            <span className="font-semibold">
              {new Date().toLocaleDateString(dateLocale)}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600 font-medium">
              {t('order.estimatedDelivery')}
            </span>
            <span className="font-semibold">
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString(dateLocale)}
            </span>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 mb-8">
        <h3 className="font-semibold mb-3 text-lg">{t('order.whatsNext')}</h3>
        <p className="text-gray-700 leading-relaxed">
          {t('order.whatsNextText')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Home className="h-5 w-5" />
          {t('common.continueShopping')}
        </Link>
        <Link to="/" className="btn-secondary text-center">
          {t('order.backToHome')}
        </Link>
      </div>
    </div>
  )
}
