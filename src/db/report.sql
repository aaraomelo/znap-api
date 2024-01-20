-- 

SELECT
  c.id as client_id,
  c.name as client_name,
  COUNT(o.id) as total_orders,
  SUM(oi.quantity) as total_ordered_quantity,
  SUM((oi.quantity * p.price) * (1 - oi.discount_percentage / 100) * (1 + oi.tax_percentage / 100)) as total_order_value,
  AVG(p.price * (1 - oi.discount_percentage / 100) * (1 + oi.tax_percentage / 100)) as average_order_price
FROM
  clients c
LEFT JOIN
  orders_master o ON c.id = o.client_id
LEFT JOIN
  order_items oi ON o.id = oi.order_master_id
LEFT JOIN
  products p ON oi.product_id = p.id
GROUP BY
  c.id, c.name;

-- 

SELECT
  p.id as product_id,
  p.name as product_name,
  SUM(oi.quantity) as total_ordered_quantity,
  SUM((oi.quantity * p.price) * (1 - oi.discount_percentage / 100) * (1 + oi.tax_percentage / 100)) as total_order_value,
  AVG(p.price * (1 - oi.discount_percentage / 100) * (1 + oi.tax_percentage / 100)) as average_order_price
FROM
  products p
LEFT JOIN
  order_items oi ON p.id = oi.product_id
GROUP BY
  p.id, p.name;

-- 

SELECT
  c.id as client_id,
  c.name as client_name,
  p.id as product_id,
  p.name as product_name,
  SUM(oi.quantity) as total_ordered_quantity,
  SUM((oi.quantity * p.price) * (1 - oi.discount_percentage / 100) * (1 + oi.tax_percentage / 100)) as total_order_value,
  AVG(p.price * (1 - oi.discount_percentage / 100) * (1 + oi.tax_percentage / 100)) as average_order_price
FROM
  clients c
CROSS JOIN
  products p
LEFT JOIN
  orders_master o ON c.id = o.client_id
LEFT JOIN
  order_items oi ON o.id = oi.order_master_id AND p.id = oi.product_id
GROUP BY
  c.id, c.name, p.id, p.name
HAVING
  total_ordered_quantity IS NOT NULL;