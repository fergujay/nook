import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, Loader2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { createPaymentIntent, confirmPayment } from '../services/paymentService'
import { sendFiscalReceipt, calculateVAT, type FiscalReceiptItem, formatFiscalReceipt } from '../services/fiscalService'
import { sendOrderConfirmationEmail, type OrderEmailData } from '../services/emailService'
import { saveOrder } from '../services/orderService'

export default function Checkout() {
  const { t } = useLanguage();
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    try {
      const totalAmount = totalPrice + 500 // Including shipping
      const vatAmount = calculateVAT(totalAmount, 20) // 20% VAT for Serbia

      // Step 1: Create payment intent
      const paymentIntent = await createPaymentIntent(
        totalAmount,
        'rsd',
        {
          order_id: `order_${Date.now()}`,
          customer_email: formData.email,
        }
      )

      if (!paymentIntent.success || !paymentIntent.payment_intent_id) {
        throw new Error(paymentIntent.error || 'Failed to create payment intent')
      }

      // Step 2: Confirm payment (in test mode, this simulates payment)
      const paymentResult = await confirmPayment(
        paymentIntent.payment_intent_id,
        'pm_test_card' // In real implementation, this would be the actual payment method ID
      )

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed')
      }

      // Step 3: Prepare fiscal receipt items
      const fiscalItems: FiscalReceiptItem[] = items.map(item => {
        const itemTotal = item.price * item.quantity
        return {
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: itemTotal,
          taxRate: 20,
        }
      })

      // Add shipping as a separate item
      fiscalItems.push({
        name: 'Shipping',
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        taxRate: 20,
      })

      // Step 4: Send fiscal receipt to Serbian fiscalization system
      const fiscalResult = await sendFiscalReceipt({
        items: fiscalItems,
        totalAmount: totalAmount,
        taxAmount: vatAmount,
        paymentMethod: 'Card Payment',
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        },
        transactionId: paymentIntent.payment_intent_id,
        metadata: {
          order_id: `order_${Date.now()}`,
        },
      })

      if (!fiscalResult.success || !fiscalResult.receipt) {
        console.warn('Fiscal receipt generation failed, but payment succeeded:', fiscalResult.error)
        // Continue even if fiscal receipt fails (in production, this should be handled differently)
      }

      // Store receipt in sessionStorage for order page
      if (fiscalResult.receipt) {
        sessionStorage.setItem('lastFiscalReceipt', JSON.stringify(fiscalResult.receipt))
      }

      // Step 5: Send order confirmation email with fiscal receipt
      const orderNumber = fiscalResult.receipt?.receiptNumber || `ORDER-${Date.now()}`
      const orderDate = new Date().toLocaleDateString('sr-RS', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const emailData: OrderEmailData = {
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        orderNumber,
        orderDate,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal: totalPrice,
        shipping: 500,
        tax: vatAmount,
        total: totalAmount,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentIntentId: paymentIntent.payment_intent_id,
        fiscalReceipt: fiscalResult.receipt ? {
          receiptNumber: fiscalResult.receipt.receiptNumber,
          fiscalReceiptNumber: fiscalResult.receipt.fiscalReceiptNumber,
          qrCode: fiscalResult.receipt.qrCode,
          pfrSignature: fiscalResult.receipt.pfrSignature,
          formattedReceipt: formatFiscalReceipt(fiscalResult.receipt),
        } : undefined,
      }

      // Step 6: Save order to database/storage
      if (user) {
        try {
          const orderResult = await saveOrder({
            userId: user.id,
            items: items,
            subtotal: totalPrice,
            shipping: 500,
            tax: vatAmount,
            total: totalAmount,
            shippingAddress: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              zipCode: formData.zipCode,
              country: formData.country,
            },
            paymentIntentId: paymentIntent.payment_intent_id,
            fiscalReceipt: fiscalResult.receipt || undefined,
          });

          if (orderResult.success && orderResult.order) {
            console.log('Order saved:', orderResult.order.id);
          }
        } catch (err) {
          console.error('Failed to save order:', err);
          // Don't block the order flow if saving fails
        }
      }

      // Step 7: Send email (non-blocking - don't wait for it to complete)
      sendOrderConfirmationEmail(emailData).then((emailResult) => {
        if (emailResult.success) {
          console.log('Order confirmation email sent:', emailResult.messageId)
        } else {
          console.warn('Failed to send email:', emailResult.error)
        }
      }).catch((err) => {
        console.error('Email sending error:', err)
        // Don't block the order flow if email fails
      })

      // Step 8: Clear cart and navigate to order confirmation
      clearCart()
      navigate('/order', {
        state: {
          paymentIntentId: paymentIntent.payment_intent_id,
          fiscalReceipt: fiscalResult.receipt,
          orderNumber,
        },
      })
    } catch (err) {
      console.error('Payment processing error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during payment processing')
      setIsProcessing(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="text-center py-20">
          <p className="text-gray-600 text-xl mb-4 font-medium">{t('yourCartIsEmpty')}</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            {t('continueShopping')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto container-padding py-12">
      <h1 className="heading-medium mb-12" style={{ color: 'var(--foreground)' }}>{t('checkout')}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-medium">{t('shippingInformation')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('firstName')}
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
                  {t('lastName')}
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
                  {t('email')}
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
                  {t('phone')}
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
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address')}
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
                  {t('city')}
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
                  {t('zipCode')}
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
                  {t('country')}
                </label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">{t('selectCountry')}</option>
                  <option value="serbia">{t('serbia')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <CreditCard className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-medium">{t('paymentInformation')}</h2>
            </div>
            <div className="space-y-4">
              {/* Test Mode Notice */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">{t('testModeActive')}</p>
                <p className="text-xs text-yellow-700">
                  {t('testCardInfo')} <code className="bg-yellow-100 px-2 py-1 rounded">{t('testCardNumber')}</code>
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {t('testCardNote')}
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cardNumber')}
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  required
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cardholderName')}
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
                    {t('expiryDate')}
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
                    {t('cvv')}
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
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-28">
            <h2 className="text-2xl font-medium mb-6">{t('orderSummary')}</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString('sr-RS')} RSD</span>
                </div>
              ))}
              <div className="border-t-2 border-gray-200 pt-4 space-y-3 mt-4">
                <div className="flex justify-between text-gray-700">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold">{totalPrice.toLocaleString('sr-RS')} RSD</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('shipping')}</span>
                  <span className="font-semibold">500 RSD</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-gray-200">
                  <span>{t('total')}</span>
                  <span className="text-primary-600">{(totalPrice + 500).toLocaleString('sr-RS')} RSD</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('processingPayment')}
                </>
              ) : (
                t('placeOrder')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}



