//import React from "react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios';
import "./BestSellingProducts.css";

const BestSellingProducts = () => {
  // const products = [
  //   { id: 1, name: "Compresso Colombia", rating: 5.0, reviewcount: 216, price: 300, image: "./product1r.png" },
  //   { id: 2, name: "Compresso Ethiopia", rating: 5.0, reviewcount: 216, price: 200, image: "./product3r.png" },
  //   { id: 3, name: "Compresso Italy", rating: 5.0, reviewcount: 216, price: 250, image: "./product2r.png" },
  //   { id: 4, name: "Compresso Colombia", rating: 5.0, reviewcount: 216, price: 400, image: "./product1r.png" },
  // ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch(`http://localhost:5001/api/featuredproducts`); 

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bestselling-container">
      <h2 className="bestselling-heading">Bestselling Products</h2>
      <div className="bestselling-list">
        {products.map((product) => (
          <div className="bestselling-product-card" key={product.id}>
            <div
                className="bestselling-image-wrapper"
                style={{ backgroundImage: `url(${product.image})` }}
            ></div>
            <div className="bestselling-product-info">
              <p className="bestselling-name">
                <Link to={`/product/${product.variantId}`}>{product.name}</Link>
              </p>
              <p className="bestselling-rating">
                <img 
                  src="/star.png" 
                  alt="Star" 
                  style={{ width: "16px", height: "16px", marginRight: "3px", marginBottom: "2px", verticalAlign: "middle"}} 
                />
                 {Number(product.rating).toFixed(1)} {/*({product.reviewcount})*/}
              </p>
              <p className="bestselling-price">₺{product.price}</p>
            </div>
            <button className="bestselling-add-button">+</button>
          </div>
        ))}
      </div>
      <p className="bestselling-view-all">
        <Link to="/products">View All Products</Link>
      </p>
    </div>
  );
};

export default BestSellingProducts;
