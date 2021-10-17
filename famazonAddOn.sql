USE famazon_db;

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(45,2) NULL;
