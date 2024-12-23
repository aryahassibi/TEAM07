import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:5001/api';

// Fetch all details of all product variants in the wishlist
export const useWishlistItems = (navigate) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
 
        if (token) {
            axios
                .get(`${API_BASE_URL}/wishlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setProducts(
                        response.data.map((product) => ({
                            ...product,
                            price: Number(product.effective_price),
                        }))
                    );
                })
                .catch((err) => {
                    console.error("Error fetching wishlist products:", err);
                    setError(err);
                    setProducts([]);
                });
        } else {
            alert("Please log in to view your wishlist.");
            navigate("/login");
        }
    }, [navigate]);

    return { products, error };
};