import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, Receipt, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserOrders, type Order } from '../services/orderService';
import { formatFiscalReceipt } from '../services/fiscalService';

export default function Orders() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userOrders = await getUserOrders(user.id);
      // Sort by date, newest first
      userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReceipt = (order: Order) => {
    if (!order.fiscalReceipt) return;
    
    const receiptText = formatFiscalReceipt(order.fiscalReceipt);
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiscal-receipt-${order.fiscalReceipt.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="heading-medium mb-4">{t('pleaseSignIn')}</h1>
          <p className="text-gray-600 text-xl mb-8">
            {t('needToSignInForOrders')}
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            {t('signIn')}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">{t('loadingOrders')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto container-padding py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="heading-medium mb-2">{t('myOrders')}</h1>
          <p className="text-gray-600">
            {orders.length === 0
              ? t('youHaveNoOrders')
              : `${orders.length} ${orders.length === 1 ? t('orderCount') : t('ordersCount')}`}
          </p>
        </div>
        <Link to="/products" className="btn-secondary">
          {t('continueShopping')}
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-20">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-4">{t('noOrdersYet')}</h2>
          <p className="text-gray-600 mb-8">
            {t('startShopping')}
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            {t('browseProducts')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{order.orderNumber}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.orderDate).toLocaleDateString('sr-RS', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {order.shippingAddress.city}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {t(order.status)}
                  </span>
                  {order.fiscalReceipt && (
                    <button
                      onClick={() => handleDownloadReceipt(order)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Receipt className="h-4 w-4" />
                      {t('receipt')}
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-700">{t('items')}</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {(item.price * item.quantity).toLocaleString('sr-RS')} RSD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-700">{t('shippingAddress')}</h3>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.name}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('total')}</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {order.total.toLocaleString('sr-RS')} RSD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

