import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Product } from '../data/products'
import { useCart } from '../contexts/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <div className="group block border-r border-b hover:bg-muted transition-all duration-300 h-full relative flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <Link
        to={`/products/${product.id}`}
        className="flex flex-col h-full"
      >
        <div className="relative aspect-[3/2] overflow-hidden border-b" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold px-4 py-2 bg-black/70">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col justify-between" style={{ backgroundColor: 'var(--card)' }}>
          <div>
            <div className="mb-1">
              <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {product.category}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-medium mb-1 group-hover:text-primary transition-colors leading-tight" style={{ color: 'var(--foreground)' }}>
              {product.name}
            </h3>
            <p className="text-xs mb-2 leading-relaxed line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
              {product.description}
            </p>
          </div>
          <div className="space-y-0.5">
            <div className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
              {product.price.toLocaleString('sr-RS')} RSD
            </div>
            {product.size && (
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {product.size} {product.shape ? `(${product.shape})` : ''}
              </div>
            )}
            {product.fabric && (
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {product.fabric}
              </div>
            )}
          </div>
        </div>
      </Link>
      {product.inStock && (
        <button
          onClick={handleAddToCart}
          className="absolute bottom-6 right-6 p-2 border bg-white/80 hover:bg-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)'
            e.currentTarget.style.color = 'var(--primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--muted-foreground)'
          }}
          aria-label="Add to cart"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}



