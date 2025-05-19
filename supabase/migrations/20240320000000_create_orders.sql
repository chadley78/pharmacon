-- Create enum for order status
create type order_status as enum (
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

-- Create orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  status order_status default 'pending_payment' not null,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  subtotal decimal(10,2) not null,
  shipping_cost decimal(10,2) not null default 0,
  total decimal(10,2) not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price_at_time decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table orders enable row level security;
alter table order_items enable row level security;

-- Orders policies
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Order items policies
create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create their own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for orders table
create trigger update_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column(); 