USE ecommerce_db;

-- Note: Passwords are all 'password'
INSERT INTO Users (user_id, first_name, last_name, email, phone_number, tax_id, password_hash)
VALUES
(1, 'Arya', 'Hassibi', 'arya@user.com', '+905301234567', '12345678901', SHA2('password', 256)),
(2, 'Beste', 'Bayhan', 'beste@user.com', '+905302345678', '23456789012', SHA2('password', 256)),
(3, 'Mustafa', 'Topcu', 'mustafa@user.com', '+905303456789', '34567890123', SHA2('password', 256)),
(4, 'Orhun Ege', 'Ozpay', 'orhun@user.com', '+905304567890', '45678901234', SHA2('password', 256)),
(5, 'Eid', 'Alhamali', 'eid@user.com', '+905305678901', '56789012345', SHA2('password', 256)),
(6, 'Ecem', 'Akın', 'ecem@user.com', '+905306789012', '67890123456', SHA2('password', 256)),
(7, 'Zeynep', 'Işık', 'zeynep.isik@user.com', '+905307890123', '78901234567', SHA2('password', 256)),
(8, 'Cemal', 'Yılmaz', 'cemal.yilmaz@user.com', '+905308901234', '89012345678', SHA2('password', 256));
(9, 'Test', 'User', 'test@user.com', '+905309012345', '90123456789', SHA2('password', 256));

-- Note: Passwords are all 'password'
INSERT INTO Managers (manager_id, first_name, last_name, email, password_hash, role)
VALUES
(1, 'Arya', 'Hassibi', 'arya@manager.com', UNHEX(SHA2('password', 256)), 'sales_manager'),
(2, 'Beste', 'Bayhan', 'beste@manager.com', UNHEX(SHA2('password', 256)), 'product_manager'),
(3, 'Mustafa', 'Topcu', 'mustafa@manager.com', UNHEX(SHA2('password', 256)), 'sales_manager'),
(4, 'Orhun', 'Ege Ozpay', 'orhun@manager.com', UNHEX(SHA2('password', 256)), 'product_manager'),
(5, 'Eid', 'Alhamali', 'eid@manager.com', UNHEX(SHA2('password', 256)), 'sales_manager'),
(6, 'Ecem', 'Akın', 'ecem@manager.com', UNHEX(SHA2('password', 256)), 'product_manager');
(7, 'Zeynep', 'Işık', 'zeynep@manager.com', UNHEX(SHA2('password', 256)), 'product_manager');
(8, 'Cemal', 'Yılmaz', 'cemal@manager.com', UNHEX(SHA2('password', 256)), 'product_manager');
(9, 'Sales', 'Manager', 'sales@manager.com', UNHEX(SHA2('password', 256)), 'sales_manager');
(10, 'Product', 'Manager', 'product@manager.com', UNHEX(SHA2('password', 256)), 'product_manager');

-- Insert sample data into Categories
INSERT INTO Categories (category_id, name, description)
VALUES
(1, 'Coffee Beans', "Quality coffee beans, thats all we care about.");

-- Insert sample data into DeliveryOptions
INSERT INTO DeliveryOptions (delivery_option_id, name, cost, description)
VALUES
(1, 'Standard Shipping', 5.99, 'Delivery in 5-7 business days.'),
(2, 'Express Shipping', 9.99, 'Delivery in 2-3 business days.'),
(3, 'Overnight Shipping', 19.99, 'Next business day delivery.');

-- Insert sample data into Products
INSERT INTO Products (product_id, name, origin, roast_level, bean_type, grind_type, flavor_profile, processing_method, caffeine_content, category_id, description, warranty_status, distributor_info)
VALUES
(1, 'Ethiopian Yirgacheffe', 'Ethiopia', 'Light', 'Arabica', 'Whole Bean', 'Floral and citrus notes', 'Washed', 'High', 1, 'A delicate and aromatic coffee with vibrant flavors.', FALSE, 'Ethiopian Distributors Ltd.', 4.5),
(2, 'Colombian Supremo', 'Colombia', 'Medium', 'Arabica', 'Ground', 'Chocolate and nutty', 'Natural', 'High', 1, 'Rich and smooth with a balanced flavor profile.', TRUE, 'Colombian Coffee Co.', 4.2),
(3, 'Brazilian Santos', 'Brazil', 'Dark', 'Robusta', 'Pods', 'Bold and strong', 'Washed', 'High', 1, 'Strong and full-bodied coffee ideal for espresso.', FALSE, 'Brazilian Beans Inc.', 4.0),
(4, 'Kenyan AA', 'Kenya', 'Medium', 'Arabica', 'Whole Bean', 'Berry and winey', 'Honey-processed', 'High', 1, 'Bright acidity with fruity undertones.', TRUE, 'Kenyan Coffee Traders', 4.7),
(5, 'Sumatra Mandheling', 'Indonesia', 'Dark', 'Arabica', 'Ground', 'Earthy and spicy', 'Natural', 'High', 1, 'Complex flavors with a heavy body.', FALSE, 'Indo Beans Exporters', 4.3),
(6, 'Guatemalan Antigua', 'Guatemala', 'Medium', 'Arabica', 'Whole Bean', 'Chocolate and caramel', 'Washed', 'High', 1, 'Smooth and rich with a lingering finish.', TRUE, 'Guatemala Coffee Ltd.', 4.6),
(7, 'Costa Rican Tarrazu', 'Costa Rica', 'Light', 'Arabica', 'Pods', 'Citrus and honey', 'Washed', 'High', 1, 'Bright and clean with a sweet aroma.', FALSE, 'Costa Rica Coffee Co.', 4.4),
(8, 'Nicaraguan Segovia', 'Nicaragua', 'Medium', 'Arabica', 'Whole Bean', 'Nutty and sweet', 'Honey-processed', 'High', 1, 'Balanced and smooth with a pleasant sweetness.', TRUE, 'Nicaraguan Coffee Export', 4.1),
(9, 'Mexican Altura', 'Mexico', 'Light', 'Arabica', 'Ground', 'Floral and mild', 'Washed', 'High', 1, 'Mild and smooth with subtle floral notes.', FALSE, 'Mexican Beans Ltd.', 3.9),
(10, 'Honduran Marcala', 'Honduras', 'Medium', 'Arabica', 'Whole Bean', 'Sweet and fruity', 'Natural', 'High', 1, 'Sweet with a fruity acidity and a clean finish.', TRUE, 'Honduras Coffee Traders', 4.3),
(11, 'Peruvian Chanchamayo', 'Peru', 'Light', 'Arabica', 'Pods', 'Bright and floral', 'Washed', 'High', 1, 'Bright acidity with a floral and fruity profile.', FALSE, 'Peruvian Coffee Co.', 4.2),
(12, 'Tanzanian Peaberry', 'Tanzania', 'Medium', 'Arabica', 'Whole Bean', 'Citrus and berry', 'Honey-processed', 'High', 1, 'Unique peaberry beans with a vibrant flavor.', TRUE, 'Tanzanian Beans Export', 4.5),
(13, 'Papua New Guinea Sigri', 'Papua New Guinea', 'Dark', 'Arabica', 'Ground', 'Rich and malty', 'Natural', 'High', 1, 'Deep and malty with a rich aroma.', FALSE, 'Papua Coffee Ltd.', 4.0),
(14, 'Rwandan Bourbon', 'Rwanda', 'Medium', 'Arabica', 'Whole Bean', 'Sweet and fruity', 'Washed', 'High', 1, 'Sweet and fruity with a balanced acidity.', TRUE, 'Rwanda Coffee Traders', 4.4),
(15, 'El Salvador Pacamara', 'El Salvador', 'Light', 'Arabica', 'Pods', 'Floral and bright', 'Honey-processed', 'High', 1, 'Floral aromas with a bright and lively taste.', FALSE, 'El Salvador Beans Inc.', 4.1),
(16, 'Panama Geisha', 'Panama', 'Light', 'Arabica', 'Whole Bean', 'Jasmine and tropical fruit', 'Washed', 'High', 1, 'Exquisite Geisha with jasmine and tropical fruit notes.', TRUE, 'Panama Coffee Co.', 4.8),
(17, 'Vietnamese Robusta', 'Vietnam', 'Dark', 'Robusta', 'Ground', 'Strong and bitter', 'Washed', 'High', 1, 'Strong and bitter, perfect for instant coffee.', FALSE, 'Vietnam Coffee Export', 3.8),
(18, 'Indian Monsooned Malabar', 'India', 'Medium', 'Arabica', 'Whole Bean', 'Spicy and earthy', 'Other', 'High', 1, 'Unique monsooned process gives it a spicy earthy flavor.', TRUE, 'Indian Beans Ltd.', 4.2),
(19, 'Yemen Mocha', 'Yemen', 'Dark', 'Arabica', 'Pods', 'Chocolate and wine', 'Natural', 'High', 1, 'Historic Mocha with rich chocolate and wine flavors.', FALSE, 'Yemen Coffee Traders', 4.3),
(20, 'Laos Bolaven Plateau', 'Laos', 'Medium', 'Arabica', 'Whole Bean', 'Sweet and balanced', 'Washed', 'High', 1, 'Sweet and balanced with a smooth finish.', TRUE, 'Laos Coffee Export', 4.0);

-- Insert sample data into Product_Variant
INSERT INTO Product_Variant (variant_id, product_id, weight_grams, price, stock, sku)
VALUES
-- Product 1 Variants
(1, 1, 250, 500.00, 100, 'ETH-YIR-250'),
(2, 1, 500, 950.00, 50, 'ETH-YIR-500'),
(3, 1, 1000, 1800.00, 25, 'ETH-YIR-1000'),

-- Product 2 Variants
(4, 2, 250, 450.00, 200, 'COL-SUP-250'),
(5, 2, 500, 850.00, 80, 'COL-SUP-500'),

-- Product 3 Variants
(6, 3, 250, 600.00, 150, 'BRA-SAN-250'),

-- Product 4 Variants
(7, 4, 250, 550.00, 120, 'KEN-AA-250'),
(8, 4, 500, 1050.00, 60, 'KEN-AA-500'),

-- Product 5 Variants
(9, 5, 250, 580.00, 90, 'SUM-MAN-250'),
(10, 5, 500, 1100.00, 40, 'SUM-MAN-500'),
(11, 5, 1000, 2100.00, 10, 'SUM-MAN-1000'),

-- Product 6 Variants
(12, 6, 250, 520.00, 130, 'GUA-ANT-250'),
(13, 6, 500, 1000.00, 70, 'GUA-ANT-500'),

-- Product 7 Variants
(14, 7, 250, 480.00, 160, 'COS-TAR-250'),

-- Product 8 Variants
(15, 8, 250, 530.00, 110, 'NIC-SEG-250'),
(16, 8, 500, 1020.00, 55, 'NIC-SEG-500'),

-- Product 9 Variants
(17, 9, 250, 400.00, 200, 'MEX-ALT-250'),

-- Product 10 Variants
(18, 10, 250, 510.00, 140, 'HON-MAR-250'),
(19, 10, 500, 1000.00, 60, 'HON-MAR-500'),

-- Product 11 Variants
(20, 11, 250, 495.00, 130, 'PER-SIG-250'),

-- Product 12 Variants
(21, 12, 250, 575.00, 90, 'TAN-PEA-250'),
(22, 12, 500, 1150.00, 45, 'TAN-PEA-500'),
(23, 12, 1000, 2200.00, 20, 'TAN-PEA-1000'),

-- Product 13 Variants
(24, 13, 250, 610.00, 80, 'PNG-SIG-250'),

-- Product 14 Variants
(25, 14, 250, 540.00, 100, 'RWA-BUR-250'),
(26, 14, 500, 1080.00, 50, 'RWA-BUR-500'),

-- Product 15 Variants
(27, 15, 250, 505.00, 120, 'ELS-PAC-250'),

-- Product 16 Variants
(28, 16, 250, 700.00, 60, 'PAN-GEI-250'),
(29, 16, 500, 1350.00, 30, 'PAN-GEI-500'),
(30, 16, 1000, 2600.00, 15, 'PAN-GEI-1000'),

-- Product 17 Variants
(31, 17, 250, 380.00, 200, 'VIE-ROB-250'),

-- Product 18 Variants
(32, 18, 250, 550.00, 100, 'IND-MON-250'),

-- Product 19 Variants
(33, 19, 250, 620.00, 70, 'YEM-MOH-250'),
(34, 19, 500, 1200.00, 35, 'YEM-MOH-500'),

-- Product 20 Variants
(35, 20, 250, 500.00, 90, 'LAO-BOL-250'),
(36, 20, 500, 980.00, 40, 'LAO-BOL-500');

-- Insert sample data into Product_Images
INSERT INTO Product_Images (image_id, product_id, image_url, alt_text)
VALUES
(1, 1, '/assets/images/products/product1.png', 'Ethiopian Yirgacheffe 250g'),
(2, 1, '/assets/images/products/product1.png', 'Ethiopian Yirgacheffe 500g'),
(3, 1, '/assets/images/products/product1.png', 'Ethiopian Yirgacheffe 1000g'),

(4, 2, '/assets/images/products/product2.png', 'Colombian Supremo 250g'),
(5, 2, '/assets/images/products/product2.png', 'Colombian Supremo 500g'),

(6, 3, '/assets/images/products/product3.png', 'Brazilian Santos 250g'),

(7, 4, '/assets/images/products/product4.png', 'Kenyan AA 250g'),
(8, 4, '/assets/images/products/product4.png', 'Kenyan AA 500g'),

(9, 5, '/assets/images/products/product5.png', 'Sumatra Mandheling 250g'),
(10, 5, '/assets/images/products/product5.png', 'Sumatra Mandheling 500g'),
(11, 5, '/assets/images/products/product5.png', 'Sumatra Mandheling 1000g'),

(12, 6, '/assets/images/products/product6.png', 'Guatemalan Antigua 250g'),
(13, 6, '/assets/images/products/product6.png', 'Guatemalan Antigua 500g'),

(14, 7, '/assets/images/products/product7.png', 'Costa Rican Tarrazu 250g'),

(15, 8, '/assets/images/products/product8.png', 'Nicaraguan Segovia 250g'),
(16, 8, '/assets/images/products/product8.png', 'Nicaraguan Segovia 500g'),

(17, 9, '/assets/images/products/product9.png', 'Mexican Altura 250g'),

(18, 10, '/assets/images/products/product10.png', 'Honduran Marcala 250g'),
(19, 10, '/assets/images/products/product10.png', 'Honduran Marcala 500g'),

(20, 11, '/assets/images/products/product11.png', 'Peruvian Chanchamayo 250g'),

(21, 12, '/assets/images/products/product12.png', 'Tanzanian Peaberry 250g'),
(22, 12, '/assets/images/products/product12.png', 'Tanzanian Peaberry 500g'),
(23, 12, '/assets/images/products/product12.png', 'Tanzanian Peaberry 1000g'),

(24, 13, '/assets/images/products/product13.png', 'Papua New Guinea Sigri 250g'),

(25, 14, '/assets/images/products/product14.png', 'Rwandan Bourbon 250g'),
(26, 14, '/assets/images/products/product14.png', 'Rwandan Bourbon 500g'),

(27, 15, '/assets/images/products/product15.png', 'El Salvador Pacamara 250g'),

(28, 16, '/assets/images/products/product16.png', 'Panama Geisha 250g'),
(29, 16, '/assets/images/products/product16.png', 'Panama Geisha 500g'),
(30, 16, '/assets/images/products/product16.png', 'Panama Geisha 1000g'),

(31, 17, '/assets/images/products/product17.png', 'Vietnamese Robusta 250g'),

(32, 18, '/assets/images/products/product18.png', 'Indian Monsooned Malabar 250g'),

(33, 19, '/assets/images/products/product19.png', 'Yemen Mocha 250g'),
(34, 19, '/assets/images/products/product19.png', 'Yemen Mocha 500g'),

(35, 20, '/assets/images/products/product20.png', 'Laos Bolaven Plateau 250g'),
(36, 20, '/assets/images/products/product20.png', 'Laos Bolaven Plateau 500g');


-- Insert sample data into Address
INSERT INTO Address (address_id, user_id, address_line, city, state, postal_code, country)
VALUES
(1, 1, '123 Main Street', 'Anytown', 'Anystate', '12345', 'USA'),
(2, 2, '456 Elm Street', 'Othertown', 'Otherstate', '67890', 'USA'),
(3, 3, '789 Oak Avenue', 'Sometown', 'Somestate', '11223', 'USA');

-- Insert sample data into ShoppingCart
INSERT INTO ShoppingCart (cart_id, user_id, session_id)
VALUES
(1, 1, 'session_abc123'),
(2, 2, 'session_def456'),
(3, NULL, 'session_guest789'); -- Guest user

-- Insert sample data into ShoppingCartItems
INSERT INTO ShoppingCartItems (cart_item_id, cart_id, variant_id, quantity)
VALUES
(1, 1, 1, 2), -- John has 2x 250g Colombian
(2, 1, 3, 1), -- John has 1x 250g Espresso
(3, 2, 5, 3), -- Jane has 3x 250g Ethiopian Decaf
(4, 3, 2, 4); -- Guest has 4x 500g Colombians

-- Insert sample data into Comments
INSERT INTO Comments (comment_id, product_id, user_id, rating, content, approved)
VALUES
(1, 1, 1, 5, 'Absolutely love this coffee! Smooth and flavorful.', TRUE),
(2, 2, 2, 4, 'Great espresso blend, rich and bold.', TRUE),
(3, 3, 3, 3, 'Decent decaf coffee, but a bit too light for my taste.', TRUE);

-- Insert sample data into Orders
INSERT INTO Orders (order_id, user_id, total_price, status, delivery_option_id)
VALUES
(1, 1, 29.98, 'processing', 1),
(2, 2, 12.99, 'in-transit', 2),
(3, 3, 15.99, 'delivered', 1);

-- Insert sample data into OrderItems
INSERT INTO OrderItems (order_item_id, order_id, product_id, quantity, price_at_purchase)
VALUES
(1, 1, 1, 2, 14.99),
(2, 2, 2, 1, 12.99),
(3, 3, 3, 1, 15.99);

-- Insert sample data into Payments
INSERT INTO Payments (payment_id, order_id, user_id, amount, card_holder_name, card_number, card_expiration, cvv)
VALUES
(1, 1, 1, 29.98, 'John Doe', AES_ENCRYPT('4111111111111111', 'secretkey'), '2025-12-31', AES_ENCRYPT('123', 'secretkey')),
(2, 2, 2, 12.99, 'Jane Smith', AES_ENCRYPT('5555555555554444', 'secretkey'), '2024-10-31', AES_ENCRYPT('456', 'secretkey')),
(3, 3, 3, 15.99, 'Alice Johnson', AES_ENCRYPT('378282246310005', 'secretkey'), '2026-06-30', AES_ENCRYPT('789', 'secretkey'));

-- Insert sample data into RefundRequests
INSERT INTO RefundRequests (refund_request_id, order_id, user_id, status, notes)
VALUES
(1, 2, 2, 'pending', 'Product did not meet expectations.');

-- Insert sample data into ReturnItems
INSERT INTO ReturnItems (return_item_id, refund_request_id, product_id, quantity, price_at_purchase, reason)
VALUES
(1, 1, 2, 1, 12.99, 'Did not like the taste.');

-- Insert sample data into Invoices
INSERT INTO Invoices (invoice_id, order_id, user_id, invoice_pdf)
VALUES
(1, 1, 1, NULL),
(2, 2, 2, NULL),
(3, 3, 3, NULL);

-- Insert sample data into Discounts
INSERT INTO Discounts (discount_id, discount_type, value, start_date, end_date, category_id, active)
VALUES
(1, 'percentage', 10.00, '2023-01-01', '2023-12-31', 2, TRUE),
(2, 'fixed', 2.00, '2023-06-01', '2023-12-31', 3, TRUE);

-- Insert sample data into Wishlist
INSERT INTO Wishlist (wishlist_id, user_id, product_id)
VALUES
(1, 1, 3),
(2, 2, 1),
(3, 2, 2),
(4, 3, 1);

-- If the WishlistItems table is needed, insert sample data (assuming the schema is correct)
INSERT INTO WishlistItems (wishlist_item_id, wishlist_id, product_id)
VALUES
(1, 1, 3),
(2, 2, 1),
(3, 3, 2),
(4, 4, 1);