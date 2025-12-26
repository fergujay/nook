# Payment and Fiscal Services

This directory contains services for payment processing and fiscal receipt generation in Serbia.

## Payment Service (`paymentService.ts`)

### Overview
Integrates with Stripe payment gateway for card payments in Serbia. Currently configured for **test mode**.

### Features
- Create payment intents
- Confirm payments
- Test card support

### Test Cards
Use these test card numbers in test mode:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Any expiry date (future) and any 3-digit CVV will work in test mode.

### Environment Variables
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Usage
```typescript
import { createPaymentIntent, confirmPayment } from './paymentService'

// Create payment intent
const intent = await createPaymentIntent(3500, 'rsd', { order_id: '123' })

// Confirm payment
const result = await confirmPayment(intent.payment_intent_id, 'pm_test_card')
```

## Fiscal Receipt Service (`fiscalService.ts`)

### Overview
Generates electronic fiscal receipts (e-fiskalizacija) compliant with Serbian tax regulations. Currently in **test mode**.

### Features
- Generate fiscal receipts with QR codes
- Calculate VAT (20% standard rate in Serbia)
- PFR (Poreski Fiskalni Registar) signature generation
- Receipt formatting and download

### Serbian Fiscalization Requirements
Serbia requires all businesses to issue electronic fiscal receipts that include:
- Receipt number and fiscal receipt number
- QR code for verification
- PFR signature (cryptographic signature from Tax Authority)
- Business information (name, tax ID, address)
- Itemized list with VAT breakdown

### Test Mode
In test mode, the service generates mock fiscal receipts. In production, you would need to:
1. Register with a certified fiscal receipt provider
2. Integrate with SEF (Sistem E-Fiskalizacije) or V-PFR (cloud-based fiscal processor)
3. Use certified hardware/software for receipt generation

### Usage
```typescript
import { sendFiscalReceipt, calculateVAT } from './fiscalService'

// Calculate VAT
const vatAmount = calculateVAT(3500, 20) // 20% VAT

// Send fiscal receipt
const result = await sendFiscalReceipt({
  items: [
    {
      name: 'Product Name',
      quantity: 1,
      unitPrice: 3500,
      totalPrice: 3500,
      taxRate: 20,
    }
  ],
  totalAmount: 3500,
  taxAmount: vatAmount,
  paymentMethod: 'Card Payment',
  customerInfo: {
    name: 'Customer Name',
    email: 'customer@example.com',
  },
})
```

## Production Setup

### Payment Gateway
1. Sign up for Stripe account: https://stripe.com
2. Get your API keys from the dashboard
3. Set up webhook endpoints for payment confirmation
4. Replace test API calls with actual Stripe SDK calls

### Fiscal Receipt Service
1. Contact a certified fiscal receipt provider in Serbia:
   - SEF (Sistem E-Fiskalizacije) - Official government system
   - Certified fiscal service providers
2. Register your business and obtain credentials
3. Integrate with their API (replace mock functions)
4. Ensure compliance with Serbian tax regulations

## Notes
- Both services are currently in **test mode**
- All API calls fall back to mock responses if the backend is unavailable
- In production, these should be called from a secure backend server
- Never expose secret API keys in frontend code

