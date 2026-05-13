-- SCRIPT DE DATOS DE PRUEBA (SEED) PARA LUNA BOUTIQUE
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Insertar Categorías
INSERT INTO categoria (nombre, descripcion, imagen_url) VALUES
('Alta Costura', 'Diseños exclusivos confeccionados a mano para eventos galácticos.', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800'),
('Esenciales', 'Piezas básicas con la calidad suprema de Luna Boutique.', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'),
('Accesorios', 'Detalles que iluminan tu estilo personal.', 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800');

-- 2. Insertar Colores
INSERT INTO color (nombre, codigo_hex) VALUES
('Midnight Black', '#09090b'),
('Astral Gold', '#eab308'),
('Nebula Pink', '#db2777'),
('Stardust White', '#f8fafc');

-- 3. Insertar Productos
INSERT INTO producto (nombre, descripcion, material, genero, marca, id_categoria) VALUES
('Vestido Eclipse', 'Un vestido de noche que captura la esencia de un eclipse total. Corte asimétrico y tela de seda.', 'Seda Italiana', 'Mujer', 'Luna Boutique', (SELECT id_categoria FROM categoria WHERE nombre = 'Alta Costura')),
('Chaqueta Galáctica', 'Estructura rígida con acabados brillantes que reflejan la luz estelar.', 'Cuero Vegano', 'Unisex', 'Luna Boutique', (SELECT id_categoria FROM categoria WHERE nombre = 'Esenciales')),
('Pantalón Órbita', 'Comodidad y elegancia en un diseño de caída fluida.', 'Lino Premium', 'Mujer', 'Luna Boutique', (SELECT id_categoria FROM categoria WHERE nombre = 'Esenciales')),
('Bolso Constelación', 'Pequeño bolso de mano con detalles en pedrería fina.', 'Seda y Cristales', 'Unisex', 'Luna Boutique', (SELECT id_categoria FROM categoria WHERE nombre = 'Accesorios'));

-- 4. Insertar Imágenes de Productos
INSERT INTO imagen_producto (id_producto, url_imagen, es_principal, orden)
SELECT id_producto, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800', true, 1 FROM producto WHERE nombre = 'Vestido Eclipse';
INSERT INTO imagen_producto (id_producto, url_imagen, es_principal, orden)
SELECT id_producto, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800', true, 1 FROM producto WHERE nombre = 'Chaqueta Galáctica';
INSERT INTO imagen_producto (id_producto, url_imagen, es_principal, orden)
SELECT id_producto, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800', true, 1 FROM producto WHERE nombre = 'Pantalón Órbita';
INSERT INTO imagen_producto (id_producto, url_imagen, es_principal, orden)
SELECT id_producto, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800', true, 1 FROM producto WHERE nombre = 'Bolso Constelación';

-- 5. Insertar Variantes de Producto
-- Vestido Eclipse (S, M, L en Midnight Black)
INSERT INTO variante_producto (id_producto, id_color, talla, sku, precio)
SELECT id_producto, (SELECT id_color FROM color WHERE nombre = 'Midnight Black'), 'S', 'VEST-ECL-BLK-S', 250000 FROM producto WHERE nombre = 'Vestido Eclipse';
INSERT INTO variante_producto (id_producto, id_color, talla, sku, precio)
SELECT id_producto, (SELECT id_color FROM color WHERE nombre = 'Midnight Black'), 'M', 'VEST-ECL-BLK-M', 250000 FROM producto WHERE nombre = 'Vestido Eclipse';
INSERT INTO variante_producto (id_producto, id_color, talla, sku, precio)
SELECT id_producto, (SELECT id_color FROM color WHERE nombre = 'Midnight Black'), 'L', 'VEST-ECL-BLK-L', 250000 FROM producto WHERE nombre = 'Vestido Eclipse';

-- Chaqueta Galáctica (M, L en Astral Gold)
INSERT INTO variante_producto (id_producto, id_color, talla, sku, precio, precio_descuento)
SELECT id_producto, (SELECT id_color FROM color WHERE nombre = 'Astral Gold'), 'M', 'CHAK-GAL-GLD-M', 180000, 150000 FROM producto WHERE nombre = 'Chaqueta Galáctica';
INSERT INTO variante_producto (id_producto, id_color, talla, sku, precio, precio_descuento)
SELECT id_producto, (SELECT id_color FROM color WHERE nombre = 'Astral Gold'), 'L', 'CHAK-GAL-GLD-L', 180000, 150000 FROM producto WHERE nombre = 'Chaqueta Galáctica';

-- 6. Inicializar Inventario (Esto debería estar vinculado a las variantes creadas arriba)
-- Como las variantes tienen UUIDs generados, usamos el SKU para identificarlas en este script manual
INSERT INTO inventario (id_variante, stock_actual, stock_minimo)
SELECT id_variante, 10, 2 FROM variante_producto WHERE sku = 'VEST-ECL-BLK-S';
INSERT INTO inventario (id_variante, stock_actual, stock_minimo)
SELECT id_variante, 15, 2 FROM variante_producto WHERE sku = 'VEST-ECL-BLK-M';
INSERT INTO inventario (id_variante, stock_actual, stock_minimo)
SELECT id_variante, 5, 2 FROM variante_producto WHERE sku = 'VEST-ECL-BLK-L';
INSERT INTO inventario (id_variante, stock_actual, stock_minimo)
SELECT id_variante, 8, 2 FROM variante_producto WHERE sku = 'CHAK-GAL-GLD-M';
INSERT INTO inventario (id_variante, stock_actual, stock_minimo)
SELECT id_variante, 0, 1 FROM variante_producto WHERE sku = 'CHAK-GAL-GLD-L'; -- Sin stock para pruebas
