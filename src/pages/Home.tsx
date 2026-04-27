import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Mail, MessageCircle, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { getAssetPath } from "../utils/images";
import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/nook.belgrade/";

// Curated selection — fewer slides, more confidence.
const HERO_IMAGES = [
  "/slider/hero-slider-01.jpg",
  "/slider/hero-slider-04.jpg",
  "/slider/hero-slider-07.jpg",
  "/slider/hero-slider-09.jpg",
  "/slider/hero-slider-12.jpg",
];

// Distinct lifestyle photos for the immersive bands so each section has its own atmosphere.
const LINEN_IMAGE = "/slider/hero-slider-02.jpg";
const COTTON_IMAGE = "/products/4-pink-coral/main.jpg";
const STORY_IMAGE = "/slider/hero-slider-06.jpg";
const CONTACT_IMAGE = "/slider/hero-slider-10.jpg";

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
    const progress = -rect.top * factor;
    setOffset(progress);
  }, [factor]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  return { ref, offset };
}

export default function Home() {
  const { t } = useLanguage();
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [chevronVisible, setChevronVisible] = useState(true);

  const heroParallax = useParallax(0.2);
  const linenParallax = useParallax(0.15);
  const cottonParallax = useParallax(0.15);
  const storyParallax = useParallax(0.18);
  const contactParallax = useParallax(0.12);

  const collectionReveal = useReveal();
  const linenReveal = useReveal();
  const cottonReveal = useReveal();
  const storyReveal = useReveal();
  const contactReveal = useReveal();

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroSlide((p) => (p + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
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

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ── full-screen, cinematic, minimal UI */}
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
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image}
              className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
              style={{
                opacity: index === heroSlide ? 1 : 0,
                zIndex: index === heroSlide ? 1 : 0,
              }}
            >
              <img
                src={getAssetPath(image)}
                alt=""
                className="w-full h-full object-cover"
                style={{ minHeight: "120%" }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/35 via-black/25 to-black/55" />
        </div>

        {/* Centered headline */}
        <div className="relative z-10 container-padding text-center max-w-4xl">
          <p
            className={`text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] mb-7 text-white/80 transition-all duration-700 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("home.heroEyebrow")}
          </p>
          <h1
            className={`font-editorial text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-white text-balance mb-8 transition-all duration-1000 delay-200 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.heroTitle")}
          </h1>
          <p
            className={`text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto mb-10 transition-all duration-700 delay-500 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("home.heroLead")}
          </p>
          <div
            className={`transition-all duration-700 delay-700 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              to="/products"
              className="font-semibold py-4 px-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center group bg-white text-foreground"
            >
              {t("home.heroCta")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Slim bar indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroSlide(index)}
              className={`h-px transition-all duration-700 ${
                index === heroSlide ? "w-12 bg-white" : "w-6 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-700 delay-1000 ${
            heroLoaded && chevronVisible ? "opacity-60" : "opacity-0"
          }`}
        >
          <ChevronDown className="h-4 w-4 text-white animate-bounce" aria-hidden />
        </div>
      </section>

      {/* ── Collection intro ── editorial pull-quote band */}
      <section
        ref={collectionReveal.ref}
        className="relative py-24 lg:py-32"
      >
        <div className="container-padding mx-auto max-w-3xl text-center">
          <span
            className={`block w-12 h-px bg-foreground/20 mx-auto mb-10 transition-all duration-700 ${
              collectionReveal.visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            aria-hidden
          />
          <p
            className={`text-[0.65rem] sm:text-xs uppercase tracking-[0.32em] mb-7 font-semibold text-muted-foreground transition-all duration-700 ${
              collectionReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.collectionEyebrow")}
          </p>
          <h2
            className={`font-editorial text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground text-balance mb-8 transition-all duration-1000 delay-150 ${
              collectionReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.collectionTitle")}
          </h2>
          <p
            className={`font-editorial italic text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto transition-all duration-700 delay-300 ${
              collectionReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.collectionLead")}
          </p>
          <span
            className={`block w-12 h-px bg-foreground/20 mx-auto mt-10 transition-all duration-700 delay-500 ${
              collectionReveal.visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            aria-hidden
          />
        </div>
      </section>

      {/* ── Linen ── full-bleed immersive band, text on left */}
      <section
        ref={linenParallax.ref}
        className="relative min-h-[85vh] flex items-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${linenParallax.offset}px)`,
            willChange: "transform",
          }}
        >
          <img
            src={getAssetPath(LINEN_IMAGE)}
            alt=""
            className="h-full w-full object-cover"
            style={{ minHeight: "120%" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        </div>

        <div
          ref={linenReveal.ref}
          className={`relative z-10 container-padding py-20 lg:py-28 mx-auto max-w-7xl w-full transition-all duration-1000 ${
            linenReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="max-w-lg lg:max-w-xl">
            <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] mb-6 text-white/70">
              {t("home.linenEyebrow")}
            </p>
            <h2 className="font-editorial text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white text-balance mb-6">
              {t("home.linenTitle")}
            </h2>
            <p className="text-base md:text-lg text-white/85 leading-relaxed mb-10 max-w-md">
              {t("home.linenText")}
            </p>
            <Link
              to="/products?category=Linen"
              className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-white"
            >
              <span className="relative">
                {t("home.linenCta")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white origin-left transition-transform duration-300 group-hover:scale-x-110" />
              </span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cotton ── full-bleed immersive band, text on right */}
      <section
        ref={cottonParallax.ref}
        className="relative min-h-[85vh] flex items-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${cottonParallax.offset}px)`,
            willChange: "transform",
          }}
        >
          <img
            src={getAssetPath(COTTON_IMAGE)}
            alt=""
            className="h-full w-full object-cover"
            style={{ minHeight: "120%" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/30 to-transparent" />
        </div>

        <div
          ref={cottonReveal.ref}
          className={`relative z-10 container-padding py-20 lg:py-28 mx-auto max-w-7xl w-full transition-all duration-1000 ${
            cottonReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <div className="max-w-lg lg:max-w-xl ml-auto lg:text-right">
            <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] mb-6 text-white/70">
              {t("home.cottonEyebrow")}
            </p>
            <h2 className="font-editorial text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white text-balance mb-6">
              {t("home.cottonTitle")}
            </h2>
            <p className="text-base md:text-lg text-white/85 leading-relaxed mb-10 max-w-md lg:ml-auto">
              {t("home.cottonText")}
            </p>
            <Link
              to="/products?category=Cotton"
              className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-white"
            >
              <ArrowRight className="mr-3 h-4 w-4 rotate-180 group-hover:-translate-x-2 transition-transform duration-300 lg:hidden" />
              <span className="relative">
                {t("home.cottonCta")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white origin-left transition-transform duration-300 group-hover:scale-x-110" />
              </span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300 hidden lg:inline-block" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Story ── full-bleed real photo with parallax */}
      <section
        ref={storyParallax.ref}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${storyParallax.offset}px)`,
            willChange: "transform",
          }}
        >
          <img
            src={getAssetPath(STORY_IMAGE)}
            alt=""
            className="h-full w-full object-cover"
            style={{ minHeight: "120%" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f1a17]/80 via-[#2a211c]/62 to-[#1f1a17]/84" />
        </div>

        <div
          ref={storyReveal.ref}
          className="relative z-10 container-padding py-24 lg:py-32 max-w-3xl mx-auto text-center"
        >
          <p
            className={`text-[0.65rem] sm:text-xs text-white/80 uppercase tracking-[0.32em] mb-7 font-semibold transition-all duration-700 ${
              storyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.storyEyebrow")}
          </p>
          <h2
            className={`font-editorial text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.02em] whitespace-pre-line text-balance text-white mb-8 transition-all duration-1000 delay-150 ${
              storyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.storyTitle")}
          </h2>
          <p
            className={`text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              storyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.storyText")}
          </p>
          <div
            className={`mt-10 flex justify-center transition-all duration-700 delay-500 ${
              storyReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              to="/our-story"
              className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-white"
            >
              <span className="relative">
                {t("home.storyCta")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white origin-left transition-transform duration-300 group-hover:scale-x-110" />
              </span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ── real image left, details right */}
      <section
        ref={contactReveal.ref}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]"
      >
        <div ref={contactParallax.ref} className="relative overflow-hidden min-h-[40vh] lg:min-h-[70vh]">
          <div
            className="absolute inset-0"
            style={{
              transform: `translateY(${contactParallax.offset}px)`,
              willChange: "transform",
            }}
          >
            <img
              src={getAssetPath(CONTACT_IMAGE)}
              alt=""
              className="h-full w-full object-cover"
              style={{ minHeight: "120%" }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" />
          </div>
        </div>

        <div className="flex flex-col justify-center bg-card">
          <div className="container-padding py-16 lg:py-24">
            <div
              className={`max-w-lg transition-all duration-700 ${
                contactReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-[0.65rem] sm:text-xs text-muted-foreground uppercase tracking-[0.32em] mb-5 font-semibold">
                {t("home.visitEyebrow")}
              </p>
              <h2 className="font-editorial text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground text-balance mb-6">
                {t("home.visitTitle")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-12 leading-relaxed">
                {t("home.visitText")}
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Mail,
                    title: t("home.emailTitle"),
                    content: (
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    ),
                    delay: "delay-100",
                  },
                  {
                    icon: Instagram,
                    title: t("home.locationTitle"),
                    content: (
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {t("home.locationText")}
                      </a>
                    ),
                    delay: "delay-200",
                  },
                  {
                    icon: MessageCircle,
                    title: t("home.pickupTitle"),
                    content: <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{t("home.pickupText")}</p>,
                    delay: "delay-300",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 transition-all duration-700 ${item.delay} ${
                      contactReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary shadow-md transition-transform duration-300 hover:scale-105">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
