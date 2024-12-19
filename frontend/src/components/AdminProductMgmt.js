import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminProductMgmt.css"; // Import the CSS for styling

const AdminProductMgmt = () => {
    const [deliveries, setDeliveries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/deliveries");
                setDeliveries(response.data.deliveries || []);
            } catch (error) {
                console.error("Error fetching deliveries:", error);
                alert("Failed to fetch deliveries.");
            }
        };

        fetchDeliveries();
    }, []);

    return (
        <div className="admin-container">
            <button
                className="go-back-button"
                onClick={() => navigate("/admin/main_page")}
            >
                Go Back
            </button>
            <h1 className="admin-title">Product Management</h1>
            <p className="admin-description">
                Manage products, categories, and delivery operations.
            </p>
            <div className="product-actions">
                <button
                    className="action-button"
                    onClick={() => window.location.href = '/admin/review_management'}
                >
                    View Reviews
                </button>
                <button
                    className="action-button"
                    onClick={() => navigate("/admin/view_products")}
                >
                    View Products
                </button>
                <button
                    className="action-button"
                    onClick={() => navigate("/admin/categories")}
                >
                    View Categories
                </button>

            </div>
            <h2>Delivery List</h2>
            <div className="table-container">
                {deliveries.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Delivery ID</th>
                                <th>Customer ID</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((delivery) => (
                                <tr key={delivery.id}>
                                    <td>{delivery.id}</td>
                                    <td>{delivery.customerId}</td>
                                    <td>{delivery.productId}</td>
                                    <td>{delivery.quantity}</td>
                                    <td>${delivery.totalPrice}</td>
                                    <td>{delivery.address}</td>
                                    <td>{delivery.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No deliveries available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminProductMgmt;
