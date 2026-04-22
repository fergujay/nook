import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Heart, Check, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { getProductById, products } from '../data/products'
import { useCart } from '../contexts/CartContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect, useRef } from 'react'
import ProductCard from '../components/ProductCard'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Zoom } from 'yet-another-react-lightbox/plugins'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = id ? getProductById(id) : undefined
  const { addToCart } = useCart()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const { t, language } = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  const galleryImages = product?.gallery || [product?.image || ''].filter(Boolean)

  const lightboxSlides = galleryImages.map((src) => ({
    src,
    alt: product?.name || '',
  }))

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setImageLoaded(false)
  }, [selectedImage])

  useEffect(() => {
    const galleryElement = document.querySelector('[data-gallery-container]')
    if (!galleryElement || galleryImages.length <= 1) return

    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent
      if (!wheelEvent.ctrlKey && !wheelEvent.metaKey && !isLightboxOpen) {
        wheelEvent.preventDefault()
        if (wheelEvent.deltaY > 0) {
          setSelectedImage((prev) => (prev + 1) % galleryImages.length)
        } else if (wheelEvent.deltaY < 0) {
          setSelectedImage(
            (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
          )
        }
      }
    }

    galleryElement.addEventListener('wheel', handleWheel, { passive: false })
    return () => galleryElement.removeEventListener('wheel', handleWheel)
  }, [galleryImages.length, isLightboxOpen])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-muted-foreground text-lg mb-6">Product not found</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            {t('common.backToProducts')}
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const description = product.descriptionKey
    ? t(product.descriptionKey)
    : product.description
  const fabric = product.fabricKey ? t(product.fabricKey) : product.fabric
  const shape = product.shapeKey ? t(product.shapeKey) : product.shape
  const categoryLabel =
    t(`productFields.categories.${product.category}`) || product.category
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'
  const favored = isFavorite(product.id)

  const recommendedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  return (
    <div className="w-full bg-card">
      {/* Back Button */}
      <div className="container-padding py-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center transition-all duration-500 group text-muted-foreground hover:text-primary ${
            pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">{t('common.backToProducts')}</span>
        </button>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Image Gallery */}
        <div
          className={`relative overflow-hidden bg-muted transition-all duration-700 ${
            pageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ minHeight: '500px' }}
          data-gallery-container
        >
          {/* Main Image */}
          <div
            className="w-full h-full overflow-hidden group cursor-pointer relative flex items-center justify-center"
            style={{ minHeight: '500px' }}
            onClick={() => setIsLightboxOpen(true)}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={galleryImages[selectedImage]}
              alt={product.name}
              className={`max-w-full max-h-full w-auto h-auto object-contain transition-all duration-500 ease-out ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ maxHeight: '600px' }}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Zoom indicator */}
            <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
              <ZoomIn className="h-5 w-5 text-foreground" />
            </div>
          </div>

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 hover:opacity-100 focus:opacity-100 transition-all duration-200 hover:scale-110 group-hover:opacity-70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 hover:opacity-100 focus:opacity-100 transition-all duration-200 hover:scale-110 group-hover:opacity-70"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </>
          )}

          {/* Thumbnail Navigation */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedImage 
                      ? 'border-primary scale-105 shadow-md' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`View ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div
          ref={detailsRef}
          className="flex flex-col justify-center bg-card"
        >
          <div className="container-padding py-12 lg:py-20">
            <div 
              className={`max-w-lg transition-all duration-700 delay-150 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  {categoryLabel}
                </span>
              </div>

              {/* Title */}
              <h1 className="heading-large mb-4 text-foreground text-balance">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl md:text-4xl font-semibold mb-6 text-primary">
                {product.price.toLocaleString(priceLocale)} RSD
              </p>

              {/* Description */}
              <p className="text-base md:text-lg mb-8 leading-relaxed text-muted-foreground">
                {description}
              </p>

              {/* Product Specs */}
              <div className="space-y-3 mb-8 p-4 bg-muted/50 rounded-lg">
                {product.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {t('common.size')}
                    </span>
                    <span className="text-muted-foreground">
                      {product.size}
                      {shape && ` (${shape})`}
                    </span>
                  </div>
                )}
                {fabric && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {t('common.fabric')}
                    </span>
                    <span className="text-muted-foreground">
                      {fabric}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t('common.inStock')}
                  </span>
                  <span className={product.inStock ? 'text-green-600' : 'text-destructive'}>
                    {product.inStock ? t('common.inStock') : t('common.outOfStock')}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.inStock ? (
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3 text-foreground">
                    {t('common.quantity')}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-border rounded-lg flex items-center justify-center transition-all duration-200 font-medium text-lg text-foreground hover:border-primary hover:text-primary active:scale-95"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold w-16 text-center text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 border-border rounded-lg flex items-center justify-center transition-all duration-200 font-medium text-lg text-foreground hover:border-primary hover:text-primary active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 font-medium border border-destructive bg-destructive/10 text-destructive rounded-lg">
                    {t('common.outOfStock')}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    addedToCart 
                      ? 'bg-green-600 text-white' 
                      : 'bg-primary text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5" />
                      {t('common.addedToCart')}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      {t('common.addToCart')}
                    </>
                  )}
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`px-5 border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                    favored 
                      ? 'border-primary text-primary bg-primary/5' 
                      : 'border-border text-foreground hover:border-primary hover:text-primary'
                  }`}
                  aria-label={
                    favored
                      ? t('favorites.removeFromFavorites')
                      : t('favorites.addToFavorites')
                  }
                >
                  <Heart className="h-6 w-6" fill={favored ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="w-full container-padding py-16 lg:py-20 max-w-7xl mx-auto">
          <h2 className="heading-medium mb-10 text-foreground">
            {t('productDetail.recommended')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {recommendedProducts.map((recommendedProduct, index) => (
              <div 
                key={recommendedProduct.id} 
                className="opacity-0 animate-slide-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <ProductCard product={recommendedProduct} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={selectedImage}
        slides={lightboxSlides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        on={{
          view: ({ index }) => {
            setSelectedImage(index)
          },
        }}
        carousel={{ finite: false, preload: 2 }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' } }}
      />
    </div>
  )
}
