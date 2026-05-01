-- Habilitar la extensión para generar UUIDs
create extension if not exists "uuid-ossp";

-- 1. Tabla de Perfiles de Usuario (Extiende auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'customer')) default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS) en profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. Tabla de Categorías
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table categories enable row level security;
create policy "Categories are viewable by everyone." on categories for select using (true);
-- Las políticas de insert/update/delete solo para admins se harían verificando el role en profiles.

-- 3. Tabla de Productos Base
create table products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric(10,2) not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;
create policy "Active products are viewable by everyone." on products for select using (is_active = true);

-- 4. Tabla de Variantes de Productos (Inventario Real)
create table product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  size text, -- Ej: 'S', 'M', 'L', 'XL' o números
  color text, -- Ej: 'Negro', 'Blanco', o códigos hex
  stock_quantity integer not null default 0,
  sku text unique,
  price_adjustment numeric(10,2) default 0, -- Por si la talla XXL cuesta $5 más
  image_url text, -- Foto específica de ese color
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table product_variants enable row level security;
create policy "Variants are viewable by everyone." on product_variants for select using (true);

-- 5. Tabla de Pedidos
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  total_amount numeric(10,2) not null,
  status text check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) default 'pending',
  shipping_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;
create policy "Users can view their own orders." on orders for select using (auth.uid() = user_id);

-- 6. Tabla de Detalles del Pedido
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_variant_id uuid references product_variants(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price_at_time numeric(10,2) not null, -- Precio congelado al momento de la compra
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table order_items enable row level security;
create policy "Users can view their own order items." on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- Triggers automáticos (Opcional, muy recomendado):
-- Trigger para crear profile cuando un usuario se registra en auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
