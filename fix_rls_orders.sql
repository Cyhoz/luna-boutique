-- 1. Permitir que cualquiera pueda crear una Orden (Checkouts para Invitados o Logueados)
create policy "Allow inserting orders" 
on orders for insert 
with check (true);

-- 2. Permitir que cualquiera pueda insertar Items en la orden
create policy "Allow inserting order items" 
on order_items for insert 
with check (true);
