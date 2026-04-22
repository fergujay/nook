import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react'
import { getProductById, products } from '../data/products'
import { useCart } from '../contexts/CartContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'
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

  const galleryImages = product?.gallery || [product?.image || ''].filter(Boolean)

  const lightboxSlides = galleryImages.map((src) => ({
    src,
    alt: product?.name || '',
  }))

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          {t('common.backToProducts')}
        </button>
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
    <div className="w-full">
      <div className="container-padding py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-8 transition-colors group"
          style={{ color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--muted-foreground)')
          }
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t('common.backToProducts')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div
          className="relative overflow-hidden"
          style={{ height: '500px' }}
          data-gallery-container
        >
          <div
            className="w-full h-full overflow-hidden group cursor-pointer relative flex items-center justify-center"
            style={{ height: '500px', backgroundColor: 'var(--muted)' }}
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={galleryImages[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-500 ease-out group-hover:opacity-90"
              style={{ maxHeight: '500px', width: 'auto', height: 'auto' }}
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-1 px-4 pb-2">
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 transition-all duration-300"
                  style={{
                    height: '2px',
                    backgroundColor:
                      index === selectedImage
                        ? 'var(--primary)'
                        : 'var(--border)',
                    opacity: index === selectedImage ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="flex flex-col justify-center"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="container-padding py-16 lg:py-24">
            <div className="max-w-lg">
              <div className="mb-4">
                <span
                  className="inline-block px-4 py-1.5 text-sm font-medium"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--primary)' }}
                >
                  {categoryLabel}
                </span>
              </div>
              <h1
                className="heading-large mb-6"
                style={{ color: 'var(--foreground)' }}
              >
                {product.name}
              </h1>
              <p
                className="text-3xl md:text-4xl font-medium mb-6"
                style={{ color: 'var(--primary)' }}
              >
                {product.price.toLocaleString(priceLocale)} RSD
              </p>
              <p
                className="text-base md:text-lg mb-8 leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {description}
              </p>
              {product.size && (
                <div className="mb-4">
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {t('common.size')}:{' '}
                  </span>
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    {product.size}
                  </span>
                  {shape && (
                    <span style={{ color: 'var(--muted-foreground)' }}>
                      {' '}
                      ({shape})
                    </span>
                  )}
                </div>
              )}
              {fabric && (
                <div className="mb-8">
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {t('common.fabric')}:{' '}
                  </span>
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    {fabric}
                  </span>
                </div>
              )}

              {product.inStock ? (
                <div className="mb-8">
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {t('common.quantity')}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 flex items-center justify-center transition-all font-medium text-lg"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                      }}
                    >
                      −
                    </button>
                    <span
                      className="text-xl font-medium w-16 text-center"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 flex items-center justify-center transition-all font-medium text-lg"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <span
                    className="inline-block px-4 py-2 font-medium border"
                    style={{
                      backgroundColor: 'var(--muted)',
                      color: 'var(--destructive)',
                      borderColor: 'var(--destructive)',
                    }}
                  >
                    {t('common.outOfStock')}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t('common.addToCart')}
                </button>
                <button
                  onClick={toggleFavorite}
                  className="px-4 border-2 transition-all"
                  style={{
                    borderColor: favored ? 'var(--primary)' : 'var(--border)',
                    color: favored ? 'var(--primary)' : 'var(--foreground)',
                  }}
                  aria-label={
                    favored
                      ? t('favorites.removeFromFavorites')
                      : t('favorites.addToFavorites')
                  }
                >
                  <Heart className="h-5 w-5" fill={favored ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recommendedProducts.length > 0 && (
        <section
          className="w-full container-padding py-16"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <h2
            className="heading-medium mb-8"
            style={{ color: 'var(--foreground)' }}
          >
            {t('productDetail.recommended')}
          </h2>
          <div
            className="grid grid-cols-2 gap-0 border-t border-l"
            style={{ borderColor: 'var(--border)' }}
          >
            {recommendedProducts.map((recommendedProduct) => (
              <div key={recommendedProduct.id} className="animate-fade-in">
                <ProductCard product={recommendedProduct} />
              </div>
            ))}
          </div>
        </section>
      )}

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
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } }}
      />
    </div>
  )
}
