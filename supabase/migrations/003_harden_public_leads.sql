alter table public.leads
  add constraint leads_full_name_length check (char_length(btrim(full_name)) between 2 and 120),
  add constraint leads_email_format check (
    char_length(btrim(email)) between 3 and 320
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  add constraint leads_phone_length check (phone is null or char_length(btrim(phone)) between 7 and 30),
  add constraint leads_company_length check (company is null or char_length(btrim(company)) between 1 and 120),
  add constraint leads_service_interest_length check (service_interest is null or char_length(btrim(service_interest)) between 1 and 120),
  add constraint leads_message_length check (message is null or char_length(btrim(message)) between 1 and 2000),
  add constraint leads_source_length check (char_length(btrim(source)) between 1 and 100),
  add constraint leads_notes_length check (notes is null or char_length(btrim(notes)) between 1 and 2000);

alter table public.lead_activities
  add constraint lead_activities_description_length check (char_length(btrim(description)) between 1 and 2000);

drop policy if exists "admins can create lead activities" on public.lead_activities;
create policy "admins can create their lead activities"
on public.lead_activities
for insert
to authenticated
with check (public.is_admin() and user_id = auth.uid());

revoke all on table public.profiles, public.leads, public.lead_activities, public.services from anon, authenticated;

grant insert (full_name, email, phone, company, service_interest, message) on table public.leads to anon;
grant select on table public.services to anon;

grant select on table public.profiles to authenticated;
grant select, insert, update on table public.leads to authenticated;
grant select, insert, update on table public.lead_activities to authenticated;
grant select on table public.services to authenticated;
