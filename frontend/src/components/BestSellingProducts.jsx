import React from "react";
import "./BestSellingProducts.css";

const BestSellingProducts = () => {
  const products = [
    { id: 1, name: "Compresso Colombia", rating: 5.0, reviewcount: 216, price: 300, image: "./product1.png" },
    { id: 2, name: "Compresso Ethiopia", rating: 5.0, reviewcount: 216, price: 200, image: "./product2.png" },
    { id: 3, name: "Compresso Italy", rating: 5, reviewcount: 216, price: 250, image: "./product3.png" },
    { id: 4, name: "Compresso Colombia", rating: 5.0, reviewcount: 216, price: 400, image: "./product1.png" },
  ];

  return (
    <div className="bestselling-container">
      <h2 className="bestselling-heading">Bestselling Products</h2>
      <div className="bestselling-list">
        {products.map((product) => (
          <div className="bestselling-product-card" key={product.id}>
            <a href="#" onClick={(event) => event.preventDefault()} className="bestselling-image-link">
              <div
                className="bestselling-image-wrapper"
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
            </a>
            <div className="bestselling-product-info">
              <p className="bestselling-name">
                <a href="#" onClick={(event) => event.preventDefault()}>{product.name}</a>
              </p>
              <p className="bestselling-rating">⭐{product.rating.toFixed(1)} ({product.reviewcount})</p>
              <p className="bestselling-price">${product.price}</p>
            </div>
            <button className="bestselling-add-button">+</button>
          </div>
        ))}
      </div>
      <p className="bestselling-view-all">
        <a href="#" onClick={(event) => event.preventDefault()}>View All</a>
      </p>
    </div>
  );
};

export default BestSellingProducts;
