import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, Truck, Check, ShoppingBag, ArrowRight, Lock } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'

type DeliveryMethod = 'courier_belgrade' | 'post_serbia' | 'pickup'
type PaymentMethod = 'card' | 'cash_on_delivery' | 'at_pickup'

const FREE_SHIPPING_THRESHOLD = 10000

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { t, language } = useLanguage()
  const priceLocale = language === 'sr' ? 'sr-RS' : 'en-US'
  const [pageLoaded, setPageLoaded] = useState(false)

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('courier_belgrade')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'serbia',
    notes: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const deliveryCost = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) return 0
    if (deliveryMethod === 'courier_belgrade') return 500
    if (deliveryMethod === 'post_serbia') return 300
    return 0
  }, [totalPrice, deliveryMethod])

  const paymentOptions: { id: PaymentMethod; label: string }[] = useMemo(() => {
    const opts: { id: PaymentMethod; label: string }[] = [
      { id: 'card', label: t('checkout.paymentCard') },
    ]
    if (deliveryMethod === 'courier_belgrade') {
      opts.push({
        id: 'cash_on_delivery',
        label: t('checkout.paymentCashOnDelivery'),
      })
    }
    if (deliveryMethod === 'pickup') {
      opts.push({
        id: 'at_pickup',
        label: t('checkout.paymentAtPickup'),
      })
    }
    return opts
  }, [deliveryMethod, t])

  const selectedPayment = paymentOptions.find((p) => p.id === paymentMethod)
    ? paymentMethod
    : paymentOptions[0].id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearCart()
    navigate('/order')
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const formatRsd = (v: number) => `${v.toLocaleString(priceLocale)} RSD`

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
          <p className="text-muted-foreground text-xl mb-2 font-medium">
            {t('cart.empty')}
          </p>
          <p className="text-muted-foreground mb-8">{t('cart.emptyHint')}</p>
          <button onClick={() => navigate('/products')} className="btn-primary inline-flex items-center gap-2">
            {t('common.browseProducts')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  const total = totalPrice + deliveryCost

  return (
    <div className="max-w-7xl mx-auto container-padding py-12 min-h-screen">
      {/* Header */}
      <h1 
        className={`heading-medium mb-4 text-foreground transition-all duration-700 ${
          pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {t('checkout.title')}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div 
            className={`bg-card border border-border rounded-xl p-6 transition-all duration-500 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-6 flex items-start gap-3 text-left">
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="min-w-0 flex-1 text-left text-xl font-semibold text-foreground">
                {t('checkout.shippingInformation')}
              </h2>
            </div>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('checkout.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                {deliveryMethod !== 'pickup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.address')}
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.city')}
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.zipCode')}
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.country')}
                      </label>
                      <select
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="serbia">{t('checkout.serbia')}</option>
                        <option value="other">{t('checkout.other')}</option>
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('checkout.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div 
            className={`bg-card border border-border rounded-xl p-6 transition-all duration-500 delay-100 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-6 flex items-start gap-3 text-left">
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="min-w-0 flex-1 text-left text-xl font-semibold text-foreground">
                {t('checkout.deliveryMethod')}
              </h2>
            </div>
            
            <div className="space-y-3">
                {(
                  [
                    {
                      id: 'courier_belgrade' as DeliveryMethod,
                      label: t('checkout.deliveryCourierBelgrade'),
                      hint: t('checkout.deliveryCourierBelgradeHint'),
                    },
                    {
                      id: 'post_serbia' as DeliveryMethod,
                      label: t('checkout.deliveryPost'),
                      hint: t('checkout.deliveryPostHint'),
                    },
                    {
                      id: 'pickup' as DeliveryMethod,
                      label: t('checkout.deliveryPickup'),
                      hint: t('checkout.deliveryPickupHint'),
                    },
                  ]
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      deliveryMethod === opt.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={deliveryMethod === opt.id}
                      onChange={() => {
                        setDeliveryMethod(opt.id)
                        if (opt.id !== 'courier_belgrade' && paymentMethod === 'cash_on_delivery') {
                          setPaymentMethod('card')
                        }
                        if (opt.id !== 'pickup' && paymentMethod === 'at_pickup') {
                          setPaymentMethod('card')
                        }
                      }}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {opt.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{opt.hint}</div>
                    </div>
                    {deliveryMethod === opt.id && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </label>
                ))}
            </div>
          </div>

          {/* Payment Method */}
          <div 
            className={`bg-card border border-border rounded-xl p-6 transition-all duration-500 delay-200 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-6 flex items-start gap-3 text-left">
              <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <h2 className="min-w-0 flex-1 text-left text-xl font-semibold text-foreground">
                {t('checkout.paymentMethod')}
              </h2>
            </div>
            
            <div className="mb-4 space-y-3">
                  {paymentOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPayment === opt.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={selectedPayment === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="accent-primary"
                      />
                      <span className="font-medium text-foreground flex-1">{opt.label}</span>
                      {selectedPayment === opt.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
                {selectedPayment === 'card' && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.cardNumber')}
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('checkout.cardName')}
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        required
                        value={formData.cardName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('checkout.expiryDate')}
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          required
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('checkout.cvv')}
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          required
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div 
            className={`bg-card border border-border rounded-xl p-6 sticky top-24 transition-all duration-700 delay-300 ${
              pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 text-foreground">{t('cart.summary')}</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-3 border-b border-border last:border-0"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatRsd(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium text-foreground">{formatRsd(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping')}</span>
                <span className="font-medium text-foreground">
                  {deliveryCost === 0
                    ? language === 'sr' ? 'Besplatno' : 'Free'
                    : formatRsd(deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
                <span className="text-foreground">{t('cart.total')}</span>
                <span className="text-primary">{formatRsd(total)}</span>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground my-6 leading-relaxed">
              {t('checkout.termsAccept')}{' '}
              <Link
                to="/terms"
                className="text-primary hover:underline"
              >
                {t('checkout.termsLink')}
              </Link>{' '}
              {t('checkout.and')}{' '}
              <Link
                to="/privacy"
                className="text-primary hover:underline"
              >
                {t('checkout.privacyLink')}
              </Link>
              .
            </p>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              {t('checkout.placeOrder')}
            </button>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              {language === 'sr' ? 'Sigurno plaćanje' : 'Secure checkout'}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
