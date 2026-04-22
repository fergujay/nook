import { Mail, Phone, MapPin, Heart, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto container-padding py-16">
      <div className="text-center mb-20">
        <h1 className="heading-medium mb-6">About Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We are passionate about bringing you the finest textiles for your
          home, combining quality craftsmanship with sustainable practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        <div className="text-center group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors duration-300 shadow-soft">
            <Heart className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            To provide premium quality textiles that enhance your living spaces
            while respecting our planet.
          </p>
        </div>
        <div className="text-center group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors duration-300 shadow-soft">
            <Users className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Our Team</h3>
          <p className="text-gray-600 leading-relaxed">
            A dedicated team of textile experts and designers committed to
            excellence.
          </p>
        </div>
        <div className="text-center group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors duration-300 shadow-soft">
            <Award className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Quality Promise</h3>
          <p className="text-gray-600 leading-relaxed">
            Every product is carefully selected and tested to meet our high
            standards.
          </p>
        </div>
      </div>

      <div className="card mb-16">
        <h2 className="heading-medium mb-8">Our Story</h2>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6 leading-relaxed">
          <p className="text-lg">
            Founded with a vision to transform homes through exceptional
            textiles, Nook has been serving customers with passion and
            dedication. We believe that the right textiles can transform any
            space into a sanctuary of comfort and style.
          </p>
          <p className="text-lg">
            Our journey began with a simple idea: to make premium quality
            textiles accessible to everyone. We source our materials from
            trusted suppliers who share our commitment to sustainability and
            ethical practices.
          </p>
          <p className="text-lg">
            Today, we continue to grow and evolve, always staying true to our
            core values of quality, sustainability, and customer satisfaction.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="heading-medium mb-8">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">Email</h3>
              <a
                href="mailto:info@nook.com"
                className="text-gray-600 hover:text-primary-600 transition-colors block"
              >
                info@nook.com
              </a>
              <a
                href="mailto:support@nook.com"
                className="text-gray-600 hover:text-primary-600 transition-colors block"
              >
                support@nook.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <Phone className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">Phone</h3>
              <a
                href="tel:+381111234567"
                className="text-gray-600 hover:text-primary-600 transition-colors block"
              >
                +381 11 123 4567
              </a>
              <p className="text-gray-600 text-sm mt-1">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">Address</h3>
              <p className="text-gray-600">
                123 Textile Street
                <br />
                Belgrade, Serbia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
