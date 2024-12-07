import PropTypes from "prop-types";
import "./ProductCard.css"; // Add styles in a separate CSS file or use inline styles as required.

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
    const {
        name,
        price,
        discounted_price,
        image_url,
        stock,
        isDiscounted,
    } = product;

    return (
        <div className={`product-card ${stock === 0 ? "out-of-stock" : ""}`}>
            <div className="product-image-wrapper">
                <img src={image_url} alt={name} className="product-image" />
                {stock === 0 && <div className="stock-overlay">Out of Stock</div>}
                <button
                    className="wishlist-icon"
                    onClick={onAddToWishlist}
                    aria-label="Add to Wishlist"
                >
                    ♥
                </button>
            </div>
            <div className="product-details">
                <div className="product-info">
                    <h3 className="product-name">{name}</h3>
                    <div className="product-pricing">
                        <span className="product-price">${discounted_price || price}</span>
                        {isDiscounted && (
                            <span className="product-original-price">
                                ${price}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    className="add-to-cart-icon"
                    onClick={onAddToCart}
                    aria-label="Add to Cart"
                >
                    🛒
                </button>
            </div>
        </div>
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
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
    onAddToWishlist: PropTypes.func.isRequired,
};

export default ProductCard;
