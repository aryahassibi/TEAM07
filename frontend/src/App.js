import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Cart from './components/Cart';
import ProductsPage from './components/ProductsPage';
import LoginRegister from './components/LoginRegister';
import ProductDetail from './components/ProductDetail';
import AdminLoginPage from './components/AdminLoginPage'; // Import AdminLoginPage
import MainAdminPage from './components/MainAdminPage'; // Adjust path as necessary
import { CartProvider } from './CartContext';
import Navbar from './components/Navbar';
import About from './components/About';
import ReviewAdminPage from './components/ReviewAdminPage';
import './index.css';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="main-content">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:variant_id" element={<ProductDetail />} />
                        <Route path="/loginregister" element={<LoginRegister />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/main_page" element={<MainAdminPage />} />
                        <Route path="/admin/review_management" element={<ReviewAdminPage />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
