import { Mail, MapPin, Scissors, Leaf, Home } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";

const CONTACT_EMAIL = "nook.textile@gmail.com";

// Custom hook for scroll-triggered reveals
function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isRevealed };
}

export default function About() {
  const { t } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);
  const valuesReveal = useRevealOnScroll();
  const contactReveal = useRevealOnScroll();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const values = [
    {
      icon: Scissors,
      titleKey: "about.value1Title",
      textKey: "about.value1Text",
    },
    {
      icon: Leaf,
      titleKey: "about.value2Title",
      textKey: "about.value2Text",
    },
    {
      icon: Home,
      titleKey: "about.value3Title",
      textKey: "about.value3Text",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto container-padding py-16 lg:py-20">
      {/* Header */}
      <div className="text-center mb-16 lg:mb-20">
        <p
          className={`text-sm md:text-base uppercase tracking-[0.25em] mb-4 font-medium text-muted-foreground transition-all duration-700 ${
            pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          NOOK · BEOGRAD
        </p>
        <h1 
          className={`heading-large mb-6 text-foreground text-balance transition-all duration-700 delay-100 ${
            pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("about.title")}
        </h1>
        <p 
          className={`text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
            pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("about.lead")}
        </p>
      </div>

      {/* Story Card */}
      <div 
        className={`bg-card border border-border rounded-2xl p-8 lg:p-12 mb-16 lg:mb-20 max-w-3xl mx-auto shadow-soft transition-all duration-700 delay-300 ${
          pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">{t("about.p1")}</p>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("about.p2")}</p>
          <p className="text-lg font-medium text-foreground">{t("about.p3")}</p>
        </div>
      </div>

      {/* Values Section */}
      <div ref={valuesReveal.ref}>
        <h2 
          className={`heading-medium text-center mb-12 text-foreground transition-all duration-700 ${
            valuesReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {t("about.valuesTitle")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16 lg:mb-20">
          {values.map((value, index) => (
            <div 
              key={index}
              className={`text-center group transition-all duration-700 ${
                valuesReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-medium group-hover:bg-primary group-hover:text-primary-foreground">
                <value.icon className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {t(value.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(value.textKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div 
        ref={contactReveal.ref}
        className={`bg-card border border-border rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto shadow-soft transition-all duration-700 ${
          contactReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="heading-medium mb-4 text-foreground">{t("about.contactTitle")}</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t("about.contactLead")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`flex items-start gap-4 p-4 rounded-xl bg-muted/50 transition-all duration-300 hover:bg-muted ${
              contactReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="p-3 bg-primary/10 rounded-xl">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-foreground">
                {t("common.email")}
              </h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div 
            className={`flex items-start gap-4 p-4 rounded-xl bg-muted/50 transition-all duration-300 hover:bg-muted ${
              contactReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="p-3 bg-primary/10 rounded-xl">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-foreground">
                {t("about.basedIn")}
              </h3>
              <p className="text-muted-foreground">{t("about.basedInValue")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
