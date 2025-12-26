import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getAssetPath } from "../utils/images";

export default function Cart() {
  const { t } = useLanguage();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto container-padding py-16">
        <h1
          className="heading-medium mb-12"
          style={{ color: "var(--foreground)" }}
        >
          {t('shoppingCart')}
        </h1>
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-600 text-xl mb-2 font-medium">
            {t('yourCartIsEmpty')}
          </p>
          <p className="text-gray-500 mb-8">{t('startAddingItems')}</p>
          <Link to="/products" className="btn-primary inline-flex items-center">
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto container-padding py-12">
      <h1 className="heading-medium mb-12">{t('shoppingCart')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="card flex flex-col sm:flex-row gap-6">
              <img
                src={getAssetPath(item.image)}
                alt={item.name}
                className="w-full sm:w-40 h-40 object-cover"
              />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-xl mb-1">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  {item.size && (
                    <p className="text-xs text-gray-500 mb-2">
                      Size: {item.size} {item.shape ? `(${item.shape})` : ''}
                    </p>
                  )}
                  <p
                    className="font-bold text-2xl mb-4"
                    style={{ color: "var(--primary)" }}
                  >
                    {item.price.toLocaleString('sr-RS')} RSD
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={t('removeItem')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">{t('subtotal')}</p>
                    <p
                      className="font-bold text-2xl"
                      style={{ color: "var(--primary)" }}
                    >
                      {(item.price * item.quantity).toLocaleString('sr-RS')} RSD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="card sticky top-28">
            <h2
              className="text-2xl font-medium mb-6"
              style={{ color: "var(--foreground)" }}
            >
              {t('orderSummary')}
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                <span>{t('items')} ({totalItems})</span>
                <span className="font-semibold">{totalPrice.toLocaleString('sr-RS')} RSD</span>
              </div>
              <div className="flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                <span>{t('shipping')}</span>
                <span className="font-semibold">500 RSD</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span style={{ color: "var(--foreground)" }}>{t('total')}</span>
                  <span style={{ color: "var(--primary)" }}>
                    {(totalPrice + 500).toLocaleString('sr-RS')} RSD
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn-primary w-full text-center block"
            >
              {t('proceedToCheckout')}
            </Link>
            <Link
              to="/products"
              className="btn-secondary w-full text-center block mt-4"
            >
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
