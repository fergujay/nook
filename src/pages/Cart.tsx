import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart()
  const { t, language } = useLanguage()
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'
  const [pageLoaded, setPageLoaded] = useState(false)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  const formatRsd = (value: number) => `${value.toLocaleString(priceLocale)} RSD`

  const FREE_SHIPPING_THRESHOLD = 10000
  const progressToFreeShipping = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = (id: string) => {
    setRemovingItemId(id)
    setTimeout(() => {
      removeFromCart(id)
      setRemovingItemId(null)
    }, 300)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16 min-h-[70vh] flex items-center justify-center">
        <div 
          className={`text-center transition-all duration-700 ${
            pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="heading-medium mb-4 text-foreground">
            {t('cart.title')}
          </h1>
          <p className="text-muted-foreground text-xl mb-2 font-medium">
            {t('cart.empty')}
          </p>
          <p className="text-muted-foreground mb-8">{t('cart.emptyHint')}</p>
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
      <h1 
        className={`heading-medium mb-8 text-foreground transition-all duration-700 ${
          pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {t('cart.title')}
        <span className="ml-3 text-lg font-normal text-muted-foreground">
          ({totalItems} {totalItems === 1 ? t('common.item') : t('common.items')})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-300 hover:shadow-soft ${
                removingItemId === item.id 
                  ? 'opacity-0 scale-95 -translate-x-4' 
                  : 'opacity-100 scale-100 translate-x-0'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                transitionDelay: removingItemId === item.id ? '0ms' : `${index * 50}ms`
              }}
            >
              {/* Product Image */}
              <Link 
                to={`/products/${item.id}`} 
                className="group flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Product Details */}
              <div className="flex-grow flex flex-col justify-between min-w-0">
                <div>
                  <Link 
                    to={`/products/${item.id}`}
                    className="font-editorial font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-primary font-bold text-xl mt-1">
                    {formatRsd(item.price)}
                  </p>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border rounded-none overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2.5 hover:bg-muted transition-colors text-foreground"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-foreground bg-muted/30">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2.5 hover:bg-muted transition-colors text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      aria-label={t('cart.remove')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {t('cart.subtotal')}
                    </p>
                    <p className="font-bold text-xl text-foreground">
                      {formatRsd(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div 
            className={`bg-card border border-border rounded-xl p-6 sticky top-24 transition-all duration-700 delay-200 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 text-foreground">
              {t('cart.summary')}
            </h2>

            {/* Free Shipping Progress */}
            {amountToFreeShipping > 0 && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {formatRsd(amountToFreeShipping)} {language === 'sr' ? 'do besplatne dostave' : 'away from free shipping'}
                  </span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}

            {progressToFreeShipping >= 100 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {language === 'sr' ? 'Besplatna dostava!' : 'Free shipping unlocked!'}
                </span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.itemsCount')} ({totalItems})</span>
                <span className="font-medium text-foreground">{formatRsd(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping')}</span>
                <span className="text-sm italic">
                  {t('cart.shippingFromCheckout')}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-foreground">{t('cart.total')}</span>
                <span className="text-primary">{formatRsd(totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="btn-primary w-full text-center flex items-center justify-center gap-2"
              >
                {t('cart.proceedToCheckout')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="btn-secondary w-full text-center block"
              >
                {t('common.continueShopping')}
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              {t('cart.freeShippingNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
