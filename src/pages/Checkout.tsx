import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, Truck } from 'lucide-react'
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
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="text-center py-20">
          <p className="text-gray-600 text-xl mb-4 font-medium">
            {t('cart.empty')}
          </p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            {t('common.continueShopping')}
          </button>
        </div>
      </div>
    )
  }

  const total = totalPrice + deliveryCost

  return (
    <div className="max-w-7xl mx-auto container-padding py-12">
      <h1
        className="heading-medium mb-12"
        style={{ color: 'var(--foreground)' }}
      >
        {t('checkout.title')}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-medium">
                {t('checkout.shippingInformation')}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.firstName')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.lastName')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              {deliveryMethod !== 'pickup' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.address')}
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.city')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.zipCode')}
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.country')}
                    </label>
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="serbia">{t('checkout.serbia')}</option>
                      <option value="other">{t('checkout.other')}</option>
                    </select>
                  </div>
                </>
              )}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.notes')}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-medium">
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
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    deliveryMethod === opt.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
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
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {opt.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{opt.hint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <CreditCard className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-medium">
                {t('checkout.paymentMethod')}
              </h2>
            </div>
            <div className="space-y-3 mb-4">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPayment === opt.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={selectedPayment === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                  />
                  <span className="font-medium text-gray-900">{opt.label}</span>
                </label>
              ))}
            </div>
            {selectedPayment === 'card' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.cardNumber')}
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.cardName')}
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.expiryDate')}
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.cvv')}
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-28">
            <h2 className="text-2xl font-medium mb-6">{t('cart.summary')}</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatRsd(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t-2 border-gray-200 pt-4 space-y-3 mt-4">
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold">{formatRsd(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-semibold">
                    {deliveryCost === 0
                      ? t('courier.optionPickupPrice')
                      : formatRsd(deliveryCost)}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-gray-200">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary-600">{formatRsd(total)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              {t('checkout.termsAccept')}{' '}
              <Link
                to="/terms"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                {t('checkout.termsLink')}
              </Link>{' '}
              {t('checkout.and')}{' '}
              <Link
                to="/privacy"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                {t('checkout.privacyLink')}
              </Link>
              .
            </p>
            <button type="submit" className="btn-primary w-full text-lg py-4">
              {t('checkout.placeOrder')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
