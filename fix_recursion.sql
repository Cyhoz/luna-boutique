-- Solución al error de recursión infinita en las políticas de RLS
-- El problema es que la política de 'profiles' se consulta a sí misma para verificar el rol de admin.

-- 1. Eliminar las políticas problemáticas
DROP POLICY IF EXISTS "Admin ve todos los perfiles" ON profiles;
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

-- 2. Crear una política simple para lectura:
-- Todos pueden ver los perfiles (necesario para ver el rol de otros si fuera necesario, 
-- o al menos para que la verificación de admin funcione sin recursión infinita)
CREATE POLICY "Lectura pública de perfiles" ON profiles
FOR SELECT USING (true);

-- 3. Políticas para modificación
CREATE POLICY "Usuarios modifican su propio perfil" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 4. El Admin puede hacer todo (usando una consulta que ya no recursa porque SELECT es true)
CREATE POLICY "Admin total sobre perfiles" ON profiles
FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Corregir también la política de productos si fuera necesario
-- Aunque la de productos estaba bien, el fallo venía al intentar leer 'profiles'
