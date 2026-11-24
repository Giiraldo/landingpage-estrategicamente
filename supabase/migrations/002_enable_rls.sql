alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.services enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, email, full_name)
select
  id,
  coalesce(email, ''),
  raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "authenticated users can read their profile" on public.profiles;
create policy "authenticated users can read their profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "anonymous users can submit website leads" on public.leads;
create policy "anonymous users can submit website leads"
on public.leads
for insert
to anon
with check (
  source = 'website'
  and status = 'new'
  and priority = 'medium'
  and assigned_to is null
  and notes is null
);

drop policy if exists "admins can read leads" on public.leads;
create policy "admins can read leads"
on public.leads
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can create leads" on public.leads;
create policy "admins can create leads"
on public.leads
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins can update leads" on public.leads;
create policy "admins can update leads"
on public.leads
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can read lead activities" on public.lead_activities;
create policy "admins can read lead activities"
on public.lead_activities
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can create lead activities" on public.lead_activities;
create policy "admins can create lead activities"
on public.lead_activities
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins can update lead activities" on public.lead_activities;
create policy "admins can update lead activities"
on public.lead_activities
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public users can read active services" on public.services;
create policy "public users can read active services"
on public.services
for select
to anon, authenticated
using (is_active);

drop policy if exists "admins can read all services" on public.services;
create policy "admins can read all services"
on public.services
for select
to authenticated
using (public.is_admin());
