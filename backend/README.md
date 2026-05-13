# Luna Boutique Backend (Supabase)

Este directorio contiene la estructura lógica de la base de datos basada en el MER de Luna Boutique.

## Estructura
- `/schema/main_schema.sql`: Definición de tablas, enums, tipos y relaciones. Incluye la lógica de triggers para actualización de stock automática.
- `/schema/security_policies.sql`: Políticas de RLS (Row Level Security) para proteger los datos de clientes y pedidos.
- `/seeds/initial_seed.sql`: Datos maestros iniciales (Categorías, Colores, Marcas) y productos de ejemplo.

## Configuración en Supabase
Para conectar tu base de datos:

1. **Schema Principal**: Ejecuta el contenido de `schema/main_schema.sql` en el SQL Editor de Supabase.
2. **Políticas de Seguridad**: Ejecuta `schema/security_policies.sql` para activar la protección de datos.
3. **Datos Iniciales**: Ejecuta `seeds/initial_seed.sql` para poblar la tienda.

## Triggers Críticos Incluidos
El backend cuenta con lógica automatizada para:
- **Actualización de Stock**: Cada vez que se inserta un registro en `movimiento_inventario`, la tabla `inventario` se actualiza automáticamente.
- **Creación de Clientes**: (Opcional) Trigger para vincular usuarios de Supabase Auth con la tabla `cliente`.

## Conexión con Frontend
Asegúrate de configurar las variables de entorno en el archivo `.env.local` del frontend:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key (para acciones admin)
```
