-- ESQUEMA DE BASE DE DATOS PARA TIENDA DE ROPA ONLINE
-- Basado en el MER proporcionado
-- Compatible con Supabase (PostgreSQL)

-- Habilitar la extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUMS Y TIPOS PERSONALIZADOS
-- ==========================================

DO $$ BEGIN
    CREATE TYPE tipo_movimiento_env AS ENUM ('entrada', 'salida', 'ajuste', 'devolucion', 'transferencia');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_pedido_env AS ENUM ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_pago_env AS ENUM ('pendiente', 'aprobado', 'rechazado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 2. TABLAS DE USUARIO Y DIRECCIÓN
-- ==========================================

-- Tabla CLIENTE (Extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    password_hash TEXT, -- Generalmente manejado por Supabase Auth, pero incluido por el MER
    role TEXT DEFAULT 'cliente', -- 'cliente' o 'admin'
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado TEXT DEFAULT 'activo'
);

-- Tabla DIRECCION
CREATE TABLE IF NOT EXISTS direccion (
    id_direccion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_cliente UUID NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    alias TEXT, -- Ej: 'Casa', 'Trabajo'
    nombre_destinatario TEXT NOT NULL,
    direccion_linea1 TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    estado_provincia TEXT NOT NULL,
    codigo_postal TEXT,
    pais TEXT DEFAULT 'Chile',
    es_principal BOOLEAN DEFAULT false
);

-- ==========================================
-- 3. CATÁLOGO DE PRODUCTOS
-- ==========================================

-- Tabla CATEGORIA
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    id_parent UUID REFERENCES categoria(id_categoria) ON DELETE SET NULL,
    descripcion TEXT,
    imagen_url TEXT,
    estado TEXT DEFAULT 'activo'
);

-- Tabla COLOR
CREATE TABLE IF NOT EXISTS color (
    id_color UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    codigo_hex TEXT NOT NULL
);

-- Tabla PRODUCTO
CREATE TABLE IF NOT EXISTS producto (
    id_producto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_categoria UUID REFERENCES categoria(id_categoria) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    material TEXT,
    genero TEXT, -- Ej: 'Hombre', 'Mujer', 'Unisex'
    marca TEXT,
    estado TEXT DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla IMAGEN_PRODUCTO
CREATE TABLE IF NOT EXISTS imagen_producto (
    id_imagen UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_producto UUID NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
    url_imagen TEXT NOT NULL,
    es_principal BOOLEAN DEFAULT false,
    orden INTEGER DEFAULT 0
);

-- Tabla VARIANTE_PRODUCTO
CREATE TABLE IF NOT EXISTS variante_producto (
    id_variante UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_producto UUID NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
    id_color UUID REFERENCES color(id_color) ON DELETE SET NULL,
    talla TEXT NOT NULL, -- Ej: 'S', 'M', 'L', '38', '40'
    sku TEXT UNIQUE NOT NULL,
    codigo_barras TEXT UNIQUE,
    precio NUMERIC(12, 2) NOT NULL DEFAULT 0,
    precio_descuento NUMERIC(12, 2) DEFAULT 0,
    estado TEXT DEFAULT 'activo'
);

-- ==========================================
-- 4. INVENTARIO
-- ==========================================

-- Tabla INVENTARIO
CREATE TABLE IF NOT EXISTS inventario (
    id_inventario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_variante UUID UNIQUE NOT NULL REFERENCES variante_producto(id_variante) ON DELETE CASCADE,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla MOVIMIENTO_INVENTARIO
CREATE TABLE IF NOT EXISTS movimiento_inventario (
    id_movimiento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_inventario UUID NOT NULL REFERENCES inventario(id_inventario) ON DELETE CASCADE,
    tipo_movimiento tipo_movimiento_env NOT NULL,
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    referencia_id UUID, -- Puede ser id_pedido si es una venta
    referencia_tipo TEXT, -- Ej: 'pedido', 'ajuste_manual'
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usuario_id UUID REFERENCES auth.users(id) -- Quién realizó el movimiento
);

-- ==========================================
-- 5. CARRITO DE COMPRAS
-- ==========================================

-- Tabla CARRITO
CREATE TABLE IF NOT EXISTS carrito (
    id_carrito UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_cliente UUID NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado TEXT DEFAULT 'activo'
);

-- Tabla DETALLE_CARRITO
CREATE TABLE IF NOT EXISTS detalle_carrito (
    id_detalle_carrito UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_carrito UUID NOT NULL REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    id_variante UUID NOT NULL REFERENCES variante_producto(id_variante) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(12, 2) NOT NULL
);

-- ==========================================
-- 6. PEDIDOS Y VENTAS
-- ==========================================

-- Tabla PEDIDO
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_cliente UUID NOT NULL REFERENCES cliente(id_cliente) ON DELETE SET NULL,
    id_direccion_envio UUID REFERENCES direccion(id_direccion) ON DELETE SET NULL,
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado estado_pedido_env DEFAULT 'pendiente',
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    notas TEXT
);

-- Tabla DETALLE_PEDIDO
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle_pedido UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pedido UUID NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_variante UUID NOT NULL REFERENCES variante_producto(id_variante) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(12, 2) NOT NULL,
    descuento NUMERIC(12, 2) DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- Tabla PAGO
CREATE TABLE IF NOT EXISTS pago (
    id_pago UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pedido UUID NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    metodo_pago TEXT NOT NULL, -- 'tarjeta', 'transferencia', 'webpay'
    monto NUMERIC(12, 2) NOT NULL,
    moneda TEXT DEFAULT 'CLP',
    estado estado_pago_env DEFAULT 'pendiente',
    fecha_pago TIMESTAMP WITH TIME ZONE,
    referencia_pago TEXT -- ID de transacción externa
);

-- Tabla ENVIO
CREATE TABLE IF NOT EXISTS envio (
    id_envio UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pedido UUID UNIQUE NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    paqueteria TEXT, -- Ej: 'Starken', 'Chilexpress'
    numero_guia TEXT,
    costo_envio NUMERIC(12, 2) DEFAULT 0,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    fecha_entrega_estimada TIMESTAMP WITH TIME ZONE,
    fecha_entrega_real TIMESTAMP WITH TIME ZONE,
    estado TEXT DEFAULT 'en_proceso'
);

-- ==========================================
-- 7. SEGURIDAD (ROW LEVEL SECURITY)
-- ==========================================

ALTER TABLE cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE direccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE color ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagen_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE variante_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimiento_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_carrito ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE envio ENABLE ROW LEVEL SECURITY;

-- Políticas Básicas (Clientes)
CREATE POLICY "Clientes pueden ver sus propios datos" ON cliente FOR SELECT USING (auth.uid() = id_cliente);
CREATE POLICY "Clientes pueden ver sus propias direcciones" ON direccion FOR ALL USING (auth.uid() = id_cliente);
CREATE POLICY "Clientes pueden ver sus carritos" ON carrito FOR ALL USING (auth.uid() = id_cliente);
CREATE POLICY "Clientes pueden ver sus pedidos" ON pedido FOR SELECT USING (auth.uid() = id_cliente);

-- Políticas de Administrador (Acceso total)
CREATE POLICY "Admins gestionan todo en cliente" ON cliente FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gestionan todo en pedido" ON pedido FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gestionan todo en producto" ON producto FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gestionan todo en variante_producto" ON variante_producto FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gestionan todo en inventario" ON inventario FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gestionan todo en movimiento_inventario" ON movimiento_inventario FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gestionan todo en envio" ON envio FOR ALL USING (
  EXISTS (SELECT 1 FROM cliente WHERE id_cliente = auth.uid() AND role = 'admin')
);

-- Políticas Básicas (Público/Solo lectura)
CREATE POLICY "Público puede ver categorías" ON categoria FOR SELECT USING (true);
CREATE POLICY "Público puede ver productos" ON producto FOR SELECT USING (estado = 'activo');
CREATE POLICY "Público puede ver variantes" ON variante_producto FOR SELECT USING (estado = 'activo');
CREATE POLICY "Público puede ver imágenes" ON imagen_producto FOR SELECT USING (true);

-- ==========================================
-- 8. TRIGGERS Y AUTOMATIZACIÓN
-- ==========================================

-- Trigger para actualizar stock_actual en INVENTARIO al insertar en MOVIMIENTO_INVENTARIO
CREATE OR REPLACE FUNCTION actualizar_stock_inventario()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.tipo_movimiento = 'entrada' OR NEW.tipo_movimiento = 'devolucion') THEN
        UPDATE inventario 
        SET stock_actual = stock_actual + NEW.cantidad,
            ultima_actualizacion = NOW()
        WHERE id_inventario = NEW.id_inventario;
    ELSIF (NEW.tipo_movimiento = 'salida') THEN
        UPDATE inventario 
        SET stock_actual = stock_actual - NEW.cantidad,
            ultima_actualizacion = NOW()
        WHERE id_inventario = NEW.id_inventario;
    ELSIF (NEW.tipo_movimiento = 'ajuste') THEN
        -- En ajuste, la cantidad podría ser el nuevo stock total o un diferencial
        -- Aquí asumimos que cantidad es el diferencial (positivo suma, negativo resta)
        UPDATE inventario 
        SET stock_actual = stock_actual + NEW.cantidad,
            ultima_actualizacion = NOW()
        WHERE id_inventario = NEW.id_inventario;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON movimiento_inventario
FOR EACH ROW EXECUTE FUNCTION actualizar_stock_inventario();

-- Vista para Alertas de Stock Bajo
CREATE OR REPLACE VIEW vista_alertas_stock AS
SELECT 
    p.nombre AS producto_nombre,
    vp.talla,
    c.nombre AS color_nombre,
    i.stock_actual,
    i.stock_minimo,
    vp.sku
FROM inventario i
JOIN variante_producto vp ON i.id_variante = vp.id_variante
JOIN producto p ON vp.id_producto = p.id_producto
JOIN color c ON vp.id_color = c.id_color
WHERE i.stock_actual <= i.stock_minimo;

-- Trigger para crear cliente automáticamente al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.cliente (id_cliente, nombre, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar el trigger para vincular auth.users con la tabla cliente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 9. ÍNDICES RECOMENDADOS
-- ==========================================

CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_variante_producto ON variante_producto(id_producto);
CREATE INDEX idx_inventario_variante ON inventario(id_variante);
CREATE INDEX idx_pedido_cliente ON pedido(id_cliente);
CREATE INDEX idx_movimiento_fecha ON movimiento_inventario(fecha_movimiento);
