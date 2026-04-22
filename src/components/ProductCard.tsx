import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '../data/products'
import { useCart } from '../contexts/CartContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useLanguage } from '../contexts/LanguageContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const { t, language } = useLanguage()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const description = product.descriptionKey ? t(product.descriptionKey) : product.description
  const fabric = product.fabricKey ? t(product.fabricKey) : product.fabric
  const shape = product.shapeKey ? t(product.shapeKey) : product.shape
  const categoryLabel = t(`productFields.categories.${product.category}`) || product.category
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'
  const favored = isFavorite(product.id)

  return (
    <div
      className="group block border-r border-b hover:bg-muted transition-all duration-300 h-full relative flex flex-col"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        <div
          className="relative aspect-[3/2] overflow-hidden border-b"
          style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold px-4 py-2 bg-black/70">
                {t('common.outOfStock')}
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col justify-between" style={{ backgroundColor: 'var(--card)' }}>
          <div>
            <div className="mb-1">
              <span
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {categoryLabel}
              </span>
            </div>
            <h3
              className="text-xl md:text-2xl font-medium mb-1 group-hover:text-primary transition-colors leading-tight"
              style={{ color: 'var(--foreground)' }}
            >
              {product.name}
            </h3>
            <p
              className="text-xs mb-2 leading-relaxed line-clamp-2"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {description}
            </p>
          </div>
          <div className="space-y-0.5">
            <div className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
              {product.price.toLocaleString(priceLocale)} RSD
            </div>
            {product.size && (
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {product.size}
                {shape ? ` (${shape})` : ''}
              </div>
            )}
            {fabric && (
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {fabric}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute bottom-6 right-6 flex gap-2">
        <button
          onClick={handleToggleFavorite}
          className="p-2 border bg-white/80 hover:bg-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
          style={{
            borderColor: favored ? 'var(--primary)' : 'var(--border)',
            color: favored ? 'var(--primary)' : 'var(--muted-foreground)',
          }}
          aria-label={favored ? t('favorites.removeFromFavorites') : t('favorites.addToFavorites')}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" fill={favored ? 'currentColor' : 'none'} />
        </button>
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            className="p-2 border bg-white/80 hover:bg-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.color = 'var(--primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted-foreground)'
            }}
            aria-label={t('common.addToCart')}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
