import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "../data/products";
import { getAssetPath } from "../utils/images";
import ImageWithLoader from "../components/ImageWithLoader";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroButtonRef = useRef<HTMLAnchorElement>(null);
  const deliveryOverlayRef = useRef<HTMLDivElement>(null);
  const textilesSectionRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isHeroButtonHovered, setIsHeroButtonHovered] = useState(false);
  const [isDeliveryOverlayTransparent, setIsDeliveryOverlayTransparent] =
    useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [textileSlideIndex, setTextileSlideIndex] = useState(0);
  const [isTextileHovered, setIsTextileHovered] = useState(false);
  const [textileDragStart, setTextileDragStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [textileDragOffset, setTextileDragOffset] = useState(0);
  const [isTextileDragging, setIsTextileDragging] = useState(false);
  const textileContainerRef = useRef<HTMLDivElement>(null);
  const [textileContainerWidth, setTextileContainerWidth] = useState(0);
  const [cottonProductIndex, setCottonProductIndex] = useState(0);
  const [linenProductIndex, setLinenProductIndex] = useState(0);
  const [isCottonImageHovered, setIsCottonImageHovered] = useState(false);
  const [isLinenImageHovered, setIsLinenImageHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  // Hero slider images
  const heroImages = [
    "slider/hero-slider-01.jpg",
    "slider/hero-slider-02.jpg",
    "slider/hero-slider-03.jpg",
    "slider/hero-slider-04.jpg",
    "slider/hero-slider-05.jpg",
    "slider/hero-slider-06.jpg",
    "slider/hero-slider-07.jpg",
    "slider/hero-slider-08.jpg",
    "slider/hero-slider-09.jpg",
    "slider/hero-slider-10.jpg",
    "slider/hero-slider-11.jpg",
    "slider/hero-slider-12.jpg",
  ];

  // Get all products for Cotton and Linen categories
  const cottonProducts = products.filter((p) => p.category === "Cotton");
  const linenProducts = products.filter((p) => p.category === "Linen");

  // Create 2 slides: Cotton and Linen
  const textileSlides = [
    {
      category: "Cotton",
      products: cottonProducts,
      subtitle: t('everydayLuxury'),
      title: t('cotton'),
      description: t('cottonDescription'),
      link: "/products?category=Cotton",
      linkText: t('exploreCotton'),
    },
    {
      category: "Linen",
      products: linenProducts,
      subtitle: t('timelessElegance'),
      title: t('linen'),
      description: t('linenDescription'),
      link: "/products?category=Linen",
      linkText: t('exploreLinen'),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check if scrolled past hero button
      if (heroButtonRef.current) {
        const buttonRect = heroButtonRef.current.getBoundingClientRect();
        const buttonBottom = buttonRect.bottom + window.scrollY;
        setIsDeliveryOverlayTransparent(window.scrollY > buttonBottom);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle responsive video loading
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (heroContainerRef.current) {
        setContainerWidth(heroContainerRef.current.offsetWidth);
      }
      if (textileContainerRef.current) {
        setTextileContainerWidth(textileContainerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Hero slideshow
  useEffect(() => {
    if (isHeroHovered || heroImages.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHeroHovered, heroImages.length, isDragging]);

  // Drag handlers for hero carousel
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setDragOffset(0);
    setIsDragging(true);

    // Prevent text selection and scrolling during drag
    if ("touches" in e) {
      e.preventDefault();
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart || !isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = Math.abs(clientY - dragStart.y);

    // Only drag horizontally if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      e.preventDefault();
      e.stopPropagation();
      setDragOffset(deltaX);
    }
  };

  const handleDragEnd = () => {
    if (!dragStart || !isDragging) return;

    const threshold = containerWidth * 0.15; // 15% of container width

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Dragged right - go to previous slide
        setHeroSlideIndex(
          (prev) => (prev - 1 + heroImages.length) % heroImages.length
        );
      } else {
        // Dragged left - go to next slide
        setHeroSlideIndex((prev) => (prev + 1) % heroImages.length);
      }
    }

    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  // Textile slideshow (Cotton and Linen)
  useEffect(() => {
    if (isTextileHovered || textileSlides.length <= 1 || isTextileDragging)
      return;

    const interval = setInterval(() => {
      setTextileSlideIndex((prev) => (prev + 1) % textileSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isTextileHovered, textileSlides.length, isTextileDragging]);

  // Cotton product slideshow - cycles through all Cotton products
  useEffect(() => {
    if (
      isCottonImageHovered ||
      cottonProducts.length <= 1 ||
      textileSlideIndex !== 0
    )
      return;

    const interval = setInterval(() => {
      setCottonProductIndex((prev) => (prev + 1) % cottonProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isCottonImageHovered, cottonProducts.length, textileSlideIndex]);

  // Linen product slideshow - cycles through all Linen products
  useEffect(() => {
    if (
      isLinenImageHovered ||
      linenProducts.length <= 1 ||
      textileSlideIndex !== 1
    )
      return;

    const interval = setInterval(() => {
      setLinenProductIndex((prev) => (prev + 1) % linenProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLinenImageHovered, linenProducts.length, textileSlideIndex]);

  // Textile drag handlers
  const handleTextileDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setTextileDragStart({ x: clientX, y: clientY });
    setTextileDragOffset(0);
    setIsTextileDragging(true);
    if ("touches" in e) {
      e.preventDefault();
    }
  };

  const handleTextileDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!textileDragStart || !isTextileDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - textileDragStart.x;
    const deltaY = Math.abs(clientY - textileDragStart.y);
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      e.preventDefault();
      e.stopPropagation();
      setTextileDragOffset(deltaX);
    }
  };

  const handleTextileDragEnd = () => {
    if (!textileDragStart || !isTextileDragging) return;
    const threshold = textileContainerWidth * 0.15 || 100;
    if (Math.abs(textileDragOffset) > threshold) {
      if (textileDragOffset > 0) {
        setTextileSlideIndex(
          (prev) => (prev - 1 + textileSlides.length) % textileSlides.length
        );
      } else {
        setTextileSlideIndex((prev) => (prev + 1) % textileSlides.length);
      }
    }
    setTextileDragStart(null);
    setTextileDragOffset(0);
    setIsTextileDragging(false);
  };

  const handlePrevSlide = () => {
    setTextileSlideIndex(
      (prev) => (prev - 1 + textileSlides.length) % textileSlides.length
    );
  };

  const handleNextSlide = () => {
    setTextileSlideIndex((prev) => (prev + 1) % textileSlides.length);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        ref={heroImageRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden select-none"
        style={{
          marginTop: "-80px",
          paddingTop: "80px",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "pan-y pinch-zoom",
        }}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => {
          setIsHeroHovered(false);
          if (isDragging) handleDragEnd();
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Background Image Carousel */}
        <div
          ref={heroContainerRef}
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: "transform",
          }}
        >
          {heroImages.map((image, index) => {
            const isActive = index === heroSlideIndex;
            const isNext = index === (heroSlideIndex + 1) % heroImages.length;
            const isPrev =
              index ===
              (heroSlideIndex - 1 + heroImages.length) % heroImages.length;

            // Calculate position based on drag - use containerWidth for responsiveness
            let translateX = 0;
            const width =
              containerWidth || heroContainerRef.current?.offsetWidth || 0;

            if (isDragging && dragOffset !== 0 && width > 0) {
              if (isActive) {
                translateX = dragOffset;
              } else if (isNext && dragOffset < 0) {
                translateX = dragOffset + width;
              } else if (isPrev && dragOffset > 0) {
                translateX = dragOffset - width;
              }
            }

            return (
              <div
                key={index}
                className="absolute inset-0"
                style={{
                  opacity: isActive
                    ? 1
                    : (isNext || isPrev) && isDragging
                    ? 0.4
                    : 0,
                  zIndex: isActive ? 2 : isNext || isPrev ? 1 : 0,
                  transform: `translateX(${translateX}px)`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out",
                  willChange: isDragging ? "transform" : "auto",
                }}
              >
                <ImageWithLoader
                  src={getAssetPath(image)}
                  alt={`Hero slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "120%", pointerEvents: "none" }}
                />
              </div>
            );
          })}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>
        </div>

        {/* Text Content Overlay */}
        <div className="relative z-10 container-padding text-center max-w-4xl">
          <p
            className="text-xs sm:text-sm md:text-base uppercase mb-3 sm:mb-4 font-medium text-white/90 px-2"
            style={{ letterSpacing: isMobile ? "4px" : "6px" }}
          >
            {t('tableLinenMadeWithLove')}
          </p>
          <h1
            className="mb-6 md:mb-8 leading-tight text-white"
            style={{ 
              fontSize: isMobile ? "clamp(2.5rem, 8vw, 5.75rem)" : "92px"
            }}
          >
            {t('heroTitle')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed text-white/90 max-w-2xl mx-auto px-2">
            {t('heroDescription')}
          </p>
          <Link
            ref={heroButtonRef}
            to="/products"
            className="font-semibold py-3 px-6 sm:py-4 sm:px-8 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center group w-fit text-sm sm:text-base"
            style={{
              backgroundColor: isHeroButtonHovered ? "transparent" : "white",
              color: isHeroButtonHovered ? "white" : "rgb(17, 24, 39)",
              border: isHeroButtonHovered
                ? "2px solid white"
                : "2px solid transparent",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={() => setIsHeroButtonHovered(true)}
            onMouseLeave={() => setIsHeroButtonHovered(false)}
          >
            {t('viewCollection')}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Delivery Info Overlay */}
        <div
          ref={deliveryOverlayRef}
          className={`absolute bottom-4 right-4 sm:bottom-8 sm:right-8 backdrop-blur-sm p-4 sm:p-6 shadow-lg max-w-[calc(100%-2rem)] sm:max-w-xs transition-all duration-300 ${
            isMobile || isDeliveryOverlayTransparent
              ? "bg-transparent"
              : "bg-white/90"
          }`}
        >
          <p
            className={`text-xs sm:text-sm mb-2 transition-colors duration-300 ${
              isMobile || isDeliveryOverlayTransparent
                ? "text-white"
                : "text-gray-900"
            }`}
            style={{ letterSpacing: isMobile ? "4px" : "6px" }}
          >
            {t('deliveryHours')}
          </p>
          <p
            className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
              isMobile || isDeliveryOverlayTransparent
                ? "text-white/90"
                : "text-gray-700"
            }`}
          >
            {t('deliveryHoursText')}
          </p>
        </div>
      </section>

      {/* Exceptional Textiles Section */}
      <section
        ref={textilesSectionRef}
        className="section-padding w-full relative"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto container-padding text-center">
          <p
            className="text-xs sm:text-sm md:text-base uppercase mb-4 sm:mb-6 font-medium px-2"
            style={{
              color: "var(--muted-foreground)",
              letterSpacing: isMobile ? "4px" : "6px",
            }}
          >
            {t('ourCollection')}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 px-2"
            style={{ color: "var(--foreground)" }}
          >
            {t('exceptionalTextiles')}
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t('exceptionalTextilesDescription')}
          </p>
        </div>
      </section>

      {/* Textile Category Section (Cotton & Linen Slider) */}
      <section
        ref={textileContainerRef}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative select-none overflow-hidden"
        style={{
          cursor: isTextileDragging ? "grabbing" : "grab",
          touchAction: "pan-y pinch-zoom",
        }}
        onMouseEnter={() => setIsTextileHovered(true)}
        onMouseLeave={() => {
          setIsTextileHovered(false);
          if (isTextileDragging) handleTextileDragEnd();
        }}
        onMouseDown={handleTextileDragStart}
        onMouseMove={handleTextileDragMove}
        onMouseUp={handleTextileDragEnd}
        onTouchStart={handleTextileDragStart}
        onTouchMove={handleTextileDragMove}
        onTouchEnd={handleTextileDragEnd}
      >
        {textileSlides.map((slide, slideIndex) => {
          const isActive = slideIndex === textileSlideIndex;
          const isNext =
            slideIndex === (textileSlideIndex + 1) % textileSlides.length;
          const isPrev =
            slideIndex ===
            (textileSlideIndex - 1 + textileSlides.length) %
              textileSlides.length;

          let translateX = 0;
          const width =
            textileContainerWidth ||
            textileContainerRef.current?.offsetWidth ||
            0;

          if (isTextileDragging && textileDragOffset !== 0 && width > 0) {
            if (isActive) {
              translateX = textileDragOffset;
            } else if (isNext && textileDragOffset < 0) {
              translateX = textileDragOffset + width;
            } else if (isPrev && textileDragOffset > 0) {
              translateX = textileDragOffset - width;
            }
          }

          const isCotton = slide.category === "Cotton";

          return (
            <div
              key={slideIndex}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2"
              style={{
                opacity: isActive
                  ? 1
                  : (isNext || isPrev) && isTextileDragging
                  ? 0.4
                  : 0,
                zIndex: isActive ? 2 : isNext || isPrev ? 1 : 0,
                transform: `translateX(${translateX}px)`,
                transition: isTextileDragging
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out",
                willChange: isTextileDragging ? "transform" : "auto",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {/* Image Column - Left for both Cotton and Linen */}
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => {
                  if (isCotton) setIsCottonImageHovered(true);
                  else setIsLinenImageHovered(true);
                }}
                onMouseLeave={() => {
                  if (isCotton) setIsCottonImageHovered(false);
                  else setIsLinenImageHovered(false);
                }}
              >
                <div
                  className="relative w-full h-full"
                  style={{ minHeight: "80vh" }}
                >
                  {slide.products.map((product, productIndex) => {
                    const currentProductIndex = isCotton
                      ? cottonProductIndex
                      : linenProductIndex;
                    const isProductActive =
                      productIndex === currentProductIndex;

                    return (
                      <div
                        key={product.id}
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                          opacity: isProductActive ? 1 : 0,
                          zIndex: isProductActive ? 1 : 0,
                        }}
                      >
                        <ImageWithLoader
                          src={getAssetPath(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ pointerEvents: "none" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Text Column - Right for both Cotton and Linen */}
              <div
                className="flex flex-col justify-center relative"
                style={{ backgroundColor: "var(--card)" }}
              >
                <div className="container-padding py-12 sm:py-16 lg:py-24">
                  <div className="max-w-lg text-center lg:text-left lg:pl-8">
                    <p
                      className="text-xs sm:text-sm md:text-sm uppercase mb-3 sm:mb-4 font-medium section-subtitle"
                      style={{
                        color: "var(--muted-foreground)",
                        letterSpacing: isMobile ? "4px" : "6px",
                      }}
                    >
                      {slide.subtitle}
                    </p>
                    <h2
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 sm:mb-6 leading-tight"
                      style={{ color: "var(--foreground)" }}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {slide.description}
                    </p>
                    <Link
                      to={slide.link}
                      className="text-xs sm:text-sm uppercase tracking-widest font-semibold inline-flex items-center group transition-all duration-300"
                      style={{
                        color: "var(--foreground)",
                        borderBottom: "1px solid var(--primary)",
                        paddingBottom: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--primary)";
                        e.currentTarget.style.borderBottomColor = "transparent";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--foreground)";
                        e.currentTarget.style.borderBottomColor =
                          "var(--primary)";
                      }}
                    >
                      {slide.linkText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Navigation arrows */}
        {textileSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center transition-all duration-200"
              style={{
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                backgroundColor: "white",
                border: "2px solid transparent",
                color: "rgb(17, 24, 39)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.border = "2px solid white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "rgb(17, 24, 39)";
                e.currentTarget.style.border = "2px solid transparent";
              }}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center transition-all duration-200"
              style={{
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                backgroundColor: "white",
                border: "2px solid transparent",
                color: "rgb(17, 24, 39)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.border = "2px solid white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "rgb(17, 24, 39)";
                e.currentTarget.style.border = "2px solid transparent";
              }}
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </section>

      {/* Our Story Section */}
      <section
        className="section-padding w-full relative"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto container-padding text-center">
          <p
            className="text-xs sm:text-sm md:text-base uppercase mb-4 sm:mb-6 font-medium px-2"
            style={{
              color: "var(--muted-foreground)",
              letterSpacing: isMobile ? "4px" : "6px",
            }}
          >
            OUR HERITAGE
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 px-2"
            style={{ color: "var(--foreground)" }}
          >
            Two Decades of Textile Excellence
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Since 2005, we've been dedicated to sourcing and supplying the
            finest fabrics, empowering creators with materials that inspire and
            endure.
          </p>
        </div>
      </section>

      {/* Visit Our Atelier Section */}
      <section className="relative min-h-[90vh] overflow-hidden w-full">
        {/* Background - Video */}
        <div className="absolute inset-0">
          <video
            key={isMobile ? "mobile" : "hd"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              pointerEvents: "none",
            }}
            src={
              isMobile
                ? getAssetPath("videos/atelier-background-mobile.mp4")
                : getAssetPath("videos/atelier-background-hd.mp4")
            }
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Contact Information Overlay */}
        <div className="relative z-10 flex items-center justify-center min-h-[90vh] container-padding py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl mx-auto text-center">
              <p
                className="text-xs sm:text-sm md:text-base text-white/80 uppercase mb-4 sm:mb-6 font-medium px-2"
                style={{ letterSpacing: isMobile ? "4px" : "6px" }}
              >
                CONNECT WITH US
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 leading-tight text-white px-2"
                style={{ color: "white" }}
              >
                Visit Our Atelier
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8 sm:mb-12 leading-relaxed max-w-xl mx-auto px-2">
                Experience our collection firsthand at our London atelier. We
                welcome you to explore our fabrics and discuss your projects.
              </p>
            </div>

            {/* Contact Information */}
            <div className="max-w-2xl mx-auto flex justify-center">
              <div className="space-y-6 sm:space-y-8 w-full px-4">
                {/* Location */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                      Location
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed break-words">
                      123 Fabric Street, London W1U 3QP, UK
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                      Opening Hours
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                      We accept and deliver orders on weekdays, from 10 AM to 7
                      PM.
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                      Telephone
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 break-all">
                      +44 (0) 20 7123 4567
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                      Email
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 break-all">
                      <a
                        href="mailto:enquiries@textileshop.co.uk"
                        className="hover:text-white transition-colors"
                      >
                        enquiries@textileshop.co.uk
                      </a>
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
