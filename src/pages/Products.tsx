import { useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Package } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useLanguage } from '../contexts/LanguageContext'

export default function Products() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'All'
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)
  const [headerRevealed, setHeaderRevealed] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    []
  )

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam, categories])

  useEffect(() => {
    const timer = setTimeout(() => setHeaderRevealed(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const labelFor = (cat: string) =>
    t(`productFields.categories.${cat}`) || cat

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header Section */}
      <section ref={headerRef} className="section-padding bg-white w-full">
        <div className="container-padding max-w-7xl mx-auto">
          <p 
            className={`text-sm md:text-base text-muted-foreground uppercase tracking-[0.25em] mb-4 font-medium transition-all duration-700 ${
              headerRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('products.eyebrow')}
          </p>
          <h1 
            className={`heading-large font-editorial mb-6 leading-[1.06] tracking-[-0.02em] text-foreground text-balance transition-all duration-700 delay-100 ${
              headerRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('products.title')}
          </h1>
          <p 
            className={`text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl transition-all duration-700 delay-200 ${
              headerRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('products.lead')}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section
        className="py-5 border-y sticky top-16 z-40 bg-white border-border shadow-soft"
      >
        <div className="container-padding max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-foreground font-medium flex items-center gap-2">
              <span className="uppercase tracking-wide">{t('products.filterShowing')}</span>
              <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 bg-primary/10 text-primary font-semibold rounded-full">
                {filteredProducts.length}
              </span>
              <span className="uppercase tracking-wide">
                {filteredProducts.length === 1
                  ? t('common.item')
                  : t('common.items')}
              </span>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {categories.map((category, index) => (
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
                  className={`text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full border ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white text-foreground border-foreground/30 hover:border-primary hover:text-primary hover:bg-primary/5'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {labelFor(category)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full bg-card">
        {filteredProducts.length > 0 ? (
          <div className="container-padding max-w-7xl mx-auto py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-slide-up"
                  style={{ 
                    animationDelay: `${index * 80}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 container-padding">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-foreground text-xl font-medium mb-3">
                {t('products.emptyTitle')}
              </p>
              <p className="text-muted-foreground mb-8">{t('products.emptyLead')}</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchParams({})
                }}
                className="btn-primary inline-flex items-center justify-center"
              >
                {t('common.viewAllProducts')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
