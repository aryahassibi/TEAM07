import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SetPricesDiscounts.css"; // Import the CSS for styling

const SetPricesDiscounts = () => {
    const [variants, setVariants] = useState([]); // Manage variant-level data
    const navigate = useNavigate();

    // Fetch the product variants list
    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/product-variants", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const fetchedVariants = Array.isArray(response.data) ? response.data : response.data.variants || [];
                setVariants(fetchedVariants);
            } catch (error) {
                console.error("Error fetching product variants:", error);
                alert("Failed to fetch product variants.");
            }
        };

        fetchVariants();
    }, []);

    // Handle input changes for price and discount
    const handleInputChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    // Submit updated prices and discounts
    const handleSave = async () => {
        try {
            await axios.put(
                "http://localhost:5001/api/product-variants/update",
                { variants }, // Send the updated variants array
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert("Prices and discounts updated successfully!");
            navigate("/admin/sales_mgmt"); // Navigate back
        } catch (error) {
            console.error("Error updating product variants:", error);
            alert("Failed to update prices and discounts.");
        }
    };

    return (
        <div className="set-prices-container">
            <button className="go-back-button" onClick={() => navigate("/admin/sales_mgmt")}>
                Go Back
            </button>
            <h1>Set Prices and Discounts</h1>
            <p>Edit the variant prices and discount percentages.</p>
            <div className="product-table-container">
                {variants.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Variant ID</th>
                                <th>Product Name</th>
                                <th>Weight (g)</th>
                                <th>Price</th>
                                <th>Discount (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map((variant, index) => (
                                <tr key={variant.variant_id}>
                                    <td>{variant.variant_id}</td>
                                    <td>{variant.name}</td>
                                    <td>{variant.weight_grams}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => handleInputChange(index, "price", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={variant.discount || 0}
                                            onChange={(e) => handleInputChange(index, "discount", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No product variants available.</p>
                )}
            </div>
            <button className="save-button" onClick={handleSave}>
                Save Changes
            </button>
        </div>
    );
};

export default SetPricesDiscounts;
