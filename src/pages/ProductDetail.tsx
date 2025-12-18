import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { getProductById, products } from '../data/products'
import { useCart } from '../contexts/CartContext'
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
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  
  const galleryImages = product?.gallery || [product?.image || ''].filter(Boolean)
  
  // Prepare images for lightbox
  const lightboxSlides = galleryImages.map((src) => ({
    src,
    alt: product?.name || '',
  }))

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Back to Products
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

  // Scroll wheel navigation for gallery
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
          setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
        }
      }
    }

    galleryElement.addEventListener('wheel', handleWheel, { passive: false })
    return () => galleryElement.removeEventListener('wheel', handleWheel)
  }, [galleryImages.length, isLightboxOpen])

  // Get recommended products (exclude current product, same category, limit to 3)
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
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="relative overflow-hidden" style={{ height: '500px' }} data-gallery-container>
          {/* Main Image */}
          <div 
            className="w-full h-full overflow-hidden group cursor-pointer relative flex items-center justify-center" 
            style={{ 
              height: '500px', 
              backgroundColor: 'var(--muted)'
            }}
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={galleryImages[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-500 ease-out group-hover:opacity-90"
              style={{ 
                maxHeight: '500px',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
          
          {/* Indicator Line */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-1 px-4 pb-2">
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 transition-all duration-300"
                  style={{
                    height: '2px',
                    backgroundColor: index === selectedImage ? 'var(--primary)' : 'var(--border)',
                    opacity: index === selectedImage ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center" style={{ backgroundColor: 'var(--card)' }}>
          <div className="container-padding py-16 lg:py-24">
            <div className="max-w-lg">
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 text-sm font-medium" style={{ backgroundColor: 'var(--muted)', color: 'var(--primary)' }}>
                  {product.category}
                </span>
              </div>
              <h1 className="heading-large mb-6" style={{ color: 'var(--foreground)' }}>{product.name}</h1>
              <p className="text-3xl md:text-4xl font-medium mb-6" style={{ color: 'var(--primary)' }}>
                {product.price.toLocaleString('sr-RS')} RSD
              </p>
              <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {product.description}
              </p>
              {product.size && (
                <div className="mb-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Size: </span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{product.size}</span>
                  {product.shape && (
                    <span style={{ color: 'var(--muted-foreground)' }}> ({product.shape})</span>
                  )}
                </div>
              )}
              {product.fabric && (
                <div className="mb-8">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Fabric: </span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{product.fabric}</span>
                </div>
              )}

              {product.inStock ? (
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 flex items-center justify-center transition-all font-medium text-lg"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)'
                        e.currentTarget.style.borderColor = 'var(--primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = 'var(--border)'
                      }}
                    >
                      −
                    </button>
                    <span className="text-xl font-medium w-16 text-center" style={{ color: 'var(--foreground)' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 flex items-center justify-center transition-all font-medium text-lg"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)'
                        e.currentTarget.style.borderColor = 'var(--primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = 'var(--border)'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 font-medium border" style={{ backgroundColor: 'var(--muted)', color: 'var(--destructive)', borderColor: 'var(--destructive)' }}>
                    Out of Stock
                  </span>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <section className="w-full container-padding py-16" style={{ backgroundColor: 'var(--card)' }}>
          <h2 className="heading-medium mb-8" style={{ color: 'var(--foreground)' }}>
            Recommended Products
          </h2>
          <div className="grid grid-cols-2 gap-0 border-t border-l" style={{ borderColor: 'var(--border)' }}>
            {recommendedProducts.map((recommendedProduct) => (
              <div key={recommendedProduct.id} className="animate-fade-in">
                <ProductCard product={recommendedProduct} />
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
        carousel={{
          finite: false,
          preload: 2,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </div>
  )
}
