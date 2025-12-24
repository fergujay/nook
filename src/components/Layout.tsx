import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Globe, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getAssetPath } from "../utils/images";
import ImageWithLoader from "./ImageWithLoader";
import { products } from "../data/products";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, items, updateQuantity, removeFromCart, totalPrice } =
    useCart();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const cartMenuRef = useRef<HTMLDivElement>(null);

  // Track last page visited for back navigation
  useEffect(() => {
    // Use navigation items for consistent naming
    const pageNames: { [key: string]: string } = {
      '/': t('home'),
      '/products': t('products'),
      '/about': t('aboutUs'),
      '/textile-care': t('textileCare'),
      '/courier': t('courier'),
      '/cart': t('cart'),
      '/checkout': 'Checkout',
    }
    
    // Track product detail pages with product name and description
    if (location.pathname.startsWith('/products/')) {
      const productId = location.pathname.split('/products/')[1]
      const product = products.find(p => p.id === productId)
      if (product) {
        localStorage.setItem('lastPageVisited', `${product.name} (${product.description})`)
        localStorage.setItem('lastPagePath', '/products')
      }
    }
    // Don't track products page itself, but track other pages
    else if (location.pathname !== '/products') {
      const pageName = pageNames[location.pathname] || t('home')
      localStorage.setItem('lastPageVisited', pageName)
      localStorage.setItem('lastPagePath', location.pathname)
    }
  }, [location.pathname, t])

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("products"), href: "/products" },
    { name: t("aboutUs"), href: "/about" },
    { name: t("textileCare"), href: "/textile-care" },
    { name: t("courier"), href: "/courier" },
  ];

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageMenuOpen]);

  // Close cart menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target as Node)
      ) {
        setCartMenuOpen(false);
      }
    };

    if (cartMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Determine if we're on home page at top (for transparent header)
  const isHomePage = location.pathname === "/";
  const shouldBeTransparent = isHomePage && !isScrolled && !mobileMenuOpen;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isHomePage && !isScrolled ? "" : "bg-gray-50"
      }`}
    >
      <header
        className={`sticky top-0 w-full ${
          mobileMenuOpen ? "z-[101]" : "z-50"
        } ${
          shouldBeTransparent
            ? ""
            : "bg-white/95 backdrop-blur-sm shadow-soft border-b border-gray-100"
        }`}
        style={
          shouldBeTransparent
            ? {
                backgroundColor: "transparent",
                boxShadow: "none",
                borderBottom: "none",
                background: "transparent",
                transition:
                  "background-color 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease",
              }
            : mobileMenuOpen
            ? {
                backgroundColor: "rgba(55, 55, 55, 0.95)",
                backdropFilter: "blur(10px)",
                borderBottom: "none",
                transition:
                  "background-color 0.2s ease, backdrop-filter 0.2s ease",
              }
            : {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                transition:
                  "background-color 0.2s ease, backdrop-filter 0.2s ease",
              }
        }
      >
        <nav
          className="container-padding"
          style={shouldBeTransparent ? { backgroundColor: "transparent" } : {}}
        >
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center group">
              {shouldBeTransparent || mobileMenuOpen ? (
                <img
                  src={getAssetPath("logo-white.svg")}
                  alt="Nook"
                  className="h-6 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <img
                  src={getAssetPath("logo.svg")}
                  alt="Nook"
                  className="h-6 group-hover:opacity-80 transition-opacity"
                />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-200 relative ${
                    shouldBeTransparent
                      ? location.pathname === item.href
                        ? "text-white"
                        : "text-white/90 hover:text-white"
                      : location.pathname === item.href
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && !shouldBeTransparent && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                  {item.href === "/" && shouldBeTransparent && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "white" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center gap-2 p-2.5 transition-all duration-200 ${
                    shouldBeTransparent && !mobileMenuOpen
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : mobileMenuOpen
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : ""
                  }`}
                  style={
                    shouldBeTransparent && !mobileMenuOpen
                      ? {}
                      : mobileMenuOpen
                      ? {}
                      : { color: "var(--muted-foreground)" }
                  }
                  onMouseEnter={(e) => {
                    if (!shouldBeTransparent && !mobileMenuOpen) {
                      e.currentTarget.style.color = "var(--primary)";
                      e.currentTarget.style.backgroundColor = "var(--muted)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!shouldBeTransparent && !mobileMenuOpen) {
                      e.currentTarget.style.color = "var(--muted-foreground)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  aria-label="Language"
                >
                  <Globe className="h-5 w-5" />
                  <span className="hidden lg:inline text-sm font-medium uppercase">
                    {language}
                  </span>
                </button>
                {languageMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-32 shadow-lg border py-2 z-50"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === "en"
                          ? "bg-primary-50 text-primary-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("sr");
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === "sr"
                          ? "bg-primary-50 text-primary-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Srpski
                    </button>
                  </div>
                )}
              </div>
              {/* Shopping Cart - Floating Menu for Desktop, Link for Mobile */}
              <div className="relative hidden md:block" ref={cartMenuRef}>
                <button
                  onClick={() => setCartMenuOpen(!cartMenuOpen)}
                  className={`relative p-2.5 transition-all duration-200 ${
                    shouldBeTransparent && !mobileMenuOpen
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : mobileMenuOpen
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : ""
                  }`}
                  style={
                    shouldBeTransparent && !mobileMenuOpen
                      ? {}
                      : mobileMenuOpen
                      ? {}
                      : { color: "var(--muted-foreground)" }
                  }
                  onMouseEnter={(e) => {
                    if (!shouldBeTransparent && !mobileMenuOpen) {
                      e.currentTarget.style.color = "var(--primary)";
                      e.currentTarget.style.backgroundColor = "var(--muted)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!shouldBeTransparent && !mobileMenuOpen) {
                      e.currentTarget.style.color = "var(--muted-foreground)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  aria-label={t("cart")}
                >
                  {cartMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <>
                      <ShoppingBag className="h-6 w-6" />
                      {totalItems > 0 && (
                        <span
                          className="absolute top-1 right-1 text-xs h-5 w-5 flex items-center justify-center font-semibold shadow-md rounded-full"
                          style={{
                            backgroundColor:
                              shouldBeTransparent || mobileMenuOpen
                                ? "rgba(255, 255, 255, 0.9)"
                                : "var(--primary)",
                            color:
                              shouldBeTransparent || mobileMenuOpen
                                ? "var(--primary)"
                                : "var(--primary-foreground)",
                          }}
                        >
                          {totalItems}
                        </span>
                      )}
                    </>
                  )}
                </button>
                {cartMenuOpen && (
                  <div
                    className="absolute w-96 max-h-[600px] shadow-lg border z-50 overflow-hidden flex flex-col"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      right: 0,
                      marginTop: isScrolled ? "4rem" : "1rem",
                      transition: "margin-top 0.3s ease-in-out",
                    }}
                  >
                    <div
                      className="p-4 border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("cart")} ({totalItems})
                      </h3>
                    </div>
                    {items.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingBag
                          className="h-12 w-12 mx-auto mb-4 opacity-50"
                          style={{ color: "var(--muted-foreground)" }}
                        />
                        <p
                          className="text-sm"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Your cart is empty
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-y-auto flex-1 max-h-[400px]">
                          <div className="p-4 space-y-4">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                                style={{ borderColor: "var(--border)" }}
                              >
                                <ImageWithLoader
                                  src={getAssetPath(item.image)}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover flex-shrink-0"
                                />
                                <div className="flex-grow min-w-0">
                                  <h4
                                    className="font-medium text-sm mb-1 truncate"
                                    style={{ color: "var(--foreground)" }}
                                  >
                                    {item.name}
                                  </h4>
                                  <p
                                    className="text-sm font-semibold mb-2"
                                    style={{ color: "var(--primary)" }}
                                  >
                                    ${item.price.toFixed(2)}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="flex items-center gap-1 border rounded"
                                      style={{ borderColor: "var(--border)" }}
                                    >
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            item.id,
                                            item.quantity - 1
                                          )
                                        }
                                        className="p-1 hover:bg-gray-100 transition-colors"
                                        style={{ color: "var(--foreground)" }}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span
                                        className="px-2 py-1 text-xs font-semibold min-w-[2rem] text-center"
                                        style={{ color: "var(--foreground)" }}
                                      >
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            item.id,
                                            item.quantity + 1
                                          )
                                        }
                                        className="p-1 hover:bg-gray-100 transition-colors"
                                        style={{ color: "var(--foreground)" }}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors ml-auto"
                                      aria-label="Remove item"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div
                          className="p-4 border-t space-y-3"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className="font-semibold"
                              style={{ color: "var(--foreground)" }}
                            >
                              Total:
                            </span>
                            <span
                              className="font-bold text-lg"
                              style={{ color: "var(--primary)" }}
                            >
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <Link
                            to="/checkout"
                            onClick={() => setCartMenuOpen(false)}
                            className="btn-primary w-full text-center block"
                          >
                            Checkout
                          </Link>
                          <Link
                            to="/cart"
                            onClick={() => setCartMenuOpen(false)}
                            className="btn-secondary w-full text-center block"
                          >
                            View Cart
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                className={`relative md:hidden p-2.5 transition-all duration-200 ${
                  shouldBeTransparent && !mobileMenuOpen
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : mobileMenuOpen
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : ""
                }`}
                style={
                  shouldBeTransparent && !mobileMenuOpen
                    ? {}
                    : mobileMenuOpen
                    ? {}
                    : { color: "var(--muted-foreground)" }
                }
                onMouseEnter={(e) => {
                  if (!shouldBeTransparent && !mobileMenuOpen) {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.backgroundColor = "var(--muted)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!shouldBeTransparent && !mobileMenuOpen) {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                aria-label={t("cart")}
              >
                <ShoppingBag className="h-6 w-6" />
                {totalItems > 0 && (
                  <span
                    className="absolute top-1 right-1 text-xs h-5 w-5 flex items-center justify-center font-semibold shadow-md rounded-full"
                    style={{
                      backgroundColor:
                        shouldBeTransparent || mobileMenuOpen
                          ? "rgba(255, 255, 255, 0.9)"
                          : "var(--primary)",
                      color:
                        shouldBeTransparent || mobileMenuOpen
                          ? "var(--primary)"
                          : "var(--primary-foreground)",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className={`md:hidden p-2.5 transition-colors ${
                  shouldBeTransparent && !mobileMenuOpen
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : mobileMenuOpen
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : ""
                }`}
                style={
                  shouldBeTransparent && !mobileMenuOpen
                    ? {}
                    : mobileMenuOpen
                    ? {}
                    : { color: "var(--muted-foreground)" }
                }
                onMouseEnter={(e) => {
                  if (!shouldBeTransparent && !mobileMenuOpen) {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.backgroundColor = "var(--muted)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!shouldBeTransparent && !mobileMenuOpen) {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation - Fullscreen Section */}
          {mobileMenuOpen && (
            <div
          className="md:hidden fixed z-[100] overflow-y-auto"
          style={{
            animation: "fadeIn 0.2s ease-in-out",
            top: "5rem",
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                pointerEvents: "none",
              }}
              src={getAssetPath("videos/mobile-menu-background.mp4")}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Navigation Content */}
          <div className="relative z-10 py-6 px-4 min-h-full flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-white border-l-4 border-white pl-4"
                      : "text-white/90 hover:text-white hover:pl-4 transition-all"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Language Selector */}
              <div className="pt-4 mt-4 border-t border-white/20">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-white/90">
                    Language
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 text-sm transition-colors"
                      style={
                        language === "en"
                          ? {
                              backgroundColor: "var(--primary)",
                              color: "var(--primary-foreground)",
                            }
                          : {
                              backgroundColor: "var(--muted)",
                              color: "var(--muted-foreground)",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (language !== "en") {
                        e.currentTarget.style.backgroundColor = "var(--border)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (language !== "en") {
                        e.currentTarget.style.backgroundColor = "var(--muted)";
                        }
                      }}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("sr");
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 text-sm transition-colors"
                      style={
                        language === "sr"
                          ? {
                              backgroundColor: "var(--primary)",
                              color: "var(--primary-foreground)",
                            }
                          : {
                              backgroundColor: "var(--muted)",
                              color: "var(--muted-foreground)",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (language !== "sr") {
                        e.currentTarget.style.backgroundColor = "var(--border)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (language !== "sr") {
                        e.currentTarget.style.backgroundColor = "var(--muted)";
                        }
                      }}
                    >
                      SR
                    </button>
                </div>
                  </div>
                </div>
              </div>
            </div>
          )}

      <main className="flex-grow">{children}</main>

      <footer
        className="w-full"
        style={{
          backgroundColor: "#2a2a2a",
          color: "#d3d3d3",
          fontFamily: "Raleway, sans-serif",
        }}
      >
        <div className="container-padding py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Column - TEXTILE SHOP */}
            <div>
              <img
                src={getAssetPath("logo-white.svg")}
                alt="Nook"
                className="h-6 mb-4"
              />
              <h3
                className="text-lg font-semibold mb-4 uppercase"
                style={{ color: "#d3d3d3" }}
              >
                TEXTILE SHOP
              </h3>
              <p
                className="text-sm leading-relaxed max-w-md"
                style={{ color: "#d3d3d3" }}
              >
                Curating exceptional textiles for discerning designers, makers,
                and enthusiasts since 2005.
              </p>
            </div>

            {/* Middle Column - QUICK LINKS */}
            <div>
              <ul className="space-y-2 text-sm" style={{ color: "#d3d3d3" }}>
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - CONTACT */}
            <div>
              <h3
                className="text-sm font-medium mb-4 uppercase"
                style={{ color: "#d3d3d3" }}
              >
                CONTACT
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "#d3d3d3" }}>
                <li>123 Fabric Street</li>
                <li>London W1U 3QP</li>
                <li>
                  <a
                    href="tel:+442071234567"
                    className="hover:opacity-80 transition-opacity"
                  >
                    +44 (0) 20 7123 4567
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:enquiries@textileshop.co.uk"
                    className="hover:opacity-80 transition-opacity"
                  >
                    enquiries@textileshop.co.uk
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Separator Line */}
          <div
            className="mt-12 pt-8 border-t"
            style={{ borderColor: "rgba(211, 211, 211, 0.2)" }}
          >
            {/* Copyright */}
            <div className="text-center text-sm" style={{ color: "#d3d3d3" }}>
              <p>&copy; 2025 TEXTILE SHOP. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
