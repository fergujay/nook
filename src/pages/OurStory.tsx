import { ArrowRight, Mail, Instagram, Scissors, Droplets, Leaf, Ruler } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { getAssetPath } from "../utils/images";
import { EditorialSectionKicker } from "../components/EditorialSectionKicker";

const CONTACT_EMAIL = "nook.textile@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/nook.belgrade/";

const IMG = {
  hero: getAssetPath("/slider/hero-slider-03.jpg"),
  heroAlt: getAssetPath("/slider/hero-slider-07.jpg"),
  table: getAssetPath("/products/2-carrara-marble-tablecloth/main.jpg"),
  texture: getAssetPath("/products/1-reindeer-moss/main.jpg"),
  character: getAssetPath("/products/7-spring-lines/main.jpg"),
  craft: [
    getAssetPath("/products/6-april-light/main.jpg"),
    getAssetPath("/products/3-carrara-marble-napkins/main.jpg"),
    getAssetPath("/products/5-first-bloom/main.jpg"),
  ] as const,
  custom: getAssetPath("/products/4-pink-coral/main.jpg"),
};

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

export default function OurStory() {
  const { t } = useLanguage();
  const heroParallax = useParallax(0.2);
  const charParallax = useParallax(0.15);
  const [loaded, setLoaded] = useState(false);

  const beliefReveal = useReveal(0.12);
  const tableReveal = useReveal();
  const quoteReveal = useReveal(0.2);
  const characterReveal = useReveal();
  const craftReveal = useReveal(0.1);
  const customReveal = useReveal();
  const contactReveal = useReveal();

  useEffect(() => { const id = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(id); }, []);

  const craftItems = [
    { icon: Scissors, titleKey: "ourStory.craft1Title", textKey: "ourStory.craft1Text", photo: IMG.craft[0] },
    { icon: Droplets, titleKey: "ourStory.craft2Title", textKey: "ourStory.craft2Text", photo: IMG.craft[1] },
    { icon: Leaf, titleKey: "ourStory.craft3Title", textKey: "ourStory.craft3Text", photo: IMG.craft[2] },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ── full-bleed image with parallax + centered statement */}
      <section ref={heroParallax.ref} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${heroParallax.offset}px)`,
            willChange: "transform",
          }}
        >
          <img src={IMG.hero} alt="" className="h-full w-full object-cover" style={{ minHeight: "120%" }} loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
        </div>

        <div className="relative z-10 container-padding text-center max-w-3xl">
          <p
            className={`text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] mb-6 text-white/80 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("ourStory.heroEyebrow")}
          </p>
          <h1
            className={`font-editorial text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-white text-balance mb-8 transition-all duration-1000 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("ourStory.title")}
          </h1>
          <p
            className={`text-base md:text-lg text-white/85 leading-relaxed max-w-xl mx-auto mb-10 transition-all duration-700 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("ourStory.lead")}
          </p>
          <div className={`transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button
              onClick={() => document.getElementById("story-start")?.scrollIntoView({ behavior: "smooth" })}
              className="font-semibold py-4 px-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center group bg-white text-foreground"
            >
              {t("ourStory.heroEyebrow")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-y-1 rotate-90 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Belief statement ── full-width band */}
      <section
        id="story-start"
        ref={beliefReveal.ref}
        className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-[#b93435] via-[#c74b4c] to-[#8a1f21]"
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40h80M40 0v80' stroke='%23fff' stroke-width='0.4' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 container-padding mx-auto max-w-4xl py-20 lg:py-28 text-center">
          <div
            className={`transition-all duration-1000 ${
              beliefReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="block w-12 h-px bg-white/30 mx-auto mb-8" aria-hidden />
            <p className="font-editorial text-[clamp(1.5rem,3.8vw,2.8rem)] font-medium leading-[1.2] text-white text-balance">
              {t("ourStory.p1")}
            </p>
            <span className="block w-12 h-px bg-white/30 mx-auto mt-8" aria-hidden />
          </div>
        </div>
      </section>

      {/* ── Why the table ── editorial split */}
      <div className="container-padding mx-auto max-w-7xl py-16 lg:py-24">
        <section
          ref={tableReveal.ref}
          className={`editorial-chapter mb-20 lg:mb-28 transition-all duration-700 ${
            tableReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <EditorialSectionKicker preline={t("ourStory.preline")} label={t("ourStory.sectionLabel")} />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative aspect-[3/4] overflow-hidden border border-foreground/[0.08]">
                  <img src={IMG.table} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]" loading="lazy" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden border border-foreground/[0.08] translate-y-8">
                  <img src={IMG.texture} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]" loading="lazy" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-8 lg:col-span-5 lg:col-start-8">
              <div className="editorial-hairline max-w-xs" aria-hidden />
              <p className="font-editorial text-pretty text-2xl font-medium leading-snug text-foreground sm:text-[1.65rem]">
                {t("ourStory.p2")}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Pull quote ── full-bleed */}
      <figure
        ref={quoteReveal.ref}
        className={`relative border-y border-foreground/[0.06] bg-gradient-to-b from-secondary/35 via-card/40 to-background transition-all duration-700 ${
          quoteReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container-padding mx-auto max-w-5xl py-16 sm:py-20 lg:py-24">
          <blockquote className="flex items-start gap-3 border-l-2 border-primary/35 pl-6 sm:gap-4 sm:pl-10">
            <span className="font-editorial pointer-events-none shrink-0 select-none leading-none text-[clamp(2.5rem,5.5vw,4rem)] font-medium text-primary/[0.14]" aria-hidden>&ldquo;</span>
            <p className="min-w-0 flex-1 text-pretty font-editorial text-[clamp(1.4rem,3.5vw,2.2rem)] font-medium leading-[1.3] text-foreground">
              {t("ourStory.quote")}
            </p>
          </blockquote>
        </div>
      </figure>

      {/* ── Quiet by design ── immersive image band with text overlay */}
      <section ref={charParallax.ref} className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${charParallax.offset}px)`,
            willChange: "transform",
          }}
        >
          <img src={IMG.character} alt="" className="h-full w-full object-cover" style={{ minHeight: "120%" }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent lg:from-black/75 lg:via-black/40" />
        </div>

        <div
          ref={characterReveal.ref}
          className={`relative z-10 container-padding py-20 lg:py-28 max-w-7xl mx-auto transition-all duration-1000 ${
            characterReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="max-w-lg lg:max-w-xl">
            <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] mb-6 text-white/70">
              {t("ourStory.characterLabel")}
            </p>
            <p className="font-editorial text-[clamp(1.4rem,3vw,2rem)] font-medium leading-[1.25] text-white text-pretty mb-6">
              {t("ourStory.characterP1")}
            </p>
            <p className="text-base md:text-lg leading-relaxed text-white/85">
              {t("ourStory.characterP2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── How we make ── three-column editorial grid */}
      <div className="container-padding mx-auto max-w-7xl py-16 lg:py-24">
        <div className="mb-14 lg:mb-20">
          <EditorialSectionKicker label={t("ourStory.craftLabel")} />
        </div>

        <div
          ref={craftReveal.ref}
          className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-12"
        >
          {craftItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.titleKey}
                className={`group transition-all duration-700 ${
                  craftReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Tall photo */}
                <div className="relative aspect-[3/4] overflow-hidden border border-foreground/[0.06] mb-8">
                  <img
                    src={item.photo}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/15 via-transparent to-transparent" aria-hidden />
                </div>

                {/* Connector line */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="h-px flex-1 bg-foreground/[0.08]" aria-hidden />
                </div>

                {/* Text */}
                <h3 className="font-editorial text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl mb-4">
                  {t(item.titleKey)}
                </h3>
                <p className="text-pretty text-[0.938rem] leading-[1.75] text-muted-foreground">
                  {t(item.textKey)}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Custom pieces ── split with image */}
      <section
        ref={customReveal.ref}
        className={`grid grid-cols-1 lg:grid-cols-2 min-h-[50vh] transition-all duration-700 ${
          customReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative overflow-hidden order-2 lg:order-1">
          <img src={IMG.custom} alt="" className="h-full w-full object-cover min-h-[40vh]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent lg:bg-gradient-to-l" aria-hidden />
        </div>
        <div className="flex flex-col justify-center order-1 lg:order-2 bg-card">
          <div className="container-padding py-14 lg:py-20">
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex h-12 w-12 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary">
                  <Ruler className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl mb-5">
                {t("ourStory.customLabel")}
              </h3>
              <p className="text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg mb-8">
                {t("ourStory.customText")}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-foreground"
              >
                <span className="relative">
                  {t("common.email")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left transition-transform duration-300 group-hover:scale-x-110" />
                </span>
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <div className="container-padding mx-auto max-w-7xl py-16 lg:py-24">
        <section
          ref={contactReveal.ref}
          className={`editorial-panel-soft px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 transition-all duration-700 ${
            contactReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <EditorialSectionKicker className="mb-8 lg:mb-10" label={t("ourStory.contactLabel")} />
          <p className="mb-10 max-w-2xl text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg">
            {t("ourStory.contactLead")}
          </p>
          <div className="grid gap-10 md:grid-cols-2 md:gap-6 md:divide-x md:divide-foreground/10">
            <div className="flex gap-5 md:pr-8">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary/90" aria-hidden />
              <div>
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{t("common.email")}</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-pretty text-base text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
            <div className="flex gap-5 md:pl-8">
              <Instagram className="mt-0.5 h-5 w-5 shrink-0 text-primary/90" aria-hidden />
              <div>
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Instagram</p>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-pretty text-base text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40">
                  @nook.belgrade
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
