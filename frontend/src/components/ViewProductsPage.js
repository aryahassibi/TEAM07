import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./ViewProductsPage.css"; // Custom CSS for styling

const ViewProductsPage = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/products");
                // Reverse the order of products to show bottom-to-top
                setProducts(response.data.reverse());
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("Failed to fetch products.");
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="view-products-container">
            <div className="view-products-top-buttons">
                {/* Turn Back Button */}
                <button
                    className="view-products-go-back-button"
                    onClick={() => navigate("/admin/product_management")}
                >
                    Turn Back
                </button>

                {/* Add Product Button */}
                <button
                    className="view-products-add-product-button"
                    onClick={() => navigate("/admin/add_product")}
                >
                    Add Product
                </button>
            </div>

            <h1>All Products</h1>

            <div className="view-products-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.product_id} className="view-products-card">
                            <h3>{product.name}</h3>
                            <p><strong>Origin:</strong> {product.origin || "N/A"}</p>
                            <p><strong>Roast Level:</strong> {product.roast_level}</p>
                            <p><strong>Bean Type:</strong> {product.bean_type}</p>
                            <p><strong>Caffeine Content:</strong> {product.caffeine_content}</p>
                            <p><strong>Category ID:</strong> {product.category_id}</p>
                            <p><strong>Description:</strong> {product.description ? product.description : "No description available."}</p>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    );
};

export default ViewProductsPage;
