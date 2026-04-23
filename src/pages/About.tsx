import { Mail, MapPin, Scissors, Leaf, Home } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { getAssetPath } from "../utils/images";
import { EditorialInfoHero } from "../components/EditorialInfoHero";
import { EditorialSectionKicker } from "../components/EditorialSectionKicker";

const CONTACT_EMAIL = "nook.textile@gmail.com";

const ABOUT_IMAGES = {
  hero: getAssetPath("/slider/hero-slider-05.jpg"),
  story: getAssetPath("/products/2-carrara-marble-tablecloth/main.jpg"),
  texture: getAssetPath("/products/1-reindeer-moss/main.jpg"),
  valuePhotos: [
    getAssetPath("/products/6-april-light/main.jpg"),
    getAssetPath("/products/3-carrara-marble-napkins/main.jpg"),
    getAssetPath("/products/5-first-bloom/main.jpg"),
  ] as const,
};

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
  const storyReveal = useRevealOnScroll();
  const quoteReveal = useRevealOnScroll();
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
      photo: ABOUT_IMAGES.valuePhotos[0],
    },
    {
      icon: Leaf,
      titleKey: "about.value2Title",
      textKey: "about.value2Text",
      photo: ABOUT_IMAGES.valuePhotos[1],
    },
    {
      icon: Home,
      titleKey: "about.value3Title",
      textKey: "about.value3Text",
      photo: ABOUT_IMAGES.valuePhotos[2],
    },
  ];

  return (
    <>
      <EditorialInfoHero
        imageSrc={ABOUT_IMAGES.hero}
        eyebrow={t("home.storyEyebrow")}
        title={t("about.title")}
        lead={t("about.lead")}
        ctaTo="/products"
        ctaLabel={t("common.viewAllProducts")}
        loaded={pageLoaded}
      />

      <div className="container-padding mx-auto max-w-7xl py-12 lg:py-16">
        <section
          ref={storyReveal.ref}
          className={`editorial-chapter mb-20 lg:mb-28 ${
            storyReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700`}
        >
          <EditorialSectionKicker preline="NOOK · BEOGRAD" label={t("about.storySectionLabel")} />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:gap-y-16">
            <div className="lg:col-span-6 lg:col-start-1">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                <div className="relative aspect-[4/5] max-h-[min(32rem,70vh)] overflow-hidden border border-foreground/[0.08] lg:max-h-[min(38rem,78vh)]">
                  <img
                    src={ABOUT_IMAGES.story}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="relative hidden aspect-[4/5] max-h-[min(32rem,70vh)] overflow-hidden border border-foreground/[0.08] lg:block lg:max-h-[min(38rem,78vh)]">
                  <img
                    src={ABOUT_IMAGES.texture}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div
              className={`flex flex-col justify-start space-y-8 lg:col-span-5 lg:col-start-8 lg:self-start lg:pl-2 ${
                storyReveal.isRevealed ? "delay-100" : ""
              } transition-all duration-700`}
            >
              <div className="editorial-hairline max-w-xs" aria-hidden />
              <p className="font-editorial text-pretty text-2xl font-medium leading-snug text-foreground sm:text-[1.65rem] sm:leading-snug">
                {t("about.p1")}
              </p>
              <p className="text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg">
                {t("about.p2")}
              </p>
            </div>
          </div>
        </section>

        {/* Pull quote — full-bleed band */}
        <figure
          ref={quoteReveal.ref}
          className={`relative left-1/2 right-1/2 -mx-[50vw] mb-20 w-screen max-w-[100vw] border-y border-foreground/[0.06] bg-gradient-to-b from-secondary/35 via-card/40 to-background lg:mb-28 ${
            quoteReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700`}
        >
          <div className="container-padding mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <blockquote className="flex items-start gap-3 border-l-2 border-primary/35 pl-6 sm:gap-4 sm:pl-10">
              <span
                className="font-editorial pointer-events-none shrink-0 select-none leading-none text-[clamp(2.5rem,5.5vw,4rem)] font-medium text-primary/[0.14]"
                aria-hidden
              >
                “
              </span>
              <p className="min-w-0 flex-1 text-pretty font-editorial text-[1.4rem] font-medium leading-[1.35] text-foreground sm:text-3xl md:text-[1.85rem] md:leading-snug">
                {t("about.p3")}
              </p>
            </blockquote>
          </div>
        </figure>

        <section ref={valuesReveal.ref} className="editorial-chapter mb-20 lg:mb-28">
          <div
            className={`${
              valuesReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-700`}
          >
            <EditorialSectionKicker label={t("about.valuesTitle")} />
          </div>

          <div className="divide-y divide-foreground/[0.08] border-t border-foreground/[0.08]">
            {values.map((value, index) => {
              const Icon = value.icon;
              const imageFirst = index % 2 === 0;
              return (
                <article
                  key={value.titleKey}
                  className={`editorial-service-row transition-all duration-700 ${
                    valuesReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 90}ms` }}
                >
                  <div
                    className={`relative aspect-[5/4] overflow-hidden border border-foreground/[0.06] sm:aspect-[16/10] ${
                      !imageFirst ? "md:order-2" : ""
                    }`}
                  >
                    <img
                      src={value.photo}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/25 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className={`space-y-5 ${!imageFirst ? "md:order-1 md:pr-4 lg:pr-8" : ""}`}>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl">
                      {t(value.titleKey)}
                    </h3>
                    <p className="max-w-xl text-pretty text-base leading-[1.75] text-muted-foreground">
                      {t(value.textKey)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 03 — Contact: restrained desk card */}
        <section
          ref={contactReveal.ref}
          className={`editorial-chapter editorial-panel-soft px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 ${
            contactReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700`}
        >
          <EditorialSectionKicker className="mb-8 lg:mb-10" label={t("about.contactTitle")} />
          <p className="mb-10 max-w-2xl text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg">
            {t("about.contactLead")}
          </p>
          <div className="grid gap-10 md:grid-cols-2 md:gap-6 md:divide-x md:divide-foreground/10">
            <div className="flex gap-5 md:pr-8">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary/90" aria-hidden />
              <div>
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t("common.email")}
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-pretty text-base text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <div className="flex gap-5 md:pl-8">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary/90" aria-hidden />
              <div>
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t("about.basedIn")}
                </p>
                <p className="text-pretty text-base text-foreground">{t("about.basedInValue")}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
