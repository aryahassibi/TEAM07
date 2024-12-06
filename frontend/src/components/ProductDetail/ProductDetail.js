import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductDetail from "../../hooks/useProductDetail";
import ProductImagesCarousel from "./ProductImagesCarousel";
import ProductInfoTable from "./ProductInfoTable";
import ReviewsSection from "./ReviewsSection";
import wishlistIcon from '../../assets/images/icons/wishlist-light.svg';

import "./ProductDetail.css";

const ProductDetail = () => {
    const { variant_id } = useParams();
    const navigate = useNavigate();

    // Fetch product details using the custom hook
    const { product, variants, reviews, averageRating, error } = useProductDetail(variant_id);

    // State for quantity, selected variant, and image navigation
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Set default variant when product or variants change
    useEffect(() => {
        if (variants.length > 0 && !selectedVariant) {
            const initialVariant = variants.find(
                (variant) => variant.variant_id === parseInt(variant_id)
            );
            setSelectedVariant(initialVariant || variants[0]); // Fallback to the first variant if not found
        }
    }, [variants, variant_id, selectedVariant]);


    // Add to Cart Handler
    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stock !== 0) {
            alert("Not enough stock available!");
            return;
        }

        // Add logic for adding to cart (e.g., context, API call)
        alert(`${product.name} added to cart.`);
    };

    // Write Review Navigation
    const handleWriteReviewClick = () => {
        if (product?.product_id) {
            navigate(`/reviews/write/${product.product_id}`);
        }
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!product || !variants) return <div className="loading-message">Loading...</div>;

    return (
        <div className="product-detail-container">
            {/* Top Section: Images and Key Info */}
            <div className="top-section">
                {/* Left: Product Images */}
                <ProductImagesCarousel
                    images={product.images}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                />

                {/* Right: Product Info */}
                <div className="key-info">
                    {/* Name, Description, and Price */}
                    <div className="top-info">
                        <h1 className="product-name">{product.name}</h1>
                        <p className="product-description">{product.description}</p>
                        <h2 className="product-price">${Number(selectedVariant?.price || 0).toFixed(2)}</h2>
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
                                    }`}
                                    onClick={() => setSelectedVariant(variant)}
                                    disabled={variant.stock === 0}
                                >
                                    {variant.weight_grams}g   ●   ${variant.price}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart, Stock Info, and Wishlist */}
                    <div className="actions">
                        <div className="stock-info boxy-rectangle">
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
                        <button className="wishlist-button">
                            <img src={wishlistIcon} alt="Add to Wishlist" />
                        </button>
                    </div>
                </div>

            </div>


            {/* Product Information Table */}
            <ProductInfoTable product={product} />

            {/* Reviews Section */}
            <ReviewsSection
                reviews={reviews}
                averageRating={averageRating}
                onWriteReview={handleWriteReviewClick}
            />
        </div>
    );
};

export default ProductDetail;
