// ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css"; // Import the CSS file for styling

const ProductDetail = () => {
    const { variant_id } = useParams(); // Assuming variant_id is passed via route
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState({
        stock: 0,
        price: 0,
    });
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        // Fetch product details by variant_id
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/product/variants/${variant_id}`
                );
                setProduct(response.data);
                console.log(response.data);
                const variant = response.data;
                setSelectedVariant(variant || { stock: 0, price: 0 });
                // Fetch all variants for the product
                const allVariantsResponse = await axios.get(
                    `http://localhost:5001/api/products/${response.data.product_id}/variants`
                );
                console.log(allVariantsResponse.data);
                setVariants(allVariantsResponse.data.variants);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [variant_id]);

    const handlePrevImage = () => {
        if (!product.images || product.images.length === 0) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        if (!product.images || product.images.length === 0) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleVariantChange = (e) => {
        const variantId = e.target.value;
        // Fetch the selected variant details
        const selected = variants.find(
            (variant) => variant.variant_id === parseInt(variantId)
        );
        setSelectedVariant(selected);
        setCurrentImageIndex(0); // Reset image index when variant changes
    };

    





    const fetchProductVariantDetails = async (variantId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/cart/variant/${variantId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product details:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Failed to fetch product details');
        }
    };
    
    const handleAddToCart= async (variantId, quantity) => {

        const token = localStorage.getItem('token');
        if(token){
 
            try {
                // Send a POST request to the backend with the token and variant details
                const response = await axios.post('http://localhost:5001/api/cart/add-to-cart', 
                    {variantId}, // Payload
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                            'Content-Type': 'application/json' 
                        }
                    }
                );
    
                
                if (response.status === 200) {
                    alert('Product added to cart successfully!');
                } else {
                    alert('Failed to add product to cart. Please try again.');
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
                alert('An error occurred. Please try again.');
            }
            
    
    
        }
        else{
            
            try {
            
            const product = await fetchProductVariantDetails(variantId);
    
            // Retrieve the cart from localStorage, initializing as an empty array if it doesn't exist
            const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
            
            
            const cartItem = existingCart.find(item => item.variantId === variantId);
    
            
            const newQuantity = cartItem ? cartItem.quantity + quantity : quantity;
    
            
            if (newQuantity > product.stock) {
                alert(`Only ${product.stock} units of this product are available.`);
                return;
            }
    
            // Update cart item quantity or add new item
            if (cartItem) {
                cartItem.quantity = newQuantity;
            } else {
                existingCart.push({
                    variantId: product.variantId,
                    product_name: product.product_name,
                    price: product.price,
                    weight: product.weight,
                    image: product.image,
                    quantity: newQuantity
                });
            }
    
            
            localStorage.setItem('cart', JSON.stringify(existingCart));
            alert('Product added to cart successfully!');
        } catch (error) {
            alert('Failed to add product to cart. Please try again.');
            console.error(error);
        }
         }
    };
    





    return (
        <div className="product-detail-container">
            <div className="image-carousel">
                {product.images && product.images.length > 0 ? (
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
                                        index === currentImageIndex
                                            ? "active"
                                            : ""
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
                <h1 className="product-name">{product.name}</h1>
                <p className="product-origin">
                    <strong>Origin:</strong> {product.origin}
                </p>
                <p className="product-roast">
                    <strong>Roast Level:</strong> {product.roast_level}
                </p>
                <p className="product-bean">
                    <strong>Bean Type:</strong> {product.bean_type}
                </p>
                <p className="product-flavor">
                    <strong>Flavor Profile:</strong> {product.flavor_profile}
                </p>
                <p className="product-description">{product.description}</p>

                <div className="variant-selection">
                    <label htmlFor="variant">Choose Weight:</label>
                    <select
                        id="variant"
                        value={selectedVariant.variant_id}
                        onChange={handleVariantChange}
                    >
                        {variants.map((variant) => (
                            <option
                                key={variant.variant_id}
                                value={variant.variant_id}
                            >
                                {variant.weight_grams}g - ${variant.price}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="quantity-selection">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        min="1"
                        max={selectedVariant.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <span className="stock">
                        {selectedVariant.stock} in stock
                    </span>
                </div>

                <div className="price-add">
                    <p className="price">
                        ${Number(selectedVariant.price).toFixed(2)}
                    </p>
                    <button
                        className="add-to-cart-button"
                        onClick={handleAddToCart(variant_id,1)}
                        disabled={selectedVariant.stock === 0}
                    >
                        {selectedVariant.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
