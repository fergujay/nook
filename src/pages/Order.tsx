import { Link } from "react-router-dom";
import { CheckCircle, Package, Home } from "lucide-react";

export default function Order() {
  return (
    <div className="max-w-3xl mx-auto container-padding py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 shadow-soft animate-scale-in">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="heading-medium mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 text-xl mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
            <Package className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="text-2xl font-medium">Order Details</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Order Number</span>
            <span className="font-bold text-lg">#NOOK-2024-001</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Order Date</span>
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600 font-medium">
              Estimated Delivery
            </span>
            <span className="font-semibold">
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 mb-8">
        <h3 className="font-semibold mb-3 text-lg">What's Next?</h3>
        <p className="text-gray-700 leading-relaxed">
          You will receive an email confirmation with your order details and
          tracking information once your order ships.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Home className="h-5 w-5" />
          Continue Shopping
        </Link>
        <Link to="/" className="btn-secondary text-center">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
