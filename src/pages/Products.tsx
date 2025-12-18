import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'All'
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam, categories])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <section className="section-padding bg-white w-full">
        <div className="container-padding">
          <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest mb-4 font-medium">
            CURATED SELECTION
          </p>
          <h1 className="heading-large mb-6" style={{ color: 'var(--foreground)' }}>
            The Collection
          </h1>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-3xl">
            Explore our carefully curated range of exceptional textiles, each selected for its unique character, superior quality, and enduring beauty.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 border-y sticky top-20 z-40" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="container-padding">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 font-medium">
              SHOWING {filteredProducts.length} {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'}
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    if (category === 'All') {
                      setSearchParams({})
                    } else {
                      setSearchParams({ category })
                    }
                  }}
                  className={`text-sm font-medium transition-all duration-300 px-2 pb-1 ${
                    selectedCategory === category
                      ? 'border-b-2'
                      : ''
                  }`}
                  style={selectedCategory === category ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : { color: 'var(--muted-foreground)' }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.color = 'var(--foreground)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.color = 'var(--muted-foreground)'
                    }
                  }}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="w-full" style={{ backgroundColor: 'var(--card)' }}>
        {filteredProducts.length > 0 ? (
          <div className="container-padding py-8">
            <div className="grid grid-cols-2 gap-0 border-t border-l" style={{ borderColor: 'var(--border)' }}>
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 container-padding">
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 text-xl font-medium mb-4">No products found in this category.</p>
              <p className="text-gray-500 mb-6">Try selecting a different category or view all products.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchParams({})
                }}
                className="font-semibold py-3 px-8 transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                View All Products
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}



