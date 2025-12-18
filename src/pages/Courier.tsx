import { Truck, Package, Clock, MapPin, Mail } from 'lucide-react'

export default function Courier() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      duration: '5-7 business days',
      price: '$5.99',
      description: 'Regular shipping via Post of Serbia',
    },
    {
      name: 'Express Shipping',
      duration: '2-3 business days',
      price: '$12.99',
      description: 'Fast delivery for urgent orders',
    },
    {
      name: 'Overnight Shipping',
      duration: '1 business day',
      price: '$24.99',
      description: 'Next day delivery available in major cities',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto container-padding py-16">
      <div className="text-center mb-20">
        <h1 className="heading-medium mb-6">Shipping & Delivery</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We offer multiple shipping options to get your order to you quickly
          and safely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {shippingOptions.map((option, index) => (
          <div key={index} className="card-hover">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-primary-100 rounded-xl">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium">{option.name}</h3>
            </div>
            <p className="text-3xl font-bold text-primary-600 mb-3">
              {option.price}
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">{option.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Clock className="h-4 w-4" />
              <span>{option.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <Package className="h-7 w-7 text-primary-600" />
            </div>
            <h2 className="text-2xl font-medium">Our Courier Partners</h2>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-2 text-lg">Post of Serbia</h3>
              <p className="text-gray-600 leading-relaxed">
                Our primary shipping partner for standard deliveries across
                Serbia. Reliable and cost-effective service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">Express Couriers</h3>
              <p className="text-gray-600 leading-relaxed">
                For express and overnight deliveries, we work with trusted
                courier services to ensure fast and secure delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <MapPin className="h-7 w-7 text-primary-600" />
            </div>
            <h2 className="text-2xl font-medium">Delivery Areas</h2>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-2 text-lg">Serbia</h3>
              <p className="text-gray-600 leading-relaxed">
                We deliver to all cities and regions in Serbia. Free shipping
                available for orders over $100.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">International</h3>
              <p className="text-gray-600 leading-relaxed">
                International shipping available upon request. Please contact us
                for rates and delivery times.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
        <h2 className="text-2xl font-medium mb-4">Tracking Your Order</h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
          Once your order ships, you'll receive a tracking number via email.
          You can use this number to track your package's journey to your
          doorstep.
        </p>
        <div className="flex items-center gap-3 text-primary-700">
          <Mail className="h-5 w-5" />
          <a href="mailto:shipping@nook.com" className="font-semibold hover:text-primary-800 transition-colors">
            Questions about shipping? Contact us at shipping@nook.com
          </a>
        </div>
      </div>
    </div>
  )
}



