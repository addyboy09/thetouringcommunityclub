drop policy if exists "Admins can delete approved sites" on public.approved_sites;
drop policy if exists "Admins can insert approved sites" on public.approved_sites;
drop policy if exists "Admins can update approved sites" on public.approved_sites;
drop policy if exists "Admins can delete discounts" on public.discounts;
drop policy if exists "Admins can insert discounts" on public.discounts;
drop policy if exists "Admins can update discounts" on public.discounts;
drop policy if exists "Admins can delete meetups" on public.meetups;
drop policy if exists "Admins can insert meetups" on public.meetups;
drop policy if exists "Admins can update meetups" on public.meetups;
drop policy if exists "Admins can delete recommended sites" on public.recommended_sites;
drop policy if exists "Admins can insert recommended sites" on public.recommended_sites;
drop policy if exists "Admins can update recommended sites" on public.recommended_sites;
drop policy if exists "Admins can manage roles" on public.user_roles;
drop policy if exists "Admins can view all roles" on public.user_roles;

create policy "Admins can delete approved sites"
on public.approved_sites
for delete
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can insert approved sites"
on public.approved_sites
for insert
to authenticated
with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can update approved sites"
on public.approved_sites
for update
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can delete discounts"
on public.discounts
for delete
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can insert discounts"
on public.discounts
for insert
to authenticated
with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can update discounts"
on public.discounts
for update
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can delete meetups"
on public.meetups
for delete
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can insert meetups"
on public.meetups
for insert
to authenticated
with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can update meetups"
on public.meetups
for update
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can delete recommended sites"
on public.recommended_sites
for delete
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can insert recommended sites"
on public.recommended_sites
for insert
to authenticated
with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

create policy "Admins can update recommended sites"
on public.recommended_sites
for update
to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'::public.app_role));

revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;