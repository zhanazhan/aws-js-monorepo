-- Create User table
CREATE TABLE Users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Insert sample data
INSERT INTO Users (id, name, email, password)
VALUES
    ('1', 'John Doe', 'john@example.com', 'password123'),
    ('2', 'Jane Smith', 'jane@example.com', 'pass456'),
    ('3', 'Bob Johnson', NULL, 'securepass');
