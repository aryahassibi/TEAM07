import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchCategories from "../../hooks/userFetchCategories";
import "./ProductsDropdownMenu.css";

const DropdownMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { categories, loading, error } = useFetchCategories();


  return (
    <li
      className="dropdown"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <Link to="/products" className="dropdown-toggle">PRODUCTS</Link>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-column">
            <h4>Main Categories</h4>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <ul>
                {categories.map((category) => (
                  <li key={category.category_id}>
                    <Link to={`/products?category_id=${category.category_id}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dropdown-column">
            <h4>Roast Levels</h4>
            <ul>
              <li><Link to="/products?roast_level=Light">Light</Link></li>
              <li><Link to="/products?roast_level=Medium">Medium</Link></li>
              <li><Link to="/products?roast_level=Dark">Dark</Link></li>
              <li><Link to="/products?roast_level=French">French</Link></li>
              <li><Link to="/products?roast_level=Espresso">Espresso</Link></li>
            </ul>
          </div>

          <div className="dropdown-column">
            <h4>Bean Types</h4>
            <ul>
              <li><Link to="/products?bean_type=Arabica">Arabica</Link></li>
              <li><Link to="/products?bean_type=Robusta">Robusta</Link></li>
              <li><Link to="/products?bean_type=Liberica">Liberica</Link></li>
              <li><Link to="/products?bean_type=Blend">Blend</Link></li>
            </ul>
          </div>

          <div className="dropdown-column">
            <h4>Grind Types</h4>
            <ul>
              <li><Link to="/products?grind_type=Whole%20Bean">Whole Bean</Link></li>
              <li><Link to="/products?grind_type=Ground">Ground</Link></li>
              <li><Link to="/products?grind_type=Other">Other</Link></li>
            </ul>
          </div>

          <div className="dropdown-column">
            <h4>Processing Methods</h4>
            <ul>
              <li><Link to="/products?processing_method=Washed">Washed</Link></li>
              <li><Link to="/products?processing_method=Natural">Natural</Link></li>
              <li><Link to="/products?processing_method=Honey-processed">Honey-processed</Link></li>
              <li><Link to="/products?processing_method=Other">Other</Link></li>
            </ul>
          </div>

          <div className="dropdown-column">
            <h4>Caffeine Content</h4>
            <ul>
              <li><Link to="/products?caffeine_content=High">High</Link></li>
              <li><Link to="/products?caffeine_content=Decaf">Decaf</Link></li>
              <li><Link to="/products?caffeine_content=Half-Caf">Half-Caf</Link></li>
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export default DropdownMenu;
