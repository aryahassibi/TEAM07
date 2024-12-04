//src/components/ProductsPage.js

import { useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import FilterPanel from './FilterPanel';
import { useLocation, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import './ProductsPage.css';  

const ProductsPage = () => {
  
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    stature: '',
    beanSize: '',
    optimalAltitude: '',
    leafTipColor: '',
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters); // Temporary filters to apply on confirmation
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // Fetch products data from backend based on location.search
  useEffect(() => {
    const fetchProducts = async () => {
      const query = new URLSearchParams(location.search);
      try {
        const response = await axios.get(`http://localhost:5001/api/products?${query.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsPanelOpen(false);
  };

  const clearFilters = () => {
    setTempFilters({
      type: '',
      region: '',
      stature: '',
      beanSize: '',
      optimalAltitude: '',
      leafTipColor: '',
    });
  };
  // Generate breadcrumb from location.search
  const generateBreadcrumb = () => {
    const query = new URLSearchParams(location.search);
    const breadcrumbs = [];
    query.forEach((value, key) => {
      let label;
      switch (key) {
        case 'roast_level':
          label = 'Roast Level';
          break;
        case 'bean_type':
          label = 'Bean Type';
          break;
        case 'grind_type':
          label = 'Grind Type';
          break;
        case 'caffeine_content':
          label = 'Caffeine Content';
          break;
        case 'origin':
          label = 'Origin';
          break;
        default:
          label = key;
      }
      breadcrumbs.push({ label, value });
    });
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumb();

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);
  

  return (
    <div className="products-page">
      <h1>Our Coffee Products</h1>

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/products">All Products</Link>
         {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {' > '}
            <span>{crumb.label}: </span>
            <span>{crumb.value}</span>
          </span>
        ))}
      </div>

      {/* Filter Button */}
      <button onClick={openPanel} className="filter-button">
        Filter
      </button>

      {/* Filter Panel */}
      {isPanelOpen && (
        <FilterPanel
          filters={tempFilters}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          closePanel={closePanel}
          clearFilters={clearFilters}
        />
      )}

      {/* Product List */}

      <div className="coffee-list">
        {products.length > 0 ? (
          products.map((coffee) => (
            <CoffeeCard key={coffee.variant_id} coffee={coffee}  />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

const CoffeeCard = ({ coffee }) => {

  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const fetchProductVariantDetails = async (variantId) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/cart/variant/${variantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch product details');
    }
};

const handleAddToCart= async (variantId, quantity) => {

    const token = localStorage.getItem('token');
    if(token){

        try {
            // Send a POST request to the backend with the token and variant details
            const response = await axios.post('http://localhost:5001/api/cart/add-to-cart', 
                {variantId}, // Payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        'Content-Type': 'application/json' 
                    }
                }
            );

            
            if (response.status === 200) {
                alert('Product added to cart successfully!');
            } else {
                alert('Failed to add product to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('An error occurred. Please try again.');
        }
        


    }
    else{
        
        try {
        
        const product = await fetchProductVariantDetails(variantId);

        
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        
        const cartItem = existingCart.find(item => item.variantId === variantId);

        
        const newQuantity = cartItem ? cartItem.quantity + quantity : quantity;

        
        if (newQuantity > product.stock) {
            alert(`Only ${product.stock} units of this product are available.`);
            return;
        }

        
        if (cartItem) {
            cartItem.quantity = newQuantity;
        } else {
            existingCart.push({
                variantId: product.variantId,
                product_name: product.product_name,  
                price: product.price,
                weight: product.weight,
                image: product.image,
                quantity: newQuantity
            });
        }

        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        alert('Product added to cart successfully!');
    } catch (error) {
        alert('Failed to add product to cart. Please try again.');
        console.error(error);
    }
     }
};


  return (
      <Link to={`/product/${coffee.variant_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="coffee-card">
              <div className="image-placeholder"></div>
              <h3>{coffee.name}</h3>
              <p>Weight: {coffee.weight_grams}g</p>
              <p>Price: ${coffee.price}</p>
              <p>Stock Available: {coffee.stock}</p>
              <div className="cart-controls">
                  <button onClick={(e) => e.preventDefault(handleDecrement())}>-</button>
                  <span>{quantity}</span>
                  <button onClick={(e) => e.preventDefault(handleIncrement())}>+</button>
                  <button onClick={handleAddToCart(coffee.variant_id,1)}>Add to Cart</button>
              </div>
          </div>
      </Link>
  );
};

CoffeeCard.propTypes = {
  coffee: PropTypes.shape({
    name: PropTypes.string.isRequired,
    weight_grams: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    variant_id: PropTypes.number.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};


export default ProductsPage;
