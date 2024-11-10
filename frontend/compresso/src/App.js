// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Mnovo from './components/Mnovo';
import Card from './components/Card';
import ProductsPage from './components/ProductsPage';
import { CartProvider } from './CartContext'; // Import CartProvider

function App() {
  return (
    <CartProvider> {/* Wrap the app with CartProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mnovo" element={<Mnovo />} />
          <Route path="/card" element={<Card />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
