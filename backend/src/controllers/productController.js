const mysql = require("mysql2");

// Database connection
const db = require('../config/db');

// List all products with filtering and sorting
exports.listProducts = (req, res) => {
    const {
        category_id,
        roast_level,
        bean_type,
        grind_type,
        caffeine_content,
        origin,
        sort_by = 'price', // Default sort_by
        sort_order = 'asc', // Default sort_order
    } = req.query;

    // Validate sorting parameters
    const validSortBy = ['price']; // Allowed fields to sort by
    const validSortOrder = ['asc', 'desc'];

    if (!validSortBy.includes(sort_by)) {
        return res.status(400).json({ error: 'Invalid sort_by parameter.' });
    }

    if (!validSortOrder.includes(sort_order.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid sort_order parameter.' });
    }

    // Map sort_by to actual database column
    const sortByColumn = {
        price: 'pv.price',
    };

    let query = `
        SELECT 
            p.product_id, 
            p.name, 
            p.category_id,
            p.roast_level, 
            p.bean_type, 
            p.grind_type, 
            p.caffeine_content, 
            p.origin, 
            p.description,
            pv.variant_id, 
            pv.weight_grams, 
            pv.price, 
            pv.stock, 
            pv.sku
        FROM 
            Products p
        JOIN 
            Product_Variant pv ON p.product_id = pv.product_id
    `;

    let conditions = [];
    let params = [];

    if (category_id) {
        conditions.push(`p.category_id = ?`);
        params.push(category_id);
    }
    if (roast_level) {
        conditions.push(`p.roast_level = ?`);
        params.push(roast_level);
    }
    if (bean_type) {
        conditions.push(`p.bean_type = ?`);
        params.push(bean_type);
    }
    if (grind_type) {
        conditions.push(`p.grind_type = ?`);
        params.push(grind_type);
    }
    if (caffeine_content) {
        conditions.push(`p.caffeine_content = ?`);
        params.push(caffeine_content);
    }
    if (origin) {
        conditions.push(`p.origin = ?`);
        params.push(origin);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    // Add ORDER BY clause
    query += ` ORDER BY ${sortByColumn[sort_by]} ${sort_order.toUpperCase()}`;

    db.query(query, params, (error, results) => {
        if (error) {
            console.error('Error retrieving products:', error.message);
            return res.status(500).json({ error: 'Failed to retrieve products.' });
        }

        // Instead of returning 404 for no results, return an empty array
        res.json(results);
    });
};

// Retrieve a single product by ID
exports.getProductById = (req, res) => {
    const productId = req.params.id;

    const query = `
        SELECT 
            p.name, 
            p.origin, 
            p.roast_level, 
            p.bean_type, 
            p.grind_type, 
            p.flavor_profile, 
            p.processing_method, 
            p.caffeine_content, 
            p.description, 
            pv.weight_grams, 
            pv.price, 
            pv.stock, 
            pv.sku 
        FROM Products p 
        JOIN Product_Variant pv ON p.product_id = pv.product_id 
        WHERE pv.variant_id = ?`;

    db.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!results.length) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(results[0]);
    });
};

// Create a new product
exports.createProduct = async (req, res) => {
    console.log("POST /api/products/create - Request received");
    console.log("Request Body:", req.body);

    const { product, variants, images } = req.body;

    if (!product) {
        console.error("Product data is missing");
        return res.status(400).json({ error: "Product details are missing" });
    }

    const categoryId = product.category_id && Number.isInteger(product.category_id) ? product.category_id : null;

    console.log("Category ID:", categoryId);

    const productQuery = `
        INSERT INTO Products (name, origin, roast_level, bean_type, grind_type, flavor_profile, processing_method, caffeine_content, category_id, description, warranty_status, distributor_info)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // Insert Product
        const [productResult] = await connection.query(productQuery, [
            product.name,
            product.origin,
            product.roast_level,
            product.bean_type,
            product.grind_type,
            product.flavor_profile,
            product.processing_method,
            product.caffeine_content,
            categoryId,
            product.description,
            product.warranty_status,
            product.distributor_info,
        ]);

        console.log("Product inserted successfully:", productResult);

        const productId = productResult.insertId;

        // Insert Variants
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                console.log("Inserting Variant:", variant);
                await connection.query(`
                    INSERT INTO Product_Variant (product_id, weight_grams, price, stock, sku)
                    VALUES (?, ?, ?, ?, ?)
                `, [productId, variant.weight_grams, variant.price, variant.stock, variant.sku]);
            }
        }

        // Insert Images
        if (images && images.length > 0) {
            for (const image of images) {
                console.log("Inserting Image:", image);
                await connection.query(`
                    INSERT INTO Product_Images (product_id, image_url, alt_text)
                    VALUES (?, ?, ?)
                `, [productId, image.image_url, image.alt_text]);
            }
        }

        await connection.commit();
        console.log("Transaction committed successfully");
        res.status(201).json({ message: "Product added successfully", productId });
    } catch (error) {
        await connection.rollback();
        console.error("Error during product creation:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        connection.release();
    }
};




// Update a product by ID
exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    const query = 'UPDATE Products SET ? WHERE product_id = ?';
    db.query(query, [updateData, productId], (error, results) => {
        if (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!results.affectedRows) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated' });
    });
};

// Delete a product by ID
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;

    const query = 'DELETE FROM Products WHERE product_id = ?';
    db.query(query, [productId], (error, results) => {
        if (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!results.affectedRows) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    });
};

exports.allVariantsOfProductId = (req, res) => {
    const { product_id } = req.params;

    const query = `
        SELECT 
            variant_id, 
            product_id, 
            weight_grams, 
            price, 
            stock, 
            sku
        FROM 
            Product_Variant
        WHERE 
            product_id = ?
    `;

    db.query(query, [product_id], (error, results) => {
        if (error) {
            console.error('Error retrieving variants:', error.message);
            return res.status(500).json({ 
                error: 'Failed to retrieve variants. Please try again later.',
                details: error.message 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                error: 'No variants found for the specified product.'
            });
        }

        res.json({
            product_id,
            variants: results,
        });
    });
};

exports.getProductDetails = (req, res) => {
    const { product_id } = req.params;

    const query = `
        SELECT p.*, COALESCE(p.average_rating, 0) AS average_rating
        FROM Products p
        WHERE p.product_id = ?
    `;

    db.query(query, [product_id], (err, results) => {
        if (err) {
            console.error("Error fetching product details:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(results[0]);
    });
};

// List all categories
exports.listCategories = (req, res) => {
    const query = "SELECT category_id, name FROM Categories";

    db.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching categories:", error.message);
            return res.status(500).json({ error: "Failed to fetch categories" });
        }
        res.status(200).json(results);
    });
};



// Retrieve product details by variant ID
exports.getProductByVariantId = (req, res) => {
    const variantId = req.params.variant_id;

    const productQuery = `
        SELECT 
            p.product_id,
            p.name, 
            p.origin, 
            p.roast_level, 
            p.bean_type, 
            p.grind_type, 
            p.flavor_profile, 
            p.processing_method, 
            p.caffeine_content, 
            p.description, 
            pv.variant_id, 
            pv.weight_grams, 
            pv.price, 
            pv.stock, 
            pv.sku 
        FROM 
            Products p 
        JOIN 
            Product_Variant pv ON p.product_id = pv.product_id 
        WHERE 
            pv.variant_id = ?;
    `;

    const imagesQuery = `
        SELECT image_url, alt_text FROM Product_Images WHERE product_id = ?;
    `;

    db.query(productQuery, [variantId], (error, results) => {
        if (error) {
            console.error('Error retrieving product details:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const product = results[0];

        db.query(imagesQuery, [product.product_id], (imgError, imgResults) => {
            if (imgError) {
                console.error('Error retrieving product images:', imgError);
                return res.status(500).json({ error: 'Internal server error' });
            }
            product.images = imgResults.map(img => ({
                url: img.image_url,
                alt: img.alt_text
            }));
            res.json(product);
        });
    });
};
