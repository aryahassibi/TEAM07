import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import wishlistIcon from '../../assets/images/icons/wishlist/wishlist-dark.svg';
import wishlistIconFilled from '../../assets/images/icons/wishlist/wishlist-dark-filled.svg';

import './ProductInfoPanel.css';

const ProductInfoPanel = ({
    product,
    selectedVariant,
    variants,
    setSelectedVariant,
    handleAddToCart,
    wishlistFilled,
    handleWishlistClick
}) => {
    const [discountedPrice, setDiscountedPrice] = useState(selectedVariant?.price);
    const [isDiscounted, setIsDiscounted] = useState(false);
    const [discountType, setDiscountType] = useState(null);
    const [discountValue, setDiscountValue] = useState(null);

    useEffect(() => {
        if (selectedVariant) {
            // Fetch discount for the selected variant
            fetch(`http://localhost:5001/api/product/variant/${selectedVariant.variant_id}/discount`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success && data.discount) {
                        setDiscountedPrice(data.discounted_price);
                        setIsDiscounted(data.discounted_price < selectedVariant.price);
                        setDiscountType(data.discount.discount_type);
                        setDiscountValue(data.discount.value);
                    } else {
                        setDiscountedPrice(selectedVariant.price); // Use original price if not successful
                        setIsDiscounted(false);
                        setDiscountType(null);
                        setDiscountValue(null);
                    }
                })
                .catch((error) => {
                    console.error(
                        `Error fetching discounted price from URL: http://localhost:5001/api/product/variant/${selectedVariant.variant_id}/discount`,
                        error
                    );
                    setDiscountedPrice(selectedVariant.price); // Use original price on error
                    setIsDiscounted(false);
                    setDiscountType(null);
                    setDiscountValue(null);
                });
        }
    }, [selectedVariant]);

    return (
        <div className="key-info">
            {/* Name, Description, and Price */}
            <div className="top-info">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <div className="product-price-section">
                    <div className="product-price">
                        {Number(discountedPrice).toFixed(2)} TL
                    </div>
                    {isDiscounted && (
                        <div className="price-details">

                            <span className="product-original-price">
                                {Number(selectedVariant.price).toFixed(2)} TL
                            </span>
                            <span className="dot">●</span>
                            <span className="discount-label">
                                {discountType === "percentage"
                                    ? `-${discountValue}% Sale`
                                    : `-${Number(discountValue)} TL Off`}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Variant Selection */}
            <div className="variant-selection">
                <h3 className="variant-header">Weight Options</h3>
                <div className="variant-buttons">
                    {variants.map((variant) => (
                        <button
                            key={variant.variant_id}
                            className={`variant-button ${
                                selectedVariant?.variant_id === variant.variant_id ? "selected" : ""
                            } ${variant.stock === 0 ? "out-of-stock" : ""}`}
                            onClick={() => setSelectedVariant(variant)}
                        >
                            {variant.weight_grams}g ● {Number(variant.price).toFixed(2)} TL
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