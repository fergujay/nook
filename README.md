# Nook - Textile E-commerce Site

A modern, responsive React + TypeScript e-commerce website for a textile store, built with Vite and Tailwind CSS.

## Features

- 🛍️ **Product Catalog** - Browse and filter products by category
- ❤️ **Favorites** - Save your favorite products
- 🛒 **Shopping Cart** - Add items to cart and manage quantities
- 💳 **Checkout** - Complete checkout process with payment form
- 📦 **Order Tracking** - Order confirmation page
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Clean, beautiful interface with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite for optimal performance

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
yarn build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
yarn preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx   # Main layout with header and footer
│   └── ProductCard.tsx
├── contexts/        # React contexts for state management
│   ├── CartContext.tsx
│   └── FavoritesContext.tsx
├── data/           # Mock data
│   └── products.ts
├── pages/          # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Favorites.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Order.tsx
│   ├── About.tsx
│   ├── TextileCare.tsx
│   └── Courier.tsx
├── App.tsx         # Main app component with routing
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Pages

- **Home** (`/`) - Landing page with hero section and featured products
- **Products** (`/products`) - Product catalog with category filtering
- **Product Detail** (`/products/:id`) - Individual product page
- **Favorites** (`/favorites`) - Saved favorite products
- **Cart** (`/cart`) - Shopping cart with order summary
- **Checkout** (`/checkout`) - Checkout form with shipping and payment
- **Order** (`/order`) - Order confirmation page
- **About** (`/about`) - About us and contact information
- **Textile Care** (`/textile-care`) - Care instructions for textiles
- **Courier** (`/courier`) - Shipping and delivery information

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme. The primary color is currently set to a blue palette.

### Products

Update `src/data/products.ts` to add or modify products. You can also connect this to a backend API.

### Styling

The project uses Tailwind CSS utility classes. Custom styles can be added in `src/index.css` or by extending the Tailwind config.

## License

MIT

