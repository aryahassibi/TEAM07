import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { CartContext } from '../CartContext';
import FilterPanel from './FilterPanel';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.css';

const ProductsPage = () => {
  const { addToCart } = useContext(CartContext);
  const [filters, setFilters] = useState({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [products, setProducts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to trigger product updates
  const location = useLocation();
  const navigate = useNavigate();

  // State for sorting option
  const [sortOption, setSortOption] = useState('price-asc'); // Default sort order

  // Fetch products data from backend based on location.search
  useEffect(() => {
    const fetchProducts = async () => {
      const query = new URLSearchParams(location.search);

      try {
        let response;
        if (location.pathname.includes('/search')) {
          response = await axios.get(`http://localhost:5001/api/search?${query.toString()}`);
          setProducts(response.data.data);
        } else {
          response = await axios.get(`http://localhost:5001/api/products?${query.toString()}`);
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [location.search, refreshTrigger]); // Add refreshTrigger to dependencies

  // Synchronize sortOption state with URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sortBy = query.get('sort_by') || 'price';
    const sortOrder = query.get('sort_order') || 'asc';
    setSortOption(`${sortBy}-${sortOrder}`);
  }, [location.search]);

  const handleSortChange = (event) => {
    const [sortBy, sortOrder] = event.target.value.split('-');
    setSortOption(event.target.value);

    // Update the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('sort_by', sortBy);
    queryParams.set('sort_order', sortOrder);

    // Update the URL without reloading the page
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

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

    // Update the URL with new filters
    const queryParams = new URLSearchParams(location.search);

    // Remove existing filter parameters
    ['roast_level', 'bean_type', 'grind_type', 'caffeine_content', 'origin'].forEach((param) => {
      queryParams.delete(param);
    });

    // Add new filters
    Object.entries(tempFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });

    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setTempFilters({});
  };

  // Generate breadcrumb from location.search
  const generateBreadcrumb = () => {
    const query = new URLSearchParams(location.search);
    const breadcrumbs = [];
    query.forEach((value, key) => {
      if (key === 'search') {
        breadcrumbs.push({ label: 'Search', value });
      } else if (key === 'sort_by' || key === 'sort_order') {
        // Skip sort parameters in breadcrumb
      } else {
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
      }
    });
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumb();

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment refreshTrigger to refetch products
  };

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

      {/* Sorting Dropdown */}
      <div className="sorting-container">
        <label htmlFor="sort">Sort: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="price-asc">Lowest to Highest Price</option>
          <option value="price-desc">Highest to Lowest Price</option>
          <option value="average_rating-desc">Most Popular</option>
          <option value="average_rating-asc">Least Popular</option>
        </select>
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
            <CoffeeCard
              key={coffee.variant_id}
              coffee={coffee}
              addToCart={addToCart}
              triggerRefresh={triggerRefresh} // Pass refresh function to CoffeeCard
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

const CoffeeCard = ({ coffee, addToCart, triggerRefresh }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent page navigation
    if (quantity > coffee.stock) {
      alert('Not enough stock available!');
      return;
    }
    addToCart(coffee.name, coffee.variant_id, quantity, coffee.price, coffee.weight_grams);
    alert(`${quantity} item(s) of ${coffee.name} added to cart.`);
    triggerRefresh(); // Trigger product refresh after adding to cart
  };

  return (
    <Link to={`/product/${coffee.variant_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="coffee-card">
        <div className="image-placeholder"></div>
        <h3>{coffee.name}</h3>
        <p>Weight: {coffee.weight_grams}g</p>
        <p>Price: ${coffee.price}</p>
        <p>Average Rating: {coffee.average_rating}</p>
        <p>Stock Available: {coffee.stock}</p>
        <div className="cart-controls">
          <button onClick={(e) => { e.preventDefault(); handleDecrement(); }}>-</button>
          <span>{quantity}</span>
          <button onClick={(e) => { e.preventDefault(); handleIncrement(); }}>+</button>
          <button onClick={handleAddToCart}>Add to Cart</button>
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
    average_rating: PropTypes.number, // Added to show popularity
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  triggerRefresh: PropTypes.func.isRequired, // New prop
};

export default ProductsPage;
