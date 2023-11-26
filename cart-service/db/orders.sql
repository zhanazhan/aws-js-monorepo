-- Create Orders table
CREATE TABLE Orders (
    id UUID PRIMARY KEY,
    user_id UUID,
    cart_id UUID REFERENCES Carts(id),
    payment JSON,
    delivery JSON,
    comments TEXT,
    status ENUM ('PROCESSING', 'FULFILLED', 'DELIVERED') NOT NULL DEFAULT 'PROCESSING',
    total NUMERIC(10, 2)
);

-- Insert sample data into Orders table
INSERT INTO Orders (id, user_id, cart_id, payment, delivery, comments, status, total)
VALUES
    ('1', '3', '1', '{"method": "credit_card"}', '{"address": "123 Main St"}', 'Special instructions for the delivery', 'PROCESSING', 59.99),
    ('2', '1', '2', '{"method": "paypal"}', '{"address": "456 Oak St"}', 'No special instructions', 'DELIVERED', 79.99);
    ('3', '2', '3', '{"method": "paypal"}', '{"address": "456 Oak St"}', 'No special instructions', 'DELIVERED', 79.99);
