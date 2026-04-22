import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Mail, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const cottonProduct = products.find((p) => p.id === "4");
  const linenProduct = products.find((p) => p.id === "1");
  const cottonImages =
    cottonProduct?.gallery || [cottonProduct?.image || ""].filter(Boolean);
  const linenImages =
    linenProduct?.gallery || [linenProduct?.image || ""].filter(Boolean);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="w-full">
      {/* Hero Section */}
      <section
        ref={heroImageRef}
        className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
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
          <div className="absolute inset-0 bg-black/35 z-10" />
        </div>

        <div className="relative z-10 container-padding text-center max-w-4xl">
          <p className="text-sm md:text-base uppercase tracking-widest mb-4 font-medium text-white/90">
            {t("home.heroEyebrow")}
          </p>
          <h1 className="heading-large mb-8 leading-tight text-white">
            {t("home.heroTitle")}
          </h1>
          <p className="text-base md:text-lg mb-10 leading-relaxed text-white/90 max-w-2xl mx-auto">
            {t("home.heroLead")}
          </p>
          <Link
            to="/products"
            className="font-semibold py-4 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center group w-fit bg-white text-gray-900 hover:bg-white/90"
          >
            {t("home.heroCta")}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div
          className="hidden md:block absolute bottom-8 right-8 backdrop-blur-sm p-6 shadow-lg max-w-xs z-10"
          style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
        >
          <p
            className="text-sm font-semibold mb-2 uppercase tracking-widest"
            style={{ color: "var(--foreground)" }}
          >
            {t("home.heroOverlayTitle")}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t("home.heroOverlayText")}
          </p>
        </div>
      </section>

      {/* Collection Introduction */}
      <section
        className="section-padding w-full"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto container-padding text-center">
          <p
            className="text-sm md:text-base uppercase tracking-widest mb-6 font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t("home.collectionEyebrow")}
          </p>
          <h2
            className="heading-large mb-8"
            style={{ color: "var(--foreground)" }}
          >
            {t("home.collectionTitle")}
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t("home.collectionLead")}
          </p>
        </div>
      </section>

      {/* Cotton */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative">
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsCottonHovered(true)}
          onMouseLeave={() => setIsCottonHovered(false)}
        >
          <div className="relative w-full h-full" style={{ minHeight: "80vh" }}>
            {cottonImages.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: index === cottonSlideIndex ? 1 : 0,
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
          </div>
        </div>

        <div
          className="flex flex-col justify-center relative"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="container-padding py-16 lg:py-24">
            <div className="max-w-lg text-center lg:text-left">
              <p
                className="text-xs md:text-sm uppercase tracking-widest mb-4 font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("home.cottonEyebrow")}
              </p>
              <h2
                className="heading-large mb-6 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                {t("home.cottonTitle")}
              </h2>
              <p
                className="text-base md:text-lg mb-10 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("home.cottonText")}
              </p>
              <Link
                to="/products?category=Cotton"
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group border-b-2 pb-1"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--primary)",
                }}
              >
                {t("home.cottonCta")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Linen */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative">
        <div
          className="flex flex-col justify-center order-2 lg:order-1 relative"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="container-padding py-16 lg:py-24 relative z-10">
            <div className="max-w-lg text-center lg:text-left">
              <p
                className="text-xs md:text-sm uppercase tracking-widest mb-4 font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("home.linenEyebrow")}
              </p>
              <h2
                className="heading-large mb-6 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                {t("home.linenTitle")}
              </h2>
              <p
                className="text-base md:text-lg mb-10 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("home.linenText")}
              </p>
              <Link
                to="/products?category=Linen"
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group border-b-2 pb-1"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--primary)",
                }}
              >
                {t("home.linenCta")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden order-1 lg:order-2"
          onMouseEnter={() => setIsLinenHovered(true)}
          onMouseLeave={() => setIsLinenHovered(false)}
        >
          <div className="relative w-full h-full" style={{ minHeight: "80vh" }}>
            {linenImages.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: index === linenSlideIndex ? 1 : 0,
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
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='fabric' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='%23ffffff'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23000000' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23fabric)'/%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[90vh] container-padding py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm md:text-base text-white/80 uppercase tracking-widest mb-6 font-medium">
              {t("home.storyEyebrow")}
            </p>
            <h2
              className="heading-large mb-8 leading-tight whitespace-pre-line"
              style={{ color: "white" }}
            >
              {t("home.storyTitle")}
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              {t("home.storyText")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
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
          ></div>
        </div>

        <div
          className="flex flex-col justify-center"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="container-padding py-16 lg:py-24">
            <div className="max-w-lg">
              <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest mb-4 font-medium">
                {t("home.visitEyebrow")}
              </p>
              <h2
                className="heading-large mb-6 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                {t("home.visitTitle")}
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-12 leading-relaxed">
                {t("home.visitText")}
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("home.emailTitle")}
                    </h3>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--muted-foreground)")
                      }
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("home.locationTitle")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t("home.locationText")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("home.pickupTitle")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {t("home.pickupText")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
