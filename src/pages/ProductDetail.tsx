import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Ruler,
  Shirt,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import { getProductById, products } from '../data/products'
import { formatProductDisplaySize } from '../utils/productSize'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect, useRef, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import Lightbox, { useController, ACTION_CLOSE } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Zoom } from 'yet-another-react-lightbox/plugins'

/** Shared glass styling for lightbox toolbar controls (readable on any photo). */
const lightboxChrome =
  'border border-[#f6f1ea]/28 bg-[#141414]/82 text-[#f6f1ea] shadow-[0_10px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl ring-1 ring-black/35'

type LightboxZoomToolbarProps = {
  zoom: number
  minZoom: number
  maxZoom: number
  disabled: boolean
  zoomIn: () => void
  zoomOut: () => void
}

function LightboxZoomToolbar({
  zoom,
  minZoom,
  maxZoom,
  disabled,
  zoomIn,
  zoomOut,
}: LightboxZoomToolbarProps) {
  const { t } = useLanguage()

  if (disabled) return null

  const atMin = zoom <= minZoom
  const atMax = zoom >= maxZoom
  const pct = Math.min(999, Math.round(zoom * 100))

  const segmentBtn =
    'flex size-11 shrink-0 items-center justify-center transition-colors hover:bg-[#f6f1ea]/12 active:bg-[#f6f1ea]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6f1ea] disabled:pointer-events-none disabled:opacity-40'

  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-full ${lightboxChrome}`}
      role="toolbar"
      aria-label={t('productDetail.lightboxZoomControls')}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          zoomOut()
        }}
        disabled={atMin}
        title={t('productDetail.lightboxZoomOut')}
        aria-label={t('productDetail.lightboxZoomOut')}
        className={segmentBtn}
      >
        <Minus className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      </button>
      <span
        className="w-px shrink-0 self-stretch bg-[#f6f1ea]/22"
        aria-hidden
      />
      <output
        className="flex min-w-[4.25rem] items-center justify-center px-3 text-sm font-semibold tabular-nums"
        aria-live="polite"
        title={`${pct}%`}
      >
        {pct}%
      </output>
      <span
        className="w-px shrink-0 self-stretch bg-[#f6f1ea]/22"
        aria-hidden
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          zoomIn()
        }}
        disabled={atMax}
        title={t('productDetail.lightboxZoomIn')}
        aria-label={t('productDetail.lightboxZoomIn')}
        className={segmentBtn}
      >
        <Plus className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  )
}

function LightboxCloseControl() {
  const { close } = useController()
  const { t } = useLanguage()

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        close()
      }}
      title={t('productDetail.lightboxClose')}
      aria-label={t('productDetail.lightboxClose')}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f6f1ea]/12 active:bg-[#f6f1ea]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6f1ea] ${lightboxChrome}`}
    >
      <X className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  )
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = id ? getProductById(id) : undefined
  const { addToCart } = useCart()
  const { t, language } = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const mainPhotoRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const suppressPhotoClickRef = useRef(false)
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
    const el = mainPhotoRef.current
    if (!el || galleryImages.length <= 1) return

    const handleWheel = (e: WheelEvent) => {
      if (isLightboxOpen || e.ctrlKey || e.metaKey) return
      const dx = e.deltaX
      const dy = e.deltaY
      const horizontal =
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 2
      const shiftScroll =
        e.shiftKey && Math.abs(dy) > 2 && Math.abs(dy) >= Math.abs(dx)

      if (horizontal) {
        e.preventDefault()
        if (dx > 0) {
          setSelectedImage((prev) => (prev + 1) % galleryImages.length)
        } else {
          setSelectedImage(
            (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
          )
        }
      } else if (shiftScroll) {
        e.preventDefault()
        if (dy > 0) {
          setSelectedImage((prev) => (prev + 1) % galleryImages.length)
        } else {
          setSelectedImage(
            (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
          )
        }
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [id, galleryImages.length, isLightboxOpen])

  const lightboxRender = useMemo(
    () => ({
      buttonPrev: () => null,
      buttonNext: () => null,
      buttonZoom: (api: LightboxZoomToolbarProps) => <LightboxZoomToolbar {...api} />,
      buttonClose: () => <LightboxCloseControl key={ACTION_CLOSE} />,
    }),
    [],
  )

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

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const SWIPE_THRESHOLD_PX = 45

  const handleMainPhotoTouchStart = (e: React.TouchEvent) => {
    if (galleryImages.length <= 1) return
    const t = e.targetTouches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }

  const handleMainPhotoTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || galleryImages.length <= 1) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartRef.current.x
    const dy = t.clientY - touchStartRef.current.y
    touchStartRef.current = null

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return

    suppressPhotoClickRef.current = true
    window.setTimeout(() => {
      suppressPhotoClickRef.current = false
    }, 350)

    if (dx < 0) nextImage()
    else prevImage()
  }

  const handleMainPhotoAreaClick = () => {
    if (suppressPhotoClickRef.current) return
    setIsLightboxOpen(true)
  }

  const description = product.descriptionKey
    ? t(product.descriptionKey)
    : product.description
  const fabric = product.fabricKey ? t(product.fabricKey) : product.fabric
  const shape = product.shapeKey ? t(product.shapeKey) : product.shape
  const displaySize = formatProductDisplaySize(product)
  const categoryLabel =
    t(`productFields.categories.${product.category}`) || product.category
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'

  const recommendedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  return (
    <div className="w-full bg-gradient-to-b from-background via-card to-secondary/25">
      {/* Back Button */}
      <div className="container-padding pt-4 pb-4 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 rounded-full border-0 bg-transparent px-3 py-2 -ml-2 font-sans transition-all duration-500 group text-muted-foreground hover:text-primary hover:bg-primary/5 ${
            pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <ArrowLeft
            className="size-5 shrink-0 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
            aria-hidden
          />
          <span className="text-sm font-medium leading-tight tracking-wide">
            {t('common.backToProducts')}
          </span>
        </button>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] min-h-[72vh]">
        {/* Image Gallery */}
        <div
          className={`relative flex min-h-0 flex-col overflow-hidden transition-all duration-700 bg-gradient-to-br from-secondary/50 via-muted/35 to-background ${
            pageLoaded ? 'opacity-100' : 'opacity-0'
          } lg:sticky lg:top-0 lg:max-h-screen lg:min-h-[min(100vh,920px)]`}
          style={{ minHeight: 'min(520px, 85vh)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(167, 39, 41, 0.08) 0%, transparent 45%),
                radial-gradient(circle at 80% 70%, rgba(238, 230, 217, 0.9) 0%, transparent 50%)`,
            }}
            aria-hidden
          />
          {/* Main Image — grows to fill gallery column */}
          <div className="relative z-[1] flex min-h-0 w-full flex-1 flex-col p-0">
            <div
              className="group relative flex min-h-0 w-full flex-1 flex-col cursor-pointer overflow-visible"
              onClick={handleMainPhotoAreaClick}
            >
              <div
                ref={mainPhotoRef}
                data-main-photo
                className="relative min-h-[min(52vh,360px)] w-full flex-1 touch-pan-y overflow-hidden bg-transparent sm:min-h-[min(48vh,420px)] md:min-h-[min(50vh,480px)]"
                onTouchStart={handleMainPhotoTouchStart}
                onTouchEnd={handleMainPhotoTouchEnd}
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 z-[1] bg-muted/80 animate-pulse" />
                )}
                <img
                  src={galleryImages[selectedImage]}
                  alt={product.name}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out motion-safe:sm:group-hover:scale-[1.02] ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />

                <div
                  className="pointer-events-none absolute bottom-3 right-3 z-[2] flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-white/95 px-3 py-2 text-xs font-medium text-muted-foreground shadow-md backdrop-blur-sm"
                  aria-hidden
                >
                  <ZoomIn className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} aria-hidden />
                  <span className="text-foreground">{t('common.enlarge')}</span>
                </div>

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-2 top-1/2 z-[2] flex size-11 -translate-y-1/2 items-center justify-center rounded-none border border-border bg-white/95 text-muted-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:text-primary hover:shadow-lg active:scale-95 sm:left-3"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-2 top-1/2 z-[2] flex size-11 -translate-y-1/2 items-center justify-center rounded-none border border-border bg-white/95 text-muted-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:text-primary hover:shadow-lg active:scale-95 sm:right-3"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="relative flex flex-col justify-center border-t border-border/40 bg-card/40 backdrop-blur-[1px] lg:border-l lg:border-t-0">
          <div className="absolute left-0 top-24 hidden h-32 w-px bg-gradient-to-b from-primary/25 via-primary/10 to-transparent lg:block" />
          <div className="container-padding py-12 lg:py-20 xl:py-24">
            <div
              className={`mx-auto max-w-xl transition-all duration-700 delay-150 lg:pl-4 xl:pl-8 ${
                pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="mb-5">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-soft">
                  {categoryLabel}
                </span>
              </div>

              <h1 className="heading-large font-editorial mb-5 text-foreground text-balance lg:max-w-[18ch]">
                {product.name}
              </h1>

              <p className="mb-8 text-3xl font-semibold tabular-nums tracking-tight text-primary md:text-4xl">
                {product.price.toLocaleString(priceLocale)}{' '}
                <span className="text-lg font-medium text-muted-foreground md:text-xl">
                  RSD
                </span>
              </p>

              <p className="mb-10 text-base leading-[1.75] text-muted-foreground md:text-lg">
                {description}
              </p>

              {(displaySize || fabric) && (
                <div className="mb-10 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/25 shadow-soft">
                  {displaySize && (
                    <div className="flex gap-4 border-b border-border/50 px-5 py-4 sm:px-6 sm:py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Ruler className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('common.size')}
                        </p>
                        <p className="mt-1 text-foreground">
                          {displaySize}
                          {shape && product.shape !== 'round' && (
                            <span className="text-muted-foreground">
                              {' '}
                              · {shape}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {fabric && (
                    <div className="flex gap-4 px-5 py-4 sm:px-6 sm:py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Shirt className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('common.fabric')}
                        </p>
                        <p className="mt-1 text-foreground">{fabric}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {product.inStock ? (
                <div className="mb-10">
                  <label className="mb-3 block text-sm font-semibold text-foreground">
                    {t('common.quantity')}
                  </label>
                  <div className="flex w-fit items-center overflow-hidden rounded-none border border-border">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 hover:bg-muted transition-colors text-foreground"
                      aria-label={t('cart.decreaseQuantity')}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-foreground bg-muted/30">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 hover:bg-muted transition-colors text-foreground"
                      aria-label={t('cart.increaseQuantity')}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-10">
                  <span className="inline-block rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 font-medium text-destructive">
                    {t('common.outOfStock')}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex w-full items-center justify-center gap-3 rounded-none py-4 px-6 text-lg font-semibold shadow-soft transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                  addedToCart
                    ? 'bg-emerald-600 text-white shadow-[0_12px_30px_-8px_rgba(22,163,74,0.45)]'
                    : 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-large active:translate-y-0'
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
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="mx-auto w-full max-w-7xl border-t border-border/50 container-padding py-16 lg:py-20">
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
          <div className="mt-12 flex justify-center border-t border-border/40 pt-10 sm:justify-start">
            <Link
              to="/products"
              className="btn-secondary inline-flex items-center gap-2 rounded-none border-0 px-8 shadow-none no-underline hover:shadow-none"
            >
              <ArrowLeft className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {t('productDetail.backToShop')}
            </Link>
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
        render={lightboxRender}
        labels={{
          Close: t('productDetail.lightboxClose'),
          'Zoom in': t('productDetail.lightboxZoomIn'),
          'Zoom out': t('productDetail.lightboxZoomOut'),
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.92)' },
          toolbar: { gap: '10px', padding: '12px 14px' },
        }}
      />
    </div>
  )
}
