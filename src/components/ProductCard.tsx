import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Product } from '../data/products'
import { useCart } from '../contexts/CartContext'
import { getAssetPath } from '../utils/images'
import ImageWithLoader from './ImageWithLoader'
import { useState, useEffect, useRef } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  )
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const desktopIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileSlideRef = useRef<number>(0)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const galleryImages = product.gallery || [product.image]
  
  // Different intervals for mobile slideshow (5 images)
  const mobileIntervals = [3000, 2500, 4000, 3500, 3000] // Different intervals in ms
  
  // Check if mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Desktop: Change images on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || galleryImages.length <= 1) return
    
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width
      const percentage = x / width
      
      // Map mouse position to image index
      const imageIndex = Math.floor(percentage * galleryImages.length)
      const clampedIndex = Math.min(imageIndex, galleryImages.length - 1)
      
      setCurrentImageIndex(clampedIndex)
    }
  }
  
  // Desktop: Reset to first image when not hovered
  useEffect(() => {
    // Clear mobile slideshow when on desktop
    if (!isMobile && mobileIntervalRef.current) {
      clearTimeout(mobileIntervalRef.current)
      mobileIntervalRef.current = null
    }
    
    if (!isMobile && !isHovered) {
      setCurrentImageIndex(0)
    }
  }, [isHovered, isMobile])
  
  // Mobile: Slideshow with different intervals
  useEffect(() => {
    // Clear desktop hover interval when on mobile
    if (isMobile && desktopIntervalRef.current) {
      clearInterval(desktopIntervalRef.current)
      desktopIntervalRef.current = null
    }
    
    if (isMobile && galleryImages.length > 1) {
      const scheduleNext = () => {
        if (mobileIntervalRef.current) {
          clearTimeout(mobileIntervalRef.current)
        }
        
        const interval = mobileIntervals[mobileSlideRef.current % mobileIntervals.length]
        mobileIntervalRef.current = setTimeout(() => {
          mobileSlideRef.current = (mobileSlideRef.current + 1) % galleryImages.length
          setCurrentImageIndex(mobileSlideRef.current)
          scheduleNext()
        }, interval)
      }
      
      // Reset to start
      mobileSlideRef.current = 0
      setCurrentImageIndex(0)
      
      // Start slideshow with first interval
      const initialInterval = mobileIntervals[0]
      mobileIntervalRef.current = setTimeout(() => {
        scheduleNext()
      }, initialInterval)
    } else {
      if (mobileIntervalRef.current) {
        clearTimeout(mobileIntervalRef.current)
        mobileIntervalRef.current = null
      }
      mobileSlideRef.current = 0
    }
    
    return () => {
      if (mobileIntervalRef.current) {
        clearTimeout(mobileIntervalRef.current)
        mobileIntervalRef.current = null
      }
    }
  }, [isMobile, galleryImages.length])
  
  // Reset to first image when not hovered (desktop)
  useEffect(() => {
    if (!isMobile && !isHovered) {
      setCurrentImageIndex(0)
    }
  }, [isHovered, isMobile])
  
  // Swipe handlers for mobile
  const minSwipeDistance = 50
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if ((isLeftSwipe || isRightSwipe) && galleryImages.length > 1) {
      // Pause slideshow when user swipes
      if (mobileIntervalRef.current) {
        clearTimeout(mobileIntervalRef.current)
        mobileIntervalRef.current = null
      }
      
      if (isLeftSwipe) {
        const nextIndex = (currentImageIndex + 1) % galleryImages.length
        setCurrentImageIndex(nextIndex)
        mobileSlideRef.current = nextIndex
      }
      if (isRightSwipe) {
        const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
        setCurrentImageIndex(prevIndex)
        mobileSlideRef.current = prevIndex
      }
      
      // Resume slideshow after swipe
      if (isMobile) {
        const scheduleNext = () => {
          if (mobileIntervalRef.current) {
            clearTimeout(mobileIntervalRef.current)
          }
          const nextInterval = mobileIntervals[mobileSlideRef.current % mobileIntervals.length]
          mobileIntervalRef.current = setTimeout(() => {
            mobileSlideRef.current = (mobileSlideRef.current + 1) % galleryImages.length
            setCurrentImageIndex(mobileSlideRef.current)
            scheduleNext()
          }, nextInterval)
        }
        const interval = mobileIntervals[mobileSlideRef.current % mobileIntervals.length]
        mobileIntervalRef.current = setTimeout(() => {
          scheduleNext()
        }, interval)
      }
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <div 
      ref={cardRef}
      className="group relative overflow-hidden" 
      style={{ aspectRatio: '4/5' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Link
        to={`/products/${product.id}`}
        className="block w-full h-full"
      >
        {/* Main Image - Full Size with Gallery */}
        <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ImageWithLoader
                src={getAssetPath(image)}
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          ))}
          
          {/* Title at top - appears on hover */}
          <div 
            className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/50 via-black/30 to-transparent opacity-0 group-hover:opacity-100 z-20"
            style={{
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div 
              className="transform -translate-y-2 group-hover:translate-y-0"
              style={{
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div className="mb-1">
                <span className="text-xs uppercase tracking-wider font-medium text-white/80">
                  {product.category}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-white leading-tight">
                {product.name}
              </h3>
            </div>
          </div>
          
          {/* Overlay with product info at bottom - appears on hover */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6 sm:p-8 z-10"
            style={{
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div 
              className="transform translate-y-4 group-hover:translate-y-0"
              style={{
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
                {product.description}
              </p>
              <div className="text-xl font-semibold text-white">
                {product.price.toLocaleString('sr-RS')} RSD
              </div>
              {product.size && (
                <div className="text-xs text-white/80 mb-1">
                  {product.size} {product.shape ? `(${product.shape})` : ''}
                </div>
              )}
              {product.fabric && (
                <div className="text-xs text-white/80">
                  {product.fabric}
                </div>
              )}
            </div>
          </div>

          {/* Subtle bottom info - always visible but hidden on hover */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-100 group-hover:opacity-0"
            style={{
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-1">
                  {product.name}
                </h3>
                <div className="text-sm text-white/90">
                  {product.price.toLocaleString('sr-RS')} RSD
                </div>
              </div>
            </div>
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <span className="text-white font-semibold px-6 py-3 bg-black/80 backdrop-blur-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Add to Cart Button - appears on hover */}
      {product.inStock && (
        <button
          onClick={handleAddToCart}
          className="absolute top-4 right-4 p-3 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 z-30"
          style={{ 
            color: 'var(--foreground)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.color = 'var(--primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.color = 'var(--foreground)'
          }}
          aria-label="Add to cart"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}



