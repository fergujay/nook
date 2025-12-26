import { Truck, Package, Clock, MapPin, Mail } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Courier() {
  const { t } = useLanguage();
  const [isMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  const shippingOptions = [
    {
      name: t('standardShipping'),
      duration: `5-7 ${t('businessDays')}`,
      price: '500 RSD',
      description: t('standardShippingDescription'),
    },
    {
      name: t('expressShipping'),
      duration: `2-3 ${t('businessDays')}`,
      price: '1,200 RSD',
      description: t('expressShippingDescription'),
    },
    {
      name: t('overnightShipping'),
      duration: `1 ${t('businessDay')}`,
      price: '2,400 RSD',
      description: t('overnightShippingDescription'),
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="section-padding w-full relative bg-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <p
            className="text-xs sm:text-sm md:text-base uppercase mb-4 sm:mb-6 font-medium px-2"
            style={{
              color: "var(--muted-foreground)",
              letterSpacing: isMobile ? "4px" : "6px",
            }}
          >
            {t('shippingDelivery')}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 px-2"
            style={{ color: "var(--foreground)" }}
          >
            {t('shippingDeliveryTitle')}
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t('shippingDescription')}
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="section-padding w-full relative" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className="group"
                style={{
                  transition: "transform 0.3s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div
                    className="p-3 sm:p-4 flex-shrink-0"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                    }}
                  >
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium" style={{ color: "var(--foreground)" }}>
                    {option.name}
                  </h3>
                </div>
                <p
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
                  style={{ color: "var(--primary)" }}
                >
                  {option.price}
                </p>
                <p
                  className="text-base sm:text-lg mb-4 sm:mb-5 leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {option.description}
                </p>
                <div className="flex items-center gap-2 text-sm sm:text-base" style={{ color: "var(--muted-foreground)" }}>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-medium">{option.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courier Partners & Delivery Areas */}
      <section className="section-padding w-full relative bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div>
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div
                  className="p-4 sm:p-6 flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  <Package className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {t('ourCourierPartners')}
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                    {t('postOfSerbia')}
                  </h3>
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t('postOfSerbiaText')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                    {t('expressCouriers')}
                  </h3>
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t('expressCouriersText')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div
                  className="p-4 sm:p-6 flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {t('deliveryAreas')}
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                    {t('serbiaDelivery')}
                  </h3>
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t('serbiaDeliveryText')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                    {t('international')}
                  </h3>
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t('internationalText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="section-padding w-full relative" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-4xl mx-auto container-padding">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-6 sm:mb-8"
            style={{ color: "var(--foreground)" }}
          >
            {t('trackingYourOrder')}
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t('trackingText')}
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "var(--primary)" }} />
            <a
              href="mailto:shipping@nook.com"
              className="text-base sm:text-lg font-medium hover:opacity-70 transition-opacity"
              style={{ color: "var(--primary)" }}
            >
              {t('questionsAboutShipping')} shipping@nook.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
