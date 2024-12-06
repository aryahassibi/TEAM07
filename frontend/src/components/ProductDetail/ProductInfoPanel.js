import PropTypes from 'prop-types';

import wishlistIcon from '../../assets/images/icons/wishlist/wishlist-dark.svg';
import wishlistIconFilled from '../../assets/images/icons/wishlist/wishlist-dark-filled.svg';

import './ProductInfoPanel.css';


const ProductInfoPanel = ({ product, selectedVariant, variants, setSelectedVariant, handleAddToCart, wishlistFilled, handleWishlistClick }) => {
    return (
        <div className="key-info">
            {/* Name, Description, and Price */}
            <div className="top-info">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <div className="product-price">{Number(selectedVariant?.price || 0).toFixed(2)} TL</div>
            </div>

            {/* Variant Selection */}
            <div className="variant-selection">
                <h3 className="variant-header">Weight Options</h3> {/* Label stacked above buttons */}
                <div className="variant-buttons">
                    {variants.map((variant) => (
                        <button
                            key={variant.variant_id}
                            className={`variant-button ${
                                selectedVariant?.variant_id === variant.variant_id ? "selected" : ""
                            } ${variant.stock === 0 ? "out-of-stock" : ""}`}
                            onClick={() => setSelectedVariant(variant)}
                        >
                            {variant.weight_grams}g   ●   ${variant.price}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add to Cart, Stock Info, and Wishlist */}
            <div className="actions">
                <div className={`stock-info boxy-rectangle ${selectedVariant?.stock === 0 ? "out-of-stock" : ""}`}>
                    <strong>Stock:</strong>
                    <span>{selectedVariant?.stock || 0}</span>
                </div>
                <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                    {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="wishlist-button" onClick={handleWishlistClick}>
                    <img src={wishlistFilled ? wishlistIconFilled : wishlistIcon} alt="Add to Wishlist" />
                </button>
            </div>
        </div>
    );
};

ProductInfoPanel.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    selectedVariant: PropTypes.shape({
        variant_id: PropTypes.number,
        price: PropTypes.number,
        stock: PropTypes.number,
    }),
    variants: PropTypes.arrayOf(
        PropTypes.shape({
            variant_id: PropTypes.number.isRequired,
            weight_grams: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            stock: PropTypes.number.isRequired,
        })
    ).isRequired,
    setSelectedVariant: PropTypes.func.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    wishlistFilled: PropTypes.bool.isRequired,
    handleWishlistClick: PropTypes.func.isRequired,
};

export default ProductInfoPanel;