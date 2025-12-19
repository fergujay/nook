import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Phone, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "../data/products";
import { getAssetPath } from "../utils/images";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [cottonSlideIndex, setCottonSlideIndex] = useState(0);
  const [linenSlideIndex, setLinenSlideIndex] = useState(0);
  const [isCottonHovered, setIsCottonHovered] = useState(false);
  const [isLinenHovered, setIsLinenHovered] = useState(false);

  // Hero slider images
  const heroImages = [
    'slider/IMG_6031.jpg',
    'slider/IMG_6032.jpg',
    'slider/IMG_6035.jpg',
    'slider/IMG_6043.jpg',
    'slider/IMG_6046.jpg',
    'slider/IMG_6047.jpg',
    'slider/IMG_6049.jpg',
    'slider/IMG_6051.jpg',
    'slider/IMG_6059.jpg',
    'slider/IMG_6060.jpg',
    'slider/IMG_6061.jpg',
    'slider/IMG_6063.jpg',
  ];

  // Get product galleries
  const cottonProduct = products.find((p) => p.id === "4");
  const linenProduct = products.find((p) => p.id === "1");
  const cottonImages = cottonProduct?.gallery || [cottonProduct?.image || ""].filter(Boolean);
  const linenImages = linenProduct?.gallery || [linenProduct?.image || ""].filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero slideshow
  useEffect(() => {
    if (isHeroHovered || heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHeroHovered, heroImages.length]);

  // Cotton slideshow
  useEffect(() => {
    if (isCottonHovered || cottonImages.length <= 1) return;

    const interval = setInterval(() => {
      setCottonSlideIndex((prev) => (prev + 1) % cottonImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isCottonHovered, cottonImages.length]);

  // Linen slideshow
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
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden" 
        style={{ marginTop: '-80px', paddingTop: '80px' }}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Background Image Carousel */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: "transform",
          }}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
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
              />
            </div>
          ))}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
        </div>

        {/* Text Content Overlay */}
        <div className="relative z-10 container-padding text-center max-w-4xl">
          <p
            className="text-sm md:text-base uppercase tracking-wider mb-4 font-medium text-white/90"
          >
            CURATED TEXTILES
          </p>
          <h1
            className="heading-large mb-8 leading-tight text-white"
          >
            Artistry in Every Thread
            </h1>
          <p
            className="text-base md:text-lg mb-10 leading-relaxed text-white/90 max-w-2xl mx-auto"
          >
            A carefully curated collection of exceptional fabrics, sourced
            from the finest mills across Britain and beyond.
          </p>
          <Link
            to="/products"
            className="font-semibold py-4 px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center group w-fit bg-white text-gray-900 hover:bg-white/90"
          >
            VIEW COLLECTION
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
        </div>

        {/* Establishment Info Overlay */}
        <div
          className="absolute bottom-8 right-8 backdrop-blur-sm p-6 shadow-lg max-w-xs bg-white/90"
        >
          <p
            className="text-sm font-semibold mb-2 text-gray-900"
          >
            ESTABLISHED 2005
          </p>
          <p
            className="text-sm leading-relaxed text-gray-700"
          >
            Twenty years of excellence in textile craftsmanship
          </p>
        </div>
      </section>

      {/* Collection Introduction Section */}
      <section
        className="section-padding w-full"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto container-padding text-center">
          <p
            className="text-sm md:text-base uppercase tracking-widest mb-6 font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            OUR COLLECTION
          </p>
          <h2
            className="heading-large mb-8"
            style={{ color: "var(--foreground)" }}
          >
            Exceptional Textiles
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            Each fabric in our collection is chosen for its unique character,
            quality, and the artistry behind its creation
          </p>
        </div>
      </section>

      {/* Cotton Category Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative">
        {/* Left Column - Product Image Slideshow */}
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
                  src={getAssetPath(image)}
                  alt={`Pink coral Tablecloth - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Text Content */}
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
                EVERYDAY LUXURY
              </p>
              <h2
                className="heading-large mb-6 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                Cotton
              </h2>
              <p
                className="text-base md:text-lg mb-10 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Soft, breathable cotton in an array of sophisticated hues and
                weaves
              </p>
              <Link
                to="/products?category=Cotton"
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group border-b-2 pb-1"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--primary)",
                }}
              >
                EXPLORE COTTON
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Linen Category Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] relative">
        {/* Left Column - Text Content */}
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
                TIMELESS ELEGANCE
              </p>
              <h2
                className="heading-large mb-6 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                Linen
              </h2>
              <p
                className="text-base md:text-lg mb-10 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Luxurious linen with an exquisite drape and natural texture
              </p>
              <Link
                to="/products?category=Linen"
                className="text-sm uppercase tracking-widest font-semibold inline-flex items-center group border-b-2 pb-1"
                style={{
                  color: "var(--foreground)",
                  borderColor: "var(--primary)",
                }}
              >
                EXPLORE LINEN
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Product Image Slideshow */}
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
                  src={getAssetPath(image)}
                  alt={`Reindeer moss Table runner - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background - Fabric Store Image/Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
          {/* Fabric texture pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='fabric' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='%23ffffff'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23000000' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23fabric)'/%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          ></div>
          {/* Colorful fabric roll representation */}
          <div className="absolute inset-0">
            {/* Fabric rolls - various colors */}
            <div className="absolute top-20 right-10 w-24 h-32 bg-blue-500 opacity-30 transform rotate-12"></div>
            <div className="absolute top-40 right-32 w-20 h-28 bg-red-500 opacity-30 transform -rotate-12"></div>
            <div className="absolute top-60 right-52 w-28 h-36 bg-green-500 opacity-30 transform rotate-6"></div>
            <div className="absolute bottom-40 right-20 w-22 h-30 bg-purple-500 opacity-30 transform -rotate-6"></div>
            <div className="absolute bottom-60 right-40 w-26 h-34 bg-orange-500 opacity-30 transform rotate-12"></div>
            <div className="absolute top-32 right-72 w-24 h-32 bg-yellow-500 opacity-30 transform -rotate-12"></div>
            <div className="absolute bottom-32 right-64 w-20 h-28 bg-pink-500 opacity-30 transform rotate-6"></div>
          </div>
        </div>

        {/* Text Overlay - Centered */}
        <div className="relative z-10 flex items-center justify-center min-h-[90vh] container-padding py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm md:text-base text-white/80 uppercase tracking-widest mb-6 font-medium">
              OUR STORY
            </p>
            <h2
              className="heading-large mb-8 leading-tight"
              style={{ color: "white" }}
            >
              Two Decades of
              <br />
              Textile Excellence
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Since 2005, we've been at the heart of Britain's textile
              community, championing traditional craftsmanship while embracing
              innovative design.
            </p>
          </div>
        </div>
      </section>

      {/* Visit Our Atelier Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* Left Column - Fabric Texture Background */}
        <div className="relative bg-gray-900 overflow-hidden">
          {/* Blurred fabric texture pattern */}
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
          {/* Fabric fold patterns */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `
                repeating-linear-gradient(90deg,
                  transparent 0px,
                  rgba(255,255,255,0.15) 2px,
                  transparent 4px,
                  transparent 60px
                )
              `,
                transform: "skewY(-2deg)",
                filter: "blur(1px)",
              }}
            ></div>
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `
                repeating-linear-gradient(90deg,
                  transparent 0px,
                  rgba(0,0,0,0.1) 1px,
                  transparent 2px,
                  transparent 80px
                )
              `,
                transform: "skewY(1deg)",
                filter: "blur(1px)",
              }}
            ></div>
          </div>
        </div>

        {/* Right Column - Contact Information */}
        <div
          className="flex flex-col justify-center"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="container-padding py-16 lg:py-24">
            <div className="max-w-lg">
              <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest mb-4 font-medium">
                GET IN TOUCH
              </p>
              <h2
                className="heading-large mb-6 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                Visit Our Atelier
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-12 leading-relaxed">
                We welcome you to experience our collection firsthand. Our team
                is here to guide you through every step of your textile journey.
              </p>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      123 Fabric Street
                      <br />
                      Marylebone
                      <br />
                      London W1U 3QP
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Opening Hours
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Monday - Friday: 9:00 - 18:00
                      <br />
                      Saturday: 10:00 - 16:00
                      <br />
                      Sunday: By appointment only
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Telephone
                    </h3>
                    <p className="text-gray-600">+44 (0) 20 7123 4567</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:enquiries@textileshop.co.uk"
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
                      enquiries@textileshop.co.uk
                    </a>
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
