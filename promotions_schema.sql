-- 10. Actualización de productos para Novedades y Ofertas
alter table products 
add column is_new boolean default false,
add column is_on_sale boolean default false,
add column sale_price decimal(12,2);
