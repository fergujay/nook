import { Mail, Phone, MapPin, Heart, Users, Award } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const [isMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

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
            {t('ourStory')}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 px-2"
            style={{ color: "var(--foreground)" }}
          >
            {t('aboutUsTitle')}
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t('aboutUsDescription')}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding w-full relative bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 transition-transform duration-300 group-hover:scale-110">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  <Heart className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4" style={{ color: "var(--foreground)" }}>
                {t('ourMission')}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {t('ourMissionText')}
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 transition-transform duration-300 group-hover:scale-110">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  <Users className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4" style={{ color: "var(--foreground)" }}>
                {t('ourTeam')}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {t('ourTeamText')}
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 transition-transform duration-300 group-hover:scale-110">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  <Award className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4" style={{ color: "var(--foreground)" }}>
                {t('qualityPromise')}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {t('qualityPromiseText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding w-full relative" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-4xl mx-auto container-padding">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-8 sm:mb-12"
            style={{ color: "var(--foreground)" }}
          >
            {t('ourStoryTitle')}
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {t('ourStoryText1')}
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {t('ourStoryText2')}
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {t('ourStoryText3')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding w-full relative bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12 sm:mb-16">
            <p
              className="text-xs sm:text-sm md:text-base uppercase mb-4 sm:mb-6 font-medium"
              style={{
                color: "var(--muted-foreground)",
                letterSpacing: isMobile ? "4px" : "6px",
              }}
            >
              {t('getInTouch')}
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              {t('contactUs')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div
                className="p-4 sm:p-6 flex-shrink-0"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                }}
              >
                <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                  {t('emailLabel')}
                </h3>
                <a
                  href="mailto:info@nook.com"
                  className="text-base sm:text-lg block mb-1 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  info@nook.com
                </a>
                <a
                  href="mailto:support@nook.com"
                  className="text-base sm:text-lg block hover:opacity-70 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  support@nook.com
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div
                className="p-4 sm:p-6 flex-shrink-0"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                }}
              >
                <Phone className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                  {t('phoneLabel')}
                </h3>
                <a
                  href="tel:+381111234567"
                  className="text-base sm:text-lg block mb-1 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  +381 11 123 4567
                </a>
                <p className="text-sm sm:text-base" style={{ color: "var(--muted-foreground)" }}>
                  {t('monFri')}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div
                className="p-4 sm:p-6 flex-shrink-0"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                }}
              >
                <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: "var(--foreground)" }}>
                  {t('addressLabel')}
                </h3>
                <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  123 Textile Street
                  <br />
                  Belgrade, Serbia
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
