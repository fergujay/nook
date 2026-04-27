import { Truck, Package, MapPin, Mail, BadgePercent, CreditCard, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { getAssetPath } from "../utils/images";
import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";

const HERO_IMAGE = "/slider/hero-slider-12.jpg";

const OPTION_CONFIG = [
  {
    id: "belgrade",
    icon: Truck,
    photo: "/slider/hero-slider-03.jpg",
    eyebrow: "BELGRADE · COURIER",
    titleKey: "courier.optionBelgradeTitle",
    priceKey: "courier.optionBelgradePrice",
    descKey: "courier.optionBelgradeDesc",
    paymentKey: "courier.optionBelgradePayment",
  },
  {
    id: "post",
    icon: Package,
    photo: "/slider/hero-slider-06.jpg",
    eyebrow: "SERBIA · POST",
    titleKey: "courier.optionPostTitle",
    priceKey: "courier.optionPostPrice",
    descKey: "courier.optionPostDesc",
    paymentKey: "courier.optionPostPayment",
  },
  {
    id: "pickup",
    icon: MapPin,
    photo: "/slider/hero-slider-10.jpg",
    eyebrow: "BELGRADE · PICKUP",
    titleKey: "courier.optionPickupTitle",
    priceKey: "courier.optionPickupPrice",
    descKey: "courier.optionPickupDesc",
    paymentKey: "courier.optionPickupPayment",
  },
] as const;

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

interface OptionBandProps {
  index: number;
  icon: typeof Truck;
  eyebrow: string;
  title: string;
  description: string;
  payment: string;
  price: string;
  photo: string;
}

function OptionBand({
  index,
  icon: Icon,
  eyebrow,
  title,
  description,
  payment,
  price,
  photo,
}: OptionBandProps) {
  const parallax = useParallax(0.15);
  const reveal = useReveal();
  const textOnLeft = index % 2 === 0;

  return (
    <section
      ref={parallax.ref}
      className="relative min-h-[85vh] flex items-center overflow-hidden"
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
          <div
            className={`mb-6 flex items-center gap-4 ${
              textOnLeft ? "" : "lg:flex-row-reverse"
            }`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
              {eyebrow}
            </p>
          </div>
          <h2 className="font-editorial text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white text-balance mb-6">
            {title}
          </h2>
          <p
            className={`text-base md:text-lg text-white/85 leading-relaxed mb-8 max-w-md ${
              textOnLeft ? "" : "lg:ml-auto"
            }`}
          >
            {description}
          </p>
          <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/60 mb-8">
            {payment}
          </p>
          <div
            className={`pt-6 border-t border-white/25 max-w-xs ${
              textOnLeft ? "" : "lg:ml-auto"
            }`}
          >
            <p className="font-editorial text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.02em] tabular-nums text-white">
              {price}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Courier() {
  const { t, tList } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [chevronVisible, setChevronVisible] = useState(true);
  const heroParallax = useParallax(0.2);
  const termsReveal = useReveal();
  const contactReveal = useReveal();

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

  const options = OPTION_CONFIG.map((cfg) => ({
    ...cfg,
    title: t(cfg.titleKey),
    price: t(cfg.priceKey),
    description: t(cfg.descKey),
    payment: t(cfg.paymentKey),
  }));

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero — cinematic full-screen */}
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
            {t("courier.heroEyebrow")}
          </p>
          <h1
            className={`font-editorial text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-white text-balance mb-8 transition-all duration-1000 delay-200 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("courier.title")}
          </h1>
          <p
            className={`text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-500 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("courier.lead")}
          </p>
          <div
            className={`mt-8 transition-all duration-700 delay-700 ${
              pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#delivery-options"
              className="font-semibold py-4 px-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center group bg-white text-foreground"
            >
              {t("common.aboutDelivery")}
              <ArrowRight className="ml-2 h-5 w-5 rotate-90 transition-transform group-hover:translate-y-1" aria-hidden />
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

      {/* Three immersive service bands */}
      <div id="delivery-options">
        {options.map((option, i) => (
          <OptionBand
            key={option.id}
            index={i}
            icon={option.icon}
            eyebrow={option.eyebrow}
            title={option.title}
            description={option.description}
            payment={option.payment}
            price={option.price}
            photo={option.photo}
          />
        ))}
      </div>

      {/* Terms & Payment — editorial folio */}
      <section
        ref={termsReveal.ref}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <div className="relative container-padding mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span
              className={`block w-12 h-px bg-foreground/20 mx-auto mb-10 transition-all duration-700 ${
                termsReveal.visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
              aria-hidden
            />
            <p
              className={`text-[0.65rem] sm:text-xs uppercase tracking-[0.32em] font-semibold text-muted-foreground transition-all duration-700 ${
                termsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {t("courier.detailsTitle")}
            </p>
          </div>

          <div
            className={`grid gap-14 lg:grid-cols-2 lg:gap-20 transition-all duration-1000 delay-150 ${
              termsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="text-center lg:text-left">
              <span className="inline-flex h-11 w-11 items-center justify-center border border-foreground/15 text-primary mb-6">
                <BadgePercent className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-editorial text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-tight tracking-[-0.015em] text-foreground mb-5">
                {t("courier.freeShippingTitle")}
              </h3>
              <p className="text-base md:text-lg leading-[1.7] text-muted-foreground max-w-md mx-auto lg:mx-0">
                {t("courier.freeShippingText")}
              </p>
            </div>

            <div className="text-center lg:text-left lg:border-l lg:border-foreground/10 lg:pl-20">
              <span className="inline-flex h-11 w-11 items-center justify-center border border-foreground/15 text-primary mb-6">
                <CreditCard className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-editorial text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-tight tracking-[-0.015em] text-foreground mb-5">
                {t("courier.paymentsTitle")}
              </h3>
              <ul className="space-y-3 max-w-md mx-auto lg:mx-0">
                {tList("courier.paymentsItems").map((item, idx) => (
                  <li
                    key={idx}
                    className="text-base md:text-[1.05rem] leading-[1.7] text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Concierge contact — minimal centered band */}
      <section ref={contactReveal.ref} className="relative py-24 lg:py-32 border-t border-foreground/10">
        <div className="container-padding mx-auto max-w-3xl text-center">
          <p
            className={`text-[0.65rem] sm:text-xs uppercase tracking-[0.32em] mb-7 font-semibold text-muted-foreground transition-all duration-700 ${
              contactReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("courier.questionsTitle")}
          </p>
          <p
            className={`font-editorial italic text-xl md:text-2xl text-muted-foreground leading-[1.5] max-w-xl mx-auto mb-10 transition-all duration-700 delay-150 ${
              contactReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("courier.questionsText")}
          </p>
          <div
            className={`transition-all duration-700 delay-300 ${
              contactReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-foreground"
            >
              <Mail className="mr-3 h-4 w-4" aria-hidden />
              <span className="relative">
                {CONTACT_EMAIL}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground origin-left transition-transform duration-300 group-hover:scale-x-110" />
              </span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
