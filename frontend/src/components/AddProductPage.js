import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProductPage.css";

const AddProductPage = () => {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        origin: "",
        roast_level: "Medium",
        bean_type: "Arabica",
        grind_type: "Whole Bean",
        flavor_profile: "",
        processing_method: "Natural",
        caffeine_content: "High",
        category_id: "",
        description: "",
        warranty_status: false,
        distributor_info: "",
    });

    const [variants, setVariants] = useState([{ weight_grams: "", price: "", stock: "", sku: "" }]);
    const [images, setImages] = useState([{ image_url: "", alt_text: "" }]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVariants = [...variants];
        updatedVariants[index][name] = value;
        setVariants(updatedVariants);
    };

    const handleImageChange = (index, e) => {
        const { name, value } = e.target;
        const updatedImages = [...images];
        updatedImages[index][name] = value;
        setImages(updatedImages);
    };

    const addVariant = () => {
        setVariants((prev) => [...prev, { weight_grams: "", price: "", stock: "", sku: "" }]);
    };

    const addImage = () => {
        setImages((prev) => [...prev, { image_url: "", alt_text: "" }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = { product, variants, images };
            const response = await axios.post("http://localhost:5001/api/products", payload); // No token needed
            if (response.status === 201) {
                alert("Product added successfully!");
                navigate("/admin/main_page");
            } else {
                alert("Failed to add product. Please check your input.");
            }
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            alert(
                error.response?.data?.error || "Failed to add product. Please check the console for more details."
            );
        }
    };

    return (
        <div className="add-product-container">
            <button
                className="go-back-button"
                onClick={() => navigate("/admin/product_management")}
            >
                Go Back
            </button>

            <h1>Add New Product</h1>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <h2>Product Details</h2>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Origin:</label>
                    <input
                        type="text"
                        name="origin"
                        value={product.origin}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Roast Level:</label>
                    <select name="roast_level" value={product.roast_level} onChange={handleInputChange}>
                        <option value="Light">Light</option>
                        <option value="Medium">Medium</option>
                        <option value="Dark">Dark</option>
                        <option value="French">French</option>
                        <option value="Espresso">Espresso</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Bean Type:</label>
                    <select name="bean_type" value={product.bean_type} onChange={handleInputChange}>
                        <option value="Arabica">Arabica</option>
                        <option value="Robusta">Robusta</option>
                        <option value="Liberica">Liberica</option>
                        <option value="Blend">Blend</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Category ID:</label>
                    <input
                        type="number"
                        name="category_id"
                        value={product.category_id}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <h2>Variants</h2>
                {variants.map((variant, index) => (
                    <div key={index} className="variant-group">
                        <label>Weight (grams):</label>
                        <input
                            type="number"
                            name="weight_grams"
                            value={variant.weight_grams}
                            onChange={(e) => handleVariantChange(index, e)}
                            required
                        />
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, e)}
                            required
                        />
                        <label>Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, e)}
                            required
                        />
                        <label>SKU:</label>
                        <input
                            type="text"
                            name="sku"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, e)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addVariant}>
                    Add Another Variant
                </button>
                <h2>Images</h2>
                {images.map((image, index) => (
                    <div key={index} className="image-group">
                        <label>Image URL:</label>
                        <input
                            type="url"
                            name="image_url"
                            value={image.image_url}
                            onChange={(e) => handleImageChange(index, e)}
                        />
                        <label>Alt Text:</label>
                        <input
                            type="text"
                            name="alt_text"
                            value={image.alt_text}
                            onChange={(e) => handleImageChange(index, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addImage}>
                    Add Another Image
                </button>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddProductPage;
