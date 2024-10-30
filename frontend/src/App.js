// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Mnovo from './components/Mnovo';
import Card from './components/Card';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mnovo" element={<Mnovo />} />
          <Route path="/card" element={<Card />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
