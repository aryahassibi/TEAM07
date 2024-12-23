import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../ProductsPage/ProductCard";
import "./WishlistPage.css";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();

    // Fetch products data based on filters and sort order
    useEffect(() => {
        const fetchProducts = async () => {
            const query = new URLSearchParams(location.search);

            try {
                let response = await axios.get(
                    `http://localhost:5001/api/products?${query.toString()}`
                );
                setProducts(response.data);
                const productsData = response.data.map((product) => ({
                    ...product,
                    price: Number(product.price),
                }));
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [location.search]);

    const handleAddToCart = async (variantId) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Send a POST request to the backend with the token and variant details
                const response = await axios.post(
                    "http://localhost:5001/api/cart/add-to-cart",
                    { variantId }, // Payload
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    alert("Product added to cart successfully!");
                } else {
                    alert("Failed to add product to cart. Please try again.");
                }
            } catch (error) {
                console.error("Error adding product to cart:", error);
                alert("An error occurred. Please try again.");
            }
        } else {
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/cart/variant/${variantId}`
                );

                if (response.status === 200) {
                    const productDetails = response.data;

                    const {
                        product_name,
                        price,
                        weight,
                        image,
                        stock,
                        quantity: newQuantity,
                    } = productDetails;

                    const cart = JSON.parse(localStorage.getItem("cart")) || [];

                    const existingProductIndex = cart.findIndex(
                        (item) => item.variantId === variantId
                    );

                    if (existingProductIndex > -1) {
                        const existingProduct = cart[existingProductIndex];
                        if (existingProduct.quantity + 1 > stock) {
                            alert(
                                "Stock is insufficient to add more of this product."
                            );
                            return;
                        }
                        cart[existingProductIndex].quantity += 1;
                    } else {
                        if (newQuantity > stock) {
                            alert("Stock is insufficient for this product.");
                            return;
                        }
                        cart.push({
                            variantId,
                            product_name,
                            price,
                            weight,
                            image,
                            quantity: 1,
                        });
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));

                    alert("Product added to cart successfully!");
                } else {
                    alert("Failed to fetch product details. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                alert(
                    "An error occurred while adding the product. Please try again."
                );
            }
        }
    };

    return (
        <div className="products-page">
            <h1 className="page-title">Your Wishlist</h1>

            {/* Product Grid */}
            <div className="products-grid">
                {products.length ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.variant_id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                ) : (
                    <p className="no-products">No products available.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
