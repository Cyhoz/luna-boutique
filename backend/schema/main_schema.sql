-- =============================================================================
--  CYHOZ'S PROJECT — DDL COMPLETO v2 (CORREGIDO)
--  Extraído y verificado desde Supabase (proyecto: kumnokagosnewhpgqruk)
--  Fecha corrección: 2026-05-16
--
--  CORRECCIONES APLICADAS vs versión anterior:
--  [1] handle_new_user: apuntaba a public.CLIENTE → corregido a public.USUARIO
--  [2] handle_new_user: mapeaba full_name → ahora acepta fullName|full_name|nombre
--  [3] handle_new_user: ahora persiste también el campo TELEFONO del formulario
--  [4] es_admin: consultaba public.CLIENTE/id_cliente → corregido a public.USUARIO/id_usuario
--  [5] Trigger on_auth_user_created + función handle_new_user incluidos en el DDL
--  [6] Función actualizar_stock_inventario incluida
--  Estas correcciones ya fueron aplicadas en producción.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONES
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ===========================================================================
-- 1. TIPOS ENUM
-- ===========================================================================

CREATE TYPE estado_pedido_env AS ENUM (
    'pendiente',
    'pagado',
    'enviado',
    'entregado',
    'cancelado'
);

CREATE TYPE estado_pago_env AS ENUM (
    'pendiente',
    'aprobado',
    'rechazado'
);

CREATE TYPE tipo_movimiento_env AS ENUM (
    'entrada',
    'salida',
    'ajuste',
    'devolucion',
    'transferencia'
);


-- ===========================================================================
-- 2. MÓDULO: USUARIOS & DIRECCIONES
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 2.1  usuario
--      PK: id_usuario  ← coincide con auth.users.id (UUID de Supabase Auth)
--      UNIQUE: email
--      Referenciada por: direccion, carrito, pedido, movimiento_inventario
--
--  ⚠️  IMPORTANTE PARA EL FRONTEND:
--      La tabla se llama USUARIO (no "cliente").
--      La PK se llama ID_USUARIO (no "id_cliente").
--      Todos los servicios/queries del frontend deben usar estos nombres.
-- -----------------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario      UUID          PRIMARY KEY,          -- = auth.users.id
    nombre          TEXT          NOT NULL,
    email           TEXT          NOT NULL UNIQUE,
    telefono        TEXT,
    password_hash   TEXT,
    fecha_registro  TIMESTAMPTZ   DEFAULT now(),
    estado          TEXT          DEFAULT 'activo',
    role            TEXT          DEFAULT 'cliente'     -- 'cliente' | 'admin'
);

ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes pueden ver sus propios datos"
    ON usuario FOR SELECT
    USING (auth.uid() = id_usuario);


-- -----------------------------------------------------------------------------
-- 2.2  direccion
--      PK: id_direccion
--      FK: id_usuario → usuario.id_usuario  (CASCADE DELETE)
-- -----------------------------------------------------------------------------
CREATE TABLE direccion (
    id_direccion        UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario          UUID        NOT NULL
                                    REFERENCES usuario(id_usuario)
                                        ON DELETE CASCADE,
    alias               TEXT,
    nombre_destinatario TEXT        NOT NULL,
    direccion_linea1    TEXT        NOT NULL,
    ciudad              TEXT        NOT NULL,
    estado_provincia    TEXT        NOT NULL,
    codigo_postal       TEXT,
    pais                TEXT        DEFAULT 'Chile',
    es_principal        BOOLEAN     DEFAULT FALSE
);

ALTER TABLE direccion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes pueden ver sus propias direcciones"
    ON direccion FOR ALL
    USING (auth.uid() = id_usuario);


-- ===========================================================================
-- 3. MÓDULO: CATÁLOGO DE PRODUCTOS
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 3.1  categoria  (auto-referencia para sub-categorías)
-- -----------------------------------------------------------------------------
CREATE TABLE categoria (
    id_categoria        UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre              TEXT    NOT NULL,
    id_categoria_padre  UUID    REFERENCES categoria(id_categoria) ON DELETE SET NULL,
    descripcion         TEXT,
    imagen_url          TEXT,
    estado              TEXT    DEFAULT 'activo'
);

ALTER TABLE categoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público puede ver categorías"
    ON categoria FOR SELECT USING (true);

CREATE POLICY "Solo admin puede insertar categorias"
    ON categoria FOR INSERT TO authenticated
    WITH CHECK (es_admin());


-- -----------------------------------------------------------------------------
-- 3.2  color
-- -----------------------------------------------------------------------------
CREATE TABLE color (
    id_color    UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre      TEXT    NOT NULL,
    codigo_hex  TEXT    NOT NULL
);

ALTER TABLE color ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admin puede insertar colores"
    ON color FOR INSERT TO authenticated
    WITH CHECK (es_admin());


-- -----------------------------------------------------------------------------
-- 3.3  producto
--      FK: id_categoria → categoria.id_categoria (SET NULL)
-- -----------------------------------------------------------------------------
CREATE TABLE producto (
    id_producto     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_categoria    UUID        REFERENCES categoria(id_categoria) ON DELETE SET NULL,
    nombre          TEXT        NOT NULL,
    descripcion     TEXT,
    material        TEXT,
    genero          TEXT,
    marca           TEXT,
    estado          TEXT        DEFAULT 'activo',
    fecha_creacion  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE producto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público puede ver productos"
    ON producto FOR SELECT
    USING (estado = 'activo');


-- -----------------------------------------------------------------------------
-- 3.4  variante_producto
--      FK: id_producto → producto    (CASCADE DELETE)
--      FK: id_color    → color       (SET NULL)
--      UNIQUE: sku, codigo_barras
-- -----------------------------------------------------------------------------
CREATE TABLE variante_producto (
    id_variante         UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_producto         UUID          NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
    id_color            UUID          REFERENCES color(id_color) ON DELETE SET NULL,
    talla               TEXT          NOT NULL,
    sku                 TEXT          NOT NULL UNIQUE,
    codigo_barras       TEXT          UNIQUE,
    precio              NUMERIC(12,2) NOT NULL DEFAULT 0,
    precio_descuento    NUMERIC(12,2) DEFAULT 0,
    estado              TEXT          DEFAULT 'activo'
);

ALTER TABLE variante_producto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público puede ver variantes"
    ON variante_producto FOR SELECT
    USING (estado = 'activo');

CREATE POLICY "Admins gestionan todo en variante_producto"
    ON variante_producto FOR ALL TO authenticated
    USING (es_admin());


-- -----------------------------------------------------------------------------
-- 3.5  imagen_producto
--      FK: id_producto → producto (CASCADE DELETE)
-- -----------------------------------------------------------------------------
CREATE TABLE imagen_producto (
    id_imagen       UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_producto     UUID        NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
    url_imagen      TEXT        NOT NULL,
    es_principal    BOOLEAN     DEFAULT FALSE,
    orden           INTEGER     DEFAULT 0
);

ALTER TABLE imagen_producto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público puede ver imágenes"
    ON imagen_producto FOR SELECT USING (true);


-- ===========================================================================
-- 4. MÓDULO: INVENTARIO
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 4.1  inventario
--      FK: id_variante → variante_producto (CASCADE DELETE)
--      UNIQUE id_variante → relación 1:1 con variante_producto
-- -----------------------------------------------------------------------------
CREATE TABLE inventario (
    id_inventario           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_variante             UUID        NOT NULL UNIQUE
                                        REFERENCES variante_producto(id_variante) ON DELETE CASCADE,
    stock_actual            INTEGER     NOT NULL DEFAULT 0,
    stock_minimo            INTEGER     NOT NULL DEFAULT 5,
    ultima_actualizacion    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gestionan todo en inventario"
    ON inventario FOR ALL TO authenticated
    USING (es_admin());


-- -----------------------------------------------------------------------------
-- 4.2  movimiento_inventario
--      FK: id_inventario → inventario  (CASCADE DELETE)
--      FK: id_usuario    → usuario     (SET NULL)
-- -----------------------------------------------------------------------------
CREATE TABLE movimiento_inventario (
    id_movimiento       UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_inventario       UUID                NOT NULL
                                            REFERENCES inventario(id_inventario) ON DELETE CASCADE,
    tipo_movimiento     tipo_movimiento_env NOT NULL,
    cantidad            INTEGER             NOT NULL,
    motivo              TEXT,
    referencia_id       UUID,
    referencia_tipo     TEXT,
    fecha_movimiento    TIMESTAMPTZ         DEFAULT now(),
    id_usuario          UUID                REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

ALTER TABLE movimiento_inventario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gestionan todo en movimiento_inventario"
    ON movimiento_inventario FOR ALL TO authenticated
    USING (es_admin());


-- ===========================================================================
-- 5. MÓDULO: CARRITO
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 5.1  carrito
--      FK: id_usuario → usuario (CASCADE DELETE)
-- -----------------------------------------------------------------------------
CREATE TABLE carrito (
    id_carrito      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario      UUID        NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    fecha_creacion  TIMESTAMPTZ DEFAULT now(),
    estado          TEXT        DEFAULT 'activo'
);

ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes pueden ver sus carritos"
    ON carrito FOR ALL
    USING (auth.uid() = id_usuario);


-- -----------------------------------------------------------------------------
-- 5.2  detalle_carrito
--      FK: id_carrito  → carrito           (CASCADE DELETE)
--      FK: id_variante → variante_producto (CASCADE DELETE)
-- -----------------------------------------------------------------------------
CREATE TABLE detalle_carrito (
    id_detalle_carrito  UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_carrito          UUID          NOT NULL REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    id_variante         UUID          NOT NULL REFERENCES variante_producto(id_variante) ON DELETE CASCADE,
    cantidad            INTEGER       NOT NULL DEFAULT 1,
    precio_unitario     NUMERIC(12,2) NOT NULL
);


-- ===========================================================================
-- 6. MÓDULO: PEDIDOS
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 6.1  pedido
--      FK: id_usuario         → usuario   (SET NULL)
--      FK: id_direccion_envio → direccion (SET NULL)
-- -----------------------------------------------------------------------------
CREATE TABLE pedido (
    id_pedido           UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario          UUID                REFERENCES usuario(id_usuario)   ON DELETE SET NULL,
    id_direccion_envio  UUID                REFERENCES direccion(id_direccion) ON DELETE SET NULL,
    fecha_pedido        TIMESTAMPTZ         DEFAULT now(),
    estado              estado_pedido_env   DEFAULT 'pendiente',
    total               NUMERIC(12,2)       NOT NULL DEFAULT 0,
    notas               TEXT
);

ALTER TABLE pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes pueden ver sus pedidos"
    ON pedido FOR SELECT
    USING (auth.uid() = id_usuario);


-- -----------------------------------------------------------------------------
-- 6.2  detalle_pedido
--      FK: id_pedido   → pedido            (CASCADE DELETE)
--      FK: id_variante → variante_producto (SET NULL)
-- -----------------------------------------------------------------------------
CREATE TABLE detalle_pedido (
    id_detalle_pedido   UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pedido           UUID          NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_variante         UUID          REFERENCES variante_producto(id_variante) ON DELETE SET NULL,
    cantidad            INTEGER       NOT NULL,
    precio_unitario     NUMERIC(12,2) NOT NULL,
    descuento           NUMERIC(12,2) DEFAULT 0,
    subtotal            NUMERIC(12,2) NOT NULL
);


-- ===========================================================================
-- 7. MÓDULO: PAGOS
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 7.1  medio_pago
-- -----------------------------------------------------------------------------
CREATE TABLE medio_pago (
    id_medio_pago   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          TEXT        NOT NULL,
    descripcion     TEXT,
    codigo_api      TEXT,
    estado          TEXT        DEFAULT 'activo',
    fecha_creacion  TIMESTAMPTZ DEFAULT now()
);


-- -----------------------------------------------------------------------------
-- 7.2  pago
--      FK: id_pedido     → pedido     (CASCADE DELETE)
--      FK: id_medio_pago → medio_pago (NO ACTION)
-- -----------------------------------------------------------------------------
CREATE TABLE pago (
    id_pago         UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pedido       UUID              NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    metodo_pago     TEXT              NOT NULL,
    monto           NUMERIC(12,2)     NOT NULL,
    moneda          TEXT              DEFAULT 'CLP',
    estado          estado_pago_env   DEFAULT 'pendiente',
    fecha_pago      TIMESTAMPTZ,
    referencia_pago TEXT,
    id_medio_pago   UUID              REFERENCES medio_pago(id_medio_pago) ON DELETE NO ACTION
);


-- ===========================================================================
-- 8. MÓDULO: ENVÍOS
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 8.1  tarifa_envio
-- -----------------------------------------------------------------------------
CREATE TABLE tarifa_envio (
    id_tarifa           SERIAL        PRIMARY KEY,
    paqueteria          VARCHAR(100)  NOT NULL,
    zona_destino        VARCHAR(100)  NOT NULL,
    precio_base         NUMERIC(10,2) NOT NULL,
    precio_por_kg_extra NUMERIC(10,2) DEFAULT 0.00,
    dias_min            INTEGER       NOT NULL,
    dias_max            INTEGER       NOT NULL,
    activo              BOOLEAN       DEFAULT TRUE,
    fecha_actualizacion TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tarifa_envio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de tarifas"
    ON tarifa_envio FOR SELECT USING (true);


-- -----------------------------------------------------------------------------
-- 8.2  envio
--      FK: id_pedido → pedido        (CASCADE DELETE)
--      FK: id_tarifa → tarifa_envio  (SET NULL)
--      UNIQUE id_pedido → relación 1:1 con pedido
-- -----------------------------------------------------------------------------
CREATE TABLE envio (
    id_envio                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pedido               UUID          NOT NULL UNIQUE
                                          REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    paqueteria              TEXT,
    numero_guia             TEXT,
    costo_total_envio       NUMERIC(12,2) DEFAULT 0,
    fecha_envio             TIMESTAMPTZ,
    fecha_entrega_estimada  TIMESTAMPTZ,
    fecha_entrega_real      TIMESTAMPTZ,
    estado                  TEXT          DEFAULT 'en_proceso',
    id_tarifa               INTEGER       REFERENCES tarifa_envio(id_tarifa) ON DELETE SET NULL,
    zona_destino            VARCHAR(100)  DEFAULT 'Sin especificar',
    modo_entrega            VARCHAR(50),
    peso_real_kg            NUMERIC(10,2),
    peso_volumetrico_kg     NUMERIC(10,2),
    costo_paqueteria        NUMERIC(10,2),
    costo_materiales        NUMERIC(10,2),
    costo_tiempo            NUMERIC(10,2),
    margen_aplicado         NUMERIC(10,2)
);

ALTER TABLE envio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gestionan todo en envio"
    ON envio FOR ALL TO authenticated
    USING (es_admin());


-- ===========================================================================
-- 9. FUNCIONES Y TRIGGERS
-- ===========================================================================

-- -----------------------------------------------------------------------------
-- 9.1  es_admin()
--      Usada en políticas RLS para restringir operaciones solo a admins.
--      CORREGIDA: antes consultaba public.CLIENTE/id_cliente
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.usuario
    WHERE id_usuario = auth.uid() AND role = 'admin'
  );
END;
$$;


-- -----------------------------------------------------------------------------
-- 9.2  handle_new_user()
--      Se dispara al crear un usuario en auth.users.
--      Inserta automáticamente una fila en public.usuario.
--
--      CORREGIDA:
--        - Antes insertaba en public.CLIENTE con id_CLIENTE
--        - Ahora inserta en public.USUARIO con id_USUARIO
--        - Acepta fullName (camelCase del form) o full_name o nombre
--        - Persiste telefono si el form lo envía en raw_user_meta_data
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuario (id_usuario, nombre, email, telefono)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'fullName',  ''),  -- camelCase del form React
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),  -- snake_case alternativo
      NULLIF(NEW.raw_user_meta_data->>'nombre',    ''),  -- español directo
      NEW.email                                           -- fallback: usa el email
    ),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'telefono', '')       -- opcional
  );
  RETURN NEW;
END;
$$;

-- El trigger ya existe en auth.users; se recrea por si acaso
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 9.3  actualizar_stock_inventario()
--      Ajusta stock_actual cuando se inserta un movimiento_inventario.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.actualizar_stock_inventario()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.tipo_movimiento IN ('entrada', 'devolucion') THEN
        UPDATE inventario
        SET stock_actual         = stock_actual + NEW.cantidad,
            ultima_actualizacion = NOW()
        WHERE id_inventario = NEW.id_inventario;

    ELSIF NEW.tipo_movimiento = 'salida' THEN
        UPDATE inventario
        SET stock_actual         = stock_actual - NEW.cantidad,
            ultima_actualizacion = NOW()
        WHERE id_inventario = NEW.id_inventario;

    ELSIF NEW.tipo_movimiento = 'ajuste' THEN
        -- cantidad es diferencial (+/-)
        UPDATE inventario
        SET stock_actual         = stock_actual + NEW.cantidad,
            ultima_actualizacion = NOW()
        WHERE id_inventario = NEW.id_inventario;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_actualizar_stock
  AFTER INSERT ON movimiento_inventario
  FOR EACH ROW
  EXECUTE FUNCTION public.actualizar_stock_inventario();


-- ===========================================================================
-- 10. GUÍA PARA EL FRONTEND (leer antes de tocar el código)
-- ===========================================================================
--
--  ┌─────────────────────────────────────────────────────────────────────────┐
--  │  NOMBRE CORRECTO         │  NOMBRE INCORRECTO (viejo)                   │
--  ├─────────────────────────────────────────────────────────────────────────┤
--  │  tabla:   usuario        │  tabla:   cliente                            │
--  │  columna: id_usuario     │  columna: id_cliente                         │
--  │  columna: nombre         │  columna: fullName / full_name               │
--  └─────────────────────────────────────────────────────────────────────────┘
--
--  REGISTRO (signUp):
--    El formulario debe pasar en options.data:
--      { fullName: "Juan Pérez", telefono: "+56912345678" }
--    Supabase lo guarda en raw_user_meta_data y el trigger lo mueve a usuario.
--
--  CONSULTA de usuario autenticado:
--    supabase.from('usuario').select('*').eq('id_usuario', user.id)
--
--  VERIFICACIÓN FK → 20 relaciones, todas apuntan a PK existentes ✓
-- ===========================================================================
