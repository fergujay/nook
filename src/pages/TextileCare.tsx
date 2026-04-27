import { Droplet, Sun, Shirt, Wind, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { getAssetPath } from "../utils/images";
import { useLanguage } from "../contexts/LanguageContext";

const SECTION_IDS = ["washing", "drying", "ironing", "storage"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTION_ICONS: Record<SectionId, typeof Droplet> = {
  washing: Droplet,
  drying: Sun,
  ironing: Shirt,
  storage: Wind,
};

// Lifestyle photos chosen for full-bleed legibility under a dark gradient.
const SECTION_IMAGES: Record<SectionId, string> = {
  washing: "/slider/hero-slider-02.jpg",
  drying: "/slider/hero-slider-05.jpg",
  ironing: "/slider/hero-slider-08.jpg",
  storage: "/slider/hero-slider-11.jpg",
};

const HERO_IMAGE = "/slider/hero-slider-09.jpg";

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useParallax(factor = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffset(-rect.top * factor);
  }, [factor]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  return { ref, offset };
}

interface CareBandProps {
  index: number;
  id: string;
  icon: typeof Droplet;
  title: string;
  tips: string[];
  photo: string;
}

function CareBand({ index, id, icon: Icon, title, tips, photo }: CareBandProps) {
  const parallax = useParallax(0.15);
  const reveal = useReveal();
  const textOnLeft = index % 2 === 0;

  return (
    <section
      id={id}
      ref={parallax.ref}
      className="relative min-h-[85vh] flex items-center overflow-hidden scroll-mt-24"
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${parallax.offset}px)`,
          willChange: "transform",
        }}
      >
        <img
          src={getAssetPath(photo)}
          alt=""
          className="h-full w-full object-cover"
          style={{ minHeight: "120%" }}
          loading="lazy"
        />
        <div
          className={`absolute inset-0 ${
            textOnLeft
              ? "bg-gradient-to-r from-black/65 via-black/30 to-transparent"
              : "bg-gradient-to-l from-black/65 via-black/30 to-transparent"
          }`}
        />
      </div>

      <div
        ref={reveal.ref}
        className={`relative z-10 container-padding py-20 lg:py-28 mx-auto max-w-7xl w-full transition-all duration-1000 ${
          reveal.visible
            ? "opacity-100 translate-x-0"
            : `opacity-0 ${textOnLeft ? "-translate-x-8" : "translate-x-8"}`
        }`}
      >
        <div
          className={`max-w-lg lg:max-w-xl ${
            textOnLeft ? "" : "ml-auto lg:text-right"
          }`}
        >
          <p className="font-editorial leading-none tracking-[-0.04em] text-white/30 text-[clamp(3rem,6vw,5rem)] mb-6">
            {String(index + 1).padStart(2, "0")}
          </p>
          <div
            className={`mb-6 flex items-center gap-4 ${
              textOnLeft ? "" : "lg:flex-row-reverse"
            }`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="h-px w-12 bg-white/30" aria-hidden />
          </div>
          <h2 className="font-editorial text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white text-balance mb-8">
            {title}
          </h2>
          <ul
            className={`space-y-3.5 ${textOnLeft ? "" : "lg:ml-auto"}`}
          >
            {tips.map((tip, i) => (
              <li
                key={i}
                className={`text-base md:text-[1.05rem] leading-[1.7] text-white/85 max-w-md ${
                  textOnLeft
                    ? "border-l border-white/25 pl-4"
                    : "border-l border-white/25 pl-4 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-4 lg:ml-auto lg:text-right"
                }`}
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function TextileCare() {
  const { t, tList } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [chevronVisible, setChevronVisible] = useState(true);
  const heroParallax = useParallax(0.2);
  const notesReveal = useReveal();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setChevronVisible(false), 4000);
    const onScroll = () => {
      if (window.scrollY > 80) setChevronVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const sections = SECTION_IDS.map((id) => ({
    id,
    icon: SECTION_ICONS[id],
    title: t(`textileCare.sections.${id}.title`),
    tips: tList(`textileCare.sections.${id}.tips`),
    photo: SECTION_IMAGES[id],
  }));

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero — cinematic full-screen, parallax, scroll cue */}
      <section
        ref={heroParallax.ref}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${heroParallax.offset}px)`,
            willChange: "transform",
          }}
        >
          <img
            src={getAssetPath(HERO_IMAGE)}
            alt=""
            className="h-full w-full object-cover"
            style={{ minHeight: "120%" }}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55" />
        </div>

        <div className="relative z-10 container-padding text-center max-w-4xl">
          <p
            className={`text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] mb-7 text-white/80 transition-all duration-700 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("textileCare.heroEyebrow")}
          </p>
          <h1
            className={`font-editorial text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-white text-balance mb-8 transition-all duration-1000 delay-200 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("textileCare.title")}
          </h1>
          <p
            className={`text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-500 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("textileCare.lead")}
          </p>
          <div
            className={`mt-8 transition-all duration-700 delay-700 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#washing"
              className="font-semibold py-4 px-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center group bg-white text-foreground"
            >
              {t("common.learnMore")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-y-1 rotate-90 transition-transform" />
            </a>
          </div>
        </div>

        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-700 delay-1000 ${
            pageLoaded && chevronVisible ? "opacity-60" : "opacity-0"
          }`}
        >
          <ChevronDown className="h-4 w-4 text-white animate-bounce" aria-hidden />
        </div>
      </section>

      {/* Four immersive care bands */}
      {sections.map((section, i) => (
        <CareBand
          key={section.id}
          index={i}
          id={section.id}
          icon={section.icon}
          title={section.title}
          tips={section.tips}
          photo={section.photo}
        />
      ))}

      {/* Notes — quiet editorial pull-quote band */}
      <section ref={notesReveal.ref} className="relative py-24 lg:py-32">
        <div className="container-padding mx-auto max-w-3xl text-center">
          <span
            className={`block w-12 h-px bg-foreground/20 mx-auto mb-10 transition-all duration-700 ${
              notesReveal.visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            aria-hidden
          />
          <p
            className={`text-[0.65rem] sm:text-xs uppercase tracking-[0.32em] mb-7 font-semibold text-muted-foreground transition-all duration-700 ${
              notesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("textileCare.notesTitle")}
          </p>
          <ul
            className={`mx-auto max-w-2xl divide-y divide-foreground/10 border-y border-foreground/10 transition-all duration-1000 delay-150 ${
              notesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {tList("textileCare.notesItems").map((note, idx) => (
              <li
                key={idx}
                className="font-editorial italic text-lg md:text-xl text-muted-foreground leading-[1.6] py-7 px-4"
              >
                {note}
              </li>
            ))}
          </ul>
          <span
            className={`block w-12 h-px bg-foreground/20 mx-auto mt-10 transition-all duration-700 delay-500 ${
              notesReveal.visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            aria-hidden
          />
        </div>
      </section>
    </div>
  );
}
