import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'

export default function Favorites() {
  const { items, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()
  const { t, language } = useLanguage()
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'
  const [pageLoaded, setPageLoaded] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = (id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      removeFromFavorites(id)
      setRemovingId(null)
    }, 300)
  }

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart(item)
    setAddedToCartId(item.id)
    setTimeout(() => setAddedToCartId(null), 1500)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16 min-h-[70vh] flex items-center justify-center">
        <div 
          className={`text-center transition-all duration-700 ${
            pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="heading-medium mb-4 text-foreground">
            {t('favorites.title')}
          </h1>
          <p className="text-muted-foreground text-xl mb-2 font-medium">
            {t('favorites.empty')}
          </p>
          <p className="text-muted-foreground mb-8">{t('favorites.emptyHint')}</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            {t('common.browseProducts')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto container-padding py-12 min-h-screen">
      {/* Header */}
      <div 
        className={`flex items-center justify-between mb-10 transition-all duration-700 ${
          pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="heading-medium text-foreground">{t('favorites.title')}</h1>
        <span className="text-muted-foreground font-medium px-4 py-2 bg-muted rounded-full text-sm">
          {items.length} {items.length === 1 ? t('common.item') : t('common.items')}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={`bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 hover:shadow-large hover:-translate-y-1 ${
              removingId === item.id 
                ? 'opacity-0 scale-95' 
                : 'opacity-100 scale-100'
            }`}
            style={{ 
              animationDelay: `${index * 80}ms`,
              transitionDelay: removingId === item.id ? '0ms' : `${index * 50}ms`
            }}
          >
            <Link to={`/products/${item.id}`} className="block group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Heart indicator */}
                <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
                  <Heart className="h-4 w-4 text-primary" fill="currentColor" />
                </div>
              </div>
            </Link>
            
            <div className="p-5 space-y-4">
              <div>
                <Link 
                  to={`/products/${item.id}`}
                  className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-2xl font-bold text-primary mt-1">
                  {item.price.toLocaleString(priceLocale)} RSD
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-all duration-300 ${
                    addedToCartId === item.id 
                      ? 'bg-green-600 text-white' 
                      : 'bg-primary text-primary-foreground hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addedToCartId === item.id ? t('common.addedToCart') : t('common.addToCart')}
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-3 text-destructive hover:bg-destructive/10 border border-destructive/30 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label={t('favorites.removeFromFavorites')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
