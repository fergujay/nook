export interface Product {
  id: string
  name: string
  description: string
  price: number
  pricePerMetre?: number
  width?: number
  size?: string
  shape?: string
  fabric?: string
  image: string
  gallery?: string[]
  category: string
  inStock: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Reindeer moss',
    description: 'Table runner',
    price: 3500,
    size: '30x200',
    fabric: 'Linen with a small polyester blend',
    image: '/products/1-reindeer-moss/main.jpg',
    gallery: [
      '/products/1-reindeer-moss/main.jpg',
      '/products/1-reindeer-moss/image-2.jpg',
      '/products/1-reindeer-moss/image-3.jpg',
      '/products/1-reindeer-moss/image-4.jpg',
    ],
    category: 'Linen',
    inStock: true,
  },
  {
    id: '2',
    name: 'Carrara Marble',
    description: 'Tablecloth',
    price: 8000,
    size: '140x200',
    shape: 'rectangular',
    fabric: 'Linen',
    image: '/products/2-carrara-marble-tablecloth/main.jpg',
    gallery: [
      '/products/2-carrara-marble-tablecloth/main.jpg',
      '/products/2-carrara-marble-tablecloth/image-2.jpg',
      '/products/2-carrara-marble-tablecloth/image-3.jpg',
      '/products/2-carrara-marble-tablecloth/image-4.jpg',
    ],
    category: 'Linen',
    inStock: true,
  },
  {
    id: '3',
    name: 'Carrara Marble',
    description: 'Napkins, set of two',
    price: 900,
    size: '30x30',
    fabric: 'Linen',
    image: '/products/3-carrara-marble-napkins/main.jpg',
    gallery: [
      '/products/3-carrara-marble-napkins/main.jpg',
      '/products/3-carrara-marble-napkins/image-2.jpg',
      '/products/3-carrara-marble-napkins/image-3.jpg',
      '/products/3-carrara-marble-napkins/image-4.jpg',
    ],
    category: 'Linen',
    inStock: true,
  },
  {
    id: '4',
    name: 'Pink coral',
    description: 'Tablecloth',
    price: 5400,
    size: '160x160',
    shape: 'round',
    fabric: 'Cotton with a small viscose blend',
    image: '/products/4-pink-coral/main.jpg',
    gallery: [
      '/products/4-pink-coral/main.jpg',
      '/products/4-pink-coral/image-2.jpg',
      '/products/4-pink-coral/image-3.jpg',
      '/products/4-pink-coral/image-4.jpg',
    ],
    category: 'Cotton',
    inStock: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}



