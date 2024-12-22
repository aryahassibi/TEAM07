import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext'; // Import CartProvider
import Navbar from './components/Navbar';

import MainPage from './components/MainPage';
import Cart from './components/Cart';
import ProductsPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import WriteReview from './components/WriteReview';
import About from './components/About';

import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLoginPage from './components/AdminLoginPage';
import ReviewAdminPage from './components/ReviewAdminPage';
import MainAdminPage from './components/MainAdminPage';
import AdminProductMgmt from './components/AdminProductMgmt';
import AdminSalesMgmt from './components/AdminSalesMgmt';
import AdminCategoryPage from './components/AdminCategoryPage';
import AddProductPage from './components/AddProductPage';
import ViewProductsPage from './components/ViewProductsPage';

import './index.css'; 

function App() {
  return (
    <CartProvider> {/* Wrap the app with CartProvider */}
      <Router>
        <div className="main-content">
          <Navbar />
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:variant_id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reviews/write/:product_id" element={<WriteReview />} />
            <Route path="/about" element={<About />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route path="review_management" element={<ReviewAdminPage />} />
              <Route path="main_page" element={<MainAdminPage />} />
              <Route path="product_management" element={<AdminProductMgmt />} />
              <Route path="sales_management" element={<AdminSalesMgmt />} />
              <Route path="view_products" element={<ViewProductsPage />} />
              <Route path="add_product" element={<AddProductPage />} />
              <Route path="categories" element={<AdminCategoryPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
