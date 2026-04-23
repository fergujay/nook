import { Droplet, Sun, Shirt, Wind } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { getAssetPath } from "../utils/images";
import { EditorialInfoHero } from "../components/EditorialInfoHero";
import { EditorialSectionKicker } from "../components/EditorialSectionKicker";

const SECTION_IDS = ["washing", "drying", "ironing", "storage"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTION_ICONS: Record<SectionId, typeof Droplet> = {
  washing: Droplet,
  drying: Sun,
  ironing: Shirt,
  storage: Wind,
};

const CARE_IMAGES: Record<SectionId, string> = {
  washing: getAssetPath("/products/4-pink-coral/main.jpg"),
  drying: getAssetPath("/products/6-april-light/main.jpg"),
  ironing: getAssetPath("/products/2-carrara-marble-tablecloth/main.jpg"),
  storage: getAssetPath("/products/5-first-bloom/main.jpg"),
};

const HERO_IMAGE = getAssetPath("/slider/hero-slider-09.jpg");

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

export default function TextileCare() {
  const { t, tList } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);
  const gridReveal = useRevealOnScroll();
  const notesReveal = useRevealOnScroll();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sections = SECTION_IDS.map((id) => ({
    id,
    icon: SECTION_ICONS[id],
    title: t(`textileCare.sections.${id}.title`),
    tips: tList(`textileCare.sections.${id}.tips`),
    photo: CARE_IMAGES[id],
  }));

  return (
    <>
      <EditorialInfoHero
        imageSrc={HERO_IMAGE}
        eyebrow={t("textileCare.heroEyebrow")}
        title={t("textileCare.title")}
        lead={t("textileCare.lead")}
        ctaTo="/products"
        ctaLabel={t("common.viewAllProducts")}
        loaded={pageLoaded}
      />

      <div className="container-padding mx-auto max-w-7xl py-12 lg:py-16">
        <section ref={gridReveal.ref} className="editorial-chapter mb-20 lg:mb-28">
          <div
            className={`${
              gridReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-700`}
          >
            <EditorialSectionKicker label={t("textileCare.stepsTitle")} />
          </div>

          <div className="min-w-0 divide-y divide-foreground/[0.08] border-t border-foreground/[0.08]">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const imageFirst = index % 2 === 0;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className={`editorial-service-row scroll-mt-28 transition-all duration-700 ${
                      gridReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 70}ms` }}
                  >
                    <div
                      className={`relative aspect-[5/4] overflow-hidden border border-foreground/[0.06] sm:aspect-[16/10] ${
                        !imageFirst ? "md:order-2" : ""
                      }`}
                    >
                      <img
                        src={section.photo}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"
                        aria-hidden
                      />
                    </div>
                    <div
                      className={`flex gap-4 md:gap-5 ${!imageFirst ? "md:order-1 md:pr-2" : ""}`}
                    >
                      <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary md:mt-1.5 md:h-12 md:w-12">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1 space-y-4">
                        <h2 className="font-editorial text-2xl font-medium tracking-tight text-foreground sm:text-[1.75rem]">
                          {section.title}
                        </h2>
                        <ul className="m-0 list-none space-y-3.5 p-0 text-pretty">
                          {section.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="text-base leading-[1.7] text-muted-foreground"
                            >
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>

        {/* Notes — two-column manuscript panel */}
        <section
          ref={notesReveal.ref}
          className={`editorial-chapter editorial-panel-soft px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 ${
            notesReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700`}
        >
          <EditorialSectionKicker className="mb-8 lg:mb-10" label={t("textileCare.notesTitle")} />
          <div className="editorial-hairline mb-10 max-w-md" aria-hidden />
          <ul className="columns-1 gap-x-12 gap-y-5 text-pretty md:columns-2">
            {tList("textileCare.notesItems").map((note, idx) => (
              <li
                key={idx}
                className="mb-5 break-inside-avoid pl-6 text-base leading-[1.75] text-muted-foreground sm:text-[1.05rem]"
              >
                <span className="-ml-6 mr-3 inline-block font-editorial text-lg text-primary/50">·</span>
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
