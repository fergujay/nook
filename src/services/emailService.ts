/**
 * Email Service - Order Confirmation and Fiscal Receipt
 * 
 * Sends order confirmation emails with fiscal receipt attachments.
 * In test mode, simulates email sending.
 * 
 * For production, integrate with:
 * - Resend (recommended for React apps)
 * - SendGrid
 * - AWS SES
 * - Nodemailer (backend)
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentIntentId?: string;
  fiscalReceipt?: {
    receiptNumber: string;
    fiscalReceiptNumber: string;
    qrCode: string;
    pfrSignature: string;
    formattedReceipt: string;
  };
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send order confirmation email with fiscal receipt
 */
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<EmailResponse> {
  try {
    // In production, this would call your backend API
    const response = await fetch("/api/email/send-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Fallback to mock email service in test mode
      return sendMockOrderEmail(data);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    // In test mode, use mock service
    console.log("Using mock email service (test mode)");
    return sendMockOrderEmail(data);
  }
}

/**
 * Mock email service for test mode
 */
async function sendMockOrderEmail(
  data: OrderEmailData
): Promise<EmailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In test mode, log the email content
  console.log("📧 Email would be sent (test mode):", {
    to: data.customerEmail,
    subject: `Order Confirmation - ${data.orderNumber}`,
  });

  // Generate mock message ID
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    messageId,
  };
}

/**
 * Generate HTML email template for order confirmation
 */
export function generateOrderEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toLocaleString('sr-RS')} RSD</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.total.toLocaleString('sr-RS')} RSD</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #A72729 0%, #8B1E20 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.customerName},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Thank you for your order! We're excited to prepare your items for shipment.
    </p>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin-top: 0; color: #A72729; font-size: 20px;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;"><strong>Order Number:</strong></td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;"><strong>Order Date:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${data.orderDate}</td>
        </tr>
        ${data.paymentIntentId ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;"><strong>Payment ID:</strong></td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${data.paymentIntentId.substring(0, 20)}...</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <h2 style="color: #A72729; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">Items Ordered</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Item</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Qty</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Price</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Subtotal:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.subtotal.toLocaleString('sr-RS')} RSD</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Shipping:</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.shipping.toLocaleString('sr-RS')} RSD</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">VAT (20%):</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.tax.toLocaleString('sr-RS')} RSD</td>
        </tr>
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="padding: 12px 0; font-size: 18px; font-weight: 700; color: #A72729;">Total:</td>
          <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: 700; color: #A72729;">${data.total.toLocaleString('sr-RS')} RSD</td>
        </tr>
      </table>
    </div>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h3 style="margin-top: 0; color: #A72729; font-size: 18px;">Shipping Address</h3>
      <p style="margin: 5px 0;">
        ${data.shippingAddress.name}<br>
        ${data.shippingAddress.address}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.zipCode}<br>
        ${data.shippingAddress.country}
      </p>
    </div>

    ${data.fiscalReceipt ? `
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px; border: 2px solid #A72729;">
      <h3 style="margin-top: 0; color: #A72729; font-size: 18px;">Fiscal Receipt</h3>
      <p style="margin: 5px 0; font-size: 14px;">
        <strong>Receipt No:</strong> ${data.fiscalReceipt.receiptNumber}<br>
        <strong>Fiscal No:</strong> ${data.fiscalReceipt.fiscalReceiptNumber}<br>
        <strong>PFR Signature:</strong> ${data.fiscalReceipt.pfrSignature}
      </p>
      ${data.fiscalReceipt.qrCode ? `
      <div style="text-align: center; margin: 15px 0;">
        <img src="${data.fiscalReceipt.qrCode}" alt="Fiscal Receipt QR Code" style="max-width: 150px; height: auto;" />
      </div>
      ` : ''}
      <p style="margin-top: 15px; font-size: 12px; color: #6b7280;">
        Your fiscal receipt is attached to this email. This receipt is registered with the Serbian Tax Authority.
      </p>
    </div>
    ` : ''}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
        You will receive a shipping confirmation email with tracking information once your order ships.
      </p>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        If you have any questions, please contact us at <a href="mailto:info@nook.com" style="color: #A72729;">info@nook.com</a>
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        NOOK - Textile Store<br>
        123 Textile Street, Belgrade, Serbia
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text email for order confirmation
 */
export function generateOrderEmailText(data: OrderEmailData): string {
  const itemsText = data.items
    .map(
      (item) =>
        `  ${item.name} × ${item.quantity} - ${item.total.toLocaleString('sr-RS')} RSD`
    )
    .join("\n");

  return `
Order Confirmation - ${data.orderNumber}

Dear ${data.customerName},

Thank you for your order! We're excited to prepare your items for shipment.

ORDER DETAILS
-------------
Order Number: ${data.orderNumber}
Order Date: ${data.orderDate}
${data.paymentIntentId ? `Payment ID: ${data.paymentIntentId}\n` : ''}

ITEMS ORDERED
-------------
${itemsText}

ORDER SUMMARY
-------------
Subtotal: ${data.subtotal.toLocaleString('sr-RS')} RSD
Shipping: ${data.shipping.toLocaleString('sr-RS')} RSD
VAT (20%): ${data.tax.toLocaleString('sr-RS')} RSD
Total: ${data.total.toLocaleString('sr-RS')} RSD

SHIPPING ADDRESS
----------------
${data.shippingAddress.name}
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.zipCode}
${data.shippingAddress.country}

${data.fiscalReceipt ? `
FISCAL RECEIPT
--------------
Receipt No: ${data.fiscalReceipt.receiptNumber}
Fiscal No: ${data.fiscalReceipt.fiscalReceiptNumber}
PFR Signature: ${data.fiscalReceipt.pfrSignature}

Your fiscal receipt is attached to this email.
` : ''}

You will receive a shipping confirmation email with tracking information once your order ships.

If you have any questions, please contact us at info@nook.com

---
NOOK - Textile Store
123 Textile Street, Belgrade, Serbia
  `.trim();
}

