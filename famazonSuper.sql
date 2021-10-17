USE famazon_db;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(255) NULL UNIQUE,
    over_head_costs DECIMAL(45,2) NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs) 
VALUES  ("accessories", 1499), 
        ("clothing", 2498), 
        ("electronics", 4000), 
        ("footwear", 7998), 
        ("appliance", 3995), 
        ("pharmacy", 400), 
        ("health", 1200), 
        ("fitness", 8000), 
        ("houseware", 1950), 
        ("pets", 300),
        ("outdoor", 1500),
        ("household", 140);