-- Modificar la tabla orders para agregar información logística
alter table orders
add column if not exists shipping_address text,
add column if not exists city text,
add column if not exists zip_code text,
add column if not exists shipping_cost numeric(10, 2) default 0,
add column if not exists shipping_status text check (shipping_status in ('procesando', 'enviado', 'entregado')) default 'procesando',
add column if not exists tracking_number text;
