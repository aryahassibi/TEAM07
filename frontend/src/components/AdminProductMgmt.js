import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrdersPage.css"; // Reuse the OrdersPage CSS for styling

const AdminProductMgmt = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5001/order/getorders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setErrors("Failed to fetch orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const handleToggleExpand = (orderId) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    if (loading) {
        return (
            <div className="admin-container">
                <p>Loading orders...</p>
            </div>
        );
    }

    if (errors) {
        return (
            <div className="admin-container">
                <p>{errors}</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1 className="admin-title">Product Management</h1>
            <p className="admin-description">
                Manage products, categories, and orders.
            </p>
            <div className="product-actions">
                <button
                    className="action-button"
                    onClick={() => window.location.href = "/admin/review_management"}
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

            <h2 className="admin-title">Delivery List</h2>
            {orders.length > 0 ? (
                <div className="orders-page__list">
                    {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.order_id;

                    return (
                        <div
                        key={order.order_id}
                        className={`orders-page__order ${isExpanded ? "expanded" : ""}`}
                        >
                        <div
                            className="orders-page__order-header"
                            onClick={() => handleToggleExpand(order.order_id)}
                        >
                            <div className="orders-page__order-info">
                            <span className="orders-page__order-id">Order #{order.order_id}</span>
                            <span className="orders-page__order-total">Total: {order.total_price} TL</span>
                            <span className="orders-page__order-status">Status: {order.status}</span>
                            <span className="orders-page__order-date">
                                Ordered on: {new Date(order.created_at).toLocaleDateString()}
                            </span>
                            <span className="orders-page__order-customer-id">Customer ID: {order.customer_id}</span>
                            </div>
                            <div className="orders-page__toggle-icon">{isExpanded ? "-" : "+"}</div>
                        </div>
                        {isExpanded && (
                            <div className="orders-page__order-details">
                            <ul className="orders-page__items-list">
                                {order.order_items.map((item, idx) => (
                                <li key={idx} className="orders-page__item">
                                    <img
                                    src={`http://localhost:5001${item.image_url}`}
                                    alt={item.name}
                                    className="orders-page__item-image"
                                    />
                                    <div className="orders-page__item-info">
                                    <span className="orders-page__item-name">{item.name}</span>
                                    <span className="orders-page__item-weight">Weight: {item.weight_grams}g</span>
                                    <span className="orders-page__item-price">
                                        Price: {item.price_at_purchase} TL
                                    </span>
                                    <span className="orders-page__item-quantity">Qty: {item.quantity}</span>
                                    <span className="orders-page__item-product-id">Product ID: {item.product_id}</span>
                                    </div>
                                </li>
                                ))}
                            </ul>
                            </div>
                        )}
                        </div>
                    );
                    })}
                </div>
            ) : (
                <p>No orders available.</p>
            )}
        </div>
    );
};

export default AdminProductMgmt;
