import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Globe, Heart, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useLanguage } from "../contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
}

const CONTACT_EMAIL = "nook.textile@gmail.com";

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();
  const { items: favoriteItems } = useFavorites();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.products"), href: "/products" },
    { name: t("nav.aboutUs"), href: "/about" },
    { name: t("nav.textileCare"), href: "/textile-care" },
    { name: t("nav.courier"), href: "/courier" },
  ];

  // Handle scroll for header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-medium border-b border-border" 
            : "bg-white backdrop-blur-sm shadow-soft border-b border-transparent"
        }`}
      >
        <nav className="container-padding">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}>
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.svg"
                alt="Nook"
                className={`transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? "h-5" : "h-6"
                }`}
              />
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-8 lg:space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 relative py-2 group ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      location.pathname === item.href 
                        ? "w-full" 
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-1.5 p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  aria-label={t("common.language")}
                >
                  <Globe className="h-5 w-5" />
                  <span className="hidden lg:inline text-sm font-medium uppercase">
                    {language}
                  </span>
                </button>
                {languageMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-36 shadow-large border rounded-lg py-2 z-50 animate-scale-in origin-top-right bg-card"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between ${
                        language === "en"
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      English
                      {language === "en" && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("sr");
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between ${
                        language === "sr"
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Srpski
                      {language === "sr" && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group"
                aria-label={t("nav.favorites")}
              >
                <Heart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {favoriteItems.length > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-xs h-5 w-5 flex items-center justify-center font-semibold shadow-md rounded-full animate-scale-in bg-primary text-primary-foreground"
                  >
                    {favoriteItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group"
                aria-label={t("nav.cart")}
              >
                <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-xs h-5 w-5 flex items-center justify-center font-semibold shadow-md rounded-full animate-scale-in bg-primary text-primary-foreground"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                    <Menu className="h-6 w-6" />
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                    <X className="h-6 w-6" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{ top: isScrolled ? '64px' : '80px' }}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div 
          className={`md:hidden fixed left-0 right-0 bg-card shadow-large z-50 transition-all duration-300 ease-out overflow-hidden ${
            mobileMenuOpen ? 'max-h-[calc(100vh-80px)] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ top: isScrolled ? '64px' : '80px' }}
        >
          <div className="container-padding py-6 space-y-2">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3.5 px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: mobileMenuOpen ? 'slideUp 0.4s ease-out forwards' : 'none'
                }}
              >
                <span>{item.name}</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${
                  location.pathname === item.href ? 'translate-x-1' : ''
                }`} />
              </Link>
            ))}
            
            {/* Language Toggle in Mobile */}
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-foreground/70">
                  {t("common.language")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      language === "en"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("sr");
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      language === "sr"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    SR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="w-full bg-[#2a2a2a] text-[#d3d3d3]">
        <div className="container-padding py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <img src="/logo-white.svg" alt="NOOK" className="h-6 mb-5" />
              <p className="text-sm leading-relaxed max-w-xs text-[#d3d3d3]/90">
                {t("footer.tagline")}
              </p>
              <p className="text-xs mt-6 leading-relaxed text-[#d3d3d3]/60">
                {t("footer.sinceLine").replace("{year}", String(year))}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-5 uppercase tracking-widest text-[#d3d3d3]">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { to: "/products", label: t("footer.linkCollection") },
                  { to: "/about", label: t("footer.linkAbout") },
                  { to: "/textile-care", label: t("footer.linkCare") },
                  { to: "/courier", label: t("footer.linkDelivery") },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[#d3d3d3]/80 hover:text-[#d3d3d3] transition-all duration-200 inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-sm font-semibold mb-5 uppercase tracking-widest text-[#d3d3d3]">
                {t("footer.policies")}
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { to: "/returns", label: t("footer.linkReturns") },
                  { to: "/terms", label: t("footer.linkTerms") },
                  { to: "/privacy", label: t("footer.linkPrivacy") },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[#d3d3d3]/80 hover:text-[#d3d3d3] transition-all duration-200 inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold mb-5 uppercase tracking-widest text-[#d3d3d3]">
                {t("footer.contact")}
              </h3>
              <ul className="space-y-3 text-sm text-[#d3d3d3]/80">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="hover:text-[#d3d3d3] transition-colors duration-200"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>Beograd, Srbija</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-[#d3d3d3]/10">
                <h4 className="text-xs font-medium mb-3 uppercase tracking-widest text-[#d3d3d3]/50">
                  {t("footer.legalTitle")}
                </h4>
                <ul className="space-y-1.5 text-xs text-[#d3d3d3]/50">
                  <li>{t("footer.legalName")}</li>
                  <li>{t("footer.legalMb")}</li>
                  <li>{t("footer.legalPib")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#d3d3d3]/10">
            <div className="text-center text-xs text-[#d3d3d3]/50">
              <p>
                © {year} NOOK · Anna Kovtun PR Beograd · {t("footer.rights")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
