import { getAssetPath } from '../utils/images'

export interface Product {
  id: string
  name: string
  description: string
  descriptionKey?: string
  price: number
  pricePerMetre?: number
  width?: number
  size?: string
  shape?: string
  shapeKey?: string
  fabric?: string
  fabricKey?: string
  image: string
  gallery?: string[]
  category: string
  inStock: boolean
}

const rawProducts: Product[] = [
  {
    id: '1',
    name: 'Reindeer moss',
    description: 'Table runner',
    descriptionKey: 'productFields.tableRunner',
    price: 3500,
    size: '30x200',
    fabric: 'Linen with a small polyester blend',
    fabricKey: 'productFields.fabric.linenPolyester',
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
    descriptionKey: 'productFields.tablecloth',
    price: 8000,
    size: '140x200',
    shape: 'rectangular',
    shapeKey: 'productFields.rectangular',
    fabric: 'Linen',
    fabricKey: 'productFields.fabric.linen',
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
    descriptionKey: 'productFields.napkinsSet',
    price: 900,
    size: '30x30',
    fabric: 'Linen',
    fabricKey: 'productFields.fabric.linen',
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
    descriptionKey: 'productFields.tablecloth',
    price: 5400,
    size: '160x160',
    shape: 'round',
    shapeKey: 'productFields.round',
    fabric: 'Cotton with a small viscose blend',
    fabricKey: 'productFields.fabric.cottonViscose',
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

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: getAssetPath(p.image),
  gallery: p.gallery?.map(getAssetPath),
}))

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
