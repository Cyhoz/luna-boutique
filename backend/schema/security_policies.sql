-- 1. Actualización de Perfiles para Consentimiento de Datos (Chile)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS data_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_consent_version TEXT DEFAULT '1.0';

-- 2. Creación de Tabla de Auditoría de Seguridad
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'login_attempt', 'admin_access', 'unauthorized_action'
    user_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Configuración Estricta de RLS (Row Level Security)

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PRODUCTOS: Todos pueden leer, solo Admin puede escribir
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON products;
CREATE POLICY "Permitir lectura pública de productos" ON products
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo admin puede modificar productos" ON products;
CREATE POLICY "Solo admin puede modificar productos" ON products
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- POLÍTICAS PARA PERFILES: Usuario ve su propio perfil, Admin ve todo
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON profiles;
CREATE POLICY "Usuarios ven su propio perfil" ON profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin ve todos los perfiles" ON profiles;
CREATE POLICY "Admin ve todos los perfiles" ON profiles
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- POLÍTICAS PARA PEDIDOS: Usuario ve sus propios pedidos, Admin ve todo
DROP POLICY IF EXISTS "Usuarios ven sus propios pedidos" ON orders;
CREATE POLICY "Usuarios ven sus propios pedidos" ON orders
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin gestiona todos los pedidos" ON orders;
CREATE POLICY "Admin gestiona todos los pedidos" ON orders
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- POLÍTICAS PARA LOGS DE SEGURIDAD: Solo Admin puede ver
DROP POLICY IF EXISTS "Solo admin ve logs" ON security_logs;
CREATE POLICY "Solo admin ve logs" ON security_logs
FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
