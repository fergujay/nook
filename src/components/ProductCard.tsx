import { Link } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import { Product } from '../data/products'
import { formatProductDisplaySize } from '../utils/productSize'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const { t, language } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    // Visual feedback
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const description = product.descriptionKey ? t(product.descriptionKey) : product.description
  const fabric = product.fabricKey ? t(product.fabricKey) : product.fabric
  const shape = product.shapeKey ? t(product.shapeKey) : product.shape
  const displaySize = formatProductDisplaySize(product)
  const categoryLabel = t(`productFields.categories.${product.category}`) || product.category
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'

  return (
    <div
      className="group block bg-card border border-border hover:border-primary/20 transition-all duration-500 h-full relative flex flex-col hover:shadow-large hover:-translate-y-1"
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-semibold px-5 py-2.5 bg-black/70 text-sm tracking-wide">
                {t('common.outOfStock')}
              </span>
            </div>
          )}

          {/* Quick view — inset matches category (top-3 left-3) and cart (top-3 right-3): 12px edges */}
          <div 
            className={`absolute bottom-3 left-3 right-3 flex justify-center transition-all duration-300 ${
              isHovered && product.inStock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="inline-flex items-center gap-2 border border-border bg-white/95 px-4 py-2 text-sm font-medium text-muted-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:text-primary hover:shadow-lg active:scale-95">
              <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              {t('common.viewProduct')}
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-white/90 text-foreground backdrop-blur-sm shadow-sm">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            <h3
              className={`font-editorial text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-300 md:text-xl mb-2 ${
                isHovered ? 'text-primary' : 'text-foreground'
              }`}
            >
              {product.name}
            </h3>
            <p className="text-sm mb-3 leading-relaxed line-clamp-2 text-muted-foreground">
              {description}
            </p>
          </div>
          
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-foreground">
                {product.price.toLocaleString(priceLocale)} RSD
              </span>
            </div>
            {(displaySize || fabric) && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {displaySize && (
                  <span>
                    {displaySize}
                    {shape && product.shape !== 'round' ? ` (${shape})` : ''}
                  </span>
                )}
                {fabric && (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    {fabric}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div 
        className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        {product.inStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex shrink-0 items-center justify-center rounded-none border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 ${
              addedToCart
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-white/95 text-muted-foreground hover:border-primary hover:text-primary'
            }`}
            aria-label={t('common.addToCart')}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ShoppingCart
              className={`h-4 w-4 transition-transform duration-300 ${addedToCart ? 'scale-110' : ''}`}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Added to cart feedback */}
      <div 
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium shadow-lg transition-all duration-300 ${
          addedToCart ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {t('common.addedToCart')}
      </div>
    </div>
  )
}
