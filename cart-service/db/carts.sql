-- Create Product table
CREATE TABLE Products (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample data into Product table
INSERT INTO Products (id, title, description, price)
VALUES
    ('1', 'Product A', 'Description for Product A', 19.99),
    ('2', 'Product B', 'Description for Product B', 29.99),
    ('3', 'Product C', 'Description for Product C', 39.99);

-- Create CartItem table
CREATE TABLE CartItems (
    cart_id VARCHAR(36),
    product_id VARCHAR(36),
    count INT NOT NULL,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Insert sample data into CartItem table
INSERT INTO CartItems (cart_id, product_id, count)
VALUES
    ('1', '1', 2),
    ('1', '2', 1),
    ('2', '3', 3);
    ('3', '1', 1);
    ('3', '2', 1);
    ('3', '3', 1);

-- Create Carts table
CREATE TABLE Carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    status ENUM ('OPEN', 'ORDERED') NOT NULL
);

-- Insert sample data into Carts table
INSERT INTO Carts (id, user_id, created_at, updated_at, status)
VALUES
    ('1', '3', '2023-01-01 12:00:00', '2023-01-01 12:30:00', 'OPEN'),
    ('2', '1', '2023-01-02 14:00:00', '2023-01-02 14:15:00', 'ORDERED');
    ('3', '2', '2023-01-02 14:00:00', '2023-01-02 14:15:00', 'ORDERED');
