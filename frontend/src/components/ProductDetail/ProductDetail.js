import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductDetail from "../../hooks/useProductDetail";
import ProductImagesCarousel from "./ProductImagesCarousel";
import ProductInfoTable from "./ProductInfoTable";
import ReviewsSection from "./ReviewsSection";
import "./ProductDetail.css";

const ProductDetail = () => {
    const { variant_id } = useParams();
    const navigate = useNavigate();

    // Fetch product details using the custom hook
    const { product, variants, reviews, averageRating, error } = useProductDetail(variant_id);

    // State for quantity, selected variant, and image navigation
    const [quantity, setQuantity] = useState(1);
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

    // Handle variant selection
    const handleVariantChange = (e) => {
        const variantId = e.target.value;
        const selected = variants.find(
            (variant) => variant.variant_id === parseInt(variantId)
        );
        setSelectedVariant(selected);
        setCurrentImageIndex(0); // Reset carousel to the first image
    };

    // Add to Cart Handler
    const handleAddToCart = () => {
        if (!selectedVariant || quantity > selectedVariant.stock) {
            alert("Not enough stock available!");
            return;
        }

        // Add logic for adding to cart (e.g., context, API call)
        alert(`${quantity} item(s) of ${product.name} added to cart.`);
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
                <ProductImagesCarousel
                    images={product.images}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                />
                <div className="key-info">
                    <h1 className="product-name">{product.name}</h1>
                    <p className="product-description">{product.description}</p>
                    
                    {/* Variant Selection */}
                    <div className="variant-selection">
                        <label htmlFor="variant">Choose Weight:</label>
                        <select
                            id="variant"
                            value={selectedVariant?.variant_id || ""}
                            onChange={handleVariantChange}
                        >
                            {variants.map((variant) => (
                                <option
                                    key={variant.variant_id}
                                    value={variant.variant_id}
                                    disabled={variant.stock === 0}
                                >
                                    {variant.weight_grams}g - ${variant.price}{" "}
                                    {variant.stock === 0 ? "(Out of Stock)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity Selection */}
                    <div className="quantity-selection">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={selectedVariant?.stock || 1}
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    Math.min(
                                        Math.max(1, parseInt(e.target.value) || 1),
                                        selectedVariant?.stock || 1
                                    )
                                )
                            }
                        />
                        <span className="stock-info">
                            {selectedVariant?.stock || 0} in stock
                        </span>
                    </div>
                    <div className="price-add">
                        <p className="price">
                            ${Number(selectedVariant?.price || 0).toFixed(2)}
                        </p>
                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stock === 0}
                        >
                            {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
