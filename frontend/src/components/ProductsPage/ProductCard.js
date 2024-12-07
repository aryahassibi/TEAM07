import { useState } from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ProductCard.css";

import cartIcon from "../../assets/images/icons/cart-dark.svg";
import wishlistIcon from "../../assets/images/icons/wishlist/wishlist-dark.svg";
import wishlistIconFilled from "../../assets/images/icons/wishlist/wishlist-dark-filled.svg";

const ProductCard = ({ product, onAddToCart }) => {
    const {
        name,
        price,
        discounted_price,
        image_url,
        stock,
        isDiscounted,
        weight_grams,
    } = product;

    const defaultImage = {
        url: "http://localhost:5001/assets/images/products/default_mockup.png",
        alt: "Default Mockup Image",
    };

    const [isWishlist, setIsWishlist] = useState(false);

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent navigation
        setIsWishlist((prev) => !prev); // Toggle wishlist state
    };

    // cor

    const handleImageError = (event) => {
        event.target.src = defaultImage.url;
        event.target.alt = defaultImage.alt;
    };

    return (
        <Link
            to={`/product/${product.variant_id}`}
            className={`product-card-link ${stock === 0 ? "out-of-stock" : ""}`}
        >
            <div className="product-card">
                <div className="product-image-wrapper">
                    <div className="product-weight">{weight_grams}g</div>
                    <img
                        src={`http://localhost:5001${image_url}`}
                        alt={name}
                        className="product-image"
                        onError={handleImageError}
                    />
                    {stock === 0 && (
                        <div className="stock-overlay">Out of Stock</div>
                    )}
                    <button
                        className="wishlist-icon"
                        onClick={handleWishlistClick}
                        aria-label="Toggle Wishlist"
                    >
                        <img
                            src={isWishlist ? wishlistIconFilled : wishlistIcon}
                            alt={
                                isWishlist
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"
                            }
                        />
                    </button>
                </div>
                <div className="product-details">
                    <div className="product-info">
                        <h3 className="product-name">{name}</h3>
                        <div className="product-pricing">
                            <span className="product-price">
                                {Number(discounted_price || price)} TL
                            </span>
                            {isDiscounted && (
                                <span className="product-original-price">
                                    ${price}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        className="add-to-cart-icon"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        aria-label="Add to Cart"
                    >
                        <img src={cartIcon} alt="Add to Cart" />
                    </button>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        discounted_price: PropTypes.number,
        image_url: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired,
        isDiscounted: PropTypes.bool,
        variant_id: PropTypes.number.isRequired,
        weight_grams: PropTypes.number.isRequired,
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
