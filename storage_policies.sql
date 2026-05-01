-- 1. Asegurar que el bucket existe y es público
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- 2. Eliminar políticas anteriores (si existen) para evitar duplicados
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow Uploads" on storage.objects;

-- 3. Crear política para que todo el mundo pueda VER las imágenes
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'product-images' );

-- 4. Crear política para permitir la SUBIDA de imágenes (Temporalmente abierto hasta que hagamos el login)
create policy "Allow Uploads" 
on storage.objects for insert 
with check ( bucket_id = 'product-images' );
