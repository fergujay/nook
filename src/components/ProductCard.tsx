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

const productPath = (id: string) => `/products/${id}`

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
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const description = product.descriptionKey ? t(product.descriptionKey) : product.description
  const fabric = product.fabricKey ? t(product.fabricKey) : product.fabric
  const shape = product.shapeKey ? t(product.shapeKey) : product.shape
  const displaySize = formatProductDisplaySize(product)
  const categoryLabel = t(`productFields.categories.${product.category}`) || product.category
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'

  const toProduct = productPath(product.id)

  return (
    <div
      className="group block bg-card border border-border hover:border-primary/20 transition-all duration-500 h-full relative flex flex-col hover:shadow-large hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image: link covers full area; overlays use pointer-events-none so taps reach the link */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Link
          to={toProduct}
          className="absolute inset-0 z-0 block"
          aria-label={`${product.name} — ${t('common.viewProduct')}`}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 z-20 bg-muted animate-pulse" />
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        <div
          className={`pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } hidden md:block`}
        />

        {!product.inStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="text-white font-semibold px-5 py-2.5 bg-black/70 text-sm tracking-wide">
              {t('common.outOfStock')}
            </span>
          </div>
        )}

        {/* Desktop + hover: “view” hint on image (mobile actions are under price in the card body) */}
        <div
          className={`pointer-events-none absolute bottom-3 left-3 right-3 z-20 hidden justify-center transition-all duration-300 md:flex ${
            isHovered && product.inStock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-flex items-center gap-2 border border-border bg-white/95 px-4 py-2 text-sm font-medium text-muted-foreground shadow-md backdrop-blur-sm">
            <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {t('common.viewProduct')}
          </span>
        </div>

        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-white/90 text-foreground backdrop-blur-sm shadow-sm">
            {categoryLabel}
          </span>
        </div>

      </div>

      <div className="p-5 flex flex-col justify-between flex-grow min-h-0">
        <div>
          <h3
            className={`font-editorial text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-300 md:text-xl mb-2 ${
              isHovered ? 'text-primary' : 'text-foreground'
            }`}
          >
            <Link to={toProduct} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              {product.name}
            </Link>
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

          {/* Mobile / touch: actions under price & specs — clear separation from details above */}
          <div className="mt-6 md:hidden">
            {product.inStock ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={toProduct}
                  className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 border border-border bg-card px-2 py-2.5 text-center text-xs font-medium text-foreground shadow-sm transition-all duration-200 touch-manipulation active:scale-[0.98] sm:text-sm"
                >
                  <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  <span className="line-clamp-2 leading-tight">{t('common.viewProduct')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 border px-2 py-2.5 text-center text-xs font-medium shadow-sm transition-all duration-200 touch-manipulation active:scale-[0.98] sm:text-sm ${
                    addedToCart
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-white text-foreground hover:border-primary/40'
                  }`}
                  aria-label={t('common.addToCart')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <ShoppingCart
                    className={`h-4 w-4 shrink-0 ${addedToCart ? 'scale-110' : ''}`}
                    strokeWidth={2}
                  />
                  <span className="line-clamp-2 leading-tight">{t('common.addToCart')}</span>
                </button>
              </div>
            ) : (
              <Link
                to={toProduct}
                className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 touch-manipulation active:scale-[0.98]"
              >
                <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                {t('common.viewProduct')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: corner cart, hover to reveal (mirrors old behavior) */}
      {product.inStock && (
        <div
          className={`hidden md:flex absolute top-3 right-3 z-30 flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
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
        </div>
      )}

      <div
        className={`absolute left-1/2 z-40 max-w-[min(100%,18rem)] -translate-x-1/2 px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow-lg transition-all duration-300 pointer-events-none bg-primary top-1/2 -translate-y-1/2 md:top-auto md:bottom-20 md:translate-y-0 ${
          addedToCart ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={!addedToCart}
      >
        {t('common.addedToCart')}
      </div>
    </div>
  )
}
