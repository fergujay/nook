import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Globe, Heart } from "lucide-react";
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

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-gray-100 w-full">
        <nav className="container-padding">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.svg"
                alt="Nook"
                className="h-6 group-hover:opacity-80 transition-opacity"
              />
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-200 relative ${
                    location.pathname === item.href
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-2 p-2.5 transition-all duration-200"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.backgroundColor = "var(--muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  aria-label={t("common.language")}
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
              <Link
                to="/favorites"
                className="relative p-2.5 transition-all duration-200"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.backgroundColor = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--muted-foreground)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label={t("nav.favorites")}
              >
                <Heart className="h-6 w-6" />
                {favoriteItems.length > 0 && (
                  <span
                    className="absolute top-1 right-1 text-xs h-5 w-5 flex items-center justify-center font-semibold shadow-md"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {favoriteItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative p-2.5 transition-all duration-200"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.backgroundColor = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--muted-foreground)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label={t("nav.cart")}
              >
                <ShoppingBag className="h-6 w-6" />
                {totalItems > 0 && (
                  <span
                    className="absolute top-1 right-1 text-xs h-5 w-5 flex items-center justify-center font-semibold shadow-md"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden p-2.5 transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
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

          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-gray-200 animate-fade-in">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-primary-600 border-l-4 border-primary-600 pl-4"
                      : "text-gray-700 hover:text-primary-600 hover:pl-4 transition-all"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-gray-700">
                    {t("common.language")}
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
                    >
                      SR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <img src="/logo-white.svg" alt="NOOK" className="h-6 mb-4" />
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "#d3d3d3" }}
              >
                {t("footer.tagline")}
              </p>
              <p
                className="text-xs mt-6 leading-relaxed"
                style={{ color: "rgba(211,211,211,0.7)" }}
              >
                {t("footer.sinceLine").replace("{year}", String(year))}
              </p>
            </div>

            <div>
              <h3
                className="text-sm font-medium mb-4 uppercase tracking-widest"
                style={{ color: "#d3d3d3" }}
              >
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "#d3d3d3" }}>
                <li>
                  <Link
                    to="/products"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkCollection")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkAbout")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/textile-care"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkCare")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courier"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkDelivery")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-sm font-medium mb-4 uppercase tracking-widest"
                style={{ color: "#d3d3d3" }}
              >
                {t("footer.policies")}
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "#d3d3d3" }}>
                <li>
                  <Link
                    to="/returns"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkReturns")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkTerms")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {t("footer.linkPrivacy")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-sm font-medium mb-4 uppercase tracking-widest"
                style={{ color: "#d3d3d3" }}
              >
                {t("footer.contact")}
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "#d3d3d3" }}>
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>Beograd, Srbija</li>
              </ul>
              <h4
                className="text-xs font-medium mt-6 mb-2 uppercase tracking-widest"
                style={{ color: "rgba(211,211,211,0.7)" }}
              >
                {t("footer.legalTitle")}
              </h4>
              <ul
                className="space-y-1 text-xs leading-relaxed"
                style={{ color: "rgba(211,211,211,0.7)" }}
              >
                <li>{t("footer.legalName")}</li>
                <li>{t("footer.legalMb")}</li>
                <li>{t("footer.legalPib")}</li>
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-8 border-t"
            style={{ borderColor: "rgba(211, 211, 211, 0.2)" }}
          >
            <div
              className="text-center text-xs"
              style={{ color: "rgba(211,211,211,0.7)" }}
            >
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
