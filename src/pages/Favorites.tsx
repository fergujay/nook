import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { products } from '../data/products'
import { getAssetPath } from '../utils/images'

export default function Favorites() {
  const { t } = useLanguage();
  const { items, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16">
        <h1 className="heading-medium mb-12" style={{ color: 'var(--foreground)' }}>{t('favorites')}</h1>
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 mb-6">
            <Heart className="h-12 w-12 text-red-400" />
          </div>
          <p className="text-gray-600 text-xl mb-2 font-medium">{t('yourFavoritesIsEmpty')}</p>
          <p className="text-gray-500 mb-8">{t('startAddingToFavorites')}</p>
          <Link to="/products" className="btn-primary inline-flex items-center">
            {t('browseProducts')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto container-padding py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="heading-medium">{t('favorites')}</h1>
        <span className="text-gray-600 font-medium">{items.length} {items.length === 1 ? t('item') : t('items')}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id} className="card-hover">
            <Link to={`/products/${item.id}`} className="block">
              <div className="relative aspect-square overflow-hidden rounded-xl mb-5 bg-gray-100">
                <img
                  src={getAssetPath(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
              <p
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--primary)" }}
              >
                {item.price.toLocaleString('sr-RS')} RSD
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Find the full product from products data
                    const fullProduct = products.find(p => p.id === item.id);
                    if (fullProduct) {
                      addToCart(fullProduct);
                    }
                  }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t('addToCart')}
                </button>
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  className="p-3 text-red-600 hover:bg-red-50 border-2 border-red-200 rounded-lg transition-colors"
                  aria-label={t('removeFromFavorites')}
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



