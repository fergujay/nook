import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Mail, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { products } from "../data/products";
import { getAssetPath } from "../utils/images";
import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";

const HERO_IMAGES = [
  "/slider/hero-slider-01.jpg",
  "/slider/hero-slider-02.jpg",
  "/slider/hero-slider-03.jpg",
  "/slider/hero-slider-04.jpg",
  "/slider/hero-slider-05.jpg",
  "/slider/hero-slider-06.jpg",
  "/slider/hero-slider-07.jpg",
  "/slider/hero-slider-08.jpg",
  "/slider/hero-slider-09.jpg",
  "/slider/hero-slider-10.jpg",
  "/slider/hero-slider-11.jpg",
  "/slider/hero-slider-12.jpg",
];

// Swipe/drag hook that works for touch and mouse.
// Returns handlers to spread onto the draggable element and whether we are actively dragging.
function useSwipe(onNext: () => void, onPrev: () => void) {
  const startRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    // Ignore right/middle clicks
    if (e.button !== 0 && e.pointerType === "mouse") return;
    startRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!startRef.current || startRef.current.id !== e.pointerId) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    // Once clearly horizontal, mark as dragging so we can change cursor & suppress clicks
    if (!isDragging && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };

  const finish = (e: React.PointerEvent<HTMLElement>) => {
    if (!startRef.current || startRef.current.id !== e.pointerId) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    startRef.current = null;
    setIsDragging(false);
    const threshold = 50;
    if (Math.abs(dx) <= Math.abs(dy)) return; // vertical intent → leave as scroll
    if (dx < -threshold) onNext();
    else if (dx > threshold) onPrev();
  };

  return {
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      // Prevent native image-drag from hijacking the gesture on desktop
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
  };
}

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

export default function Home() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [cottonSlideIndex, setCottonSlideIndex] = useState(0);
  const [linenSlideIndex, setLinenSlideIndex] = useState(0);
  const [isCottonHovered, setIsCottonHovered] = useState(false);
  const [isLinenHovered, setIsLinenHovered] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Reveal hooks for sections
  const collectionReveal = useRevealOnScroll();
  const cottonReveal = useRevealOnScroll();
  const linenReveal = useRevealOnScroll();
  const storyReveal = useRevealOnScroll();
  const contactReveal = useRevealOnScroll();

  const cottonProduct = products.find((p) => p.id === "4");
  const linenProduct = products.find((p) => p.id === "1");
  const cottonImages =
    cottonProduct?.gallery || [cottonProduct?.image || ""].filter(Boolean);
  const linenImages =
    linenProduct?.gallery || [linenProduct?.image || ""].filter(Boolean);

  const heroSwipe = useSwipe(
    () => setHeroSlideIndex((i) => (i + 1) % HERO_IMAGES.length),
    () => setHeroSlideIndex((i) => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length),
  );
  const cottonSwipe = useSwipe(
    () => setCottonSlideIndex((i) => (i + 1) % Math.max(cottonImages.length, 1)),
    () => setCottonSlideIndex((i) => (i - 1 + cottonImages.length) % Math.max(cottonImages.length, 1)),
  );
  const linenSwipe = useSwipe(
    () => setLinenSlideIndex((i) => (i + 1) % Math.max(linenImages.length, 1)),
    () => setLinenSlideIndex((i) => (i - 1 + linenImages.length) % Math.max(linenImages.length, 1)),
  );

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    // Trigger hero animation after mount
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHeroHovered || HERO_IMAGES.length <= 1) return;
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroHovered]);

  useEffect(() => {
    if (isCottonHovered || cottonImages.length <= 1) return;
    const interval = setInterval(() => {
      setCottonSlideIndex((prev) => (prev + 1) % cottonImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isCottonHovered, cottonImages.length]);

  useEffect(() => {
    if (isLinenHovered || linenImages.length <= 1) return;
    const interval = setInterval(() => {
      setLinenSlideIndex((prev) => (prev + 1) % linenImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLinenHovered, linenImages.length]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section
        ref={heroImageRef}
        className={`relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden select-none touch-pan-y ${
          heroSwipe.isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        {...heroSwipe.handlers}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0002})`,
            willChange: "transform",
          }}
        >
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === heroSlideIndex ? 1 : 0,
                zIndex: index === heroSlideIndex ? 1 : 0,
              }}
            >
              <img
                src={getAssetPath(image)}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ minHeight: "120%" }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroSlideIndex(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === heroSlideIndex 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 container-padding text-center max-w-4xl">
          <p 
            className={`section-subtitle text-[0.65rem] font-semibold uppercase tracking-[0.32em] mb-6 text-white/90 sm:text-xs transition-all duration-700 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("home.heroEyebrow")}
          </p>
          <h1 
            className={`heading-large font-editorial mb-8 leading-[1.06] tracking-[-0.02em] text-white text-balance transition-all duration-700 delay-150 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("home.heroTitle")}
          </h1>
          <p 
            className={`text-base md:text-lg mb-10 leading-relaxed text-white/90 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("home.heroLead")}
          </p>
          <div
            className={`transition-all duration-700 delay-500 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              to="/products"
              className="font-semibold py-4 px-10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center group w-fit bg-white text-foreground"
            >
              {t("home.heroCta")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div
          className={`hidden lg:block absolute bottom-12 right-12 backdrop-blur-md p-6 shadow-large max-w-xs z-10 transition-all duration-700 delay-700 border border-white/10 ${
            heroLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
        >
          <p className="text-sm font-semibold mb-2 uppercase tracking-widest text-foreground">
            {t("home.heroOverlayTitle")}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("home.heroOverlayText")}
          </p>
        </div>
      </section>

      {/* Collection Introduction */}
      <section
        ref={collectionReveal.ref}
        className="section-padding w-full bg-white"
      >
        <div className="max-w-7xl mx-auto container-padding text-center">
          <p
            className={`text-sm md:text-base uppercase tracking-[0.25em] mb-6 font-medium text-muted-foreground transition-all duration-700 ${
              collectionReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.collectionEyebrow")}
          </p>
          <h2
            className={`heading-large font-editorial mb-8 leading-[1.06] tracking-[-0.02em] text-foreground text-balance transition-all duration-700 delay-100 ${
              collectionReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.collectionTitle")}
          </h2>
          <p
            className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-muted-foreground transition-all duration-700 delay-200 ${
              collectionReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("home.collectionLead")}
          </p>
        </div>
      </section>

      {/* Cotton */}
      <section 
        ref={cottonReveal.ref}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative"
      >
        <div
          className={`relative overflow-hidden transition-all duration-1000 select-none touch-pan-y ${
            cottonSwipe.isDragging ? "cursor-grabbing" : "cursor-grab"
          } ${
            cottonReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
          onMouseEnter={() => setIsCottonHovered(true)}
          onMouseLeave={() => setIsCottonHovered(false)}
          {...cottonSwipe.handlers}
        >
          <div className="relative w-full h-full" style={{ minHeight: "80vh" }}>
            {cottonImages.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-1000 ease-in-out"
                style={{
                  opacity: index === cottonSlideIndex ? 1 : 0,
                  transform: index === cottonSlideIndex ? "scale(1)" : "scale(1.05)",
                  zIndex: index === cottonSlideIndex ? 1 : 0,
                }}
              >
                <img
                  src={image}
                  alt={`Pink coral tablecloth — view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Image slide indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {cottonImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCottonSlideIndex(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === cottonSlideIndex 
                      ? "w-6 bg-white" 
                      : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col justify-center relative bg-card transition-all duration-1000 delay-200 ${
            cottonReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
        >
          <div className="container-padding py-16 lg:py-24">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
              <p className="text-xs md:text-sm uppercase tracking-[0.25em] mb-4 font-medium text-muted-foreground">
                {t("home.cottonEyebrow")}
              </p>
              <h2 className="heading-large font-editorial mb-6 leading-[1.06] tracking-[-0.02em] text-foreground text-balance">
                {t("home.cottonTitle")}
              </h2>
              <p className="text-base md:text-lg mb-10 leading-relaxed text-muted-foreground">
                {t("home.cottonText")}
              </p>
              <Link
                to="/products?category=Cotton"
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-foreground"
              >
                <span className="relative">
                  {t("home.cottonCta")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left transition-transform duration-300 group-hover:scale-x-110" />
                </span>
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Linen */}
      <section 
        ref={linenReveal.ref}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative"
      >
        <div
          className={`flex flex-col justify-center order-2 lg:order-1 relative bg-card transition-all duration-1000 delay-200 ${
            linenReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          <div className="container-padding py-16 lg:py-24 relative z-10">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center lg:mx-0 lg:ml-auto lg:items-start lg:text-left">
              <p className="text-xs md:text-sm uppercase tracking-[0.25em] mb-4 font-medium text-muted-foreground">
                {t("home.linenEyebrow")}
              </p>
              <h2 className="heading-large font-editorial mb-6 leading-[1.06] tracking-[-0.02em] text-foreground text-balance">
                {t("home.linenTitle")}
              </h2>
              <p className="text-base md:text-lg mb-10 leading-relaxed text-muted-foreground">
                {t("home.linenText")}
              </p>
              <Link
                to="/products?category=Linen"
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group relative text-foreground"
              >
                <span className="relative">
                  {t("home.linenCta")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left transition-transform duration-300 group-hover:scale-x-110" />
                </span>
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden order-1 lg:order-2 transition-all duration-1000 select-none touch-pan-y ${
            linenSwipe.isDragging ? "cursor-grabbing" : "cursor-grab"
          } ${
            linenReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
          onMouseEnter={() => setIsLinenHovered(true)}
          onMouseLeave={() => setIsLinenHovered(false)}
          {...linenSwipe.handlers}
        >
          <div className="relative w-full h-full" style={{ minHeight: "80vh" }}>
            {linenImages.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-1000 ease-in-out"
                style={{
                  opacity: index === linenSlideIndex ? 1 : 0,
                  transform: index === linenSlideIndex ? "scale(1)" : "scale(1.05)",
                  zIndex: index === linenSlideIndex ? 1 : 0,
                }}
              >
                <img
                  src={image}
                  alt={`Reindeer moss table runner — view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Image slide indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {linenImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLinenSlideIndex(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === linenSlideIndex 
                      ? "w-6 bg-white" 
                      : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section 
        ref={storyReveal.ref}
        className="relative min-h-[90vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='fabric' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='%23ffffff'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23000000' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23fabric)'/%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[90vh] container-padding py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <p 
              className={`text-sm md:text-base text-white/80 uppercase tracking-[0.25em] mb-6 font-medium transition-all duration-700 ${
                storyReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {t("home.storyEyebrow")}
            </p>
            <h2
              className={`heading-large font-editorial mb-8 leading-[1.06] tracking-[-0.02em] whitespace-pre-line text-balance text-white transition-all duration-700 delay-100 ${
                storyReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {t("home.storyTitle")}
            </h2>
            <p 
              className={`text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-200 ${
                storyReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {t("home.storyText")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section 
        ref={contactReveal.ref}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]"
      >
        <div className="relative bg-gray-900 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
              repeating-linear-gradient(90deg, 
                transparent 0px, 
                rgba(255,255,255,0.1) 1px, 
                transparent 2px,
                transparent 20px
              ),
              repeating-linear-gradient(0deg, 
                transparent 0px, 
                rgba(255,255,255,0.1) 1px, 
                transparent 2px,
                transparent 20px
              ),
              linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%),
              linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 50%)
            `,
              filter: "blur(2px)",
            }}
          />
        </div>

        <div className="flex flex-col justify-center bg-card">
          <div className="container-padding py-16 lg:py-24">
            <div 
              className={`max-w-lg transition-all duration-700 ${
                contactReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-[0.25em] mb-4 font-medium">
                {t("home.visitEyebrow")}
              </p>
              <h2 className="heading-large font-editorial mb-6 leading-[1.06] tracking-[-0.02em] text-foreground text-balance">
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
                    icon: MapPin,
                    title: t("home.locationTitle"),
                    content: <p className="text-muted-foreground leading-relaxed">{t("home.locationText")}</p>,
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
                      contactReveal.isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
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
