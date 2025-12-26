import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from "lucide-react";
import { getProductById, products } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { getAssetPath } from "../utils/images";
import ImageWithLoader from "../components/ImageWithLoader";

export default function ProductDetail() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const galleryImages =
    product?.gallery || [product?.image || ""].filter(Boolean);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      const container = isFullscreen
        ? fullscreenContainerRef.current
        : galleryContainerRef.current;
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Handle ESC key to close fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  // Auto-advance slideshow
  useEffect(() => {
    if (isHovered || galleryImages.length <= 1 || isDragging || isZoomed)
      return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, galleryImages.length, isDragging, isZoomed]);

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false);
  }, [selectedImage]);

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Check for middle mouse button (button === 1)
    if (!("touches" in e) && (e as React.MouseEvent).button === 1) {
      e.preventDefault();
      setIsZoomed((prev) => !prev);
      return;
    }

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setDragOffset(0);
    setIsDragging(true);

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

    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      e.preventDefault();
      e.stopPropagation();
      setDragOffset(deltaX);
    }
  };

  const handleDragEnd = () => {
    if (!dragStart || !isDragging) return;

    const threshold = containerWidth * 0.15;

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        setSelectedImage(
          (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
        );
      } else {
        setSelectedImage((prev) => (prev + 1) % galleryImages.length);
      }
    }

    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  // Get recommended products (exclude current product, same category, limit to 3)
  const recommendedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="w-full">
      <div className="container-padding py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-8 transition-colors group"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--muted-foreground)")
          }
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>
      </div>

      {/* Full Width Image Gallery */}
      <div
        ref={galleryContainerRef}
        className="relative overflow-hidden select-none w-full"
        style={{
          minHeight: "100vh",
          cursor: isDragging ? "grabbing" : isZoomed ? "zoom-out" : "grab",
          touchAction: "pan-y pinch-zoom",
        }}
        data-gallery-container
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isDragging) handleDragEnd();
        }}
        onMouseDown={handleDragStart}
        onAuxClick={(e) => {
          // Middle mouse button (auxclick event)
          e.preventDefault();
          setIsZoomed((prev) => !prev);
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Main Image Slideshow - Full Width */}
        <div
          className="w-full h-full overflow-hidden group relative flex items-center justify-center"
          style={{
            minHeight: "100vh",
            backgroundColor: "var(--muted)",
          }}
        >
          {galleryImages.map((image, index) => {
            const isActive = index === selectedImage;
            const isNext = index === (selectedImage + 1) % galleryImages.length;
            const isPrev =
              index ===
              (selectedImage - 1 + galleryImages.length) % galleryImages.length;

            let translateX = 0;
            if (isDragging && dragOffset !== 0 && containerWidth > 0) {
              if (isActive) {
                translateX = dragOffset;
              } else if (isNext && dragOffset < 0) {
                translateX = dragOffset + containerWidth;
              } else if (isPrev && dragOffset > 0) {
                translateX = dragOffset - containerWidth;
              }
            }

            return (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
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
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full"
                  style={{
                    minHeight: "100vh",
                    pointerEvents: "none",
                    objectFit: isZoomed ? "contain" : "cover",
                    transform: isZoomed && isActive ? "scale(2)" : "scale(1)",
                    transition: isZoomed
                      ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            );
          })}

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(
                    (prev) =>
                      (prev - 1 + galleryImages.length) % galleryImages.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                style={{
                  color: "var(--foreground)",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-50%) scale(1.1)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev + 1) % galleryImages.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                style={{
                  color: "var(--foreground)",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-50%) scale(1.1)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Indicator Dots */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className="transition-all duration-300"
                  style={{
                    width: index === selectedImage ? "24px" : "8px",
                    height: "1px",
                    backgroundColor:
                      index === selectedImage
                        ? "var(--primary)"
                        : "rgba(255, 255, 255, 0.5)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    if (index !== selectedImage) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.8)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== selectedImage) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.5)";
                    }
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Overlay - Blurred Glass Background */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="container-padding w-full max-w-7xl">
            <div className="max-w-lg ml-auto">
              <div
                className="p-8 sm:p-10 lg:p-12 backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <div className="pointer-events-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="inline-block px-4 py-1.5 text-xs uppercase tracking-wider font-medium"
                      style={{
                        backgroundColor: "var(--muted)",
                        color: "var(--primary)",
                        letterSpacing: "2px",
                      }}
                    >
                      {product.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(true);
                      }}
                      className="p-2 hover:bg-white/50 transition-all duration-300 flex items-center justify-center"
                      style={{
                        color: "var(--foreground)",
                        transition:
                          "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.color = "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.color = "var(--foreground)";
                      }}
                      aria-label={t('viewFullscreen')}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
                    style={{ color: "var(--foreground)" }}
                  >
                    {product.name}
                  </h1>
                  <p
                    className="text-2xl sm:text-3xl md:text-4xl font-medium mb-6"
                    style={{ color: "var(--primary)" }}
                  >
                    {product.price.toLocaleString("sr-RS")} RSD
                  </p>
                  <p
                    className="text-base sm:text-lg md:text-xl mb-8 leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {product.description}
                  </p>
                  {product.size && (
                    <div className="mb-4">
                      <span
                        className="text-sm sm:text-base font-medium"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t('size')}:
                      </span>
                      <span
                        className="text-sm sm:text-base"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {" "}
                        {product.size}
                      </span>
                      {product.shape && (
                        <span
                          className="text-sm sm:text-base"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {" "}
                          ({product.shape})
                        </span>
                      )}
                    </div>
                  )}
                  {product.fabric && (
                    <div className="mb-8">
                      <span
                        className="text-sm sm:text-base font-medium"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t('fabric')}:
                      </span>
                      <span
                        className="text-sm sm:text-base"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {" "}
                        {product.fabric}
                      </span>
                    </div>
                  )}

                  {!product.inStock && (
                    <div className="mb-8">
                      <span
                        className="inline-block px-4 py-2 text-sm font-medium border"
                        style={{
                          backgroundColor: "var(--muted)",
                          color: "var(--destructive)",
                          borderColor: "var(--destructive)",
                        }}
                      >
                        {t('outOfStock')}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg py-4"
                    style={{
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Slideshow Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[200] bg-black"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          <div
            ref={fullscreenContainerRef}
            className="relative w-full h-full overflow-hidden select-none group"
            style={{
              cursor: isDragging ? "grabbing" : isZoomed ? "zoom-out" : "grab",
              touchAction: "pan-y pinch-zoom",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDragging) handleDragEnd();
            }}
            onMouseDown={handleDragStart}
            onAuxClick={(e) => {
              // Middle mouse button (auxclick event)
              e.preventDefault();
              setIsZoomed((prev) => !prev);
            }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Fullscreen Images */}
            {galleryImages.map((image, index) => {
              const isActive = index === selectedImage;
              const isNext =
                index === (selectedImage + 1) % galleryImages.length;
              const isPrev =
                index ===
                (selectedImage - 1 + galleryImages.length) %
                  galleryImages.length;

              let translateX = 0;
              if (isDragging && dragOffset !== 0 && containerWidth > 0) {
                if (isActive) {
                  translateX = dragOffset;
                } else if (isNext && dragOffset < 0) {
                  translateX = dragOffset + containerWidth;
                } else if (isPrev && dragOffset > 0) {
                  translateX = dragOffset - containerWidth;
                }
              }

              return (
                <div
                  key={index}
                  className="absolute inset-0 flex items-center justify-center"
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
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full"
                    style={{
                      maxHeight: "100vh",
                      pointerEvents: "none",
                      objectFit: isZoomed ? "contain" : "contain",
                      transform: isZoomed && isActive ? "scale(2)" : "scale(1)",
                      transition: isZoomed
                        ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
              );
            })}

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              className="absolute top-4 right-4 z-30 p-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              style={{
                color: "var(--foreground)",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(
                      (prev) =>
                        (prev - 1 + galleryImages.length) % galleryImages.length
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{
                    color: "var(--foreground)",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-50%) scale(1.1)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-50%) scale(1)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(
                      (prev) => (prev + 1) % galleryImages.length
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{
                    color: "var(--foreground)",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-50%) scale(1.1)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-50%) scale(1)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Indicator Dots */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className="transition-all duration-300"
                    style={{
                      width: index === selectedImage ? "24px" : "8px",
                      height: "1px",
                      backgroundColor:
                        index === selectedImage
                          ? "var(--primary)"
                          : "rgba(255, 255, 255, 0.5)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      if (index !== selectedImage) {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 0.8)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== selectedImage) {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 0.5)";
                      }
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <section
          className="w-full container-padding py-16"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2
            className="heading-medium mb-8"
            style={{ color: "var(--foreground)" }}
          >
            {t('recommendedProducts')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {recommendedProducts.map((recommendedProduct, index) => (
              <div
                key={recommendedProduct.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <ProductCard product={recommendedProduct} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
