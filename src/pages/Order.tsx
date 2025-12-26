import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, Home, Receipt, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { formatFiscalReceipt, type FiscalReceipt } from "../services/fiscalService";
import { useLanguage } from "../contexts/LanguageContext";

export default function Order() {
  const { t } = useLanguage();
  const location = useLocation();
  const [fiscalReceipt, setFiscalReceipt] = useState<FiscalReceipt | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    // Get fiscal receipt from location state or sessionStorage
    const receiptFromState = location.state?.fiscalReceipt;
    const receiptFromStorage = sessionStorage.getItem('lastFiscalReceipt');
    
    if (receiptFromState) {
      setFiscalReceipt(receiptFromState);
    } else if (receiptFromStorage) {
      try {
        setFiscalReceipt(JSON.parse(receiptFromStorage));
      } catch (e) {
        console.error('Failed to parse fiscal receipt from storage:', e);
      }
    }

    if (location.state?.paymentIntentId) {
      setPaymentIntentId(location.state.paymentIntentId);
    }
  }, [location]);

  const handleDownloadReceipt = () => {
    if (!fiscalReceipt) return;
    
    const receiptText = formatFiscalReceipt(fiscalReceipt);
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiscal-receipt-${fiscalReceipt.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto container-padding py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 shadow-soft animate-scale-in">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="heading-medium mb-4">{t('orderConfirmed')}</h1>
        <p className="text-gray-600 text-xl mb-8 leading-relaxed">
          {t('thankYouForPurchase')}
        </p>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 max-w-md mx-auto flex items-center gap-3">
          <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>{t('emailSent')}</strong> {t('emailSentText')}
          </p>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
            <Package className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="text-2xl font-medium">{t('orderDetails')}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">{t('orderNumber')}</span>
            <span className="font-bold text-lg">
              {fiscalReceipt ? `#${fiscalReceipt.receiptNumber}` : '#NOOK-2024-001'}
            </span>
          </div>
          {paymentIntentId && (
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">{t('paymentId')}</span>
              <span className="font-semibold text-sm font-mono">
                {paymentIntentId.substring(0, 20)}...
              </span>
            </div>
          )}
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">{t('orderDate')}</span>
            <span className="font-semibold">
              {fiscalReceipt ? fiscalReceipt.issueDate : new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600 font-medium">
              {t('estimatedDelivery')}
            </span>
            <span className="font-semibold">
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Fiscal Receipt Section */}
      {fiscalReceipt && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
                <Receipt className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-medium">{t('fiscalReceipt')}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t('receiptNo')}: {fiscalReceipt.fiscalReceiptNumber}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadReceipt}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('download')}
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t('business')}:</span>
                <p className="font-semibold">{fiscalReceipt.businessInfo.name}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('taxId')}:</span>
                <p className="font-semibold">{fiscalReceipt.businessInfo.taxId}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">{t('itemsOrdered')}:</h3>
              <div className="space-y-2">
                {fiscalReceipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {item.totalPrice.toLocaleString('sr-RS')} RSD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  {(fiscalReceipt.totalAmount - fiscalReceipt.taxAmount).toLocaleString('sr-RS')} RSD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (20%):</span>
                <span className="font-semibold">
                  {fiscalReceipt.taxAmount.toLocaleString('sr-RS')} RSD
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span style={{ color: 'var(--primary)' }}>
                  {fiscalReceipt.totalAmount.toLocaleString('sr-RS')} RSD
                </span>
              </div>
            </div>

            {fiscalReceipt.qrCode && (
              <div className="border-t pt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Fiscal Receipt QR Code</p>
                <img
                  src={fiscalReceipt.qrCode}
                  alt="Fiscal Receipt QR Code"
                  className="mx-auto w-32 h-32"
                />
                <p className="text-xs text-gray-500 mt-2">
                  PFR Signature: {fiscalReceipt.pfrSignature}
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded p-3 mt-4">
              <p className="text-xs text-yellow-800">
                <strong>{t('testModeNotice')}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 mb-8">
        <h3 className="font-semibold mb-3 text-lg">{t('whatsNext')}</h3>
        <p className="text-gray-700 leading-relaxed">
          {t('whatsNextText')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Home className="h-5 w-5" />
          {t('continueShopping')}
        </Link>
        <Link to="/" className="btn-secondary text-center">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
