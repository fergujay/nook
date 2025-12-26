import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../contexts/LanguageContext";

export default function Products() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || t("all");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryParam);
  const [lastPageVisited, setLastPageVisited] = useState<string>(t("home"));
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );
  const categories = [
    t("all"),
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // Get last page visited from localStorage
  useEffect(() => {
    const lastPage = localStorage.getItem("lastPageVisited") || t("home");
    setLastPageVisited(lastPage);
  }, [t]);

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full" style={{ backgroundColor: "#ffffff" }}>
      {/* Back Arrow */}
      <div className="container-padding pt-8 pb-4">
        <button
          onClick={() => {
            const lastPath = localStorage.getItem("lastPagePath") || "/";
            navigate(lastPath);
          }}
          className="flex items-center transition-colors group"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--muted-foreground)")
          }
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">
            {t("backTo")} {lastPageVisited}
          </span>
        </button>
      </div>

      {/* Minimal Filter Bar - Sticky at top - Only show if more than 4 products */}
      {filteredProducts.length > 4 && (
        <section
          className="py-4 border-b sticky top-20 z-40 backdrop-blur-sm bg-white/95"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="max-w-7xl mx-auto container-padding">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? t("item").toUpperCase()
                  : t("items").toUpperCase()}
              </div>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      if (category === t("all")) {
                        setSearchParams({});
                      } else {
                        setSearchParams({ category });
                      }
                    }}
                    className={`text-xs sm:text-sm font-medium transition-all duration-300 px-4 py-2 uppercase tracking-wider ${
                      selectedCategory === category ? "border-b-2" : ""
                    }`}
                    style={
                      selectedCategory === category
                        ? {
                            color: "var(--primary)",
                            borderColor: "var(--primary)",
                            letterSpacing: isMobile ? "2px" : "3px",
                          }
                        : {
                            color: "var(--muted-foreground)",
                            letterSpacing: isMobile ? "2px" : "3px",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.color = "var(--foreground)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.color = "var(--muted-foreground)";
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid Section - Photo-Oriented */}
      <section className="w-full" style={{ backgroundColor: "#ffffff" }}>
        {filteredProducts.length > 0 ? (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-32 container-padding">
            <div className="max-w-md mx-auto">
              <p
                className="text-xl font-medium mb-4"
                style={{ color: "var(--foreground)" }}
              >
                No products found in this category.
              </p>
              <p
                className="text-base mb-8 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Try selecting a different category or view all products.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchParams({});
                }}
                className="font-semibold py-3 px-8 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {t("allProducts")}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Collection Header Section - Moved to Bottom */}
      <section
        className="section-padding w-full"
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
            OUR COLLECTION
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 sm:mb-8 px-2"
            style={{ color: "var(--foreground)" }}
          >
            The Collection
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Explore our carefully curated range of exceptional textiles, each
            selected for its unique character, superior quality, and enduring
            beauty.
          </p>
        </div>
      </section>
    </div>
  );
}
