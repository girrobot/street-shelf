-- Enable RLS
alter table "Library" enable row level security;

-- Create policies
create policy "Public libraries are viewable by everyone"
  on "Library" for select
  using ( true );

create policy "Users can insert their own libraries"
  on "Library" for insert
  with check ( auth.uid()::text = "userId" );

create policy "Users can update their own libraries"
  on "Library" for update
  using ( auth.uid()::text = "userId" );

create policy "Users can delete their own libraries"
  on "Library" for delete
  using ( auth.uid()::text = "userId" );

-- Create a trigger to sync auth.users to public.User
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
