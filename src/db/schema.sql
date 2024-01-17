CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `price` INT NOT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `category_id` (`category_id`),
  FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`) ON DELETE CASCADE
);

CREATE TABLE `product_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (`id`)
);

CREATE TABLE `clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone_number` VARCHAR(20),
  PRIMARY KEY (`id`)
);

CREATE TABLE `orders_master` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `order_number` INT NOT NULL,
  `client_id` INT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `client_id` (`client_id`),
  FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE
);

CREATE TABLE `order_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_master_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` FLOAT NOT NULL,
  `discount_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
  `tax_amount` DECIMAL(8, 2) NOT NULL DEFAULT 0.0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `order_master_id` (`order_master_id`),
  INDEX `product_id` (`product_id`),
  FOREIGN KEY (`order_master_id`) REFERENCES `order_master` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
);