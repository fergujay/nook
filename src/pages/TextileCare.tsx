import { Droplet, Sun, Shirt, Wind } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function TextileCare() {
  const { t } = useLanguage();
  const [isMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  const careTips = [
    {
      icon: Droplet,
      title: t('washing'),
      tips: [
        t('washingTip1'),
        t('washingTip2'),
        t('washingTip3'),
        t('washingTip4'),
        t('washingTip5'),
      ],
    },
    {
      icon: Sun,
      title: t('drying'),
      tips: [
        t('dryingTip1'),
        t('dryingTip2'),
        t('dryingTip3'),
        t('dryingTip4'),
        t('dryingTip5'),
      ],
    },
    {
      icon: Shirt,
      title: t('ironing'),
      tips: [
        t('ironingTip1'),
        t('ironingTip2'),
        t('ironingTip3'),
        t('ironingTip4'),
        t('ironingTip5'),
      ],
    },
    {
      icon: Wind,
      title: t('storage'),
      tips: [
        t('storageTip1'),
        t('storageTip2'),
        t('storageTip3'),
        t('storageTip4'),
        t('storageTip5'),
      ],
    },
  ];

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
            {t('careGuide')}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 px-2"
            style={{ color: "var(--foreground)" }}
          >
            {t('howToCareForTextiles')}
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t('properCareDescription')}
          </p>
        </div>
      </section>

      {/* Care Tips Grid */}
      <section className="section-padding w-full relative" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {careTips.map((section, index) => {
              const Icon = section.icon;
              return (
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
                  <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div
                      className="p-4 sm:p-6 flex-shrink-0"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "white",
                      }}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl md:text-4xl font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3 sm:space-y-4">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3 sm:gap-4">
                        <span
                          className="text-lg sm:text-xl font-bold mt-0.5 flex-shrink-0"
                          style={{ color: "var(--primary)" }}
                        >
                          •
                        </span>
                        <span
                          className="text-base sm:text-lg leading-relaxed"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* General Guidelines Section */}
      <section className="section-padding w-full relative bg-white">
        <div className="max-w-4xl mx-auto container-padding">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-8 sm:mb-12"
            style={{ color: "var(--foreground)" }}
          >
            {t('generalCareGuidelines')}
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-2">
                <strong style={{ color: "var(--primary)" }}>{t('readTheLabel')}</strong>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {" "}
                  {t('readTheLabelText')}
                </span>
              </p>
            </div>
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-2">
                <strong style={{ color: "var(--primary)" }}>{t('sortByColor')}</strong>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {" "}
                  {t('sortByColorText')}
                </span>
              </p>
            </div>
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-2">
                <strong style={{ color: "var(--primary)" }}>{t('useGentleCycles')}</strong>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {" "}
                  {t('useGentleCyclesText')}
                </span>
              </p>
            </div>
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-2">
                <strong style={{ color: "var(--primary)" }}>{t('avoidHarshChemicals')}</strong>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {" "}
                  {t('avoidHarshChemicalsText')}
                </span>
              </p>
            </div>
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-2">
                <strong style={{ color: "var(--primary)" }}>{t('regularMaintenance')}</strong>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {" "}
                  {t('regularMaintenanceText')}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
