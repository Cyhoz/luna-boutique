-- 7. Tabla de Reseñas de Productos
create table product_reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  user_name text, -- Para mostrar nombre si el usuario no tiene perfil completo
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table product_reviews enable row level security;
create policy "Reviews are viewable by everyone." on product_reviews for select using (true);
create policy "Authenticated users can create reviews." on product_reviews for insert with check (auth.role() = 'authenticated');

-- 8. Tabla de Lista de Deseos
create table wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

alter table wishlists enable row level security;
create policy "Users can manage their own wishlist." on wishlists for all using (auth.uid() = user_id);

-- 9. Tabla de Suscripciones Newsletter
create table newsletter_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table newsletter_subscriptions enable row level security;
create policy "Admins can view subscriptions." on newsletter_subscriptions for select using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Anyone can subscribe." on newsletter_subscriptions for insert with check (true);
