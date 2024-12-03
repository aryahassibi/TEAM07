import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../CartContext";
import "./ProductDetail.css";

const ProductDetail = () => {
    const { variant_id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState({
        stock: 0,
        price: 0,
    });
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState([]);

    // State for reviews
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch product details
                const response = await axios.get(
                    `http://localhost:5001/api/product/variants/${variant_id}`
                );
                setProduct(response.data);

                // Set selected variant
                const variant = response.data;
                setSelectedVariant(variant || { stock: 0, price: 0 });

                // Fetch all variants
                const allVariantsResponse = await axios.get(
                    `http://localhost:5001/api/products/${response.data.product_id}/variants`
                );
                setVariants(allVariantsResponse.data.variants);

                // Fetch reviews
                const reviewsResponse = await axios.get(
                    `http://localhost:5001/api/reviews/${response.data.product_id}`
                );
                setReviews(reviewsResponse.data.reviews || []);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [variant_id]);

    const handlePrevImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleVariantChange = (e) => {
        const variantId = e.target.value;
        const selected = variants.find(
            (variant) => variant.variant_id === parseInt(variantId)
        );
        setSelectedVariant(selected);
        setCurrentImageIndex(0);
    };

    const handleAddToCart = () => {
        if (quantity > selectedVariant.stock) {
            alert("Not enough stock available!");
            return;
        }
        addToCart(
            product.name,
            selectedVariant.variant_id,
            quantity,
            selectedVariant.price,
            selectedVariant.weight_grams
        );
        alert(`${quantity} item(s) added to cart.`);
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="image-carousel">
                {product.images?.length > 0 ? (
                    <>
                        <div className="main-image">
                            <img
                                src={`http://localhost:5001${product.images[currentImageIndex].url}`}
                                alt={product.images[currentImageIndex].alt}
                            />
                            <button
                                className="nav-button left"
                                onClick={handlePrevImage}
                                aria-label="Previous Image"
                            >
                                &#10094;
                            </button>
                            <button
                                className="nav-button right"
                                onClick={handleNextImage}
                                aria-label="Next Image"
                            >
                                &#10095;
                            </button>
                        </div>
                        <div className="dots-container">
                            {product.images.map((image, index) => (
                                <span
                                    key={index}
                                    className={`dot ${
                                        index === currentImageIndex ? "active" : ""
                                    }`}
                                    onClick={() => handleDotClick(index)}
                                    aria-label={`View image ${index + 1}`}
                                ></span>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-image">No images available</div>
                )}
            </div>
            <div className="product-details">
                <h1>{product.name}</h1>
                <p><strong>Origin:</strong> {product.origin}</p>
                <p><strong>Roast Level:</strong> {product.roast_level}</p>

                <div className="variant-selection">
                    <label>Choose Weight:</label>
                    <select onChange={handleVariantChange}>
                        {variants.map((variant) => (
                            <option key={variant.variant_id} value={variant.variant_id}>
                                {variant.weight_grams}g - ${variant.price}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="quantity-selection">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        min="1"
                        max={selectedVariant.stock}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                </div>

                <button onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>

            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review">
                            <p><strong>{review.rating} Stars</strong></p>
                            <p>{review.content}</p>
                            <p>
                                <small>
                                    {review.first_name} {review.last_name},{" "}
                                    {new Date(review.created_at).toLocaleDateString()}
                                </small>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
