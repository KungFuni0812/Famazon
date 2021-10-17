DROP DATABASE IF EXISTS famazon_db;

CREATE DATABASE famazon_db;

USE famazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NULL,
    department_name VARCHAR(255) NULL,
    price DECIMAL(45,2) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES  ("crossbody bag", "accessories", 49.99, 50), 
        ("workout legging", "clothing", 29.99, 150), 
        ("head phone", "electronics", 59.99, 100), 
        ("sneaker", "footwear", 79.99, 150), 
        ("blender", "appliance", 99.99, 50), 
        ("vitamin", "pharmacy", 6.99, 200), 
        ("protein powder", "health", 20.99, 200), 
        ("treadmill", "fitness", 599.99, 20), 
        ("tumbler", "houseware", 19.99, 200), 
        ("leash", "pets", 19.99, 50);

