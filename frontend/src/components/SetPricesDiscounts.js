import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SetPricesDiscounts.css"; // Ensure this CSS file exists for styling

const SetPricesDiscounts = () => {
  const [variants, setVariants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/product-variants", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const fetchedVariants = Array.isArray(response.data)
          ? response.data
          : response.data.variants || [];

        const variantsWithDiscounts = await Promise.all(
          fetchedVariants.map(async (variant) => {
            try {
              const discountResponse = await axios.get(
                `http://localhost:5001/api/product/variant/${variant.variant_id}/discount`
              );
              const discountData = discountResponse.data;
              const basePrice = parseFloat(variant.price);
              const discountValue = discountData.discount?.value || 0;

              return {
                ...variant,
                discount: discountValue,
                discountedPrice: parseFloat((basePrice * (1 - discountValue / 100)).toFixed(2)),
                basePrice: basePrice,
                initialBasePrice: basePrice,
              };
            } catch (error) {
              console.error("Error fetching discount for variant:", variant.variant_id, error);
              return {
                ...variant,
                discount: 0,
                discountedPrice: parseFloat(variant.price),
                basePrice: parseFloat(variant.price),
                initialBasePrice: parseFloat(variant.price),
              };
            }
          })
        );

        setVariants(variantsWithDiscounts);
      } catch (error) {
        console.error("Error fetching product variants:", error);
        alert("Failed to fetch product variants.");
      }
    };
    fetchVariants();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedVariants = [...variants];
    const variant = updatedVariants[index];

    if (field === "discount") {
      const discount = parseFloat(value) || 0;
      variant.discount = discount;
      variant.discountedPrice = parseFloat(
        (variant.initialBasePrice * (1 - discount / 100)).toFixed(2)
      );
    } else if (field === "basePrice") {
      const newBasePrice = parseFloat(value) || 0;
      variant.basePrice = newBasePrice;
      variant.initialBasePrice = newBasePrice;
      variant.discountedPrice = parseFloat(
        (newBasePrice * (1 - variant.discount / 100)).toFixed(2)
      );
    }

    setVariants(updatedVariants);
  };

  const handleSave = async () => {
    try {
      const updatedVariants = variants.map((variant) => ({
        variant_id: variant.variant_id,
        price: variant.basePrice,
        discount: variant.discount || 0,
      }));

      await axios.put(
        "http://localhost:5001/api/product-variants/update",
        { variants: updatedVariants },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const discountPromises = updatedVariants
        .filter((variant) => variant.discount > 0)
        .map(async (variant) => {
          try {
            await axios.post(
              "http://localhost:5001/api/discounts/notify-discount",
              {
                variantId: variant.variant_id,
                discountValue: variant.discount,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );
          } catch (error) {
            console.error(`Failed to notify users for variant ID ${variant.variant_id}:`, error);
          }
        });

      await Promise.all(discountPromises);

      alert("Prices, discounts, and notifications updated successfully!");
    } catch (error) {
      console.error("Error updating prices and discounts:", error);
      alert("Failed to update prices and discounts.");
    }
  };

  return (
    <div className="set-prices-container">
      <button
        className="go-back-button"
        onClick={() => navigate("/admin/sales_mgmt")}
      >
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
                <th>Original Price</th>
                <th>Discount (%)</th>
                <th>Discounted Price</th>
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
                      value={variant.basePrice}
                      onChange={(e) => handleInputChange(index, "basePrice", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={variant.discount}
                      onChange={(e) => handleInputChange(index, "discount", e.target.value)}
                    />
                  </td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {variant.discountedPrice.toFixed(2)} TL
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
