import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import About from "./pages/About";
import TextileCare from "./pages/TextileCare";
import Courier from "./pages/Courier";
import Favorites from "./pages/Favorites";
import Returns from "./pages/Returns";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function App() {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Order />} />
                <Route path="/about" element={<About />} />
                <Route path="/textile-care" element={<TextileCare />} />
                <Route path="/courier" element={<Courier />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
}

export default App;
